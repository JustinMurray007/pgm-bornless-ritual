import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <div className="papyrus-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <main className="hero-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Digital Grimoire
            </h1>
            <p className="hero-tagline">
              The World's Oldest Spells & Magic.<br />
              Brought Back To Life With AI Technology
            </p>
          </div>

          {/* Video Container */}
          <div className="hero-video-container">
            <div className="hero-video-wrapper">
              <iframe
                className="hero-video"
                src="https://www.youtube.com/embed/OI-7gnjx_pw?rel=0&modestbranding=1"
                title="The Bornless Ritual"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <Link href="/bornless-ritual" className="hero-cta hero-cta--primary">
              <span className="hero-cta-icon">✦</span>
              The Bornless Ritual
            </Link>
            <Link href="/vessel-inquiry" className="hero-cta hero-cta--primary">
              <span className="hero-cta-icon">🔮</span>
              The Vessel Inquiry
            </Link>
            <Link href="/speak-the-magic" className="hero-cta hero-cta--secondary">
              <span className="hero-cta-icon">🎙️</span>
              Speak the Magic
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <h2 className="features-title">Three Ways to Experience Ancient Power</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔮</div>
              <h3 className="feature-card-title">The Vessel Inquiry</h3>
              <p className="feature-card-desc">
                A divination ritual using a consecrated vessel of water as a scrying medium. Summon divine presence to answer questions about the future.
              </p>
              <Link href="/vessel-inquiry" className="feature-link">
                Experience the Vessel →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✦</div>
              <h3 className="feature-card-title">The Bornless Ritual</h3>
              <p className="feature-card-desc">
                Read the authentic Greek text from PGM V. 96-172. Every word is interactive—hover to hear ancient pronunciation and voces magicae.
              </p>
              <Link href="/bornless-ritual" className="feature-link">
                Read the Ritual →
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3 className="feature-card-title">Speak It Yourself</h3>
              <p className="feature-card-desc">
                Use voice recognition to speak the ancient words. Get real-time feedback on your pronunciation.
              </p>
              <Link href="/speak-the-magic" className="feature-link">
                Try Speaking →
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="about-content">
            <h2 className="about-title" style={{ fontSize: '2rem' }}>From Ancient Egypt to Your Screen</h2>
            <p className="about-text">
              The Greek Magical Papyri are a collection of spells, rituals, and invocations
              spanning the 2nd century BCE to the 5th century CE. Buried in the Egyptian
              desert and rediscovered in the 19th century, these texts reveal the magical
              practices of the ancient Mediterranean world.
            </p>
            <p className="about-text">
              The <strong>Bornless Ritual</strong> (PGM V. 96-172) calls upon the Ἀκέφαλος
              (Akephalos), the Headless One, using <em>voces magicae</em>: barbarous words
              of power whose potency was believed to reside in their sound alone.
            </p>
            <p className="about-text">
              The <strong>Vessel Inquiry</strong> (PGM IV. 154-285) is a divination ritual
              using a consecrated vessel of water as a scrying medium, summoning divine presence
              to answer questions about the future.
            </p>
            <p className="about-text">
              This project brings these ancient words to life with modern technology:
              interactive text, AI-generated voices, and speech recognition, making
              2,000-year-old rituals accessible and experiential.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="hero-footer">
          <p>Source: <em>Greek Magical Papyri in Translation</em>, ed. Hans Dieter Betz (1986)</p>
        </footer>
      </main>
    </>
  );
}
