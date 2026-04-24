/**
 * Shared Web Audio utilities used by all TTS playback paths.
 */

// Reuse a single AudioContext to avoid hitting browser limits
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioContext();
  }
  return sharedAudioContext;
}

/**
 * Inserts a subtle echo/reverb chain between `source` and the audio context
 * destination. Returns the output gain node (already connected to destination).
 *
 * Tap layout (reduced from original):
 *   dry  × 1.15  (slightly louder than unity)
 *   tap1 × 0.20  @ 220 ms
 *   tap2 × 0.09  @ 440 ms
 *   tap3 × 0.04  @ 660 ms
 */
export function applyEcho(ctx: AudioContext, source: AudioNode): AudioNode {
  const out = ctx.createGain();
  out.gain.value = 1.15; // modest volume boost

  const tap = (delayTime: number, gain: number) => {
    const d = ctx.createDelay(1.0);
    d.delayTime.value = delayTime;
    const g = ctx.createGain();
    g.gain.value = gain;
    source.connect(d);
    d.connect(g);
    g.connect(out);
  };

  source.connect(out);   // dry path
  tap(0.22, 0.20);
  tap(0.44, 0.09);
  tap(0.66, 0.04);

  out.connect(ctx.destination);
  return out;
}

/**
 * Fetch TTS audio, apply echo, and play it.
 * Returns a Promise that resolves when playback ends (or on error).
 */
export async function playTTS(
  text: string,
  voiceId: string,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId }),
    signal,
  });

  if (!response.ok) throw new Error(`TTS error: ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(url);

    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.pause();
      audio.src = '';
    };

    const handleEnd = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error('Audio playback failed'));
    };

    // Handle abort signal
    if (signal) {
      const abortHandler = () => {
        cleanup();
        reject(new Error('Aborted'));
      };
      signal.addEventListener('abort', abortHandler, { once: true });
    }

    audio.addEventListener('ended', handleEnd, { once: true });
    audio.addEventListener('error', handleError, { once: true });

    // Apply echo via Web Audio using shared context
    try {
      const ctx = getAudioContext();
      const source = ctx.createMediaElementSource(audio);
      applyEcho(ctx, source);
    } catch (err) {
      console.warn('Failed to apply echo, playing without effects:', err);
      // Fallback: play without echo
    }

    audio.play().catch((err) => {
      cleanup();
      reject(err);
    });
  });
}

/**
 * Split text into speakable word tokens (non-whitespace chunks).
 * Preserves punctuation attached to words.
 */
export function tokeniseWords(text: string): string[] {
  return text.split(/\s+/).filter(w => w.trim().length > 0);
}

/**
 * Play text word-by-word, calling onWord(index, true/false) before/after each word.
 * Resolves when all words are done or signal is aborted.
 */
export async function playWordByWord(
  text: string,
  voiceId: string,
  onWord: (wordIndex: number, active: boolean) => void,
  signal?: AbortSignal
): Promise<void> {
  const words = tokeniseWords(text);
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) break;
    onWord(i, true);
    try {
      await playTTS(words[i], voiceId, signal);
    } catch {
      onWord(i, false);
      break;
    }
    onWord(i, false);
  }
}
