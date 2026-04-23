import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Get the audio blob from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate audio file size
    if (audioFile.size === 0) {
      console.error('Empty audio file received');
      return NextResponse.json(
        { error: 'Invalid audio file: file is empty' },
        { status: 400 }
      );
    }

    console.log('Received audio file:', {
      size: audioFile.size,
      type: audioFile.type,
    });

    // Call ElevenLabs Speech-to-Text API
    const sttFormData = new FormData();
    sttFormData.append('file', audioFile, 'recording.webm');
    sttFormData.append('model_id', 'scribe_v2');
    
    console.log('Calling ElevenLabs STT API with:', {
      audioSize: audioFile.size,
      audioType: audioFile.type,
    });

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: sttFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs STT error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return NextResponse.json(
        { 
          error: 'Speech-to-text conversion failed',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    console.log('ElevenLabs STT success:', {
      transcript: result.text || '',
      length: (result.text || '').length,
    });
    
    return NextResponse.json({
      transcript: result.text || '',
    });

  } catch (error) {
    console.error('STT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
