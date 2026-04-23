import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works — The Bornless Ritual',
  description:
    'Learn about the technology, translations, design, and magic behind the digital reconstruction of ancient Greek magical rituals',
};

export default function HowItWorksPage() {
  return (
    <>
      <div className="papyrus-bg" aria-hidden="true" />
      <div className="mist-overlay" aria-hidden="true" />

      <div className="page-title-bar">
        <h1 className="ritual-title">How It Works</h1>
        <p className="ritual-subtitle">
          The Technology, Translations, Design & Magic Behind the Ritual
        </p>
      </div>

      <main className="ritual-page how-it-works-page">
        <div className="how-it-works-content">
          {/* ── Introduction ── */}
          <section className="hiw-section">
            <p className="hiw-intro">
              This project brings ancient Greek magical rituals to life through a combination
              of scholarly translation, modern AI voice synthesis, real-time audio analysis,
              and procedural visual design. Every element — from the papyrus texture to the
              glowing text — is crafted to create an immersive experience that honors the
              original texts while leveraging cutting-edge technology.
            </p>
          </section>

          {/* ── The Source Material ── */}
          <section className="hiw-section">
            <h2 className="hiw-heading">📜 The Source Material</h2>
            <div className="hiw-content">
              <h3>The Greek Magical Papyri</h3>
              <p>
                The <strong>Greek Magical Papyri</strong> (Papyri Graecae Magicae, or PGM) is a
                collection of magical spells, hymns, and rituals written in Greek, Demotic Egyptian,
                and Coptic, dating from the 2nd century BCE to the 5th century CE. These texts were
                discovered in Egypt and represent a unique blend of Egyptian, Greek, Jewish, and
                Christian magical traditions.
              </p>

              <h3>The Bornless Ritual (PGM V. 96-172)</h3>
              <p>
                Also known as the <strong>Stele of Jeu the Hieroglyphist</strong> or the{' '}
                <strong>Headless Rite</strong>, this ritual is an invocation of the "Headless One"
                (Ἀκέφαλος, Akephalos) — a powerful deity who created heaven and earth. The ritual
                combines Egyptian solar theology with Greek Neoplatonic philosophy and Jewish divine
                names, creating a syncretic magical practice typical of Greco-Roman Egypt.
              </p>

              <h3>The Vessel Inquiry (PGM IV. 154-285)</h3>
              <p>
                The <strong>Vessel Inquiry</strong> (λεκανομαντεία, lekanomanteia) is a divination
                ritual using a consecrated vessel of water as a scrying medium. A boy medium gazes
                into the water while the operator recites invocations to Helios and the divine light,
                summoning a presence to answer questions about the future.
              </p>

              <h3>Translation & Scholarship</h3>
              <p>
                The English translations are based on <em>The Greek Magical Papyri in Translation</em>,
                edited by Hans Dieter Betz (University of Chicago Press, 1986/1992), the standard
                scholarly edition. The phonetic reconstructions are based on modern scholarly consensus
                on ancient Greek pronunciation, with special attention to the <em>voces magicae</em> —
                the "words of power" that blend Greek, Egyptian, Hebrew, and invented barbarous names.
              </p>
            </div>
          </section>

          {/* ── The Technology ── */}
          <section className="hiw-section">
            <h2 className="hiw-heading">🎙️ The Technology: ElevenLabs AI Voice</h2>
            <div className="hiw-content">
              <h3>Text-to-Speech with Ancient Pronunciation</h3>
              <p>
                Every <em>vox magica</em> (magical word) is spoken aloud using{' '}
                <strong>ElevenLabs</strong> multilingual text-to-speech AI. When you hover over or
                click a word, the application:
              </p>
              <ol>
                <li>Sends the phonetic spelling to the ElevenLabs API</li>
                <li>Receives a streaming audio response in real-time</li>
                <li>Plays the audio through your browser's Web Audio API</li>
                <li>Analyzes the audio amplitude to drive the glow animation</li>
              </ol>

              <h3>Voice Settings</h3>
              <p>
                The voice is configured for dramatic, ritualistic delivery:
              </p>
              <ul>
                <li>
                  <strong>Model</strong>: <code>eleven_multilingual_v2</code> (supports Greek phonetics)
                </li>
                <li>
                  <strong>Stability</strong>: 0.2 (low — allows dramatic variation)
                </li>
                <li>
                  <strong>Style Exaggeration</strong>: 0.9 (high — theatrical delivery)
                </li>
                <li>
                  <strong>Voice</strong>: Daniel (deep, gravelly male voice)
                </li>
              </ul>

              <h3>Phonetic Reconstruction</h3>
              <p>
                Ancient Greek pronunciation is reconstructed using modern scholarly consensus:
              </p>
              <ul>
                <li>
                  <strong>Vowels</strong>: Pure vowel sounds (no diphthongization)
                </li>
                <li>
                  <strong>Consonants</strong>: Aspirated stops (φ = "f", θ = "th", χ = "kh")
                </li>
                <li>
                  <strong>Barbarous Names</strong>: Phonetic approximations based on Greek spelling
                </li>
              </ul>
              <p>
                For example, <strong>ΙΑΩ</strong> (the Tetragrammaton in Greek letters) is pronounced
                "ee-ah-oh" rather than the modern "yah-oh" or Hebrew "yah-weh".
              </p>
            </div>
          </section>

          {/* ── The Design ── */}
          <section className="hiw-section">
            <h2 className="hiw-heading">🎨 The Design: Procedural Papyrus & Glow</h2>
            <div className="hiw-content">
              <h3>CSS-Only Papyrus Texture</h3>
              <p>
                The papyrus background is entirely procedural — no image files required. It's built
                using:
              </p>
              <ul>
                <li>
                  <strong>5 layered CSS gradients</strong>: Vertical and horizontal striations simulate
                  woven papyrus fibers, plus three radial gradients create age mottling
                </li>
                <li>
                  <strong>SVG feTurbulence filter</strong>: Adds organic noise and subtle warping
                </li>
                <li>
                  <strong>feDisplacementMap</strong>: Breaks up the mechanical regularity of the gradients
                </li>
                <li>
                  <strong>feColorMatrix</strong>: Desaturates slightly to simulate aged pigment
                </li>
              </ul>
              <p>
                The result is a photorealistic aged papyrus texture that scales perfectly to any screen
                size and requires zero bandwidth for image assets.
              </p>

              <h3>Real-Time Audio-Driven Glow Animation</h3>
              <p>
                As each word is spoken, it glows in amber/gold tones that pulse in perfect synchrony
                with the audio. This is achieved through:
              </p>
              <ol>
                <li>
                  <strong>Web Audio API AnalyserNode</strong>: Extracts real-time amplitude data from
                  the audio stream (60 times per second)
                </li>
                <li>
                  <strong>requestAnimationFrame loop</strong>: Updates CSS custom properties on each
                  frame
                </li>
                <li>
                  <strong>GPU-composited CSS filters</strong>: <code>drop-shadow()</code> and{' '}
                  <code>brightness()</code> create the glow without causing layout reflow
                </li>
              </ol>

              <h3>Glow Formula</h3>
              <p>The glow intensity is proportional to the audio amplitude:</p>
              <ul>
                <li>
                  <strong>Blur radius</strong>: <code>amplitude × 24px</code> (0–24px range)
                </li>
                <li>
                  <strong>Brightness</strong>: <code>1 + amplitude × 0.6</code> (1.0–1.6 range)
                </li>
                <li>
                  <strong>Color</strong>: <code>hsl(40, 90%, 55%)</code> (amber/gold at 40° hue)
                </li>
              </ul>
              <p>
                When audio ends, the glow fades smoothly back to the default state over 500ms using a
                linear decay animation.
              </p>

              <h3>Typography & Accessibility</h3>
              <p>
                The text uses a serif font appropriate for Greek/Coptic script, with a contrast ratio
                of at least 4.5:1 (WCAG AA compliant) against the papyrus background. Every interactive
                element is:
              </p>
              <ul>
                <li>
                  <strong>Keyboard accessible</strong>: Tab to focus, Enter/Space to trigger
                </li>
                <li>
                  <strong>Screen reader friendly</strong>: ARIA labels provide phonetic pronunciation
                </li>
                <li>
                  <strong>Visually distinct</strong>: Focus indicators meet WCAG 2.1 AA requirements
                </li>
              </ul>
            </div>
          </section>

          {/* ── The Magic ── */}
          <section className="hiw-section">
            <h2 className="hiw-heading">✨ The Magic: Kiro AI-Powered Development</h2>
            <div className="hiw-content">
              <h3>Built with Kiro</h3>
              <p>
                This entire project was developed using <strong>Kiro</strong>, an AI-powered development
                environment that transforms how software is built. Kiro guided the project from initial
                concept through requirements, design, implementation, and comprehensive testing.
              </p>

              <h3>Spec-Driven Development</h3>
              <p>
                The <code>.kiro/</code> directory in the{' '}
                <a
                  href="https://github.com/JustinMurray007/pgm-bornless-ritual"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  source repository
                </a>{' '}
                contains the complete development workflow:
              </p>
              <ul>
                <li>
                  <strong>Requirements Document</strong>: 9 formal requirements with acceptance criteria
                </li>
                <li>
                  <strong>Design Document</strong>: Architecture diagrams, data models, and 13 formal
                  correctness properties
                </li>
                <li>
                  <strong>Tasks Document</strong>: 22 top-level tasks with 56 sub-tasks, all completed
                </li>
                <li>
                  <strong>Automated Hooks</strong>: Event-driven workflows that keep documentation in sync
                </li>
              </ul>

              <h3>Property-Based Testing</h3>
              <p>
                The application validates <strong>13 formal correctness properties</strong> using
                property-based testing with fast-check:
              </p>
              <ol>
                <li>Ritual sections always sort to canonical order</li>
                <li>Phonetic mapping records are structurally complete</li>
                <li>TTS request body always contains phonetic spelling</li>
                <li>At most one concurrent TTS request per element</li>
                <li>Glow state resets to defaults after playback</li>
                <li>Glow values are proportional to amplitude</li>
                <li>Usage log records contain all required fields</li>
                <li>Session ID is always a valid UUID v4</li>
                <li>Seed script execution is idempotent</li>
                <li>Every VoceMagica element is keyboard-accessible</li>
                <li>Keyboard interaction equals hover behavior</li>
                <li>aria-label always equals phonetic spelling</li>
                <li>Environment validation names every missing variable</li>
              </ol>
              <p>
                Each property is validated with 100 random test cases, providing confidence that the
                application behaves correctly across all edge cases.
              </p>

              <h3>Test Coverage</h3>
              <p>
                The project includes <strong>17 passing tests</strong> across 4 test files:
              </p>
              <ul>
                <li>
                  <strong>Property-based tests</strong>: Validate universal correctness properties
                </li>
                <li>
                  <strong>Integration tests</strong>: Verify Supabase, TTS API, and page rendering
                </li>
                <li>
                  <strong>Unit tests</strong>: Test individual components and utilities
                </li>
              </ul>
            </div>
          </section>

          {/* ── The Stack ── */}
          <section className="hiw-section">
            <h2 className="hiw-heading">🛠️ The Technical Stack</h2>
            <div className="hiw-content">
              <ul>
                <li>
                  <strong>Framework</strong>: Next.js 14 (App Router) with TypeScript
                </li>
                <li>
                  <strong>Voice Synthesis</strong>: ElevenLabs multilingual TTS API
                </li>
                <li>
                  <strong>Database</strong>: Supabase (PostgreSQL)
                </li>
                <li>
                  <strong>Audio Analysis</strong>: Web Audio API (AnalyserNode)
                </li>
                <li>
                  <strong>Animation</strong>: requestAnimationFrame + CSS custom properties
                </li>
                <li>
                  <strong>Testing</strong>: Vitest + fast-check (property-based testing)
                </li>
                <li>
                  <strong>Development</strong>: Kiro AI-powered development environment
                </li>
              </ul>
            </div>
          </section>

          {/* ── Open Source ── */}
          <section className="hiw-section">
            <h2 className="hiw-heading">🌐 Open Source</h2>
            <div className="hiw-content">
              <p>
                This project is open source under the MIT License. The complete source code,
                including all Kiro development artifacts, is available on GitHub:
              </p>
              <p className="hiw-github-link">
                <a
                  href="https://github.com/JustinMurray007/pgm-bornless-ritual"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/JustinMurray007/pgm-bornless-ritual
                </a>
              </p>
              <p>
                The repository includes setup instructions, architecture documentation, and the
                complete <code>.kiro/</code> directory showing the spec-driven development workflow.
              </p>
            </div>
          </section>

          {/* ── Try It Yourself ── */}
          <section className="hiw-section hiw-cta">
            <h2 className="hiw-heading">🎭 Experience the Rituals</h2>
            <div className="hiw-cta-buttons">
              <Link href="/" className="hiw-cta-button">
                The Bornless Ritual
              </Link>
              <Link href="/vessel-inquiry" className="hiw-cta-button">
                The Vessel Inquiry
              </Link>
            </div>
          </section>
        </div>

        <footer className="ritual-footer">
          <p>
            Built with Kiro · Powered by ElevenLabs · Source:{' '}
            <em>The Greek Magical Papyri in Translation</em>, ed. Hans Dieter Betz (1986)
          </p>
        </footer>
      </main>
    </>
  );
}
