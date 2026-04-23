'use client';

import { useRef, useEffect, useCallback } from 'react';

interface VoiceWaveformProps {
  /** Which voice layer this visualises */
  label: 'A' | 'B' | 'C';
  /** Live amplitude 0–1 driven by the parent */
  amplitude: number;
  /** Whether this voice is currently active */
  active: boolean;
  /** Whether voices are overlapping — causes waveforms to bleed */
  overlapping: boolean;
}

// Per-voice colour palette — amber/gold family, differentiated by hue
const VOICE_COLORS: Record<string, { line: string; glow: string; bleed: string }> = {
  A: { line: 'hsl(38, 90%, 58%)',  glow: 'hsl(38, 90%, 70%)',  bleed: 'hsla(38, 90%, 58%, 0.18)' },
  B: { line: 'hsl(18, 80%, 52%)',  glow: 'hsl(18, 80%, 65%)',  bleed: 'hsla(18, 80%, 52%, 0.18)' },
  C: { line: 'hsl(55, 85%, 62%)',  glow: 'hsl(55, 85%, 75%)',  bleed: 'hsla(55, 85%, 62%, 0.18)' },
};

const HISTORY_LEN = 120; // samples kept in the rolling buffer

export default function VoiceWaveform({ label, amplitude, active, overlapping }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[]>(Array(HISTORY_LEN).fill(0));
  const rafRef = useRef<number>(0);
  const colors = VOICE_COLORS[label];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const mid = H / 2;

    // Push new amplitude sample
    historyRef.current.push(active ? amplitude : 0);
    if (historyRef.current.length > HISTORY_LEN) historyRef.current.shift();

    ctx.clearRect(0, 0, W, H);

    // ── Bleed fill when overlapping ──────────────────────────────────────
    if (overlapping && active) {
      ctx.fillStyle = colors.bleed;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Waveform line ────────────────────────────────────────────────────
    const history = historyRef.current;
    const step = W / (HISTORY_LEN - 1);

    // Glow pass
    if (active) {
      ctx.save();
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 8 + amplitude * 18;
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      history.forEach((v, i) => {
        const x = i * step;
        const y = mid - v * mid * 0.85;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // Main line
    ctx.save();
    ctx.strokeStyle = active ? colors.line : 'hsla(38, 30%, 40%, 0.3)';
    ctx.lineWidth = active ? 1.5 : 1;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = active ? 1 : 0.35;
    ctx.beginPath();
    history.forEach((v, i) => {
      const x = i * step;
      const y = mid - v * mid * 0.85;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Mirror (lower half)
    ctx.globalAlpha = active ? 0.35 : 0.15;
    ctx.beginPath();
    history.forEach((v, i) => {
      const x = i * step;
      const y = mid + v * mid * 0.85;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // ── Centre baseline ──────────────────────────────────────────────────
    ctx.save();
    ctx.strokeStyle = 'hsla(38, 30%, 40%, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(W, mid);
    ctx.stroke();
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, [amplitude, active, overlapping, colors]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Resize observer — keep canvas pixel dimensions in sync with CSS size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`voice-waveform${active ? ' voice-waveform--active' : ''}${overlapping ? ' voice-waveform--overlap' : ''}`}>
      <span className="voice-waveform-label" style={{ color: colors.line }}>
        {label}
      </span>
      <canvas ref={canvasRef} className="voice-waveform-canvas" aria-hidden="true" />
    </div>
  );
}
