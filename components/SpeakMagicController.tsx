'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Scribe, RealtimeEvents } from '@elevenlabs/client';

// Practice words from the PGM with their phonetic pronunciations
const PRACTICE_WORDS = [
  { greek: 'ΙΑΩ', phonetic: 'ee-ah-oh', translation: 'The Tetragrammaton (YHWH)', difficulty: 'easy' },
  { greek: 'ΑΒΡΑΣΑΞ', phonetic: 'ah-brah-sax', translation: 'Abraxas, the supreme deity', difficulty: 'easy' },
  { greek: 'ΣΑΒΑΩΘ', phonetic: 'sah-bah-oth', translation: 'Sabaoth, Lord of Hosts', difficulty: 'easy' },
  { greek: 'Ἀκέφαλον', phonetic: 'ah-keh-fah-lon', translation: 'The Headless One', difficulty: 'medium' },
  { greek: 'ΑΒΛΑΝΑΘΑΝΑΛΒΑ', phonetic: 'ah-blah-nah-thah-nah-lbah', translation: 'Palindrome of power', difficulty: 'medium' },
  { greek: 'ΑΚΡΑΜΜΑΧΑΜΑΡΕΙ', phonetic: 'ah-krahm-mah-khah-mah-ray', translation: 'Barbarous name of power', difficulty: 'hard' },
  { greek: 'ΣΕΜΕΣΙΛΑΜ', phonetic: 'seh-meh-see-lahm', translation: 'Name of the solar deity', difficulty: 'medium' },
  { greek: 'ΑΡΒΑΘΙΑΩ', phonetic: 'ahr-bah-thee-ah-oh', translation: 'Divine name from Hebrew tradition', difficulty: 'hard' },
];

// Challenge phrases - complete invocations
const CHALLENGE_PHRASES = [
  {
    greek: 'καλῶ σε τὸν Ἀκέφαλον',
    phonetic: 'kah-loh seh ton ah-keh-fah-lon',
    translation: 'I call upon you, the Headless One',
    difficulty: 'hard' as const,
  },
  {
    greek: 'ΙΑΩ ΣΑΒΑΩΘ ΑΔΩΝΑΙ',
    phonetic: 'ee-ah-oh sah-bah-oth ah-doh-nai',
    translation: 'Iao Sabaoth Adonai (three divine names)',
    difficulty: 'medium' as const,
  },
  {
    greek: 'ἄκουσόν μου τῆς φωνῆς',
    phonetic: 'ah-koo-son moo tays foh-nays',
    translation: 'Hear my voice',
    difficulty: 'hard' as const,
  },
];

type Stage = 'practice' | 'challenge';

export default function SpeakMagicController() {
  const [stage, setStage] = useState<Stage>('practice');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(true); // Always show manual input option
  const [highlightManualInput, setHighlightManualInput] = useState(false); // Highlight when speech fails
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scribeConnectionRef = useRef<any>(null);
  const partialTranscriptRef = useRef<string>('');
  const [realtimeTranscript, setRealtimeTranscript] = useState<string>('');

  // Detect Brave browser on mount - removed, no longer needed

  const handleSpeechResult = useCallback((transcript: string) => {
    const currentItem = stage === 'practice' 
      ? PRACTICE_WORDS[currentWordIndex]
      : CHALLENGE_PHRASES[currentWordIndex];

    // Simple matching - check if key phonetic elements are present
    const phoneticParts = currentItem.phonetic.toLowerCase().split(/[\s-]+/);
    const matchCount = phoneticParts.filter(part => 
      transcript.includes(part) || transcript.includes(part.replace('ah', 'a'))
    ).length;

    const matchPercentage = (matchCount / phoneticParts.length) * 100;

    if (matchPercentage >= 30) {
      setFeedback('✨ Excellent! You spoke the word of power correctly!');
      if (stage === 'practice') {
        setCompletedWords(prev => {
          const newSet = new Set(prev);
          newSet.add(currentWordIndex);
          // Check if all words are completed
          if (newSet.size === PRACTICE_WORDS.length) {
            setTimeout(() => setShowFinalScore(true), 1000);
          }
          return newSet;
        });
      }
    } else if (matchPercentage >= 15) {
      setFeedback('🔮 Good attempt! Try emphasizing each syllable more clearly.');
    } else {
      setFeedback('🌙 Keep practicing. Listen to the pronunciation again and try to match it.');
    }
  }, [stage, currentWordIndex]);

  // Initialize speech recognition - removed old Web Speech API and MediaRecorder logic
  // Now using ElevenLabs realtime speech-to-text with VAD
  useEffect(() => {
    return () => {
      // Cleanup realtime connection
      if (scribeConnectionRef.current) {
        try {
          scribeConnectionRef.current.disconnect();
        } catch (e) {
          console.log('Scribe cleanup (errors ignored)');
        }
      }
      
      // Cleanup audio element
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          // Revoke object URL to prevent memory leaks
          if (audioRef.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioRef.current.src);
          }
          audioRef.current.src = '';
        } catch (e) {
          console.log('Audio cleanup (errors ignored)');
        }
      }
    };
  }, []);

  const playPronunciation = async (text: string, phonetic: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setFeedback('');

    try {
      console.log('Requesting TTS for:', phonetic);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: phonetic,
          voiceId: 'onwK4e9ZLuTAKqWW03F9' // Daniel voice
        }),
      });

      console.log('TTS response status:', response.status);
      console.log('TTS response headers:', {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS error response:', errorText);
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob size:', audioBlob.size, 'type:', audioBlob.type);
      
      // Validate blob
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio file from server');
      }
      
      if (!audioBlob.type.includes('audio')) {
        console.warn('Unexpected blob type:', audioBlob.type);
      }
      
      // Create object URL for audio playback
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current.src = '';
        audioRef.current = null;
      }

      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;

      // Set up event handlers BEFORE setting src
      let hasErrored = false;
      
      audio.addEventListener('error', (e) => {
        if (hasErrored) return; // Prevent duplicate error handling
        hasErrored = true;
        
        console.error('Audio playback error:', e);
        console.error('Audio error details:', {
          error: audio.error,
          code: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState,
        });
        setIsPlaying(false);
        setFeedback('Could not play audio. Please try again.');
        URL.revokeObjectURL(audioUrl);
      });

      audio.addEventListener('ended', () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      });

      audio.addEventListener('loadeddata', () => {
        console.log('Audio loaded successfully, duration:', audio.duration);
      });

      // Wait for audio to be ready before playing
      const playWhenReady = () => {
        if (hasErrored) return;
        
        console.log('Audio ready, starting playback');
        audio.play().then(() => {
          console.log('Audio playback started successfully');
        }).catch((playError) => {
          if (hasErrored) return;
          hasErrored = true;
          
          console.error('Play failed:', playError);
          setIsPlaying(false);
          setFeedback('Could not play audio. Please try clicking the button again.');
          URL.revokeObjectURL(audioUrl);
        });
      };

      // Use loadedmetadata as it fires earlier than canplaythrough
      audio.addEventListener('loadedmetadata', playWhenReady, { once: true });
      
      // Fallback timeout in case loadedmetadata never fires
      const timeoutId = setTimeout(() => {
        if (!hasErrored && audio.readyState >= 1) {
          playWhenReady();
        }
      }, 1000);

      // Set source and load
      audio.src = audioUrl;
      audio.load(); // Explicitly load the audio

      console.log('Audio loading started with object URL');
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
      setFeedback(`Could not play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const startListening = async () => {
    try {
      setFeedback('🎤 Connecting to speech recognition...');
      setHighlightManualInput(false);
      setRealtimeTranscript('');
      partialTranscriptRef.current = '';

      // Disconnect any existing connection first
      if (scribeConnectionRef.current) {
        try {
          scribeConnectionRef.current.disconnect();
        } catch (e) {
          console.log('Cleanup previous connection');
        }
        scribeConnectionRef.current = null;
      }

      // Get single-use token from backend
      const tokenResponse = await fetch('/api/scribe-token');
      if (!tokenResponse.ok) {
        throw new Error('Failed to get authentication token');
      }
      const { token } = await tokenResponse.json();

      console.log('Starting realtime connection with token');

      // Connect to ElevenLabs realtime speech-to-text
      const connection = Scribe.connect({
        token,
        modelId: 'scribe_v2_realtime',
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        vad: {
          silenceThresholdSecs: 2.0, // Increased to 2 seconds to give more time
          threshold: 0.5, // Increased threshold to be less sensitive
          minSpeechDurationMs: 200, // Require at least 200ms of speech
          minSilenceDurationMs: 200,
        },
      });

      scribeConnectionRef.current = connection;
      
      let hasReceivedSpeech = false;

      // Handle partial transcripts (real-time feedback)
      connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data: any) => {
        console.log('Partial transcript:', data.text);
        hasReceivedSpeech = true;
        partialTranscriptRef.current = data.text;
        setRealtimeTranscript(data.text);
        setFeedback(`🎤 Hearing: "${data.text}"`);
      });

      // Handle committed transcripts (finalized)
      connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data: any) => {
        console.log('Committed transcript:', data.text, 'hasReceivedSpeech:', hasReceivedSpeech);
        const transcript = data.text.toLowerCase().trim();
        
        // Only process if we actually received speech
        if (transcript && hasReceivedSpeech) {
          handleSpeechResult(transcript);
          
          // Disconnect after getting result
          setTimeout(() => {
            if (scribeConnectionRef.current) {
              scribeConnectionRef.current.disconnect();
              scribeConnectionRef.current = null;
            }
            setIsListening(false);
          }, 100);
        } else if (!hasReceivedSpeech) {
          // Ignore empty commits that happen before any speech
          console.log('Ignoring empty commit before speech detected');
        } else {
          setFeedback('⏱️ No speech detected. Please try again.');
          setTimeout(() => {
            if (scribeConnectionRef.current) {
              scribeConnectionRef.current.disconnect();
              scribeConnectionRef.current = null;
            }
            setIsListening(false);
          }, 100);
        }
      });

      // Handle errors
      connection.on(RealtimeEvents.ERROR, (error: any) => {
        console.error('Realtime STT error:', error);
        setIsListening(false);
        setFeedback('💡 Speech recognition unavailable. Use the text input below to practice.');
        setHighlightManualInput(true);
        
        if (scribeConnectionRef.current) {
          scribeConnectionRef.current.disconnect();
          scribeConnectionRef.current = null;
        }
      });

      // Handle connection close
      connection.on(RealtimeEvents.CLOSE, () => {
        console.log('Realtime STT connection closed');
        setIsListening(false);
      });

      // Set listening state and feedback after connection is set up
      setIsListening(true);
      setFeedback('🎤 Ready! Speak the word now...');

    } catch (error) {
      console.error('Error starting realtime speech recognition:', error);
      setIsListening(false);
      setFeedback('💡 Could not start speech recognition. Use the text input below to practice.');
      setHighlightManualInput(true);
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      handleSpeechResult(manualInput.toLowerCase().trim());
      setManualInput('');
    }
  };

  const nextWord = () => {
    const maxIndex = stage === 'practice' ? PRACTICE_WORDS.length - 1 : CHALLENGE_PHRASES.length - 1;
    if (currentWordIndex < maxIndex) {
      setCurrentWordIndex(currentWordIndex + 1);
      setFeedback('');
    }
  };

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setFeedback('');
    }
  };

  const switchToChallenge = () => {
    setStage('challenge');
    setCurrentWordIndex(0);
    setFeedback('');
  };

  const switchToPractice = () => {
    setStage('practice');
    setCurrentWordIndex(0);
    setFeedback('');
    setShowFinalScore(false);
  };

  const resetPractice = () => {
    setCompletedWords(new Set());
    setCurrentWordIndex(0);
    setFeedback('');
    setShowFinalScore(false);
  };

  const getFinalScoreData = () => {
    const score = completedWords.size;
    const percentage = (score / PRACTICE_WORDS.length) * 100;
    
    if (percentage >= 75) {
      return {
        grade: 'A',
        title: 'Master Magician',
        description: 'You have mastered the ancient words of power!',
        gift: '🪄 Magic Wand',
        giftDescription: 'A powerful wand to channel your magical abilities',
        color: '#d4a574'
      };
    } else if (percentage >= 50) {
      return {
        grade: 'B',
        title: 'Apprentice Sorcerer',
        description: 'You show great promise in the magical arts.',
        gift: '🧞 Magic Carpet',
        giftDescription: 'A mystical carpet to aid your journey',
        color: '#8b7355'
      };
    } else {
      return {
        grade: 'C',
        title: 'Cursed Novice',
        description: 'The spirits are displeased with your pronunciation...',
        gift: '💀 Ancient Curse',
        giftDescription: 'May you practice until the curse is lifted',
        color: '#4a4a4a'
      };
    }
  };

  const currentItem = stage === 'practice' 
    ? PRACTICE_WORDS[currentWordIndex]
    : CHALLENGE_PHRASES[currentWordIndex];

  const progress = stage === 'practice'
    ? `${currentWordIndex + 1} / ${PRACTICE_WORDS.length}`
    : `${currentWordIndex + 1} / ${CHALLENGE_PHRASES.length}`;

  const allPracticeComplete = completedWords.size >= PRACTICE_WORDS.length * 0.6; // 60% completion
  const finalScoreData = getFinalScoreData();

  // Show final score modal
  if (showFinalScore) {
    return (
      <div className="speak-magic-container">
        <div className="speak-final-score">
          <div className="speak-final-score-header">
            <h2>Practice Complete!</h2>
            <div className="speak-final-score-grade" style={{ color: finalScoreData.color }}>
              {finalScoreData.grade}
            </div>
          </div>
          
          <div className="speak-final-score-body">
            <h3>{finalScoreData.title}</h3>
            <p className="speak-final-score-description">{finalScoreData.description}</p>
            
            <div className="speak-final-score-stats">
              <div className="speak-final-score-stat">
                <span className="speak-final-score-stat-value">{completedWords.size}</span>
                <span className="speak-final-score-stat-label">Words Mastered</span>
              </div>
              <div className="speak-final-score-stat">
                <span className="speak-final-score-stat-value">{Math.round((completedWords.size / PRACTICE_WORDS.length) * 100)}%</span>
                <span className="speak-final-score-stat-label">Completion</span>
              </div>
            </div>

            <div className="speak-final-score-gift">
              <div className="speak-final-score-gift-icon">{finalScoreData.gift}</div>
              <div className="speak-final-score-gift-text">
                <strong>Your Reward:</strong> {finalScoreData.giftDescription}
              </div>
            </div>

            <div className="speak-final-score-actions">
              <button onClick={resetPractice} className="speak-btn speak-btn-primary">
                Practice Again
              </button>
              <button onClick={switchToChallenge} className="speak-btn speak-btn-secondary">
                Try Challenge Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="speak-magic-container">
      {/* Progress indicator */}
      <div className="speak-progress">
        <span className="speak-progress-text">{progress}</span>
        {stage === 'practice' && (
          <span className="speak-progress-completed">
            {completedWords.size} mastered
          </span>
        )}
      </div>

      {/* Main practice card */}
      <div className="speak-card">
        <div className="speak-card-header">
          <div className="speak-difficulty">
            {currentItem.difficulty && (
              <span className={`speak-difficulty-badge speak-difficulty-${currentItem.difficulty}`}>
                {currentItem.difficulty}
              </span>
            )}
          </div>
          {stage === 'practice' && completedWords.has(currentWordIndex) && (
            <span className="speak-mastered-badge">✓ Mastered</span>
          )}
        </div>

        <div className="speak-word-display">
          <div className="speak-greek">{currentItem.greek}</div>
          <div className="speak-phonetic">{currentItem.phonetic}</div>
          <div className="speak-translation">{currentItem.translation}</div>
        </div>

        <div className="speak-controls">
          <button
            onClick={() => playPronunciation(currentItem.greek, currentItem.phonetic)}
            disabled={isPlaying}
            className="speak-btn speak-btn-play"
          >
            {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
          </button>
          <button
            onClick={startListening}
            disabled={isListening || isPlaying}
            className={`speak-btn speak-btn-record${isListening ? ' speak-btn-record--active' : ''}`}
          >
            {isListening ? '🎤 Listening...' : '🎤 Speak'}
          </button>
        </div>

        {feedback && (
          <div className={`speak-feedback${feedback.includes('Excellent') ? ' speak-feedback--success' : ''}`}>
            {feedback}
          </div>
        )}

        <div className="speak-navigation">
          <button
            onClick={previousWord}
            disabled={currentWordIndex === 0}
            className="speak-nav-btn speak-nav-btn-prev"
          >
            ← Previous
          </button>
          <button
            onClick={nextWord}
            disabled={currentWordIndex === (stage === 'practice' ? PRACTICE_WORDS.length - 1 : CHALLENGE_PHRASES.length - 1)}
            className="speak-nav-btn speak-nav-btn-next"
          >
            Next Lesson →
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="speak-instructions">
        <h3>How to Practice</h3>
        <ol>
          <li>Click <strong>🔊 Listen</strong> to hear the correct pronunciation</li>
          <li>Click <strong>🎤 Speak</strong> and pronounce the word clearly into your microphone</li>
          <li>See real-time feedback as you speak</li>
          <li>The system automatically detects when you finish speaking</li>
          <li>Keep practicing until you master each word!</li>
        </ol>
        <p className="speak-instructions-note">
          <strong>Tip:</strong> Speak clearly and emphasize each syllable for best results.
          The system uses advanced voice recognition that works in all browsers.
        </p>
      </div>
    </div>
  );
}
