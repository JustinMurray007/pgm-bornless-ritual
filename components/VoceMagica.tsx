'use client';

import { useRef, useCallback, CSSProperties, useState, forwardRef, useImperativeHandle } from 'react';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import { useGlowController } from '@/hooks/useGlowController';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getSessionId } from '@/lib/session';
import { useToast } from './Toast';

interface VoceMagicaProps {
  original: string;
  phonetic: string;
  ariaLabel: string;
}

export interface VoceMagicaHandle {
  highlight: (on: boolean) => void;
}

import { applyEcho } from '@/lib/audioUtils';

const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';

const VoceMagica = forwardRef<VoceMagicaHandle, VoceMagicaProps>(
  function VoceMagica({ original, phonetic, ariaLabel }, ref) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isPlayingRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const { showToast } = useToast();

    const { connectAudio, disconnectAudio, getAmplitude } = useAudioAnalyzer();
    useGlowController({ getAmplitude, elementRef, isPlaying });

    useImperativeHandle(ref, () => ({
      highlight: (on: boolean) => setIsHighlighted(on),
    }));

    // Always fully stop and clear playing state
    const stopAudio = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      }
      isPlayingRef.current = false;
      setIsPlaying(false);
      disconnectAudio();
    }, [disconnectAudio]);

    const logUsage = useCallback(async (voxMagica: string) => {
      const sessionId = getSessionId();
      if (!sessionId) return;
      const supabase = getSupabaseBrowserClient();
      const logData = {
        vox_magica: voxMagica,
        session_id: sessionId,
        triggered_at: new Date().toISOString(),
      };
      try {
        const { error } = await supabase.from('usage_logs').insert(logData);
        if (error) throw error;
      } catch (error) {
        console.warn('[VoceMagica] Usage log insert failed, retrying in 2s:', error);
        setTimeout(async () => {
          try {
            const { error: retryError } = await supabase.from('usage_logs').insert(logData);
            if (retryError) console.error('[VoceMagica] Usage log retry failed:', retryError);
          } catch (retryError) {
            console.error('[VoceMagica] Usage log retry failed:', retryError);
          }
        }, 2000);
      }
    }, []);

    const triggerTTS = useCallback(async (force = false) => {
      // Hover: don't interrupt if already playing
      // Click/keyboard (force=true): always stop and restart
      if (isPlayingRef.current && !force) return;
      if (force) stopAudio(); // interrupt current playback

      if (abortControllerRef.current) abortControllerRef.current.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: phonetic, voiceId: VOICE_ID }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`TTS API error: ${response.status}`);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (!audioRef.current) audioRef.current = new Audio();
        const audio = audioRef.current;
        audio.src = url;

        isPlayingRef.current = true;
        setIsPlaying(true);

        connectAudio(audio, applyEcho);

        const cleanup = () => {
          isPlayingRef.current = false;
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          disconnectAudio();
        };

        audio.onended = cleanup;
        audio.onerror = cleanup;

        await audio.play();
        logUsage(original);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('[VoceMagica] TTS error:', error);
        isPlayingRef.current = false;
        setIsPlaying(false);
        showToast('Audio unavailable — please try again');
      }
    }, [phonetic, connectAudio, disconnectAudio, logUsage, original, showToast, stopAudio]);

    const cancelTTS = useCallback(() => {
      // Abort any in-flight fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // Always clear playing state when user leaves — don't wait for onended
      stopAudio();
    }, [stopAudio]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerTTS(true); // force restart on keyboard
        }
      },
      [triggerTTS]
    );

    let flameClass = 'voce-magica';
    if (isActive) {
      flameClass += ' voce-magica--active';
    } else if (isHovered || isPlaying || isHighlighted) {
      flameClass += ' voce-magica--hover';
    }

    const style: CSSProperties = {
      '--glow-blur': '0px',
      '--glow-brightness': '1',
    } as CSSProperties;

    return (
      <span
        ref={elementRef}
        className={flameClass}
        style={style}
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        onMouseEnter={() => { setIsHovered(true); triggerTTS(false); }}
        onMouseLeave={() => { setIsHovered(false); setIsActive(false); cancelTTS(); }}
        onMouseDown={() => { setIsActive(true); triggerTTS(true); }}
        onMouseUp={() => setIsActive(false)}
        onFocus={() => { setIsHovered(true); triggerTTS(false); }}
        onBlur={() => { setIsHovered(false); setIsActive(false); cancelTTS(); }}
        onKeyDown={handleKeyDown}
      >
        {original}
      </span>
    );
  }
);

export default VoceMagica;
