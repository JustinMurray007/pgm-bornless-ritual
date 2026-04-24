# PGM Bornless Ritual — Static Assets

Drop `papyrus-bg.jpg` here to use a real PGM papyrus photograph as the background.

The image should be the cleaned (text-removed) version of the PGM V papyrus photograph.
Recommended: save at ~1920px wide, JPEG quality 85.

---

# Project Overview

A Next.js 14 (App Router) web application that digitally reconstructs two rituals from the **Greek Magical Papyri** (PGM). Each ritual is rendered in Greek/Coptic script over a procedural papyrus background, with phonetically accurate audio playback via ElevenLabs TTS and real-time audio-driven glow animations.

## Pages

### Home (`/`)
Landing page with project overview, video introduction, and navigation to the three main experiences: The Bornless Ritual, The Vessel Inquiry, and Speak the Magic.

### The Bornless Ritual — PGM V. 96-172 (`/bornless-ritual`)
The Stele of Jeu the Hieroglyphist. Five sections: Opening, Invocation of Moses, Headless Invocation, Lord of the Gods, Self-Identification. Hover or focus any *vox magica* to hear it spoken aloud.

### The Vessel Inquiry — PGM IV. 154-285 (`/vessel-inquiry`)
The Lekanomanteia (λεκανομαντεία, *leh-kah-noh-man-TAY-ah*) — a water-vessel divination oracle. Six sections: Preparation of the Vessel, Solar Invocation, Invocation of the Divine Light, The Boy Medium, Names of Power, The Dismissal. Hover or click any phonetic word to hear it spoken; use the ▶ button beside each line to play the full line (click ■ to stop), or **Play All** to hear the entire ritual.

### How It Works (`/how-it-works`)
Comprehensive documentation covering the source material (Greek Magical Papyri), ElevenLabs AI voice technology, procedural design techniques, Kiro AI-powered development workflow, property-based testing, and the complete technical stack. Includes links to the open-source repository and development artifacts.

### Speak the Magic (`/speak-the-magic`)
Interactive pronunciation practice for *voces magicae* from the Greek Magical Papyri. Two modes:
- **Practice Words** — 8 individual words of power with difficulty levels (easy/medium/hard). Listen to correct pronunciation, speak into your microphone, and receive instant feedback.
- **Challenge Phrases** — Complete invocations unlocked after mastering 60% of practice words.

**Speech Recognition**: Primary method is text input. Optional voice input uses Web Speech API (Chrome/Edge/Safari). 

**Browser Compatibility**: The Web Speech API is blocked by Brave browser for privacy reasons. Brave users will see a disclaimer and should use the text input method instead. Other browsers (Chrome, Edge, Safari) support the microphone feature.

If Web Speech API is unavailable or fails, users are directed to use the text input field. Each word includes Greek text, phonetic spelling, and English translation.

## Script Modules

| File | Purpose |
|---|---|
| `lib/bornlessScript.ts` | Complete Bornless Ritual script (PGM V) — 5 sections with Greek original, English translation, and phonetic reconstruction |
| `lib/phoneticScript.ts` | Phonetic reconstruction of PGM V (Bornless Ritual) — 5 sections |
| `lib/vesselScript.ts` | Phonetic reconstruction of PGM IV (Vessel Inquiry) — 6 sections |
| `lib/ritualText.ts` | Fallback ritual text for the Bornless Ritual (used if Supabase is unreachable) |
| `lib/phonetics.ts` | Fallback phonetic mappings (used if Supabase is unreachable) |

Each script section contains three text layers:
- `original` — Greek source text (primary display)
- `translation` — English translation (shown beneath, italic)
- `body` — Phonetic reconstruction (interactive, speakable)

Lines prefixed with `§` in the body are *vox lines* — rendered with a play button for direct audio playback.

## Setup

```bash
cp .env.example .env.local
# Fill in ELEVENLABS_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run seed      # Seed Supabase with ritual sections and phonetic mappings
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `ELEVENLABS_API_KEY` | ElevenLabs API key (server-side only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/tts` | POST | Proxies TTS requests to ElevenLabs. Body: `{ text, voiceId }`. Returns `audio/mpeg` stream. Rate limited: 40 requests per minute per IP. |
| `/api/ritual-voice` | POST | Ritual voice playback endpoint. Rate limited: 10 requests per minute per IP. |

**Rate Limiting**: API routes use in-memory rate limiting. The `/api/tts` endpoint allows 40 requests/minute per IP (increased for ElevenLabs Pro plan), while `/api/ritual-voice` allows 10 requests/minute per IP. For production deployments, consider using Redis or Vercel KV for distributed rate limiting.

## Key Features

- **Procedural papyrus background** — CSS-only, no image required (SVG `feTurbulence` filter for organic texture)
- **Hover/focus audio** — ElevenLabs TTS with phonetic substitution so ancient words are pronounced correctly
- **Real-time glow animation** — Web Audio API `AnalyserNode` drives CSS `drop-shadow` and `brightness` at 60fps
- **Supabase persistence** — Ritual sections, phonetic mappings, and usage logs stored in Postgres
- **Keyboard accessible** — All *voces magicae* are focusable and triggerable via Enter/Space
- **Graceful fallbacks** — Bundled content used if Supabase is unreachable; toast shown on TTS errors
