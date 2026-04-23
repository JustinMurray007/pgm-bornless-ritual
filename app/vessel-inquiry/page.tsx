import type { Metadata } from 'next';
import VesselInquiryController from '@/components/VesselInquiryController';

export const metadata: Metadata = {
  title: 'The Vessel Inquiry — PGM IV. 154-285',
  description:
    'A digital reconstruction of the Vessel Inquiry oracle ritual from the Greek Magical Papyri',
};

export default function VesselInquiryPage() {
  return (
    <>
      <div className="papyrus-bg" aria-hidden="true" />
      <div className="mist-overlay" aria-hidden="true" />

      {/* ── Title bar ── */}
      <div className="page-title-bar">
        <h1 className="ritual-title">The Vessel Inquiry</h1>
        <p className="ritual-subtitle">Oracle Ritual — PGM IV. 154–285</p>
      </div>

      <main className="ritual-page">

        <div className="ritual-intro">
          <p>
            The <strong>Vessel Inquiry</strong> (λεκανομαντεία, <em>leh-kah-noh-man-TAY-ah</em>) is
            a divination ritual from PGM IV — the Great Paris Magical Papyrus, the largest
            surviving text from the Greek Magical Papyri, dated to the 4th century CE.
          </p>
          <p>
            A vessel of water is consecrated and used as a scrying medium. A boy medium
            gazes into the surface while the operator recites invocations to Helios and
            the divine light, summoning a presence to answer questions about the future.
          </p>
          <p>
            This ritual blends Egyptian solar theology, Greek Neoplatonic light mysticism,
            and Jewish divine names — a perfect example of the syncretic magic of
            Greco-Roman Egypt.
          </p>
          <p className="ritual-intro-how">
            Hover or click any phonetic word to hear it spoken. Use the{' '}
            <span className="play-hint">▶</span> button beside each line to play the
            full line, or use <strong>Play All</strong> to hear the entire ritual.
          </p>
        </div>

        <VesselInquiryController />

        <footer className="ritual-footer">
          <p>
            Source: <em>Greek Magical Papyri in Translation</em>, ed. Hans Dieter Betz (1986)
            · PGM IV. 154–285
          </p>
        </footer>

      </main>
    </>
  );
}
