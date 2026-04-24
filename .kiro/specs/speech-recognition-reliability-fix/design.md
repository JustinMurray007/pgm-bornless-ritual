# Speech Recognition Reliability Fix - Bugfix Design

## Overview

The Web Speech API speech recognition feature on the "Speak the Magic" pronunciation practice page experiences critical reliability issues due to race conditions in retry logic, improper state management, and a non-functional ElevenLabs STT fallback. This design addresses these issues through proper state checking, cleanup mechanisms, and a working fallback implementation.

The fix strategy involves:
1. **Race Condition Prevention**: Add proper state checking before starting recognition
2. **Network Error Handling**: Implement proper cleanup and retry with state validation
3. **ElevenLabs STT Fallback**: Fix the fallback mechanism to properly record and process audio
4. **User Feedback**: Improve error messages and highlight manual input when speech fails

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when network errors cause InvalidStateError during retry attempts, or when ElevenLabs STT fallback fails to initialize
- **Property (P)**: The desired behavior when network errors occur - proper state cleanup, successful retry or fallback, and clear user guidance
- **Preservation**: Existing successful speech recognition behavior and manual text input functionality that must remain unchanged
- **recognitionRef**: The React ref holding the Web Speech API SpeechRecognition instance
- **retryCountRef**: The React ref tracking the number of retry attempts (max 2)
- **useElevenLabsSTT**: State flag indicating whether to use ElevenLabs STT instead of Web Speech API
- **mediaRecorderRef**: The React ref holding the MediaRecorder instance for ElevenLabs STT
- **InvalidStateError**: Error thrown when calling start() on a SpeechRecognition instance that hasn't fully stopped

## Bug Details

### Bug Condition

The bug manifests when the Web Speech API encounters network errors and the retry logic attempts to restart recognition before the previous instance has fully stopped. Additionally, the ElevenLabs STT fallback mechanism fails to properly initialize and execute.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { errorType: string, recognitionState: string, retryAttempt: number }
  OUTPUT: boolean
  
  RETURN (input.errorType == 'network' 
         AND input.recognitionState IN ['starting', 'started']
         AND input.retryAttempt <= 2
         AND retryAttemptedBeforeFullStop(input))
         OR (input.errorType == 'network'
         AND input.retryAttempt > 2
         AND elevenLabsSTTFallbackFails())
END FUNCTION
```

### Examples

- **Race Condition Example**: User clicks "🎤 Speak" → Network error occurs → Retry logic calls `recognitionRef.current.start()` after 1500ms → Previous recognition hasn't fully stopped → InvalidStateError: "recognition has already started"
- **Fallback Failure Example**: User clicks "🎤 Speak" → Network error occurs → Retry exhausted (2 attempts) → System sets `useElevenLabsSTT = true` → User clicks "🎤 Speak" again → `startElevenLabsRecording()` is called but fails with "STT request failed"
- **Failure Loop Example**: Network error → Retry 1 (InvalidStateError) → Retry 2 (InvalidStateError) → Fallback triggered but fails → User sees "Speech recognition unavailable" but no clear guidance
- **Edge Case - Cleanup Race**: Component unmounts during retry → Recognition instance not properly stopped → Memory leak or stale event handlers

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Successful speech recognition on first attempt must continue to work identically
- Manual text input processing must remain unchanged
- Pronunciation feedback matching logic must remain unchanged
- TTS pronunciation playback must remain unchanged
- Navigation between practice words must remain unchanged
- Completed words tracking must remain unchanged
- Component cleanup on unmount must remain unchanged

**Scope:**
All inputs that do NOT involve network errors or retry scenarios should be completely unaffected by this fix. This includes:
- Successful speech recognition captures
- Manual text input submissions
- Audio playback for pronunciation
- UI navigation and state management
- Other error types (audio-capture, not-allowed, no-speech)

## Hypothesized Root Cause

Based on the bug description, code analysis, and user feedback, the **primary root cause** is:

### **Brave Browser Incompatibility (Primary Cause)**

The Web Speech API (Google's speech recognition service) is **intentionally blocked by Brave browser** for privacy reasons. This is a known browser compatibility issue, not a code bug.

**Evidence:**
- User experiencing issues is using Brave browser
- Network errors occur consistently in Brave
- StackOverflow reference: https://stackoverflow.com/questions/74113965/speechrecognition-emitting-network-error-event-in-brave-browser
- Brave blocks Google's speech recognition API by design

**Detection Method:**
Brave browser exposes a `navigator.brave` property that can be checked:
```typescript
if ('brave' in navigator) {
  // User is on Brave browser - Web Speech API will not work
}
```

### **Secondary Issues (Code-Level)**

While the primary cause is browser incompatibility, there are also code-level issues that affect the user experience:

1. **No Browser Compatibility Detection**: The code does not detect Brave browser and warn users that Web Speech API is unavailable.

2. **Race Condition in Retry Logic**: The retry logic in the `onerror` handler calls `recognitionRef.current.start()` after a 1500ms delay, but this delay is insufficient to guarantee the previous recognition instance has fully stopped. The `onend` handler has its own 100ms delay before setting `isListening = false`, creating a timing window where the retry can execute while the recognition is still in a transitioning state.

3. **Missing State Validation**: The retry logic does not check the actual state of the recognition instance before calling `start()`. It only checks the `isListening` React state, which may not accurately reflect the internal state of the Web Speech API.

4. **ElevenLabs STT Fallback Not Implemented**: The code sets `useElevenLabsSTT = true` when retries are exhausted, but the `startElevenLabsRecording()` function is called without proper initialization. The `/api/stt` endpoint exists but the client-side recording and upload logic may not be properly wired up.

5. **Insufficient Error Recovery**: When the InvalidStateError occurs during retry, the system does not properly abort the retry sequence or clean up the recognition instance. The retry count is reset but the recognition instance may be in an invalid state.

6. **Unclear User Guidance**: When all recovery attempts fail, the system does not clearly direct users to the manual text input alternative or highlight it visually. There is no disclaimer about Brave browser incompatibility.

## Correctness Properties

Property 1: Bug Condition - Network Error Recovery

_For any_ speech recognition attempt where a network error occurs, the fixed system SHALL properly stop the current recognition instance, verify it is fully stopped, and then either successfully retry (if under retry limit) or successfully switch to ElevenLabs STT fallback (if retry limit exceeded), without throwing InvalidStateError.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

Property 2: Preservation - Successful Recognition Behavior

_For any_ speech recognition attempt that does NOT encounter network errors (successful captures, other error types, manual input), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality for successful recognition flows and non-network error scenarios.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `components/SpeakMagicController.tsx`

**Function**: `recognitionRef.current.onerror` handler and `startListening` function

**Specific Changes**:

1. **Add Brave Browser Detection and Disclaimer**: Detect Brave browser on component mount and hide the microphone feature with a clear disclaimer:
   ```typescript
   // Add state for browser detection
   const [isBraveBrowser, setIsBraveBrowser] = useState(false);
   
   // Detect Brave browser on mount
   useEffect(() => {
     if ('brave' in navigator) {
       setIsBraveBrowser(true);
       console.log('Brave browser detected - Web Speech API is blocked by design');
     }
   }, []);
   
   // In the JSX, conditionally render the microphone section
   {!isBraveBrowser && (
     <details className="speak-experimental-section">
       <summary className="speak-experimental-toggle">
         🧪 Experimental: Try Microphone (Optional)
       </summary>
       {/* Existing microphone UI */}
     </details>
   )}
   
   {isBraveBrowser && (
     <div className="speak-browser-warning">
       <p>
         ⚠️ <strong>Brave Browser Detected:</strong> The Web Speech API is blocked by Brave for privacy reasons.
         Please use the text input above to practice pronunciation, or try a different browser (Chrome, Edge, Safari).
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
   ```

2. **Add State Checking Before Retry**: Before calling `recognitionRef.current.start()` in the retry logic, add explicit state checking to verify the recognition instance is fully stopped:
   ```typescript
   // Check if recognition is actually stopped before retrying
   if (recognitionRef.current && !isListening) {
     // Add additional check for recognition state
     try {
       // Attempt to stop first to ensure clean state
       recognitionRef.current.stop();
     } catch (e) {
       // Already stopped, which is what we want
     }
     
     // Wait for stop to complete, then start
     setTimeout(() => {
       try {
         setIsListening(true);
         recognitionRef.current.start();
       } catch (e) {
         // If still fails, abort retry and switch to fallback
         console.error('Retry failed:', e);
         retryCountRef.current = 0;
         setIsListening(false);
         setUseElevenLabsSTT(true);
         setFeedback('💡 Switching to backup speech recognition...');
         setHighlightManualInput(true);
       }
     }, 2000); // Increase delay to 2000ms for more reliable cleanup
   }
2. **Add State Checking Before Retry**: Before calling `recognitionRef.current.start()` in the retry logic, add explicit state checking to verify the recognition instance is fully stopped:
   ```typescript
   // Check if recognition is actually stopped before retrying
   if (recognitionRef.current && !isListening) {
     // Add additional check for recognition state
     try {
       // Attempt to stop first to ensure clean state
       recognitionRef.current.stop();
     } catch (e) {
       // Already stopped, which is what we want
     }
     
     // Wait for stop to complete, then start
     setTimeout(() => {
       try {
         setIsListening(true);
         recognitionRef.current.start();
       } catch (e) {
         // If still fails, abort retry and switch to fallback
         console.error('Retry failed:', e);
         retryCountRef.current = 0;
         setIsListening(false);
         setUseElevenLabsSTT(true);
         setFeedback('💡 Switching to backup speech recognition...');
         setHighlightManualInput(true);
       }
     }, 2000); // Increase delay to 2000ms for more reliable cleanup
   }
   ```

3. **Implement Proper ElevenLabs STT Fallback**: Fix the `startElevenLabsRecording()` function to properly record audio and send it to the `/api/stt` endpoint:
3. **Implement Proper ElevenLabs STT Fallback**: Fix the `startElevenLabsRecording()` function to properly record audio and send it to the `/api/stt` endpoint:
   - Ensure MediaRecorder is properly initialized with correct MIME type
   - Properly handle the audio blob creation and FormData upload
   - Add error handling for microphone access and API failures
   - Ensure proper cleanup of media streams

4. **Add Abort Logic for Invalid State**: In the retry catch block, if InvalidStateError is detected, immediately abort the retry sequence and switch to fallback:
   ```typescript
   catch (e) {
     if (e instanceof DOMException && e.name === 'InvalidStateError') {
       console.error('Recognition in invalid state, switching to fallback');
       retryCountRef.current = maxRetries; // Force fallback
       setUseElevenLabsSTT(true);
       setFeedback('💡 Switching to backup speech recognition...');
     }
   }
4. **Add Abort Logic for Invalid State**: In the retry catch block, if InvalidStateError is detected, immediately abort the retry sequence and switch to fallback:
   ```typescript
   catch (e) {
     if (e instanceof DOMException && e.name === 'InvalidStateError') {
       console.error('Recognition in invalid state, switching to fallback');
       retryCountRef.current = maxRetries; // Force fallback
       setUseElevenLabsSTT(true);
       setFeedback('💡 Switching to backup speech recognition...');
     }
   }
   ```

5. **Improve User Feedback**: When all recovery attempts fail, display clear feedback directing users to the manual text input:
   ```typescript
   setFeedback('💡 Speech recognition unavailable. Use the text input below to practice.');
   setHighlightManualInput(true);
5. **Improve User Feedback**: When all recovery attempts fail, display clear feedback directing users to the manual text input:
   ```typescript
   setFeedback('💡 Speech recognition unavailable. Use the text input below to practice.');
   setHighlightManualInput(true);
   ```

6. **Add Cleanup on Component Unmount**: Ensure the recognition instance and media streams are properly cleaned up when the component unmounts or when switching between recognition methods:
   ```typescript
   // In useEffect cleanup
   return () => {
     if (recognitionRef.current) {
       try {
         recognitionRef.current.stop();
         recognitionRef.current.abort(); // Force abort
       } catch (e) {
         // Ignore errors on cleanup
       }
     }
     if (mediaRecorderRef.current) {
       try {
         mediaRecorderRef.current.stop();
       } catch (e) {
         // Ignore errors on cleanup
       }
     }
   };
   ```

**File**: `app/api/stt/route.ts`

**Function**: `POST` handler

**Specific Changes**:

1. **Verify Audio Format Handling**: Ensure the endpoint properly handles the audio blob format sent from the client (likely `audio/webm` or `audio/wav`)

2. **Add Detailed Error Logging**: Add more detailed error logging to help diagnose failures:
   ```typescript
   if (!response.ok) {
     const errorText = await response.text();
     console.error('ElevenLabs STT error:', response.status, errorText);
     return NextResponse.json(
       { error: 'Speech-to-text conversion failed', details: errorText },
       { status: response.status }
     );
   }
   ```

3. **Validate Audio File**: Add validation to ensure the audio file is not empty and has a valid size:
   ```typescript
   if (!audioFile || audioFile.size === 0) {
     return NextResponse.json(
       { error: 'Invalid audio file' },
       { status: 400 }
     );
   }
   ```

**File**: `app/globals.css`

**Section**: Speak Magic styles (around line 1974)

**Specific Changes**:

1. **Add Brave Browser Warning Styles**: Add styling for the browser compatibility warning:
   ```css
   .speak-browser-warning {
     background: rgba(204, 17, 0, 0.08);
     border: 2px solid rgba(204, 17, 0, 0.3);
     border-radius: 8px;
     padding: 16px;
     margin: 16px 0;
     color: #2a1a0a;
   }
   
   .speak-browser-warning strong {
     color: #cc1100;
   }
   
   .speak-browser-warning-link {
     color: #cc1100;
     text-decoration: underline;
     font-weight: 500;
   }
   
   .speak-browser-warning-link:hover {
     color: #990c00;
   }
   ```

2. **Add Highlight Style for Manual Input**: Add a CSS class to highlight the manual input field when speech recognition fails:
   ```css
   .speak-manual-input--highlighted {
     border-color: #cc1100;
     box-shadow: 0 0 0 3px rgba(204, 17, 0, 0.15);
     animation: input-highlight-pulse 2s ease-in-out 3;
   }
   
   @keyframes input-highlight-pulse {
     0%, 100% { box-shadow: 0 0 0 3px rgba(204, 17, 0, 0.15); }
     50% { box-shadow: 0 0 0 5px rgba(204, 17, 0, 0.25); }
   }
2. **Add Highlight Style for Manual Input**: Add a CSS class to highlight the manual input field when speech recognition fails:
   ```css
   .speak-manual-input--highlighted {
     border-color: #cc1100;
     box-shadow: 0 0 0 3px rgba(204, 17, 0, 0.15);
     animation: input-highlight-pulse 2s ease-in-out 3;
   }
   
   @keyframes input-highlight-pulse {
     0%, 100% { box-shadow: 0 0 0 3px rgba(204, 17, 0, 0.15); }
     50% { box-shadow: 0 0 0 5px rgba(204, 17, 0, 0.25); }
   }
   ```

3. **Add Error State Styling**: Add visual feedback for error states:
   ```css
   .speak-feedback--error {
     background: rgba(204, 17, 0, 0.08);
     border-color: rgba(204, 17, 0, 0.3);
     color: #cc1100;
   }
   ```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate network errors and rapid retry attempts on the UNFIXED code to observe InvalidStateError failures and understand the race condition timing. Mock the Web Speech API to control error timing.

**Test Cases**:
1. **Race Condition Test**: Simulate network error → Wait 1500ms → Attempt start() → Verify InvalidStateError occurs (will fail on unfixed code)
2. **Retry Exhaustion Test**: Simulate 3 consecutive network errors → Verify ElevenLabs STT fallback is triggered but fails (will fail on unfixed code)
3. **State Transition Test**: Simulate network error during recognition → Verify recognition state is 'started' when retry attempts to call start() (will fail on unfixed code)
4. **Fallback Initialization Test**: Trigger ElevenLabs STT fallback → Verify MediaRecorder initialization fails or API call fails (will fail on unfixed code)

**Expected Counterexamples**:
- InvalidStateError thrown during retry attempts
- ElevenLabs STT fallback fails with "STT request failed"
- Recognition instance stuck in invalid state after retry failures
- Possible causes: insufficient delay, missing state validation, incomplete fallback implementation

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleNetworkError_fixed(input)
  ASSERT result.noInvalidStateError == true
  ASSERT (result.retrySucceeded == true OR result.fallbackSucceeded == true)
  ASSERT result.userFeedbackClear == true
END FOR
```

**Test Cases**:
1. **Network Error Recovery Test**: Simulate network error → Verify retry succeeds without InvalidStateError
2. **Fallback Success Test**: Simulate 3 network errors → Verify ElevenLabs STT fallback successfully records and processes audio
3. **State Cleanup Test**: Simulate network error → Verify recognition instance is properly stopped before retry
4. **User Guidance Test**: Simulate fallback failure → Verify clear feedback and manual input highlighting

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleSpeechRecognition_original(input) = handleSpeechRecognition_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for successful recognition and other error types, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Successful Recognition Preservation**: Observe that successful speech capture works on unfixed code, then verify it continues to work identically after fix
2. **Manual Input Preservation**: Observe that manual text input works on unfixed code, then verify it continues to work identically after fix
3. **Other Error Types Preservation**: Observe that audio-capture, not-allowed, no-speech errors work on unfixed code, then verify they continue to work identically after fix
4. **Pronunciation Feedback Preservation**: Observe that pronunciation matching and feedback work on unfixed code, then verify they continue to work identically after fix

### Unit Tests

- Test network error retry logic with proper state checking
- Test ElevenLabs STT fallback initialization and audio recording
- Test state cleanup before retry attempts
- Test error message display and manual input highlighting
- Test component cleanup on unmount

### Property-Based Tests

- Generate random sequences of speech recognition events (success, network error, other errors) and verify the system handles them correctly
- Generate random retry timing scenarios and verify no InvalidStateError occurs
- Test that all non-network-error scenarios produce identical results before and after the fix

### Integration Tests

- Test full speech recognition flow with simulated network errors
- Test switching from Web Speech API to ElevenLabs STT fallback
- Test that manual input continues to work when speech recognition fails
- Test that visual feedback (error messages, input highlighting) appears correctly
