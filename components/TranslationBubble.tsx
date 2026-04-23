'use client';

import { useState, useCallback } from 'react';

interface TranslationBubbleProps {
  translation: string;
  sectionTitle: string;
}

export default function TranslationBubble({ translation, sectionTitle }: TranslationBubbleProps) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(o => !o), []);

  return (
    <div className="translation-bubble-wrapper">
      <button
        className={`translation-trigger${open ? ' translation-trigger--open' : ''}`}
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Hide translation' : `Show translation for ${sectionTitle}`}
        title={open ? 'Hide translation' : 'Show translation'}
      >
        <span className="translation-trigger-icon">ℹ</span>
      </button>

      {open && (
        <div className="translation-bubble" role="note" aria-label={`Translation: ${sectionTitle}`}>
          <div className="translation-bubble-arrow" aria-hidden="true" />
          <p className="translation-bubble-text">{translation}</p>
        </div>
      )}
    </div>
  );
}
