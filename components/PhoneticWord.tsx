'use client';

import {
  useRef, useCallback, useState,
  forwardRef, useImperativeHandle,
} from 'react';
import { useToast } from './Toast';
import { playTTS } from '@/lib/audioUtils';

export interface PhoneticWordHandle {
  highlight: (on: boolean) => void;
  setHover: (on: boolean) => void;
  setActive: (on: boolean) => void;
}

interface PhoneticWordProps {
  text: string;
  /** Called when hover state changes — lets paired Greek word mirror it */
  onHoverChange?: (on: boolean) => void;
  /** Called when active (mousedown) state changes */
  onActiveChange?: (on: boolean) => void;
}

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

const PhoneticWord = forwardRef<PhoneticWordHandle, PhoneticWordProps>(
  function PhoneticWord({ text, onHoverChange, onActiveChange }, ref) {
    const isPlayingRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const { showToast } = useToast();

    useImperativeHandle(ref, () => ({
      highlight: (on: boolean) => setIsHighlighted(on),
      setHover: (on: boolean) => { setIsHovered(on); onHoverChange?.(on); },
      setActive: (on: boolean) => { setIsActive(on); onActiveChange?.(on); },
    }));

    const stopAudio = useCallback(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isPlayingRef.current = false;
    }, []);

    const triggerTTS = useCallback(async (force = false) => {
      const word = text.trim();
      if (!word) return;
      // Hover: don't interrupt if already playing
      // Click/keyboard (force=true): always stop and restart
      if (isPlayingRef.current && !force) return;
      stopAudio();

      const controller = new AbortController();
      abortControllerRef.current = controller;
      isPlayingRef.current = true;

      try {
        await playTTS(word, VOICE_ID, controller.signal);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('[PhoneticWord] TTS error:', error);
        showToast('Audio unavailable — please try again');
      } finally {
        isPlayingRef.current = false;
      }
    }, [text, stopAudio, showToast]);

    const cancelTTS = useCallback(() => {
      stopAudio();
    }, [stopAudio]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerTTS(true);
        }
      },
      [triggerTTS]
    );

    const isInteractive = text.trim().length > 0;

    let cls = 'phonetic-word';
    if (isInteractive) {
      if (isActive) cls += ' voce-magica--active';
      else if (isHovered || isHighlighted) cls += ' voce-magica--hover';
    }

    if (!isInteractive) return <span>{text}</span>;

    return (
      <span
        className={cls}
        tabIndex={0}
        role="button"
        aria-label={`Speak: ${text.trim()}`}
        onMouseEnter={() => { setIsHovered(true); onHoverChange?.(true); triggerTTS(false); }}
        onMouseLeave={() => { setIsHovered(false); setIsActive(false); onHoverChange?.(false); onActiveChange?.(false); cancelTTS(); }}
        onMouseDown={() => { setIsActive(true); onActiveChange?.(true); triggerTTS(true); }}
        onMouseUp={() => { setIsActive(false); onActiveChange?.(false); }}
        onFocus={() => { setIsHovered(true); onHoverChange?.(true); triggerTTS(false); }}
        onBlur={() => { setIsHovered(false); setIsActive(false); onHoverChange?.(false); onActiveChange?.(false); cancelTTS(); }}
        onKeyDown={handleKeyDown}
      >
        {text}
      </span>
    );
  }
);

export default PhoneticWord;
