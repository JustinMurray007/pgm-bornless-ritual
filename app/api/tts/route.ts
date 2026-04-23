import { NextRequest, NextResponse } from 'next/server';
import { validateEnv } from '@/lib/env';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    validateEnv();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server misconfiguration' },
      { status: 500 }
    );
  }

  let text: string | undefined;
  let voiceId: string | undefined;

  try {
    const body = await request.json();
    text = body.text;
    voiceId = body.voiceId;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return NextResponse.json({ error: 'Missing required field: text' }, { status: 400 });
  }

  if (!voiceId || typeof voiceId !== 'string' || voiceId.trim() === '') {
    return NextResponse.json({ error: 'Missing required field: voiceId' }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY!;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  let elevenLabsResponse: Response;

  try {
    elevenLabsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.2,
          similarity_boost: 0.5,
          style: 0.9,
          use_speaker_boost: true,
        },
      }),
    });
  } catch (error) {
    console.error('[/api/tts] Network error reaching ElevenLabs:', error);
    return NextResponse.json(
      { error: 'Failed to reach ElevenLabs API' },
      { status: 502 }
    );
  }

  if (!elevenLabsResponse.ok) {
    const errorText = await elevenLabsResponse.text().catch(() => 'Unknown error');
    console.error(`[/api/tts] ElevenLabs returned ${elevenLabsResponse.status}:`, errorText);
    return NextResponse.json(
      { error: `ElevenLabs API error: ${elevenLabsResponse.status}` },
      { status: 502 }
    );
  }

  // Stream the audio response directly to the client
  const audioStream = elevenLabsResponse.body;
  if (!audioStream) {
    return NextResponse.json({ error: 'Empty response from ElevenLabs' }, { status: 502 });
  }

  return new NextResponse(audioStream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
      'Transfer-Encoding': 'chunked',
    },
  });
}
