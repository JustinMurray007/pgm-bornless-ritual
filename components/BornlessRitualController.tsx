'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { BORNLESS_SCRIPT } from '@/lib/bornlessScript';
import { playTTS, tokeniseWords } from '@/lib/audioUtils';
import PhoneticSection from './PhoneticSection';
import type { PhoneticSectionHandle } from './PhoneticSection';

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

// ── Build a flat ordered list of every word across all sections/lines ─────────

interface WordEntry {
  sectionIdx: number;
  lineIdx: number;
  wordIdx: number;
  text: string;
}

function buildWordEntries(): WordEntry[] {
  const entries: WordEntry[] = [];
  BORNLESS_SCRIPT.forEach((section, sectionIdx) => {
    section.body.split('\n').forEach((rawLine, lineIdx) => {
      const line = rawLine.startsWith('§') ? rawLine.slice(1) : rawLine;
      if (!line.trim()) return;
      tokeniseWords(line).forEach((word, wordIdx) => {
        entries.push({ sectionIdx, lineIdx, wordIdx, text: word });
      });
    });
  });
  return entries;
}

const WORD_ENTRIES = buildWordEntries();

// ── Sticky play/stop bar ──────────────────────────────────────────────────────

interface StickyBarProps {
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}

function StickyBar({ playing, onPlay, onStop }: StickyBarProps) {
  return (
    <div className="vessel-sticky-bar" role="toolbar" aria-label="Document playback controls">
      <button
        className={`vessel-play-all-btn${playing ? ' vessel-play-all-btn--playing' : ''}`}
        onClick={playing ? onStop : onPlay}
        aria-label={playing ? 'Stop full document playback' : 'Play entire Bornless Ritual'}
      >
        {playing ? (
          <>
            <span className="vessel-btn-icon">■</span>
            <span>Stop</span>
          </>
        ) : (
          <>
            <span className="vessel-btn-icon">▶</span>
            <span>Play All</span>
          </>
        )}
      </button>

      {playing && (
        <span className="vessel-playing-indicator" aria-live="polite">
          <span className="vessel-playing-dot" />
          Playing…
        </span>
      )}
    </div>
  );
}

// ── Main controller ───────────────────────────────────────────────────────────

export default function BornlessRitualController() {
  const isPlayingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const [playing, setPlaying] = useState(false);

  const sectionRefs = useRef<(PhoneticSectionHandle | null)[]>(
    Array(BORNLESS_SCRIPT.length).fill(null)
  );

  const clearAllHighlights = useCallback(() => {
    WORD_ENTRIES.forEach(e => {
      sectionRefs.current[e.sectionIdx]?.highlightWord(e.lineIdx, e.wordIdx, false);
    });
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    isPlayingRef.current = false;
    setPlaying(false);
    clearAllHighlights();
  }, [clearAllHighlights]);

  const handlePlayAll = useCallback(async () => {
    if (isPlayingRef.current) { stop(); return; }

    isPlayingRef.current = true;
    setPlaying(true);

    const controller = new AbortController();
    abortRef.current = controller;

    for (const entry of WORD_ENTRIES) {
      if (!isPlayingRef.current || controller.signal.aborted) break;

      sectionRefs.current[entry.sectionIdx]?.highlightWord(entry.lineIdx, entry.wordIdx, true);

      try {
        await playTTS(entry.text, VOICE_ID, controller.signal);
      } catch {
        sectionRefs.current[entry.sectionIdx]?.highlightWord(entry.lineIdx, entry.wordIdx, false);
        break;
      }

      sectionRefs.current[entry.sectionIdx]?.highlightWord(entry.lineIdx, entry.wordIdx, false);
    }

    isPlayingRef.current = false;
    setPlaying(false);
    clearAllHighlights();
  }, [stop, clearAllHighlights]);

  // Clean up on unmount
  useEffect(() => () => stop(), [stop]);

  return (
    <>
      <StickyBar playing={playing} onPlay={handlePlayAll} onStop={stop} />

      {BORNLESS_SCRIPT.map((section, idx) => (
        <PhoneticSection
          key={section.slug}
          section={section}
          ref={(el) => { sectionRefs.current[idx] = el; }}
        />
      ))}
    </>
  );
}
