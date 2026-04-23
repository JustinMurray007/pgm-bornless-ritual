import type { Metadata } from 'next';
import SpeakMagicController from '@/components/SpeakMagicController';

export const metadata: Metadata = {
  title: 'Speak the Magic — The Bornless Ritual',
  description:
    'Learn to pronounce ancient Greek magical words and phrases from the Greek Magical Papyri',
};

export default function SpeakTheMagicPage() {
  return (
    <>
      <div className="papyrus-bg" aria-hidden="true" />
      <div className="mist-overlay" aria-hidden="true" />

      <div className="page-title-bar">
        <h1 className="ritual-title">Speak the Magic</h1>
        <p className="ritual-subtitle">
          Learn to Pronounce Ancient Words of Power
        </p>
      </div>

      <main className="ritual-page speak-magic-page">
        <div className="ritual-intro">
          <p>
            For nearly two millennia, these words have been silent. Now, you can learn to speak them.
            Practice pronouncing the most powerful words from the Greek Magical Papyri, then challenge
            yourself to speak a complete magical invocation in the ancient tongue.
          </p>
          <p className="ritual-intro-how">
            Click each word to hear its pronunciation, then use your microphone to practice speaking it yourself.
            The system will listen and provide feedback on your pronunciation.
          </p>
        </div>

        <SpeakMagicController />

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
