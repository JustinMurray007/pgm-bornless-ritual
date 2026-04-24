'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

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
  const [isBraveBrowser, setIsBraveBrowser] = useState(false); // Detect Brave browser
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const retryCountRef = useRef(0);
  const maxRetries = 2;
  const [useElevenLabsSTT, setUseElevenLabsSTT] = useState(false);

  // Detect Brave browser on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'brave' in navigator) {
      setIsBraveBrowser(true);
      console.log('Brave browser detected - Web Speech API is blocked by design');
    }
  }, []);

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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Single utterance
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Use English for phonetic spellings
      recognitionRef.current.maxAlternatives = 5;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setFeedback('🎤 Listening... Speak the word now!');
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result:', event);
        
        // Reset retry count on successful result
        retryCountRef.current = 0;
        
        // Get all alternatives
        const result = event.results[0];
        const alternatives = [];
        for (let i = 0; i < result.length; i++) {
          alternatives.push(result[i].transcript.toLowerCase().trim());
        }
        
        console.log('All alternatives:', alternatives);
        const transcript = alternatives[0];
        console.log('Best transcript:', transcript);
        
        if (transcript.length > 0) {
          handleSpeechResult(transcript);
        } else {
          setFeedback('⏱️ No speech detected. Please try again.');
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Auto-retry on network errors (up to maxRetries)
        if (event.error === 'network' && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(`Network error, retrying... (${retryCountRef.current}/${maxRetries})`);
          setFeedback(`🔄 Connection issue, retrying... (${retryCountRef.current}/${maxRetries})`);
          
          // Ensure recognition is fully stopped before retrying
          if (recognitionRef.current) {
            try {
              // Attempt to stop first to ensure clean state
              recognitionRef.current.stop();
            } catch (e) {
              // Already stopped, which is what we want
              console.log('Recognition already stopped');
            }
          }
          
          // Wait longer for recognition to fully stop before retrying (increased from 1500ms to 2000ms)
          setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                setIsListening(true);
                recognitionRef.current.start();
              } catch (e) {
                // If InvalidStateError occurs, abort retry and switch to fallback
                if (e instanceof DOMException && e.name === 'InvalidStateError') {
                  console.error('Recognition in invalid state, switching to fallback');
                  retryCountRef.current = maxRetries; // Force fallback
                  setUseElevenLabsSTT(true);
                  setFeedback('💡 Switching to backup speech recognition...');
                  setHighlightManualInput(true);
                } else {
                  console.error('Retry failed:', e);
                  retryCountRef.current = 0;
                  setIsListening(false);
                  setFeedback('💡 Speech recognition unavailable. Use the text input below to practice.');
                  setHighlightManualInput(true);
                }
              }
            }
          }, 2000); // Increased delay to 2000ms for more reliable cleanup
          return;
        }
        
        // Reset retry count on other errors or max retries reached
        retryCountRef.current = 0;
        
        // Provide more specific error messages
        if (event.error === 'no-speech') {
          setFeedback('⏱️ No speech detected. Try the text input below instead.');
          setHighlightManualInput(true);
        } else if (event.error === 'audio-capture') {
          setFeedback('🎤 Microphone not found. Use the text input below to practice.');
          setHighlightManualInput(true);
        } else if (event.error === 'not-allowed') {
          setFeedback('🚫 Microphone permission denied. Use the text input below to practice.');
          setHighlightManualInput(true);
        } else if (event.error === 'network') {
          setFeedback('💡 Speech recognition unavailable. Use the text input below to practice.');
          setHighlightManualInput(true);
        } else if (event.error === 'aborted') {
          // Don't show error for aborted - this is normal when we stop it
          console.log('Recognition aborted (normal)');
        } else {
          setFeedback(`💡 Microphone unavailable. Use the text input below to practice.`);
          setHighlightManualInput(true);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        // Small delay before allowing new recognition to start
        setTimeout(() => {
          setIsListening(false);
        }, 100);
      };

      recognitionRef.current.onspeechstart = () => {
        console.log('Speech detected');
      };

      recognitionRef.current.onspeechend = () => {
        console.log('Speech ended - processing...');
      };
    }

    return () => {
      // Cleanup recognition instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort(); // Force abort
        } catch (e) {
          // Ignore errors on cleanup
          console.log('Recognition cleanup (errors ignored)');
        }
      }
      
      // Cleanup media recorder
      if (mediaRecorderRef.current) {
        try {
          if (mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        } catch (e) {
          // Ignore errors on cleanup
          console.log('MediaRecorder cleanup (errors ignored)');
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
          // Ignore errors on cleanup
          console.log('Audio cleanup (errors ignored)');
        }
      }
    };
  }, [handleSpeechResult, isListening]);

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
      audio.addEventListener('error', (e) => {
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

      // Wait for canplaythrough event before playing
      const playAudio = () => {
        console.log('Audio can play through, starting playback');
        audio.play().then(() => {
          console.log('Audio playback started successfully');
        }).catch((playError) => {
          console.error('Play failed:', playError);
          setIsPlaying(false);
          setFeedback('Could not play audio. Please try clicking the button again.');
          URL.revokeObjectURL(audioUrl);
        });
      };

      audio.addEventListener('canplaythrough', playAudio, { once: true });

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
    // If Web Speech API failed, use ElevenLabs STT
    if (useElevenLabsSTT || !recognitionRef.current) {
      await startElevenLabsRecording();
      return;
    }

    // Reset retry count and highlight when user manually starts
    retryCountRef.current = 0;
    setHighlightManualInput(false);

    // Stop any existing recognition
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Ignore if not running
    }

    // Small delay to ensure previous recognition is fully stopped
    setTimeout(() => {
      try {
        setFeedback('🎤 Starting microphone...');
        setIsListening(true);
        recognitionRef.current.start();
        console.log('Speech recognition start requested');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        setFeedback('💡 Switching to backup speech recognition...');
        setUseElevenLabsSTT(true);
        setHighlightManualInput(true);
      }
    }, 100);
  };

  const startElevenLabsRecording = async () => {
    try {
      setFeedback('🎤 Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use a compatible audio format
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      console.log('Using MediaRecorder with mimeType:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Longer delay to ensure all audio chunks are collected
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setFeedback('🔄 Processing your speech...');
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        console.log('Audio blob created:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: audioChunksRef.current.length,
        });
        
        // Extremely lenient validation - only reject if completely empty (10 bytes minimum)
        if (audioBlob.size < 10) {
          console.warn('Audio blob too small:', audioBlob.size);
          setFeedback('⏱️ Could not hear you clearly. Please speak louder and closer to the microphone.');
          setIsListening(false);
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        // Send to ElevenLabs STT API
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch('/api/stt', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('STT API error response:', {
              status: response.status,
              statusText: response.statusText,
              error: errorData,
            });
            throw new Error(`STT request failed: ${response.status} - ${errorData.error || response.statusText}`);
          }

          const result = await response.json();
          const transcript = result.transcript?.toLowerCase().trim() || '';
          
          console.log('STT result:', {
            transcript,
            length: transcript.length,
          });

          if (transcript) {
            handleSpeechResult(transcript);
          } else {
            setFeedback('⏱️ Could not hear you clearly. Please speak louder and closer to the microphone.');
          }
        } catch (error) {
          console.error('ElevenLabs STT error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setFeedback(`💡 Speech recognition unavailable. Please use the text input below to practice.`);
          setHighlightManualInput(true);
        } finally {
          setIsListening(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      setFeedback('🎤 Listening... Speak clearly now! (Recording for 10 seconds)');

      // Auto-stop after 10 seconds (increased from 8)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 10000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
      setFeedback('🚫 Could not access microphone. Please check permissions.');
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
          {!isBraveBrowser && (
            <button
              onClick={startListening}
              disabled={isListening || isPlaying}
              className={`speak-btn speak-btn-record${isListening ? ' speak-btn-record--active' : ''}`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Speak'}
            </button>
          )}
        </div>

        {isBraveBrowser && (
          <div className="speak-browser-warning">
            <p>
              <strong>⚠️ Brave Browser Detected:</strong> The Web Speech API is blocked by Brave for privacy reasons.
              Please use the text input below to practice pronunciation, or try a different browser (Chrome, Edge, Safari).
            </p>
            <p>
              <a 
                href="https://stackoverflow.com/questions/74113965/speechrecognition-emitting-network-error-event-in-brave-browser"
                target="_blank"
                rel="noopener noreferrer"
                className="speak-browser-warning-link"
              >
                Learn more about this limitation →
              </a>
            </p>
          </div>
        )}

        {useElevenLabsSTT && (
          <div className="speak-backup-notice">
            <p>✨ Using backup speech recognition (ElevenLabs)</p>
          </div>
        )}

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
          <li>Receive instant feedback on your pronunciation</li>
          <li>Keep practicing until you master each word!</li>
        </ol>
        <p className="speak-instructions-note">
          <strong>Tip:</strong> If speech recognition has connection issues, the system will automatically
          switch to a backup service. Speak clearly and emphasize each syllable for best results.
        </p>
      </div>
    </div>
  );
}
