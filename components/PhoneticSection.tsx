'use client';

import {
  useCallback, useRef, RefObject,
  forwardRef, useImperativeHandle, useState,
} from 'react';
import { PhoneticSection as PhoneticSectionType } from '@/lib/phoneticScript';
import PhoneticWord from './PhoneticWord';
import type { PhoneticWordHandle } from './PhoneticWord';
import { playWordByWord, tokeniseWords } from '@/lib/audioUtils';

interface PhoneticSectionProps {
  section: PhoneticSectionType;
}

export interface PhoneticSectionHandle {
  /** Highlight or un-highlight a specific word within a line */
  highlightWord: (rawLineIndex: number, wordIndex: number, on: boolean) => void;
  /** Highlight or un-highlight all words in a line */
  highlightLine: (rawLineIndex: number, on: boolean) => void;
}

// Setters for a paired Greek word: hover + active
interface OriginalWordSetters {
  setHover: (on: boolean) => void;
  setActive: (on: boolean) => void;
}

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

function tokeniseLine(line: string): string[] {
  return line.split(/(\s+)/).filter(t => t.length > 0);
}

// ── Static original word — mirrors hover/active state from paired phonetic word ──

interface OriginalWordProps {
  text: string;
  highlighted: boolean;
  active: boolean;
}

function OriginalWord({ text, highlighted, active }: OriginalWordProps) {
  if (!text.trim()) return <span>{text}</span>;
  let cls = 'original-word';
  if (active) cls += ' voce-magica--active';
  else if (highlighted) cls += ' voce-magica--hover';
  return <span className={cls}>{text}</span>;
}

// ── Play line button ──────────────────────────────────────────────────────────

interface PlayLineButtonProps {
  line: string;
  wordRefs: RefObject<(PhoneticWordHandle | null)[]>;
  originalWordSetters: RefObject<(OriginalWordSetters | null)[]>;
}

function PlayLineButton({ line, wordRefs, originalWordSetters }: PlayLineButtonProps) {
  const isPlayingRef = useRef(false);

  const handlePlay = useCallback(async () => {
    if (isPlayingRef.current || !line.trim()) return;
    isPlayingRef.current = true;

    await playWordByWord(
      line,
      VOICE_ID,
      (wordIdx, active) => {
        wordRefs.current?.[wordIdx]?.highlight(active);
        originalWordSetters.current?.[wordIdx]?.setHover(active);
      }
    );

    isPlayingRef.current = false;
  }, [line, wordRefs, originalWordSetters]);

  return (
    <button
      className="play-line-btn"
      onClick={handlePlay}
      aria-label={`Play: ${line.slice(0, 40)}`}
      title="Play this line"
    >
      ▶
    </button>
  );
}

// ── Vox Line ──────────────────────────────────────────────────────────────────

interface VoxLineProps {
  phoneticLine: string;
  originalLine: string;
  translationLine: string;
  sectionSlug: string;
  lineIndex: number;
  lineWordRefsMap: React.MutableRefObject<Map<number, (PhoneticWordHandle | null)[]>>;
  lineOriginalSettersMap: React.MutableRefObject<Map<number, (OriginalWordSetters | null)[]>>;
}

function VoxLine({
  phoneticLine, originalLine, translationLine, sectionSlug, lineIndex,
  lineWordRefsMap, lineOriginalSettersMap,
}: VoxLineProps) {
  const tokens = phoneticLine.split(/(\s+)/).filter(t => t.trim().length > 0);
  const origTokens = originalLine.split(/(\s+)/).filter(t => t.trim().length > 0);

  if (!lineWordRefsMap.current.has(lineIndex)) {
    lineWordRefsMap.current.set(lineIndex, Array(tokens.length).fill(null));
  }
  if (!lineOriginalSettersMap.current.has(lineIndex)) {
    lineOriginalSettersMap.current.set(lineIndex, Array(origTokens.length).fill(null));
  }

  const wordRefs = useRef(lineWordRefsMap.current.get(lineIndex)!);
  const originalWordSetters = useRef(lineOriginalSettersMap.current.get(lineIndex)!);

  return (
    <div className="vox-line-pair">
      {/* Original (Greek) line — larger, primary */}
      <div className="original-line vox-line-text">
        {origTokens.map((token, i) => {
          if (!token.trim()) return <span key={`orig-ws-${i}`}>{token}</span>;
          return (
            <OriginalWordConnected
              key={`${sectionSlug}-orig-vox-${lineIndex}-${i}`}
              text={token}
              setterRef={(setters) => {
                if (originalWordSetters.current) originalWordSetters.current[i] = setters;
                if (lineOriginalSettersMap.current.get(lineIndex)) {
                  lineOriginalSettersMap.current.get(lineIndex)![i] = setters;
                }
              }}
              onHoverChange={(on) => wordRefs.current?.[i]?.setHover(on)}
              onActiveChange={(on) => wordRefs.current?.[i]?.setActive(on)}
            />
          );
        })}
      </div>
      {/* English translation — static, between Greek and phonetic */}
      {translationLine.trim() && (
        <div className="translation-line vox-line-translation">
          {translationLine}
        </div>
      )}
      {/* Phonetic line with play button — smaller, beneath */}
      <div className="vox-line">
        <PlayLineButton
          line={phoneticLine}
          wordRefs={wordRefs}
          originalWordSetters={originalWordSetters}
        />
        <span className="vox-line-text">
          {tokens.map((token, i) => (
            <PhoneticWord
              key={`${sectionSlug}-vox-${lineIndex}-${i}`}
              ref={(el) => {
                wordRefs.current[i] = el;
                lineWordRefsMap.current.get(lineIndex)![i] = el;
              }}
              text={token}
              onHoverChange={(on) => originalWordSetters.current?.[i]?.setHover(on)}
              onActiveChange={(on) => originalWordSetters.current?.[i]?.setActive(on)}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

// ── Prose Line ────────────────────────────────────────────────────────────────

interface ProseLineProps {
  phoneticLine: string;
  originalLine: string;
  translationLine: string;
  sectionSlug: string;
  lineIndex: number;
  lineWordRefsMap: React.MutableRefObject<Map<number, (PhoneticWordHandle | null)[]>>;
  lineOriginalSettersMap: React.MutableRefObject<Map<number, (OriginalWordSetters | null)[]>>;
}

function ProseLine({
  phoneticLine, originalLine, translationLine, sectionSlug, lineIndex,
  lineWordRefsMap, lineOriginalSettersMap,
}: ProseLineProps) {
  const rawPhoneticTokens = tokeniseLine(phoneticLine);
  const rawOrigTokens = tokeniseLine(originalLine);
  const wordTokens = rawPhoneticTokens.filter(t => t.trim().length > 0);
  const origWordTokens = rawOrigTokens.filter(t => t.trim().length > 0);

  if (!lineWordRefsMap.current.has(lineIndex)) {
    lineWordRefsMap.current.set(lineIndex, Array(wordTokens.length).fill(null));
  }
  if (!lineOriginalSettersMap.current.has(lineIndex)) {
    lineOriginalSettersMap.current.set(lineIndex, Array(origWordTokens.length).fill(null));
  }

  const wordRefs = useRef(lineWordRefsMap.current.get(lineIndex)!);
  const originalWordSetters = useRef(lineOriginalSettersMap.current.get(lineIndex)!);
  let wordIdx = 0;
  let origWordIdx = 0;

  return (
    <div className="prose-line-pair">
      {/* Original (Greek) text — larger, primary */}
      <p className="ritual-prose original-prose">
        {rawOrigTokens.map((token, i) => {
          if (!token.trim()) return <span key={`orig-ws-${i}`}>{token}</span>;
          const idx = origWordIdx++;
          return (
            <OriginalWordConnected
              key={`${sectionSlug}-orig-prose-${lineIndex}-${i}`}
              text={token}
              setterRef={(setters) => {
                if (originalWordSetters.current) originalWordSetters.current[idx] = setters;
                if (lineOriginalSettersMap.current.get(lineIndex)) {
                  lineOriginalSettersMap.current.get(lineIndex)![idx] = setters;
                }
              }}
              onHoverChange={(on) => wordRefs.current?.[idx]?.setHover(on)}
              onActiveChange={(on) => wordRefs.current?.[idx]?.setActive(on)}
            />
          );
        })}
      </p>
      {/* English translation — static, between Greek and phonetic */}
      {translationLine.trim() && (
        <p className="ritual-prose translation-prose">{translationLine}</p>
      )}
      {/* Phonetic text with play button — smaller, beneath */}
      <div className="prose-line">
        <PlayLineButton
          line={phoneticLine}
          wordRefs={wordRefs}
          originalWordSetters={originalWordSetters}
        />
        <p className="ritual-prose phonetic-prose prose-line-text">
          {rawPhoneticTokens.map((token, i) => {
            if (!token.trim()) {
              return <span key={`${sectionSlug}-prose-ws-${lineIndex}-${i}`}>{token}</span>;
            }
            const idx = wordIdx++;
            return (
              <PhoneticWord
                key={`${sectionSlug}-prose-${lineIndex}-${i}`}
                ref={(el) => {
                  wordRefs.current[idx] = el;
                  lineWordRefsMap.current.get(lineIndex)![idx] = el;
                }}
                text={token}
                onHoverChange={(on) => originalWordSetters.current?.[idx]?.setHover(on)}
                onActiveChange={(on) => originalWordSetters.current?.[idx]?.setActive(on)}
              />
            );
          })}
        </p>
      </div>
    </div>
  );
}

// ── OriginalWordConnected — mirrors hover/active from phonetic; also drives it ──

interface OriginalWordConnectedProps {
  text: string;
  /** Register setters so the phonetic word can push state into this component */
  setterRef: (setters: { setHover: (on: boolean) => void; setActive: (on: boolean) => void }) => void;
  /** Called when this Greek word is hovered/activated, to push state into phonetic word */
  onHoverChange?: (on: boolean) => void;
  onActiveChange?: (on: boolean) => void;
}

function OriginalWordConnected({ text, setterRef, onHoverChange, onActiveChange }: OriginalWordConnectedProps) {
  const [highlighted, setHighlighted] = useState(false);
  const [active, setActive] = useState(false);

  const registered = useRef(false);
  if (!registered.current) {
    setterRef({ setHover: setHighlighted, setActive });
    registered.current = true;
  }

  if (!text.trim()) return <span>{text}</span>;

  return (
    <span
      className={`original-word${active ? ' voce-magica--active' : highlighted ? ' voce-magica--hover' : ''}`}
      onMouseEnter={() => { setHighlighted(true); onHoverChange?.(true); }}
      onMouseLeave={() => { setHighlighted(false); setActive(false); onHoverChange?.(false); onActiveChange?.(false); }}
      onMouseDown={() => { setActive(true); onActiveChange?.(true); }}
      onMouseUp={() => { setActive(false); onActiveChange?.(false); }}
    >
      {text}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const PhoneticSection = forwardRef<PhoneticSectionHandle, PhoneticSectionProps>(
  function PhoneticSection({ section }, ref) {
    const phoneticLines = section.body.split('\n');
    const originalLines = section.original.split('\n');
    const translationLines = section.translation.split('\n');

    const lineWordRefsMap = useRef<Map<number, (PhoneticWordHandle | null)[]>>(new Map());
    const lineOriginalSettersMap = useRef<Map<number, (OriginalWordSetters | null)[]>>(new Map());

    useImperativeHandle(ref, () => ({
      highlightWord: (rawLineIndex: number, wordIndex: number, on: boolean) => {
        lineWordRefsMap.current.get(rawLineIndex)?.[wordIndex]?.highlight(on);
        lineOriginalSettersMap.current.get(rawLineIndex)?.[wordIndex]?.setHover(on);
      },
      highlightLine: (rawLineIndex: number, on: boolean) => {
        lineWordRefsMap.current.get(rawLineIndex)?.forEach(r => r?.highlight(on));
        lineOriginalSettersMap.current.get(rawLineIndex)?.forEach(s => s?.setHover(on));
      },
    }));

    return (
      <section className="ritual-section phonetic-section">
        <h2 className="ritual-section-title">{section.title}</h2>
        <div className="ritual-body">
          {phoneticLines.map((rawPhoneticLine, lineIndex) => {
            const isVoxLine = rawPhoneticLine.startsWith('§');
            const phoneticLine = isVoxLine ? rawPhoneticLine.slice(1) : rawPhoneticLine;
            const rawOrigLine = originalLines[lineIndex] ?? '';
            const originalLine = rawOrigLine.startsWith('§') ? rawOrigLine.slice(1) : rawOrigLine;
            const rawTransLine = translationLines[lineIndex] ?? '';
            const translationLine = rawTransLine.startsWith('§') ? rawTransLine.slice(1) : rawTransLine;

            if (isVoxLine) {
              return (
                <VoxLine
                  key={`${section.slug}-voxline-${lineIndex}`}
                  phoneticLine={phoneticLine}
                  originalLine={originalLine}
                  translationLine={translationLine}
                  sectionSlug={section.slug}
                  lineIndex={lineIndex}
                  lineWordRefsMap={lineWordRefsMap}
                  lineOriginalSettersMap={lineOriginalSettersMap}
                />
              );
            }

            return (
              <ProseLine
                key={`${section.slug}-prose-${lineIndex}`}
                phoneticLine={phoneticLine}
                originalLine={originalLine}
                translationLine={translationLine}
                sectionSlug={section.slug}
                lineIndex={lineIndex}
                lineWordRefsMap={lineWordRefsMap}
                lineOriginalSettersMap={lineOriginalSettersMap}
              />
            );
          })}
        </div>
      </section>
    );
  }
);

export default PhoneticSection;
