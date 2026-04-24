import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { rateLimit } from '@/lib/rateLimit';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  const rateLimitResult = rateLimit(ip, 30, 60000);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0'
        }
      }
    );
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({
      apiKey: ELEVENLABS_API_KEY,
    });

    // Generate a single-use token for realtime speech-to-text
    const token = await client.tokens.singleUse.create('realtime_scribe');

    return NextResponse.json(token);
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
