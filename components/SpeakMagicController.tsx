'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

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
        
        // Provide more specific error messages
        if (event.error === 'no-speech') {
          setFeedback('⏱️ No speech detected. Click Speak and try again.');
        } else if (event.error === 'audio-capture') {
          setFeedback('🎤 Microphone not found. Please check your microphone.');
        } else if (event.error === 'not-allowed') {
          setFeedback('🚫 Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'network') {
          setFeedback('🌐 Network error. Speech recognition requires an internet connection. Please check your connection and try again.');
        } else if (event.error === 'aborted') {
          // Don't show error for aborted - this is normal when we stop it
          console.log('Recognition aborted (normal)');
        } else {
          setFeedback(`❌ Error: ${event.error}. Please try again.`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onspeechstart = () => {
        console.log('Speech detected');
      };

      recognitionRef.current.onspeechend = () => {
        console.log('Speech ended - processing...');
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const handleSpeechResult = (transcript: string) => {
    const currentItem = stage === 'practice' 
      ? PRACTICE_WORDS[currentWordIndex]
      : CHALLENGE_PHRASES[currentWordIndex];

    // Simple matching - check if key phonetic elements are present
    const phoneticParts = currentItem.phonetic.toLowerCase().split(/[\s-]+/);
    const matchCount = phoneticParts.filter(part => 
      transcript.includes(part) || transcript.includes(part.replace('ah', 'a'))
    ).length;

    const matchPercentage = (matchCount / phoneticParts.length) * 100;

    if (matchPercentage >= 60) {
      setFeedback('✨ Excellent! You spoke the word of power correctly!');
      if (stage === 'practice') {
        setCompletedWords(prev => {
          const newSet = new Set(prev);
          newSet.add(currentWordIndex);
          return newSet;
        });
      }
    } else if (matchPercentage >= 30) {
      setFeedback('🔮 Good attempt! Try emphasizing each syllable more clearly.');
    } else {
      setFeedback('🌙 Keep practicing. Listen to the pronunciation again and try to match it.');
    }
  };

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
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS error response:', errorText);
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob size:', audioBlob.size);
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setFeedback('Could not play audio. Please try again.');
        URL.revokeObjectURL(audioUrl);
      };

      audio.onended = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      console.log('Starting audio playback');
      await audio.play();
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
      setFeedback(`Could not play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setFeedback('Speech recognition is not supported in your browser. Use the text input below instead.');
      setShowManualInput(true);
      return;
    }

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
        setFeedback('Could not start microphone. Try the text input below instead.');
        setShowManualInput(true);
      }
    }, 100);
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
  };

  const currentItem = stage === 'practice' 
    ? PRACTICE_WORDS[currentWordIndex]
    : CHALLENGE_PHRASES[currentWordIndex];

  const progress = stage === 'practice'
    ? `${currentWordIndex + 1} / ${PRACTICE_WORDS.length}`
    : `${currentWordIndex + 1} / ${CHALLENGE_PHRASES.length}`;

  const allPracticeComplete = completedWords.size >= PRACTICE_WORDS.length * 0.6; // 60% completion

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

        {/* Manual text input fallback */}
        {showManualInput && (
          <div className="speak-manual-input">
            <p className="speak-manual-label">Or type what you hear:</p>
            <div className="speak-manual-controls">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                placeholder="Type the pronunciation..."
                className="speak-manual-text"
              />
              <button
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
                className="speak-manual-submit"
              >
                Check
              </button>
            </div>
          </div>
        )}

        {!showManualInput && (
          <button
            onClick={() => setShowManualInput(true)}
            className="speak-show-manual"
          >
            Having trouble with the microphone? Try text input
          </button>
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
          <li>Master {Math.ceil(PRACTICE_WORDS.length * 0.6)} practice words to unlock Challenge Phrases</li>
        </ol>
        <p className="speak-instructions-note">
          <strong>Note:</strong> Speech recognition works best in Chrome or Edge browsers.
          Speak clearly and emphasize each syllable for best results.
        </p>
      </div>
    </div>
  );
}
