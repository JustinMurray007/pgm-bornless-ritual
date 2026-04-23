# PGM Bornless Ritual — Static Assets

Drop `papyrus-bg.jpg` here to use a real PGM papyrus photograph as the background.

The image should be the cleaned (text-removed) version of the PGM V papyrus photograph.
Recommended: save at ~1920px wide, JPEG quality 85.

---

# Project Overview

A Next.js 14 (App Router) web application that digitally reconstructs two rituals from the **Greek Magical Papyri** (PGM). Each ritual is rendered in Greek/Coptic script over a procedural papyrus background, with phonetically accurate audio playback via ElevenLabs TTS and real-time audio-driven glow animations.

## Rituals

### The Bornless Ritual — PGM V. 96-172 (`/`)
The Stele of Jeu the Hieroglyphist. Five sections: Opening, Invocation of Moses, Headless Invocation, Lord of the Gods, Self-Identification. Hover or focus any *vox magica* to hear it spoken aloud.

### The Vessel Inquiry — PGM IV. 154-285 (`/vessel-inquiry`)
The Lekanomanteia (λεκανομαντεία, *leh-kah-noh-man-TAY-ah*) — a water-vessel divination oracle. Six sections: Preparation of the Vessel, Solar Invocation, Invocation of the Divine Light, The Boy Medium, Names of Power, The Dismissal. Hover or click any phonetic word to hear it spoken; use the ▶ button beside each line to play the full line, or **Play All** to hear the entire ritual.

## Script Modules

| File | Purpose |
|---|---|
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
| `/api/tts` | POST | Proxies TTS requests to ElevenLabs. Body: `{ text, voiceId }`. Returns `audio/mpeg` stream. |
| `/api/ritual-voice` | POST | Ritual voice playback endpoint. |

## Key Features

- **Procedural papyrus background** — CSS-only, no image required (SVG `feTurbulence` filter for organic texture)
- **Hover/focus audio** — ElevenLabs TTS with phonetic substitution so ancient words are pronounced correctly
- **Real-time glow animation** — Web Audio API `AnalyserNode` drives CSS `drop-shadow` and `brightness` at 60fps
- **Supabase persistence** — Ritual sections, phonetic mappings, and usage logs stored in Postgres
- **Keyboard accessible** — All *voces magicae* are focusable and triggerable via Enter/Space
- **Graceful fallbacks** — Bundled content used if Supabase is unreachable; toast shown on TTS errors
