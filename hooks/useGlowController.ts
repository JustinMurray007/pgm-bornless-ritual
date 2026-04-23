import { useEffect, useRef, useCallback } from 'react';

export interface UseGlowControllerOptions {
  getAmplitude: () => number;
  elementRef: React.RefObject<HTMLElement | null>;
  isPlaying: boolean;
}

export interface UseGlowControllerReturn {
  startGlow: () => void;
  stopGlow: () => void;
}

export function useGlowController({
  getAmplitude,
  elementRef,
  isPlaying,
}: UseGlowControllerOptions): UseGlowControllerReturn {
  const rafIdRef = useRef<number | null>(null);
  const fadeStartTimeRef = useRef<number | null>(null);
  const fadeStartBlurRef = useRef<number>(0);
  const fadeStartBrightnessRef = useRef<number>(1);

  const updateGlow = useCallback(() => {
    if (!elementRef.current) return;

    const amplitude = getAmplitude();
    const blur = amplitude * 24; // Max 24px at amplitude 1.0
    const brightness = 1 + amplitude * 0.6; // Max 1.6 at amplitude 1.0

    elementRef.current.style.setProperty('--glow-blur', `${blur}px`);
    elementRef.current.style.setProperty('--glow-brightness', `${brightness}`);
  }, [getAmplitude, elementRef]);

  const animationLoop = useCallback(() => {
    updateGlow();
    rafIdRef.current = requestAnimationFrame(animationLoop);
  }, [updateGlow]);

  const startGlow = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(animationLoop);
  }, [animationLoop]);

  const stopGlow = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (!elementRef.current) return;

    // Capture current glow values
    const currentBlur = parseFloat(
      elementRef.current.style.getPropertyValue('--glow-blur') || '0'
    );
    const currentBrightness = parseFloat(
      elementRef.current.style.getPropertyValue('--glow-brightness') || '1'
    );

    fadeStartBlurRef.current = currentBlur;
    fadeStartBrightnessRef.current = currentBrightness;
    fadeStartTimeRef.current = performance.now();

    // Set data-fading attribute to trigger CSS transition
    elementRef.current.setAttribute('data-fading', 'true');

    // Animate back to defaults over 500ms
    const fadeDuration = 500;

    const fadeLoop = () => {
      if (!elementRef.current || fadeStartTimeRef.current === null) return;

      const elapsed = performance.now() - fadeStartTimeRef.current;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // Linear interpolation
      const blur = fadeStartBlurRef.current * (1 - progress);
      const brightness = fadeStartBrightnessRef.current + (1 - fadeStartBrightnessRef.current) * progress;

      elementRef.current.style.setProperty('--glow-blur', `${blur}px`);
      elementRef.current.style.setProperty('--glow-brightness', `${brightness}`);

      if (progress < 1) {
        requestAnimationFrame(fadeLoop);
      } else {
        // Fade complete — remove data-fading attribute
        elementRef.current.removeAttribute('data-fading');
        fadeStartTimeRef.current = null;
      }
    };

    requestAnimationFrame(fadeLoop);
  }, [elementRef]);

  // Auto-start/stop based on isPlaying
  useEffect(() => {
    if (isPlaying) {
      startGlow();
    } else {
      stopGlow();
    }
  }, [isPlaying, startGlow, stopGlow]);

  return {
    startGlow,
    stopGlow,
  };
}
