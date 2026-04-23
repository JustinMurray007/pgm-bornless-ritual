import { useRef, useCallback } from 'react';

export interface UseAudioAnalyzerReturn {
  analyzerRef: React.RefObject<AnalyserNode | null>;
  connectAudio: (
    audioElement: HTMLAudioElement,
    buildChain?: (ctx: AudioContext, source: AudioNode) => AudioNode
  ) => void;
  disconnectAudio: () => void;
  getAmplitude: () => number;
}

export function useAudioAnalyzer(): UseAudioAnalyzerReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const connectAudio = useCallback(
    (
      audioElement: HTMLAudioElement,
      buildChain?: (ctx: AudioContext, source: AudioNode) => AudioNode
    ) => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const context = audioContextRef.current;

        if (!analyzerRef.current) {
          analyzerRef.current = context.createAnalyser();
          analyzerRef.current.fftSize = 256;
          const bufferLength = analyzerRef.current.frequencyBinCount;
          dataArrayRef.current = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
        }

        sourceRef.current = context.createMediaElementSource(audioElement);

        // If a chain builder is provided, insert it between source and analyser
        const chainOutput = buildChain
          ? buildChain(context, sourceRef.current)
          : sourceRef.current;

        chainOutput.connect(analyzerRef.current);
        analyzerRef.current.connect(context.destination);
      } catch (error) {
        console.error('[useAudioAnalyzer] Failed to create AudioContext:', error);
      }
    },
    []
  );

  const disconnectAudio = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyzerRef.current = null;
      dataArrayRef.current = null;
    }
  }, []);

  const getAmplitude = useCallback((): number => {
    if (!analyzerRef.current || !dataArrayRef.current) return 0;

    analyzerRef.current.getByteTimeDomainData(dataArrayRef.current);

    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const normalized = (dataArrayRef.current[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArrayRef.current.length);
    return Math.min(rms * 2, 1);
  }, []);

  return { analyzerRef, connectAudio, disconnectAudio, getAmplitude };
}
