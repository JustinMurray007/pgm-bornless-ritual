import type { Metadata } from 'next';
import { Cinzel, Noto_Serif } from 'next/font/google';
import './globals.css';
import { validateEnv } from '@/lib/env';
import { ToastProvider } from '@/components/Toast';
import SiteNav from '@/components/SiteNav';

validateEnv();

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin', 'greek'],
  weight: ['400', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bornless Ritual — PGM V. 96-172',
  description:
    'A digital reconstruction of the Stele of Jeu the Hieroglyphist from the Greek Magical Papyri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <body
        className={`${cinzel.variable} ${notoSerif.variable}`}
        style={{
          fontFamily: 'var(--font-noto-serif), Georgia, serif',
          backgroundColor: '#1a1008',
          color: '#1a0f00',
          margin: 0,
        }}
      >
        {/* Hidden SVG filters */}
        <svg style={{ display: 'none' }} aria-hidden="true">
          <defs>

            {/* ── Papyrus fiber texture ── */}
            <filter id="papyrus-noise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.15" numOctaves={5} seed={3} result="fiber" />
              <feTurbulence type="fractalNoise" baseFrequency="0.03 0.02" numOctaves={3} seed={8} result="mottle" />
              <feMerge result="combined">
                <feMergeNode in="fiber" />
                <feMergeNode in="mottle" />
              </feMerge>
              <feDisplacementMap in="SourceGraphic" in2="combined" scale={3} xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feColorMatrix in="displaced" type="saturate" values="0.55" result="desaturated" />
              <feBlend in="desaturated" in2="SourceGraphic" mode="multiply" result="blended" />
              <feComponentTransfer in="blended">
                <feFuncR type="gamma" amplitude="1" exponent="0.92" offset="-0.02" />
                <feFuncG type="gamma" amplitude="1" exponent="0.95" offset="-0.02" />
                <feFuncB type="gamma" amplitude="1" exponent="1.05" offset="-0.01" />
              </feComponentTransfer>
            </filter>

            {/* ── Crack overlay filter ── */}
            <filter id="crack-filter" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.008" numOctaves={6} seed={42} result="noise" />
              <feColorMatrix in="noise" type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        8 0 0 -4 -0.5"
                result="cracks" />
              <feComposite in="SourceGraphic" in2="cracks" operator="in" />
            </filter>

            {/* ── Age stain filter ── */}
            <filter id="stain-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.022" numOctaves={4} seed={17} result="stain" />
              <feColorMatrix in="stain" type="saturate" values="0.3" result="desaturated" />
              <feBlend in="SourceGraphic" in2="desaturated" mode="multiply" />
            </filter>

            {/* ── Frayed horizontal edge (top/bottom) ── */}
            <filter id="fray-h" x="-5%" y="-30%" width="110%" height="160%">
              <feTurbulence type="turbulence" baseFrequency="0.035 0.001" numOctaves={5} seed={7} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={32} xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* ── Frayed vertical edge (left/right) ── */}
            <filter id="fray-v" x="-30%" y="-5%" width="160%" height="110%">
              <feTurbulence type="turbulence" baseFrequency="0.001 0.035" numOctaves={5} seed={13} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={32} xChannelSelector="R" yChannelSelector="G" />
            </filter>

          </defs>
        </svg>

        {/* Frayed papyrus edge overlay */}
        <div className="papyrus-edge" aria-hidden="true" />
        <div className="papyrus-edge-left"  aria-hidden="true" />
        <div className="papyrus-edge-right" aria-hidden="true" />
        {/* Crack and age stain overlays */}
        <div className="papyrus-cracks" aria-hidden="true" />
        <div className="papyrus-stains" aria-hidden="true" />
        <SiteNav />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
