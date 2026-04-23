import { NextRequest, NextResponse } from 'next/server';
import { validateEnv } from '@/lib/env';

/**
 * POST /api/ritual-voice
 *
 * Two modes:
 *
 * 1. Single-voice (for overlap groups — called once per voice in parallel):
 *    Body: { voice_id, text, voice_settings }
 *    → calls /v1/text-to-speech/{voice_id} with eleven_v3
 *    → returns audio/mpeg
 *
 * 2. Sequential dialogue (for non-overlapping turns):
 *    Body: { inputs: [{ voice_id, text, voice_settings }] }
 *    → calls /v1/text-to-dialogue with eleven_v3
 *    → returns audio/mpeg
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    validateEnv();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server misconfiguration' },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY!;

  // ── Mode 1: single voice ──────────────────────────────────────────────────
  if (body.voice_id && body.text) {
    const { voice_id, text, voice_settings } = body as {
      voice_id: string;
      text: string;
      voice_settings?: Record<string, unknown>;
    };

    if (!voice_id || !text) {
      return NextResponse.json({ error: 'Missing voice_id or text' }, { status: 400 });
    }

    let res: Response;
    try {
      res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: String(text).trim(),
          model_id: 'eleven_v3',
          voice_settings: voice_settings ?? {
            stability: 0.1,
            similarity_boost: 0.9,
            style: 0.9,
            use_speaker_boost: true,
            speed: 1.15,
          },
        }),
      });
    } catch (err) {
      console.error('[/api/ritual-voice] Network error (single):', err);
      return NextResponse.json({ error: 'Failed to reach ElevenLabs API' }, { status: 502 });
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error');
      console.error(`[/api/ritual-voice] ElevenLabs ${res.status} (single):`, errText);
      return NextResponse.json({ error: `ElevenLabs API error: ${res.status}` }, { status: 502 });
    }

    return new NextResponse(res.body, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
    });
  }

  // ── Mode 2: sequential dialogue ───────────────────────────────────────────
  const inputs = body.inputs as Array<{ voice_id: string; text: string; voice_settings?: Record<string, unknown> }> | undefined;

  if (!Array.isArray(inputs) || inputs.length === 0) {
    return NextResponse.json({ error: 'Missing voice_id/text or inputs array' }, { status: 400 });
  }

  // Map to the dialogue API shape — voice_settings goes per input
  const dialogueInputs = inputs.map(i => ({
    voice_id: i.voice_id,
    text: String(i.text).trim(),
    voice_settings: i.voice_settings ?? {
      stability: 0.1,
      similarity_boost: 0.9,
      style: 0.9,
      use_speaker_boost: true,
      speed: 1.15,
    },
  }));

  let res: Response;
  try {
    res = await fetch('https://api.elevenlabs.io/v1/text-to-dialogue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        model_id: 'eleven_v3',
        inputs: dialogueInputs,
      }),
    });
  } catch (err) {
    console.error('[/api/ritual-voice] Network error (dialogue):', err);
    return NextResponse.json({ error: 'Failed to reach ElevenLabs API' }, { status: 502 });
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    console.error(`[/api/ritual-voice] ElevenLabs ${res.status} (dialogue):`, errText);
    return NextResponse.json({ error: `ElevenLabs API error: ${res.status} — ${errText}` }, { status: 502 });
  }

  return new NextResponse(res.body, {
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
  });
}
