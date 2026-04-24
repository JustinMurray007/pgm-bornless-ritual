'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  RITUAL_VOICE_SCRIPTS,
  type RitualVoiceScript,
  type OverlapGroup,
  type SequentialLine,
  type VoiceInput,
} from '@/lib/ritualScript';
import VoiceWaveform from './VoiceWaveform';
import { useToast } from './Toast';

// ── Audio helpers ─────────────────────────────────────────────────────────────

async function fetchVoiceAudio(input: VoiceInput): Promise<ArrayBuffer> {
  const res = await fetch('/api/ritual-voice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      voice_id: input.voice_id,
      text: input.text,
      voice_settings: input.voice_settings,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.arrayBuffer();
}

async function fetchSequentialAudio(line: SequentialLine): Promise<ArrayBuffer> {
  return fetchVoiceAudio(line.input);
}

/**
 * Mix multiple ArrayBuffers into a single AudioBuffer using Web Audio API.
 * Each buffer is decoded and scheduled at its delaySeconds offset.
 * Returns the mixed AudioBuffer.
 */
async function mixBuffers(
  ctx: AudioContext,
  buffers: { data: ArrayBuffer; delaySeconds: number; gain: number }[],
): Promise<AudioBuffer> {
  const decoded = await Promise.all(
    buffers.map(b => ctx.decodeAudioData(b.data.slice(0)))
  );

  // Total duration = max(delay + duration) across all voices
  const totalDuration = Math.max(
    ...decoded.map((buf, i) => buffers[i].delaySeconds + buf.duration)
  );

  const sampleRate = ctx.sampleRate;
  const totalSamples = Math.ceil(totalDuration * sampleRate);
  const mixed = ctx.createBuffer(2, totalSamples, sampleRate);

  decoded.forEach((buf, i) => {
    const delaySamples = Math.floor(buffers[i].delaySeconds * sampleRate);
    const gainVal = buffers[i].gain;
    for (let ch = 0; ch < 2; ch++) {
      const srcCh = ch < buf.numberOfChannels ? ch : 0;
      const src = buf.getChannelData(srcCh);
      const dst = mixed.getChannelData(ch);
      for (let s = 0; s < src.length; s++) {
        const idx = delaySamples + s;
        if (idx < totalSamples) dst[idx] += src[s] * gainVal;
      }
    }
  });

  return mixed;
}

/** Encode an AudioBuffer to a Blob URL for playback */
function audioBufferToBlob(buffer: AudioBuffer): string {
  const numCh = buffer.numberOfChannels;
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const pcmSize = length * numCh * 2; // 16-bit
  const wavSize = 44 + pcmSize;
  const ab = new ArrayBuffer(wavSize);
  const view = new DataView(ab);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, wavSize - 8, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, pcmSize, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return URL.createObjectURL(new Blob([ab], { type: 'audio/wav' }));
}

function getRms(analyser: AnalyserNode): number {
  const buf = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const n = (buf[i] - 128) / 128;
    sum += n * n;
  }
  return Math.min(1, Math.sqrt(sum / buf.length) * 6);
}

// ── Per-script player ─────────────────────────────────────────────────────────

interface ScriptPlayerProps {
  script: RitualVoiceScript;
}

function ScriptPlayer({ script }: ScriptPlayerProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [amplitudes, setAmplitudes] = useState({ A: 0, B: 0, C: 0 });
  const [activeVoices, setActiveVoices] = useState({ A: false, B: false, C: false });
  const [overlapping, setOverlapping] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const abortRef = useRef<AbortController | null>(null);
  const blobUrlsRef = useRef<string[]>([]);
  const { showToast } = useToast();

  const voicesPresent = useMemo(() => ({
    A: script.entries.some(e =>
      e.type === 'sequential' ? e.input.voiceLabel === 'A'
        : e.inputs.some(i => i.voiceLabel === 'A')
    ),
    B: script.entries.some(e =>
      e.type === 'sequential' ? e.input.voiceLabel === 'B'
        : e.inputs.some(i => i.voiceLabel === 'B')
    ),
    C: script.entries.some(e =>
      e.type === 'sequential' ? e.input.voiceLabel === 'C'
        : e.inputs.some(i => i.voiceLabel === 'C')
    ),
  }), [script.entries]);

  const hasOverlap = script.entries.some(e => e.type === 'overlap');

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    analyserRef.current = null;
    blobUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
    blobUrlsRef.current = [];
    setAmplitudes({ A: 0, B: 0, C: 0 });
    setActiveVoices({ A: false, B: false, C: false });
    setOverlapping(false);
    setState('idle');
  }, []);

  const play = useCallback(async () => {
    if (state === 'playing' || state === 'loading') { cleanup(); return; }

    setState('loading');
    abortRef.current = new AbortController();

    try {
      // ── Build audio segments sequentially ──────────────────────────────
      // For each entry: sequential → single fetch, overlap → parallel fetch + mix
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const segmentUrls: string[] = [];

      for (const entry of script.entries) {
        if (abortRef.current?.signal.aborted) break;

        if (entry.type === 'sequential') {
          const data = await fetchSequentialAudio(entry as SequentialLine);
          const buf = await ctx.decodeAudioData(data);
          const url = audioBufferToBlob(buf);
          segmentUrls.push(url);
          blobUrlsRef.current.push(url);

        } else {
          // Overlap group — fetch all voices in parallel
          const group = entry as OverlapGroup;
          const results = await Promise.all(
            group.inputs.map(input => fetchVoiceAudio(input))
          );
          const mixed = await mixBuffers(
            ctx,
            results.map((data, i) => ({
              data,
              delaySeconds: group.inputs[i].delaySeconds ?? 0,
              gain: group.inputs[i].gain ?? 1,
            }))
          );
          const url = audioBufferToBlob(mixed);
          segmentUrls.push(url);
          blobUrlsRef.current.push(url);
        }
      }

      if (abortRef.current?.signal.aborted || segmentUrls.length === 0) {
        cleanup();
        return;
      }

      // ── Play segments sequentially ─────────────────────────────────────
      const labels = (Object.keys(voicesPresent) as ('A'|'B'|'C')[]).filter(k => voicesPresent[k]);
      setActiveVoices({ A: labels.includes('A'), B: labels.includes('B'), C: labels.includes('C') });
      setOverlapping(hasOverlap);
      setState('playing');

      // Attach analyser to the audio element
      const audio = new Audio();
      audioRef.current = audio;

      try {
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
      } catch { /* play without analysis */ }

      // rAF loop
      const tick = () => {
        if (!analyserRef.current) return;
        const rms = getRms(analyserRef.current);
        setAmplitudes({
          A: labels.includes('A') ? Math.min(1, rms * 1.0) : 0,
          B: labels.includes('B') ? Math.min(1, rms * 0.75 + Math.random() * 0.04) : 0,
          C: labels.includes('C') ? Math.min(1, rms * 0.6  + Math.random() * 0.06) : 0,
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      // Play each segment in order
      for (const url of segmentUrls) {
        if (abortRef.current?.signal.aborted) break;
        await new Promise<void>((resolve) => {
          audio.src = url;
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          audio.play().catch(() => resolve());
        });
      }

      cleanup();

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') { cleanup(); return; }
      console.error('[RitualVoicePlayer]', err);
      showToast('Ritual voice unavailable — please try again');
      setState('error');
      cleanup();
    }
  }, [state, script.entries, cleanup, showToast, voicesPresent, hasOverlap]);

  useEffect(() => () => cleanup(), [cleanup]);

  const isLoading = state === 'loading';
  const isPlaying = state === 'playing';

  return (
    <div className={`ritual-voice-card${isPlaying ? ' ritual-voice-card--playing' : ''}`}>
      <div className="ritual-voice-card-header">
        <div className="ritual-voice-card-titles">
          <h3 className="ritual-voice-card-title">{script.title}</h3>
          <p className="ritual-voice-card-desc">{script.description}</p>
        </div>
        <button
          className={`ritual-voice-play-btn${isPlaying ? ' ritual-voice-play-btn--stop' : ''}${isLoading ? ' ritual-voice-play-btn--loading' : ''}`}
          onClick={play}
          disabled={isLoading}
          aria-label={isPlaying ? `Stop ${script.title}` : `Play ${script.title}`}
        >
          {isLoading ? '…' : isPlaying ? '■' : '▶'}
        </button>
      </div>

      <div className="ritual-voice-waveforms">
        {(['A', 'B', 'C'] as const).filter(l => voicesPresent[l]).map(label => (
          <VoiceWaveform
            key={label}
            label={label}
            amplitude={amplitudes[label]}
            active={activeVoices[label]}
            overlapping={overlapping && isPlaying}
          />
        ))}
      </div>

      <div className="ritual-voice-legend">
        {voicesPresent.A && <span className="ritual-voice-legend-item ritual-voice-legend-a">A — Narrator</span>}
        {voicesPresent.B && <span className="ritual-voice-legend-item ritual-voice-legend-b">B — Rachid (Arabic)</span>}
        {voicesPresent.C && <span className="ritual-voice-legend-item ritual-voice-legend-c">C — Darsho (Arabic Fusha)</span>}
        {hasOverlap && <span className="ritual-voice-legend-overlap">⟨ mixed overlap ⟩</span>}
      </div>
    </div>
  );
}

export default function RitualVoicePlayerController() {
  return (
    <div className="ritual-voice-player">
      {RITUAL_VOICE_SCRIPTS.map(script => (
        <ScriptPlayer key={script.slug} script={script} />
      ))}
    </div>
  );
}
