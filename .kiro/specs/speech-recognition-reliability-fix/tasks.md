# Implementation Plan

## Overview

This task list implements the fix for speech recognition reliability issues using the bugfix workflow methodology. The tasks are ordered to follow the exploratory approach: first write tests to understand the bug on unfixed code, then implement the fix, then verify the fix works and preserves existing behavior.

**PRIMARY ROOT CAUSE**: Brave browser blocks the Web Speech API by design for privacy reasons. The primary fix is to detect Brave browser and display a clear disclaimer, hiding the microphone feature and directing users to the text input alternative.

**SECONDARY ISSUES**: Race conditions in retry logic, missing state validation, and incomplete ElevenLabs STT fallback implementation.

**IMPLEMENTATION PRIORITY**:
1. **Brave Browser Detection** (Task 3.1) - Addresses the root cause for Brave users
2. **State Checking & Retry Logic** (Task 3.2) - Fixes race conditions for other browsers
3. **ElevenLabs STT Fallback** (Task 3.3) - Provides backup when Web Speech API fails
4. **User Feedback & Highlighting** (Task 3.5) - Improves user experience when speech fails
5. **Cleanup & Error Handling** (Tasks 3.4, 3.6) - Ensures proper resource management

---

## Phase 1: Exploration Tests (BEFORE Fix)

- [ ] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Network Error Race Condition and Fallback Failure
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate the race condition and fallback failures
  - **Scoped PBT Approach**: Scope properties to concrete failing cases: network errors with rapid retry attempts, and fallback initialization failures
  - Create test file: `components/__tests__/SpeakMagicController.bugfix.test.tsx`
  - Mock Web Speech API to control error timing and state transitions
  - Test Case 1: Race Condition - Simulate network error → Wait 1500ms → Attempt start() → Assert InvalidStateError occurs (from Bug Condition 1.2, 1.3)
  - Test Case 2: Retry Exhaustion - Simulate 3 consecutive network errors → Assert ElevenLabs STT fallback is triggered but fails (from Bug Condition 1.4, 1.5)
  - Test Case 3: State Transition - Simulate network error during recognition → Assert recognition state is 'started' when retry attempts to call start() (from Bug Condition 1.7)
  - Test Case 4: Fallback Initialization - Trigger ElevenLabs STT fallback → Assert MediaRecorder initialization fails or API call fails (from Bug Condition 1.5)
  - Run tests on UNFIXED code using `npm test -- components/__tests__/SpeakMagicController.bugfix.test.tsx`
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - InvalidStateError thrown during retry attempts
    - ElevenLabs STT fallback fails with "STT request failed"
    - Recognition instance stuck in invalid state after retry failures
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Successful Recognition and Non-Network Error Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for successful recognition and non-network error scenarios
  - Create test file: `components/__tests__/SpeakMagicController.preservation.test.tsx`
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test Case 1: Successful Recognition - Observe that successful speech capture works on unfixed code, verify pronunciation feedback is provided
  - Test Case 2: Manual Input - Observe that manual text input works on unfixed code, verify it processes identically to speech results
  - Test Case 3: Other Error Types - Observe that audio-capture, not-allowed, no-speech errors work on unfixed code, verify appropriate error messages
  - Test Case 4: Pronunciation Feedback - Observe that pronunciation matching works on unfixed code, verify feedback logic (Excellent/Good/Keep practicing)
  - Test Case 5: Navigation - Observe that Previous/Next navigation works on unfixed code, verify state management
  - Test Case 6: TTS Playback - Observe that "🔊 Listen" button works on unfixed code, verify audio playback
  - Run tests on UNFIXED code using `npm test -- components/__tests__/SpeakMagicController.preservation.test.tsx`
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

---

## Phase 2: Implementation

- [ ] 3. Fix speech recognition reliability issues

  - [x] 3.1 Implement Brave browser detection and disclaimer (PRIMARY FIX)
    - File: `components/SpeakMagicController.tsx`
    - **This is the PRIMARY root cause - Brave blocks Web Speech API by design**
    - Add state for browser detection: `const [isBraveBrowser, setIsBraveBrowser] = useState(false);`
    - Add useEffect to detect Brave browser on component mount:
      - Check if `'brave' in navigator`
      - If true, set `setIsBraveBrowser(true)` and log detection
    - Conditionally render microphone UI:
      - Wrap existing `<details className="speak-experimental-section">` in `{!isBraveBrowser && (...)}`
      - Add new Brave warning section when `isBraveBrowser` is true
    - Create Brave warning message:
      - Display: "⚠️ **Brave Browser Detected:** The Web Speech API is blocked by Brave for privacy reasons."
      - Suggest: "Please use the text input above to practice pronunciation, or try a different browser (Chrome, Edge, Safari)."
      - Include link to StackOverflow reference: https://stackoverflow.com/questions/74113965/speechrecognition-emitting-network-error-event-in-brave-browser
    - File: `app/globals.css`
    - Add CSS styles for browser warning (around line 1974):
      - `.speak-browser-warning` with background rgba(204, 17, 0, 0.08), border, padding, margin
      - `.speak-browser-warning strong` with color #cc1100
      - `.speak-browser-warning-link` with color #cc1100, underline, hover effect
    - _Bug_Condition: isBugCondition(input) where Brave browser is detected_
    - _Expected_Behavior: Clear disclaimer shown, microphone hidden, text input available_
    - _Preservation: All other browser behavior unchanged from Preservation Requirements_
    - _Requirements: 2.1, 2.8_

  - [x] 3.2 Add state checking and cleanup before retry attempts
    - File: `components/SpeakMagicController.tsx`
    - In the `recognitionRef.current.onerror` handler for network errors:
      - Before calling `recognitionRef.current.start()` in retry logic, add explicit state checking
      - Call `recognitionRef.current.stop()` first to ensure clean state (wrap in try-catch)
      - Increase retry delay from 1500ms to 2000ms for more reliable cleanup
      - Add try-catch around `recognitionRef.current.start()` to handle InvalidStateError
      - If InvalidStateError occurs, abort retry and switch to fallback immediately
    - _Bug_Condition: isBugCondition(input) where input.errorType == 'network' AND input.recognitionState IN ['starting', 'started'] AND retryAttemptedBeforeFullStop(input)_
    - _Expected_Behavior: result.noInvalidStateError == true AND (result.retrySucceeded == true OR result.fallbackSucceeded == true) from design_
    - _Preservation: Successful recognition and non-network error handling from Preservation Requirements_
    - _Requirements: 1.2, 1.3, 1.7, 2.1, 2.2, 2.3, 2.7_

  - [x] 3.3 Implement proper ElevenLabs STT fallback
    - File: `components/SpeakMagicController.tsx`
    - Fix the `startElevenLabsRecording()` function:
      - Ensure MediaRecorder is properly initialized with correct MIME type (audio/webm)
      - Properly handle audio blob creation from recorded chunks
      - Create FormData and append audio blob correctly
      - Send POST request to `/api/stt` endpoint with proper error handling
      - Process the transcription result and call `handleSpeechResult()`
      - Add proper cleanup of media streams after recording
      - Add error handling for microphone access failures
    - File: `app/api/stt/route.ts`
    - Verify audio format handling for audio/webm from client
    - Add validation to ensure audio file is not empty (size > 0)
    - Add detailed error logging with response status and error text
    - Return detailed error messages for debugging
    - _Bug_Condition: isBugCondition(input) where input.retryAttempt > 2 AND elevenLabsSTTFallbackFails()_
    - _Expected_Behavior: result.fallbackSucceeded == true from design_
    - _Preservation: Existing TTS functionality and API error handling from Preservation Requirements_
    - _Requirements: 1.4, 1.5, 2.4, 2.5, 2.6_

  - [x] 3.4 Add abort logic for invalid state detection
    - File: `components/SpeakMagicController.tsx`
    - In the retry catch block, detect InvalidStateError specifically:
      - Check if error is DOMException with name 'InvalidStateError'
      - If detected, immediately set retryCountRef.current to maxRetries
      - Switch to ElevenLabs STT fallback by setting useElevenLabsSTT = true
      - Display feedback: "💡 Switching to backup speech recognition..."
      - Set highlightManualInput = true
    - _Bug_Condition: isBugCondition(input) where InvalidStateError occurs during retry_
    - _Expected_Behavior: result.fallbackSucceeded == true AND result.userFeedbackClear == true from design_
    - _Preservation: Existing error handling for other error types from Preservation Requirements_
    - _Requirements: 1.2, 1.7, 2.7, 2.8_

  - [x] 3.5 Improve user feedback and manual input highlighting
    - File: `components/SpeakMagicController.tsx`
    - Update error messages to clearly direct users to text input:
      - Network error after retries: "💡 Speech recognition unavailable. Use the text input below to practice."
      - Set highlightManualInput = true when speech fails
    - File: `app/globals.css`
    - Add CSS class for highlighted manual input (around line 1974):
      - `.speak-manual-input--highlighted` with border-color #cc1100
      - Add box-shadow: 0 0 0 3px rgba(204, 17, 0, 0.15)
      - Add animation: input-highlight-pulse 2s ease-in-out 3
    - Add keyframes for input-highlight-pulse animation
    - Add `.speak-feedback--error` class for error state styling
    - _Bug_Condition: isBugCondition(input) where all recovery attempts fail_
    - _Expected_Behavior: result.userFeedbackClear == true from design_
    - _Preservation: Existing feedback display for successful recognition from Preservation Requirements_
    - _Requirements: 1.8, 2.8_

  - [x] 3.6 Add proper cleanup on component unmount
    - File: `components/SpeakMagicController.tsx`
    - In the useEffect cleanup function:
      - Call `recognitionRef.current.stop()` wrapped in try-catch
      - Call `recognitionRef.current.abort()` to force abort
      - Stop mediaRecorderRef if it exists
      - Stop all media stream tracks if they exist
      - Ignore all errors during cleanup
    - _Bug_Condition: Edge case where component unmounts during retry_
    - _Expected_Behavior: Proper cleanup without memory leaks_
    - _Preservation: Existing cleanup behavior from Preservation Requirements_
    - _Requirements: 3.9_

  - [ ] 3.7 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Network Error Recovery and Fallback Success
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests: `npm test -- components/__tests__/SpeakMagicController.bugfix.test.tsx`
    - **EXPECTED OUTCOME**: Tests PASS (confirms bug is fixed)
    - Verify Test Case 1: Network error retry succeeds without InvalidStateError
    - Verify Test Case 2: ElevenLabs STT fallback successfully records and processes audio
    - Verify Test Case 3: Recognition instance is properly stopped before retry
    - Verify Test Case 4: MediaRecorder initializes and API call succeeds
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 3.8 Verify preservation tests still pass
    - **Property 2: Preservation** - Successful Recognition and Non-Network Error Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests: `npm test -- components/__tests__/SpeakMagicController.preservation.test.tsx`
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify Test Case 1: Successful recognition still works identically
    - Verify Test Case 2: Manual input still works identically
    - Verify Test Case 3: Other error types still work identically
    - Verify Test Case 4: Pronunciation feedback still works identically
    - Verify Test Case 5: Navigation still works identically
    - Verify Test Case 6: TTS playback still works identically
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

---

## Phase 3: Validation

- [x] 4. Checkpoint - Ensure all tests pass
  - Run full test suite: `npm test`
  - Verify all bug condition tests pass (confirms fix works)
  - Verify all preservation tests pass (confirms no regressions)
  - Manually test the "Speak the Magic" page in different browsers:
    - **Brave Browser**: Verify disclaimer is shown, microphone is hidden, text input is available
    - **Chrome/Edge**: Test successful speech recognition, network error recovery, ElevenLabs STT fallback
    - **Safari**: Test successful speech recognition and fallback mechanisms
    - **All Browsers**: Test manual text input as fallback, error message clarity, manual input highlighting
  - Test network error scenarios (can simulate by throttling network in DevTools)
  - Test ElevenLabs STT fallback activation after retry exhaustion
  - If any issues arise, ask the user for guidance before proceeding
  - _Requirements: All requirements 1.1-3.10_

---

## Notes

- **PRIMARY ROOT CAUSE**: Brave browser blocks Web Speech API by design for privacy reasons (https://stackoverflow.com/questions/74113965/speechrecognition-emitting-network-error-event-in-brave-browser)
- **DETECTION METHOD**: Check for `'brave' in navigator` to detect Brave browser
- **SECONDARY ISSUES**: Race conditions in retry logic, missing state validation, incomplete ElevenLabs STT fallback
- **Testing Framework**: Vitest with fast-check for property-based testing
- **Test Command**: `npm test` (runs all tests), `npm test -- <file>` (runs specific test file)
- **Mock Requirements**: Web Speech API (SpeechRecognition), MediaRecorder, fetch API, navigator.brave
- **Key Files**:
  - `components/SpeakMagicController.tsx` - Main component with speech recognition logic
  - `app/api/stt/route.ts` - ElevenLabs STT API endpoint
  - `app/globals.css` - Styling for error states, browser warnings, and manual input highlighting
- **Property-Based Testing**: Use fast-check to generate test cases for preservation checking
- **Observation-First**: Run unfixed code first to observe actual behavior before writing preservation tests
- **Browser Testing**: Test in Chrome, Edge, Safari (should work), and Brave (should show disclaimer)
