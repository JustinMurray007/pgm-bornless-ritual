'use client';

import { useCallback, useRef, useState } from 'react';
import { RitualSection, PhoneticMap } from '@/lib/types';
import { playTTS } from '@/lib/audioUtils';

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

interface PlayAllRitualButtonProps {
  sections: RitualSection[];
  phoneticMap: PhoneticMap;
}

// Build regex from phonetic map keys
function buildRegex(phoneticMap: PhoneticMap) {
  const keys = Object.keys(phoneticMap).sort((a, b) => b.length - a.length);
  const escaped = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(${escaped.join('|')})`, 'g');
}

// Collect all vox tokens from all sections in order
function getAllVoxTokens(sections: RitualSection[], phoneticMap: PhoneticMap): string[] {
  const tokens: string[] = [];
  const regex = buildRegex(phoneticMap);

  for (const section of sections) {
    const rawLines = section.body.split('\n');
    for (const rawLine of rawLines) {
      const isVoxLine = rawLine.startsWith('§');
      const line = isVoxLine ? rawLine.slice(1) : rawLine;
      
      if (!line.trim()) continue;

      // Extract all phonetic tokens from this line
      const parts = line.split(regex);
      for (const part of parts) {
        const phonetic = phoneticMap[part];
        if (phonetic) {
          tokens.push(phonetic);
        }
      }
    }
  }

  return tokens;
}

export default function PlayAllRitualButton({ sections, phoneticMap }: PlayAllRitualButtonProps) {
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
    const tokens = getAllVoxTokens(sections, phoneticMap);

    for (const phonetic of tokens) {
      if (!isPlayingRef.current) break;
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        await playTTS(phonetic, VOICE_ID, controller.signal);
      } catch {
        // AbortError or network error — stop
        break;
      }
    }

    isPlayingRef.current = false;
    setPlaying(false);
  }, [sections, phoneticMap]);

  return (
    <button
      className={`play-all-btn${playing ? ' play-all-btn--playing' : ''}`}
      onClick={handlePlay}
      aria-label={playing ? 'Stop playback' : 'Play entire Bornless Ritual'}
      title={playing ? 'Stop' : 'Play all words of power'}
    >
      {playing ? '■ Stop' : '▶ Play All'}
    </button>
  );
}
