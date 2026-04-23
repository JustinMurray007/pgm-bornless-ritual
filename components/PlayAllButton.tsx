'use client';

import { useCallback, useRef, useState } from 'react';
import { PHONETIC_SCRIPT } from '@/lib/phoneticScript';
import { playTTS } from '@/lib/audioUtils';

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

// Collect all speakable lines from the phonetic script in order
function getAllLines(): string[] {
  const lines: string[] = [];
  for (const section of PHONETIC_SCRIPT) {
    for (const rawLine of section.body.split('\n')) {
      const line = rawLine.startsWith('§') ? rawLine.slice(1) : rawLine;
      if (line.trim()) lines.push(line.trim());
    }
  }
  return lines;
}

export default function PlayAllButton() {
  const isPlayingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback(async () => {
    if (isPlayingRef.current) {
      // Stop
      abortRef.current?.abort();
      abortRef.current = null;
      isPlayingRef.current = false;
      setPlaying(false);
      return;
    }

    isPlayingRef.current = true;
    setPlaying(true);
    const lines = getAllLines();

    for (const line of lines) {
      if (!isPlayingRef.current) break;
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await playTTS(line, VOICE_ID, controller.signal);
      } catch {
        // AbortError or network error — stop
        break;
      }
    }

    isPlayingRef.current = false;
    setPlaying(false);
  }, []);

  return (
    <button
      className={`play-all-btn${playing ? ' play-all-btn--playing' : ''}`}
      onClick={handlePlay}
      aria-label={playing ? 'Stop playback' : 'Play entire Ancient Resonance Script'}
      title={playing ? 'Stop' : 'Play all'}
    >
      {playing ? '■ Stop' : '▶ Play All'}
    </button>
  );
}
