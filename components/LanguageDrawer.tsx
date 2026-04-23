'use client';

import { useState, useCallback, useEffect } from 'react';

export default function LanguageDrawer() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  return (
    <>
      {/* ── Floating ? button ── */}
      <button
        className="drawer-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open language breakdown"
        aria-expanded={open}
        title="Language Breakdown"
      >
        ?
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="drawer-backdrop"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer ── */}
      <aside
        className={`drawer${open ? ' drawer--open' : ''}`}
        aria-label="Language Breakdown"
        aria-hidden={!open}
      >
        <div className="drawer-header">
          <h2 className="drawer-title">Language Breakdown</h2>
          <p className="drawer-subtitle">The layers of power encoded in the ritual</p>
          <button
            className="drawer-close"
            onClick={close}
            aria-label="Close language breakdown"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">

          {/* ── Layer 1 ── */}
          <div className="breakdown-layer">
            <h3 className="breakdown-layer-title">
              <span className="breakdown-layer-num">1</span>
              The Greek Layer
              <span className="breakdown-layer-tag">The Operating System</span>
            </h3>
            <dl className="breakdown-terms">
              <div className="breakdown-term">
                <dt>Akephalos <span className="breakdown-greek">(Ακέφαλος)</span></dt>
                <dd>Literally "Headless." In the 4th century, this referred to a supreme, transcendent deity — the "Head" of the world who exists beyond it.</dd>
              </div>
              <div className="breakdown-term">
                <dt>Osoronnophris <span className="breakdown-greek">(Οσοροννόφρις)</span></dt>
                <dd>A Greek corruption of the Egyptian <em>Wsir Wn-nfr</em> ("Osiris the Perfected Being"). A "wrapper" for the Egyptian god of the underworld.</dd>
              </div>
            </dl>
          </div>

          {/* ── Layer 2 ── */}
          <div className="breakdown-layer">
            <h3 className="breakdown-layer-title">
              <span className="breakdown-layer-num">2</span>
              The Hebrew / Jewish Layer
              <span className="breakdown-layer-tag">The Security Keys</span>
            </h3>
            <p className="breakdown-layer-note">
              The PGM writers believed the Jewish name for God was an invincible "Power Word."
            </p>
            <dl className="breakdown-terms">
              <div className="breakdown-term">
                <dt>IAŌ <span className="breakdown-greek">(ΙΑΩ)</span></dt>
                <dd>The Greek phonetic version of the Tetragrammaton (YHWH). Considered the most potent vowel sequence in magic.</dd>
              </div>
              <div className="breakdown-term">
                <dt>Sabaōth <span className="breakdown-greek">(Σαβαώθ)</span></dt>
                <dd>From the Hebrew <em>Tzevaot</em>, meaning "of Hosts" or "Armies."</dd>
              </div>
              <div className="breakdown-term">
                <dt>Adōnai <span className="breakdown-greek">(Αδωναί)</span></dt>
                <dd>Hebrew for "Lord."</dd>
              </div>
            </dl>
          </div>

          {/* ── Layer 3 ── */}
          <div className="breakdown-layer">
            <h3 className="breakdown-layer-title">
              <span className="breakdown-layer-num">3</span>
              The Gnostic / "Barbarian" Layer
              <span className="breakdown-layer-tag">The Encrypted Code</span>
            </h3>
            <p className="breakdown-layer-note">
              These are the <em>voces magicae</em> — words intended to be "untranslatable," bypassing human logic to speak directly to the cosmos.
            </p>
            <dl className="breakdown-terms">
              <div className="breakdown-term">
                <dt>Abrasax <span className="breakdown-greek">(Αβρασάξ)</span></dt>
                <dd>A Gnostic name for the "Lord of the 365 Heavens." The Greek letters add up to 365 in gematria (A=1, B=2, R=100, etc.).</dd>
              </div>
              <div className="breakdown-term">
                <dt>Arthexouth / Thiaf</dt>
                <dd>"Barbarian names" — phonetic strings likely derived from distorted Egyptian or Semitic phrases, intended to sound foreign and otherworldly.</dd>
              </div>
            </dl>
          </div>

          {/* ── Layer 4 ── */}
          <div className="breakdown-layer">
            <h3 className="breakdown-layer-title">
              <span className="breakdown-layer-num">4</span>
              The Vowel Layer
              <span className="breakdown-layer-tag">The Frequency</span>
            </h3>
            <dl className="breakdown-terms">
              <div className="breakdown-term">
                <dt>A E Ē I O U Ō <span className="breakdown-greek">(α ε η ι ο υ ω)</span></dt>
                <dd>The seven Greek vowels. To the ancients, these were the musical notes of the spheres — each representing one of the seven planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.</dd>
              </div>
            </dl>
          </div>

        </div>
      </aside>
    </>
  );
}
