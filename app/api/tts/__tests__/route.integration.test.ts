/**
 * Integration test for /api/tts Route Handler
 *
 * Validates: Requirement 4.2
 *
 * This test verifies that the /api/tts route handler:
 * 1. Returns Content-Type: audio/mpeg
 * 2. Proxies requests to ElevenLabs with voice settings {stability: 0.2, style: 0.9}
 *
 * The ElevenLabs API is mocked to avoid real HTTP requests.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Mock environment variables
// ---------------------------------------------------------------------------

const MOCK_ENV = {
  ELEVENLABS_API_KEY: 'test-api-key-12345',
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
};

// ---------------------------------------------------------------------------
// Mock fetch
// ---------------------------------------------------------------------------

let mockFetchCalls: Array<{ url: string; options: RequestInit }> = [];
let mockFetchResponse: Response | null = null;

function createMockAudioStream(): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      // Simulate a small MP3 audio chunk
      const mockAudioData = new Uint8Array([0xff, 0xfb, 0x90, 0x00]);
      controller.enqueue(mockAudioData);
      controller.close();
    },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('/api/tts Route Handler integration', () => {
  beforeEach(() => {
    // Set up environment variables
    process.env.ELEVENLABS_API_KEY = MOCK_ENV.ELEVENLABS_API_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = MOCK_ENV.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = MOCK_ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Reset mock state
    mockFetchCalls = [];
    mockFetchResponse = new Response(createMockAudioStream(), {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    });

    // Mock global fetch
    global.fetch = vi.fn(async (url: string | URL | Request, options?: RequestInit) => {
      const urlString = typeof url === 'string' ? url : url.toString();
      mockFetchCalls.push({ url: urlString, options: options ?? {} });
      return mockFetchResponse!;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Requirement 4.2: THE ElevenLabs_Client SHALL use the ElevenLabs Greek
   * voice model with a stability value of 0.2 (low) and a style exaggeration
   * value of 0.9 (high) for all Voces_Magicae playback.
   *
   * This test verifies:
   * 1. The route returns Content-Type: audio/mpeg
   * 2. The proxied request body contains stability: 0.2 and style: 0.9
   */
  it('returns audio/mpeg and proxies request with stability 0.2 and style 0.9', async () => {
    // Arrange: Create a mock NextRequest
    const requestBody = {
      text: 'ee-ah-oh',
      voiceId: 'test-voice-id-123',
    };

    const request = new NextRequest('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // Act: Call the route handler
    const response = await POST(request);

    // Assert: Response has correct Content-Type
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');

    // Assert: fetch was called exactly once
    expect(mockFetchCalls.length).toBe(1);

    // Assert: fetch was called with the correct ElevenLabs URL
    const fetchCall = mockFetchCalls[0];
    expect(fetchCall.url).toBe(
      `https://api.elevenlabs.io/v1/text-to-speech/${requestBody.voiceId}/stream`
    );

    // Assert: fetch was called with the correct headers
    const fetchOptions = fetchCall.options;
    expect(fetchOptions.method).toBe('POST');
    expect(fetchOptions.headers).toMatchObject({
      'Content-Type': 'application/json',
      'xi-api-key': MOCK_ENV.ELEVENLABS_API_KEY,
      Accept: 'audio/mpeg',
    });

    // Assert: fetch body contains the correct voice settings
    // Requirement 4.2: stability: 0.2 (low), style: 0.9 (high)
    const fetchBody = JSON.parse(fetchOptions.body as string);
    expect(fetchBody.text).toBe(requestBody.text);
    expect(fetchBody.model_id).toBe('eleven_multilingual_v2');
    expect(fetchBody.voice_settings).toMatchObject({
      stability: 0.2,
      style: 0.9,
    });
  });

  /**
   * Verify that the route handler returns an error when the text field is missing.
   */
  it('returns 400 when text field is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voiceId: 'test-voice-id' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing required field: text');
  });

  /**
   * Verify that the route handler returns an error when the voiceId field is missing.
   */
  it('returns 400 when voiceId field is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'ee-ah-oh' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing required field: voiceId');
  });

  /**
   * Verify that the route handler returns 502 when ElevenLabs returns an error.
   */
  it('returns 502 when ElevenLabs API returns an error', async () => {
    // Mock ElevenLabs error response
    mockFetchResponse = new Response('ElevenLabs error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    const request = new NextRequest('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'ee-ah-oh', voiceId: 'test-voice-id' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toContain('ElevenLabs API error');
  });

  /**
   * Verify that the route handler returns 502 when the network request fails.
   */
  it('returns 502 when network request to ElevenLabs fails', async () => {
    // Mock network error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'ee-ah-oh', voiceId: 'test-voice-id' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toBe('Failed to reach ElevenLabs API');
  });
});
