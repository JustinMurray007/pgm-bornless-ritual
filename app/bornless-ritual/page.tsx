import { getSupabaseServerClient } from '@/lib/supabase/server';
import { FALLBACK_SECTIONS } from '@/lib/ritualText';
import { FALLBACK_PHONETICS } from '@/lib/phonetics';
import { RitualSection as RitualSectionType, PhoneticMap } from '@/lib/types';
import LanguageDrawer from '@/components/LanguageDrawer';
import RitualVoicePlayer from '@/components/RitualVoicePlayer';
import PhoneticScriptController from '@/components/PhoneticScriptController';
import BornlessRitualController from '@/components/BornlessRitualController';

// Revalidate every 24 hours (content rarely changes)
export const revalidate = 86400;

export default async function BornlessRitualPage() {
  return (
    <>
      <div className="papyrus-bg" aria-hidden="true" />
      {/* Mist overlay — soft white cloud down the center for readability */}
      <div className="mist-overlay" aria-hidden="true" />

      {/* ── Floating language breakdown drawer ── */}
      <LanguageDrawer />

      {/* ── Title bar ── */}
      <div className="page-title-bar">
        <h1 className="ritual-title">The Bornless Ritual</h1>
        <p className="ritual-subtitle">Stele of Jeu the Hieroglyphist — PGM V. 96–172</p>
      </div>

      {/* ── Single-column content ── */}
      <main className="ritual-page">

        <div className="ritual-intro">
          <p>
            Below is the original Greek text of PGM V. 96-172, the Stele of Jeu the
            Hieroglyphist, drawn from the <em>Greek Magical Papyri</em>, a collection
            spanning the 2nd century BCE to the 5th century CE, buried in the Egyptian
            desert and rediscovered in the 19th century.
          </p>
          <p>
            The <strong>Bornless Ritual</strong> calls upon the Ἀκέφαλος (Akephalos),
            the Headless One, using <em>voces magicae</em>: barbarous words of power
            whose potency was believed to reside in their sound alone.
          </p>
          <p className="ritual-intro-how">
            <strong>How to use:</strong> Hover or click any <span className="voce-magica" style={{fontSize: '1em', letterSpacing: '0.05em', cursor: 'default'}}>highlighted word</span> to
            hear it spoken. Use <span className="play-hint">▶</span> to play an entire
            line. Tap the <strong>Language Breakdown</strong> button (top right) to learn about the ancient languages used.
          </p>
        </div>

        <BornlessRitualController />

        <footer className="ritual-footer">
          <p>Source: <em>Greek Magical Papyri in Translation</em>, ed. Hans Dieter Betz (1986)</p>
        </footer>

        {/* ── Multi-Voice Ritual Performance ── */}
        <div className="col-divider" aria-hidden="true" />

        <header className="ritual-header" style={{ marginTop: '1rem' }}>
          <h2 className="ritual-title" style={{ fontSize: '1.8rem' }}>
            The Ritual Voices
          </h2>
          <p className="ritual-subtitle">Multi-voice performance with overlapping harmonics</p>
        </header>

        <div className="ritual-intro">
          <p>
            Experience the ritual as a layered vocal performance. Three voices, the Narrator,
            the Shadow, and the Harmonic, speak in unison, overlap, and fade, creating an
            immersive soundscape that evokes the crowded ritual chambers of ancient Egypt.
          </p>
          <p className="ritual-intro-how">
            <strong>How it works:</strong> Each section uses ElevenLabs v3 audio tags to
            orchestrate multiple voices into a single audio file. The waveforms visualise
            each voice layer in real-time, bleeding together when voices overlap.
          </p>
        </div>

        <RitualVoicePlayer />

        {/* ── Phonetic Reconstruction ── */}
        <div className="col-divider" aria-hidden="true" />

        <header className="ritual-header" style={{ marginTop: '1rem' }}>
          <h2 className="ritual-title" style={{ fontSize: '1.8rem' }}>
            The Ancient Resonance Script
          </h2>
          <p className="ritual-subtitle">Full phonetic reconstruction — every word is speakable</p>
        </header>

        <div className="ritual-intro">
          <p>
            The complete ritual rendered in phonetic English, very close to how it would
            have sounded in ancient times. Every word and sentence is interactive: hover
            or click to hear it spoken. Use the{' '}
            <span className="play-hint">▶</span> button to play an entire line.
          </p>
        </div>

        <PhoneticScriptController />

        <footer className="ritual-footer">
          <p>Phonetic reconstruction based on reconstructed Koine Greek pronunciation</p>
        </footer>
      </main>
    </>
  );
}
