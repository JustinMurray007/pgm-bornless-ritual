'use client';

import { useCallback, useRef, RefObject } from 'react';
import { RitualSection as RitualSectionType, PhoneticMap } from '@/lib/types';
import VoceMagica, { VoceMagicaHandle } from './VoceMagica';
import { playTTS } from '@/lib/audioUtils';
import TranslationBubble from './TranslationBubble';

interface RitualSectionProps {
  section: RitualSectionType;
  phoneticMap: PhoneticMap;
}

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

// Build regex from phonetic map keys
function buildRegex(phoneticMap: PhoneticMap) {
  const keys = Object.keys(phoneticMap).sort((a, b) => b.length - a.length);
  const escaped = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(${escaped.join('|')})`, 'g');
}

// Collect ordered list of [original, phonetic] pairs for a vox line
function collectVoxTokens(line: string, phoneticMap: PhoneticMap): Array<{ original: string; phonetic: string }> {
  const regex = buildRegex(phoneticMap);
  const parts = line.split(regex);
  return parts
    .filter(p => phoneticMap[p])
    .map(p => ({ original: p, phonetic: phoneticMap[p] }));
}

// ── Play Line Button ──────────────────────────────────────────────────────────

interface PlayLineButtonProps {
  tokens: Array<{ original: string; phonetic: string }>;
  wordRefs: RefObject<(VoceMagicaHandle | null)[]>;
  label: string;
}

function PlayLineButton({ tokens, wordRefs, label }: PlayLineButtonProps) {
  const isPlayingRef = useRef(false);

  const handlePlay = useCallback(async () => {
    if (isPlayingRef.current || tokens.length === 0) return;
    isPlayingRef.current = true;

    for (let i = 0; i < tokens.length; i++) {
      if (!isPlayingRef.current) break;

      const { phonetic } = tokens[i];
      const wordRef = wordRefs.current?.[i];

      // Light up this word
      wordRef?.highlight(true);

      try {
        await playTTS(phonetic, VOICE_ID);
      } catch {
        // continue to next word
      }

      // Turn off highlight for this word
      wordRef?.highlight(false);
    }

    isPlayingRef.current = false;
  }, [tokens, wordRefs]);

  return (
    <button
      className="play-line-btn"
      onClick={handlePlay}
      aria-label={`Play entire line: ${label}`}
      title="Play entire line"
    >
      ▶
    </button>
  );
}

// ── Vox Line ─────────────────────────────────────────────────────────────────

interface VoxLineProps {
  line: string;
  phoneticMap: PhoneticMap;
  sectionSlug: string;
  lineIndex: number;
}

function VoxLine({ line, phoneticMap, sectionSlug, lineIndex }: VoxLineProps) {
  const tokens = collectVoxTokens(line, phoneticMap);
  // One ref slot per vox token in this line
  const wordRefs = useRef<(VoceMagicaHandle | null)[]>(
    Array(tokens.length).fill(null)
  );

  // Build the rendered spans, assigning refs to VoceMagica components
  const regex = buildRegex(phoneticMap);
  const parts = line.split(regex);
  let voxIndex = 0;
  const rendered = parts.map((part, i) => {
    const phonetic = phoneticMap[part];
    if (phonetic) {
      const idx = voxIndex++;
      return (
        <VoceMagica
          key={`${sectionSlug}-vox-${lineIndex}-${i}`}
          ref={(el) => { wordRefs.current[idx] = el; }}
          original={part}
          phonetic={phonetic}
          ariaLabel={`${part} — pronounced: ${phonetic}`}
        />
      );
    }
    return <span key={`${sectionSlug}-vox-${lineIndex}-text-${i}`}>{part}</span>;
  });

  return (
    <div className="vox-line">
      <PlayLineButton tokens={tokens} wordRefs={wordRefs} label={line} />
      <span className="vox-line-text">{rendered}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function RitualSection({ section, phoneticMap }: RitualSectionProps) {
  const rawLines = section.body.split('\n');

  return (
    <section className="ritual-section">
      <div className="ritual-section-header">
        <h2 className="ritual-section-title">{section.title}</h2>
        {section.translation && (
          <TranslationBubble
            translation={section.translation}
            sectionTitle={section.title}
          />
        )}
      </div>
      <div className="ritual-body">
        {rawLines.map((rawLine, lineIndex) => {
          const isVoxLine = rawLine.startsWith('§');
          const line = isVoxLine ? rawLine.slice(1) : rawLine;

          if (isVoxLine) {
            return (
              <VoxLine
                key={`${section.slug}-voxline-${lineIndex}`}
                line={line}
                phoneticMap={phoneticMap}
                sectionSlug={section.slug}
                lineIndex={lineIndex}
              />
            );
          }

          // Prose line — inline voces magicae (no play button, no highlight wiring needed)
          const regex = buildRegex(phoneticMap);
          const parts = line.split(regex);

          return (
            <p key={`${section.slug}-prose-${lineIndex}`} className="ritual-prose">
              {parts.map((part, i) => {
                const phonetic = phoneticMap[part];
                if (phonetic) {
                  return (
                    <VoceMagica
                      key={`${section.slug}-prose-${lineIndex}-${i}`}
                      original={part}
                      phonetic={phonetic}
                      ariaLabel={`${part} — pronounced: ${phonetic}`}
                    />
                  );
                }
                return <span key={`${section.slug}-prose-${lineIndex}-text-${i}`}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    </section>
  );
}
