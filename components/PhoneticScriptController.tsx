'use client';

import { useCallback, useRef, useState } from 'react';
import { PHONETIC_SCRIPT } from '@/lib/phoneticScript';
import { playWordByWord, tokeniseWords } from '@/lib/audioUtils';
import PhoneticSection from './PhoneticSection';
import type { PhoneticSectionHandle } from './PhoneticSection';

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

// Build ordered list of every word across all sections/lines
interface WordEntry {
  sectionIdx: number;
  lineIdx: number;
  wordIdx: number;
  text: string;
}

function buildWordEntries(): WordEntry[] {
  const entries: WordEntry[] = [];
  PHONETIC_SCRIPT.forEach((section, sectionIdx) => {
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

export default function PhoneticScriptController() {
  const isPlayingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const [playing, setPlaying] = useState(false);

  const sectionRefs = useRef<(PhoneticSectionHandle | null)[]>(
    Array(PHONETIC_SCRIPT.length).fill(null)
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    isPlayingRef.current = false;
    setPlaying(false);
    // Clear all highlights
    WORD_ENTRIES.forEach(e => {
      sectionRefs.current[e.sectionIdx]?.highlightWord(e.lineIdx, e.wordIdx, false);
    });
  }, []);

  const handlePlayAll = useCallback(async () => {
    if (isPlayingRef.current) { stop(); return; }

    isPlayingRef.current = true;
    setPlaying(true);

    const controller = new AbortController();
    abortRef.current = controller;

    for (const entry of WORD_ENTRIES) {
      if (!isPlayingRef.current || controller.signal.aborted) break;

      const sectionRef = sectionRefs.current[entry.sectionIdx];
      sectionRef?.highlightWord(entry.lineIdx, entry.wordIdx, true);

      try {
        await playWordByWord(
          entry.text,
          VOICE_ID,
          () => {}, // single word — no sub-highlighting needed
          controller.signal
        );
      } catch {
        sectionRef?.highlightWord(entry.lineIdx, entry.wordIdx, false);
        break;
      }

      sectionRef?.highlightWord(entry.lineIdx, entry.wordIdx, false);
    }

    isPlayingRef.current = false;
    setPlaying(false);
  }, [stop]);

  return (
    <>
      <div className="play-all-bar">
        <button
          className={`play-all-btn${playing ? ' play-all-btn--playing' : ''}`}
          onClick={handlePlayAll}
          aria-label={playing ? 'Stop playback' : 'Play entire Ancient Resonance Script'}
        >
          ▶ Play All
        </button>
        {playing && (
          <button
            className="stop-btn"
            onClick={stop}
            aria-label="Stop playback"
          >
            ■ Stop
          </button>
        )}
      </div>

      {PHONETIC_SCRIPT.map((section, idx) => (
        <PhoneticSection
          key={section.slug}
          section={section}
          ref={(el) => { sectionRefs.current[idx] = el; }}
        />
      ))}
    </>
  );
}
