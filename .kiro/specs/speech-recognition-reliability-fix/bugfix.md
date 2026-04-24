# Bugfix Requirements Document

## Introduction

The Web Speech API speech recognition feature on the "Speak the Magic" pronunciation practice page is experiencing critical reliability issues that prevent users from practicing pronunciation effectively. The system encounters frequent network errors, race conditions during retry attempts, and failures in the ElevenLabs STT fallback mechanism. These issues result in a degraded user experience where the experimental microphone feature fails to work reliably, forcing users to rely solely on the text input method.

The bug manifests through a cascade of failures: network errors trigger auto-retry logic, which then fails with InvalidStateError due to race conditions, and when all retries are exhausted, the ElevenLabs STT fallback also fails. This leaves users without a functioning speech recognition option.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the Web Speech API encounters a network error THEN the system displays "Speech recognition error: network" and triggers auto-retry logic

1.2 WHEN the auto-retry logic attempts to restart speech recognition THEN the system throws "InvalidStateError: Failed to execute 'start' on 'SpeechRecognition': recognition has already started"

1.3 WHEN the retry logic executes after a network error THEN the system fails to properly wait for the previous recognition instance to fully stop before starting a new one

1.4 WHEN all retries (2 attempts with 1500ms delay) are exhausted THEN the system attempts to use ElevenLabs STT fallback but fails with "Error: STT request failed"

1.5 WHEN the ElevenLabs STT fallback is triggered THEN the system does not properly initialize or execute the fallback recording mechanism

1.6 WHEN multiple network errors occur in sequence THEN the system enters a failure loop with repeated "Speech recognition ended" → "Speech recognition started" → "Speech recognition error: network" cycles

1.7 WHEN the InvalidStateError occurs during retry THEN the system does not properly clean up the recognition instance state before attempting the next retry

1.8 WHEN speech recognition fails repeatedly THEN the system does not provide clear user guidance to use the text input alternative

### Expected Behavior (Correct)

2.1 WHEN the Web Speech API encounters a network error THEN the system SHALL properly stop the current recognition instance, wait for complete cleanup, and then retry with appropriate state management

2.2 WHEN the auto-retry logic attempts to restart speech recognition THEN the system SHALL verify the recognition instance is fully stopped and in a ready state before calling start()

2.3 WHEN the retry logic executes after a network error THEN the system SHALL implement proper state checking to prevent InvalidStateError race conditions

2.4 WHEN all retries are exhausted THEN the system SHALL successfully switch to ElevenLabs STT fallback and properly initialize the MediaRecorder for audio capture

2.5 WHEN the ElevenLabs STT fallback is triggered THEN the system SHALL successfully record audio, send it to the /api/stt endpoint, and process the transcription result

2.6 WHEN multiple network errors occur in sequence THEN the system SHALL gracefully degrade to the ElevenLabs STT fallback after the configured retry limit without entering a failure loop

2.7 WHEN the InvalidStateError would occur during retry THEN the system SHALL detect the invalid state, abort the retry attempt, and either wait longer or switch to the fallback mechanism

2.8 WHEN speech recognition fails repeatedly THEN the system SHALL display clear feedback directing users to the text input alternative and highlight the manual input option

### Unchanged Behavior (Regression Prevention)

3.1 WHEN speech recognition successfully captures and processes user speech on the first attempt THEN the system SHALL CONTINUE TO provide accurate pronunciation feedback without any changes

3.2 WHEN the user clicks the "🎤 Speak" button and speech recognition starts successfully THEN the system SHALL CONTINUE TO display "🎤 Listening... Speak the word now!" feedback

3.3 WHEN speech recognition successfully returns a transcript THEN the system SHALL CONTINUE TO match it against the phonetic pronunciation and provide appropriate feedback (Excellent/Good/Keep practicing)

3.4 WHEN the user clicks the "🔊 Listen" button THEN the system SHALL CONTINUE TO play the pronunciation using the ElevenLabs TTS API without any changes

3.5 WHEN the user types pronunciation into the manual text input and submits THEN the system SHALL CONTINUE TO process it identically to speech recognition results

3.6 WHEN speech recognition completes successfully THEN the system SHALL CONTINUE TO reset the retry count to 0 for the next attempt

3.7 WHEN the user navigates between practice words using Previous/Next buttons THEN the system SHALL CONTINUE TO maintain the completed words state and feedback display

3.8 WHEN the audio-capture or not-allowed errors occur (microphone permission issues) THEN the system SHALL CONTINUE TO display appropriate error messages and highlight the manual input option

3.9 WHEN the component unmounts or cleanup occurs THEN the system SHALL CONTINUE TO properly stop the recognition instance and ignore cleanup errors

3.10 WHEN the user switches between practice and challenge stages THEN the system SHALL CONTINUE TO reset the current word index and feedback state
