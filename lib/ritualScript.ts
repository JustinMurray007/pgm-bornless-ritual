/**
 * Multi-voice ritual scripts for the Bornless Ritual.
 *
 * Architecture:
 *   - SequentialLine: one voice speaks, then the next (standard dialogue turn)
 *   - OverlapGroup:   multiple voices fetched in parallel and mixed client-side
 *                     with time offsets — this is how real overlap is achieved
 *
 * Voice roster:
 *   VOICE_A  — Daniel (iBRcUZbbi4hxPMzDCm71)  deep gravelly male, narrator
 *   VOICE_B  — Adam   (pNInz6obpgDQGcFmaJgB)  resonant baritone, the shadow
 *   VOICE_C  — Aria   (EXAVITQu4vr4xnSDxMaL)  ethereal female, the harmonic
 */

export const VOICE_A = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? 'iBRcUZbbi4hxPMzDCm71';
export const VOICE_B = '0Up3glsGKvZx3M5JI0XB'; // Rachid — Bold Arabic male, the shadow chant
export const VOICE_C = 'beZRlJoDAXQuY5EaPgHK'; // Darsho — Royal Arabic Fusha, the deep harmonic

// Voice settings shared defaults — gritty, fast, expressive
const BASE_SETTINGS = {
  stability: 0.1,        // low = maximum expressiveness / grit
  similarity_boost: 0.9,
  style: 0.9,            // high = dramatic, character-forward
  use_speaker_boost: true,
  speed: 1.15,           // faster = more urgent
};

// Shadow voice (B) — slightly slower for the echo-lag feel
const SHADOW_SETTINGS = {
  ...BASE_SETTINGS,
  stability: 0.15,
  speed: 1.05,
};

// Harmonic voice (C) — ethereal, slower, more breathy
const HARMONIC_SETTINGS = {
  ...BASE_SETTINGS,
  stability: 0.2,
  style: 0.7,
  speed: 0.95,
};

export interface VoiceInput {
  voice_id: string;
  voiceLabel: 'A' | 'B' | 'C';
  text: string;
  voice_settings?: typeof BASE_SETTINGS;
  /** Delay in seconds before this voice starts (for overlap groups) */
  delaySeconds?: number;
  /** Gain 0–1 (default 1) */
  gain?: number;
}

/** A single voice speaks, then the next begins */
export interface SequentialLine {
  type: 'sequential';
  input: VoiceInput;
}

/**
 * Multiple voices are fetched in parallel and mixed together.
 * Each voice can have a delaySeconds offset for staggered entry.
 */
export interface OverlapGroup {
  type: 'overlap';
  inputs: VoiceInput[];
}

export type ScriptEntry = SequentialLine | OverlapGroup;

export interface RitualVoiceScript {
  slug: string;
  title: string;
  description: string;
  entries: ScriptEntry[];
}

// ── Helper builders ───────────────────────────────────────────────────────────

const seq = (voice_id: string, voiceLabel: 'A'|'B'|'C', text: string, settings = BASE_SETTINGS): SequentialLine => ({
  type: 'sequential',
  input: { voice_id, voiceLabel, text, voice_settings: settings },
});

const overlap = (...inputs: VoiceInput[]): OverlapGroup => ({
  type: 'overlap',
  inputs,
});

// ── Scripts ───────────────────────────────────────────────────────────────────

export const RITUAL_VOICE_SCRIPTS: RitualVoiceScript[] = [
  {
    slug: 'opening',
    title: 'The Opening',
    description: 'Building the Atmosphere — narrator speaks, shadow echoes 300ms behind',
    entries: [
      // A speaks the full opening; B echoes it 300ms later as a whisper
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[deep voice] [slow] I call upon thee, the Headless One, who created earth and heaven, who created night and day, thee who created light and darkness.',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[whisper] I call upon thee, the Headless One, who created earth and heaven, who created night and day, thee who created light and darkness.',
          voice_settings: SHADOW_SETTINGS,
          delaySeconds: 0.3,
          gain: 0.55,
        },
      ),
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[deep voice] Thou art Osoronnophris, whom no one has ever seen.',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[whisper] Thou art Osoronnophris, whom no one has ever seen.',
          voice_settings: SHADOW_SETTINGS,
          delaySeconds: 0.25,
          gain: 0.45,
        },
      ),
    ],
  },

  {
    slug: 'first_vocal_key',
    title: 'The First Vocal Key',
    description: 'The Harmonic Resonance — three voices strike simultaneously',
    entries: [
      // All three voices hit IAO at the same time, C slightly delayed for shimmer
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[deep voice] [commanding] I... A... Ō!',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[deep voice] I... A... Ō!',
          voice_settings: SHADOW_SETTINGS,
          delaySeconds: 0.1,
          gain: 0.7,
        },
        {
          voice_id: VOICE_C, voiceLabel: 'C',
          text: '[ethereal] I... A... Ō!',
          voice_settings: HARMONIC_SETTINGS,
          delaySeconds: 0.2,
          gain: 0.5,
        },
      ),
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[commanding] Sabaōth! Adōnai!',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[deep voice] Sabaōth! Adōnai!',
          voice_settings: SHADOW_SETTINGS,
          delaySeconds: 0.15,
          gain: 0.65,
        },
        {
          voice_id: VOICE_C, voiceLabel: 'C',
          text: '[ethereal] Sabaōth! Adōnai!',
          voice_settings: HARMONIC_SETTINGS,
          delaySeconds: 0.25,
          gain: 0.45,
        },
      ),
    ],
  },

  {
    slug: 'barbarous_names',
    title: 'The Barbarous Names',
    description: 'The Chaotic Overlap — three voices shout different names simultaneously',
    entries: [
      // Chaotic: each voice shouts a different name at the same time
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[shouting] [deep voice] Abrasax!',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[whisper] Ithyphallō!',
          voice_settings: SHADOW_SETTINGS,
          delaySeconds: 0.05,
          gain: 0.8,
        },
        {
          voice_id: VOICE_C, voiceLabel: 'C',
          text: '[shouting] Arthexouth!',
          voice_settings: HARMONIC_SETTINGS,
          delaySeconds: 0.1,
          gain: 0.75,
        },
      ),
      // Then all three in unison on the closing names
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[commanding] [deep voice] Thiaf! Rheibet! Atheleber-Sēth!',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[commanding] Thiaf! Rheibet! Atheleber-Sēth!',
          voice_settings: SHADOW_SETTINGS,
          delaySeconds: 0,
          gain: 0.7,
        },
        {
          voice_id: VOICE_C, voiceLabel: 'C',
          text: '[commanding] Thiaf! Rheibet! Atheleber-Sēth!',
          voice_settings: HARMONIC_SETTINGS,
          delaySeconds: 0,
          gain: 0.55,
        },
      ),
    ],
  },

  {
    slug: 'final_seal',
    title: 'The Final Seal',
    description: 'The Fade Out — voices dissolve into silence one by one',
    entries: [
      // A takes a breath, then all three fade out staggered
      seq(VOICE_A, 'A', '[sharp intake of breath] [deep voice] [slow] Aōth... Abraōth...', BASE_SETTINGS),
      overlap(
        {
          voice_id: VOICE_A, voiceLabel: 'A',
          text: '[deep voice] [slow] Aōth... Abraōth...',
          voice_settings: BASE_SETTINGS,
          delaySeconds: 0,
          gain: 1.0,
        },
        {
          voice_id: VOICE_B, voiceLabel: 'B',
          text: '[whisper] [trailing off] Basum... Isak...',
          voice_settings: { ...SHADOW_SETTINGS, speed: 0.9 },
          delaySeconds: 0.4,
          gain: 0.6,
        },
        {
          voice_id: VOICE_C, voiceLabel: 'C',
          text: '[whisper] [trailing off] Sabaōth... Iāō...',
          voice_settings: { ...HARMONIC_SETTINGS, speed: 0.85 },
          delaySeconds: 0.8,
          gain: 0.4,
        },
      ),
      seq(VOICE_A, 'A', '[deep voice] [slow] [trailing off] Come forth... and follow.', { ...BASE_SETTINGS, speed: 0.9 }),
    ],
  },
];
