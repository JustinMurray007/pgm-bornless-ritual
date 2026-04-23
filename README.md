# The Bornless Ritual — PGM V. 96-172

A Next.js web application that digitally reconstructs the **Stele of Jeu the Hieroglyphist** from the Greek Magical Papyri (PGM V. 96-172). This immersive experience combines ancient ritual text with modern web technologies to create an interactive, audio-visual journey through one of history's most powerful magical invocations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## ✨ Features

- **📜 Authentic Ancient Text**: Full Greek/Coptic ritual text from PGM V. 96-172
- **🎙️ Phonetic Pronunciation**: ElevenLabs AI voices speak the *voces magicae* (words of power) with accurate ancient pronunciation
- **✨ Real-Time Glow Animation**: Text pulses and glows in synchrony with audio using Web Audio API analysis
- **🎨 Procedural Papyrus Background**: CSS-only photorealistic aged papyrus texture
- **♿ Full Accessibility**: Keyboard navigation, ARIA labels, screen reader support
- **💾 Supabase Integration**: Persistent storage for ritual text, phonetic mappings, and usage analytics
- **🧪 Comprehensive Testing**: Property-based tests + integration tests (17 tests passing)
- **📱 Responsive Design**: Works on all devices from mobile to desktop

## 🎯 Built with Kiro

This project was developed using **Kiro**, an AI-powered development environment. The `.kiro/` directory at the root demonstrates:

- **Specs**: Formal requirements, design documents, and implementation tasks
- **Hooks**: Automated workflows triggered by IDE events
- **Steering**: Project-specific guidelines and conventions

The `.kiro/` directory showcases the complete development workflow from requirements gathering through implementation and testing.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- ElevenLabs API key (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pgm-bornless-ritual
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL schema from `scripts/seed.ts` comments in your Supabase SQL editor:
   ```sql
   CREATE TABLE IF NOT EXISTS ritual_sections (
     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     slug        TEXT NOT NULL UNIQUE,
     title       TEXT NOT NULL,
     body        TEXT NOT NULL,
     sort_order  INTEGER NOT NULL,
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   
   CREATE TABLE IF NOT EXISTS phonetic_mappings (
     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     original    TEXT NOT NULL UNIQUE,
     phonetic    TEXT NOT NULL,
     created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   
   CREATE TABLE IF NOT EXISTS usage_logs (
     id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     vox_magica   TEXT NOT NULL,
     session_id   UUID NOT NULL,
     triggered_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );
   
   CREATE INDEX IF NOT EXISTS usage_logs_vox_magica_idx ON usage_logs (vox_magica);
   CREATE INDEX IF NOT EXISTS usage_logs_session_id_idx ON usage_logs (session_id);
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the full test suite:
```bash
npm test
```

The test suite includes:
- **Property-based tests** using fast-check for correctness validation
- **Integration tests** for Supabase, TTS API, and page rendering
- **Unit tests** for individual components and utilities

All 17 tests should pass.

## 📖 How It Works

### Audio Playback
1. Hover over or focus any *vox magica* (magical word) in the text
2. The application sends the phonetic spelling to ElevenLabs TTS API
3. Audio streams back and plays automatically
4. Web Audio API analyzes the audio in real-time

### Glow Animation
1. An `AnalyserNode` extracts amplitude data from the audio stream
2. A `requestAnimationFrame` loop updates CSS custom properties 60 times per second
3. `filter: drop-shadow()` and `brightness()` create the amber glow effect
4. The glow intensity is proportional to the audio amplitude

### Fallback Mechanisms
- If Supabase is unreachable, the app uses bundled fallback content
- If ElevenLabs fails, a toast notification appears but text remains readable
- All errors are logged to the console for debugging

## 🏗️ Architecture

```
app/
  ├── page.tsx                 # Main ritual page (Server Component)
  ├── layout.tsx               # Root layout with papyrus background
  ├── api/tts/route.ts         # TTS proxy Route Handler
  └── __tests__/               # Integration tests

components/
  ├── RitualSection.tsx        # Renders one ritual section
  ├── VoceMagica.tsx           # Interactive magical word element
  ├── Toast.tsx                # Error notifications
  └── ...

lib/
  ├── supabase/                # Supabase client modules
  ├── ritualText.ts            # Fallback ritual content
  ├── phonetics.ts             # Fallback phonetic mappings
  ├── env.ts                   # Environment validation
  └── __tests__/               # Unit and property tests

hooks/
  ├── useAudioAnalyzer.ts      # Web Audio API integration
  └── useGlowController.ts     # Real-time glow animation

.kiro/
  ├── specs/                   # Requirements, design, tasks
  ├── hooks/                   # Automated workflows
  └── steering/                # Project guidelines
```

## 🎨 Design Highlights

### Papyrus Background
The papyrus texture is entirely CSS-procedural using:
- 5 layered gradients (vertical/horizontal striations + mottling)
- SVG `feTurbulence` filter for organic noise
- `feDisplacementMap` for subtle warping
- No image assets required

### Voice Settings
ElevenLabs TTS uses:
- **Model**: `eleven_multilingual_v2` (Greek support)
- **Stability**: 0.2 (low, for dramatic variation)
- **Style**: 0.9 (high, for theatrical delivery)

### Glow Formula
```typescript
blur = amplitude × 24  // 0-24px
brightness = 1 + amplitude × 0.6  // 1.0-1.6
color = hsl(40, 90%, 55%)  // Amber/gold
```

## 📊 Correctness Properties

The application validates 13 formal correctness properties using property-based testing:

1. Ritual sections always sort to canonical order
2. Phonetic mapping records are structurally complete
3. TTS request body always contains phonetic spelling
4. At most one concurrent TTS request per element
5. Glow state resets to defaults after playback
6. Glow values are proportional to amplitude
7. Usage log records contain all required fields
8. Session ID is always a valid UUID v4
9. Seed script execution is idempotent
10. Every VoceMagica element is keyboard-accessible
11. Keyboard interaction equals hover behavior
12. aria-label always equals phonetic spelling
13. Environment validation names every missing variable

See `.kiro/specs/pgm-bornless-ritual/design.md` for full property definitions.

## 🔒 Security

- API keys are server-side only (never exposed to browser)
- Environment validation fails fast on missing credentials
- Supabase Row Level Security can be enabled for production
- All external content is treated as untrusted

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Environment Variables
Set these in your deployment platform:
- `ELEVENLABS_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📚 Resources

- [Greek Magical Papyri](https://en.wikipedia.org/wiki/Greek_Magical_Papyri)
- [PGM V. 96-172 (Bornless Ritual)](https://www.thelemapedia.org/index.php/Bornless_Ritual)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 14 Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The Greek Magical Papyri translators and scholars
- ElevenLabs for their multilingual TTS technology
- Supabase for their excellent developer experience
- The Next.js team for the App Router architecture
- Kiro for AI-powered development tooling

---

**Built with Kiro** • [View the .kiro directory](.kiro/) to see the complete development workflow
