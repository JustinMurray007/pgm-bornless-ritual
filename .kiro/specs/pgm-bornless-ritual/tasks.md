# Implementation Plan: PGM Bornless Ritual

## Overview

Implement the Bornless Ritual as a Next.js 14 App Router application in TypeScript. The build proceeds in layers: scaffolding → environment → data layer → fallbacks → Supabase clients → session → visual foundation → server data-fetch → interactive components → audio pipeline → glow animation → logging → error UX → tests.

Each task builds on the previous. No code is left unintegrated.

## Tasks

- [x] 1. Scaffold Next.js 14 App Router project with TypeScript and dependencies
  - Run `npx create-next-app@14` with `--typescript --app --tailwind=false --eslint` flags (or equivalent manual scaffold)
  - Install runtime dependencies: `@supabase/supabase-js`, `uuid`, `fast-check` (dev), testing framework (Vitest + `@testing-library/react` + `jsdom`)
  - Add `"seed": "tsx scripts/seed.ts"` script to `package.json`
  - Create the directory skeleton: `app/api/tts/`, `components/`, `hooks/`, `lib/supabase/`, `scripts/`
  - Create `lib/types.ts` with `RitualSection`, `PhoneticMapping`, `PhoneticMap`, and `UsageLog` interfaces exactly as specified in the design
  - _Requirements: 9.4 (package.json seed script), 7.4_

- [x] 2. Environment configuration
  - [x] 2.1 Implement `lib/env.ts` with `validateEnv()`
    - Declare the `required` tuple `['ELEVENLABS_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']`
    - Filter for missing keys and throw a descriptive error listing every absent variable by name
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ]* 2.2 Write property test for `validateEnv()` — Property 13
    - **Property 13: Environment validation error names every missing variable**
    - **Validates: Requirements 9.5**
    - Use `fc.subarray(['ELEVENLABS_API_KEY','NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'], {minLength:1})` as the arbitrary
    - Assert the thrown error message contains the exact name of each absent variable
    - Tag: `// Feature: pgm-bornless-ritual, Property 13: Env validation names missing vars`

  - [ ]* 2.3 Write unit tests for `lib/env.ts`
    - Happy path: all three variables present → no throw
    - Each individual variable missing → error message names that variable
    - _Requirements: 9.5_

  - [x] 2.4 Create `.env.example`
    - List `ELEVENLABS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` with placeholder values and inline comments explaining each
    - _Requirements: 9.4_

- [x] 3. Supabase schema and seed script
  - [x] 3.1 Write `scripts/seed.ts` with schema creation and upsert logic
    - Define SQL `CREATE TABLE IF NOT EXISTS` statements for `ritual_sections`, `phonetic_mappings`, and `usage_logs` (including the two indexes on `usage_logs`) exactly as specified in the design
    - Define the five `ritual_sections` seed rows (slug, title, body, sort_order 1–5)
    - Define all thirteen `phonetic_mappings` seed rows from the design's seed table
    - Use Supabase `upsert` with `onConflict` on the unique column so re-runs are idempotent
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 3.1, 3.2_

  - [ ]* 3.2 Write property test for seed idempotence — Property 9
    - **Property 9: Seed script execution is idempotent**
    - **Validates: Requirements 7.3**
    - Use `fc.integer({min: 1, max: 5})` as run-count arbitrary; mock the Supabase upsert call
    - Assert that after any number of runs the seed arrays contain exactly 5 sections and 13 mappings (no duplicates)
    - Tag: `// Feature: pgm-bornless-ritual, Property 9: Seed idempotence`

  - [ ]* 3.3 Write unit tests for `scripts/seed.ts`
    - Assert seed arrays contain exactly 5 sections and 13 mappings
    - Assert all 13 required `original` keys from Requirement 3.2 are present
    - _Requirements: 7.1, 7.2, 3.2_

- [x] 4. Checkpoint — verify scaffold, env, and seed
  - Ensure `npm run seed` executes without error (against a test Supabase instance or with mocked client)
  - Ensure `validateEnv()` throws on missing variables
  - Ask the user if questions arise before continuing.

- [x] 5. Fallback content modules
  - [x] 5.1 Implement `lib/ritualText.ts`
    - Export a `FALLBACK_SECTIONS` array of five `RitualSection` objects (Opening, First Vocal Key, Barbarous Names, Self-Identification, Final Seal) with representative body text
    - _Requirements: 2.6_

  - [x] 5.2 Implement `lib/phonetics.ts`
    - Export a `FALLBACK_PHONETICS` constant of type `PhoneticMap` containing all 13 required mappings from Requirement 3.2
    - _Requirements: 3.4, 3.2_

  - [ ]* 5.3 Write unit test for `lib/phonetics.ts`
    - Assert `FALLBACK_PHONETICS` contains all 13 required keys
    - _Requirements: 3.2_

- [x] 6. Supabase client modules
  - [x] 6.1 Implement `lib/supabase/client.ts`
    - Create a singleton browser Supabase client using `createClient` from `@supabase/supabase-js`
    - Read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `process.env`
    - _Requirements: 9.2, 9.3_

  - [x] 6.2 Implement `lib/supabase/server.ts`
    - Create a server-side Supabase client (for use in Server Components and Route Handlers)
    - _Requirements: 9.2, 9.3_

- [x] 7. Session management
  - [x] 7.1 Implement `lib/session.ts` with `getSessionId()`
    - Guard against SSR with `typeof window === 'undefined'` check
    - Read from `sessionStorage` under key `bornless_session_id`; generate and store a UUID v4 if absent
    - _Requirements: 6.2_

  - [ ]* 7.2 Write property test for session UUID format — Property 8
    - **Property 8: Session ID is always a valid UUID v4**
    - **Validates: Requirements 6.2**
    - Use `fc.constant(null)` as the arbitrary (no input needed)
    - Assert the returned value matches the UUID v4 regex `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
    - Assert repeated calls within the same session return the same UUID
    - Tag: `// Feature: pgm-bornless-ritual, Property 8: Session UUID format`

  - [ ]* 7.3 Write unit tests for `lib/session.ts`
    - Returns same UUID on repeated calls within a session
    - Generates a new UUID when `sessionStorage` is empty
    - _Requirements: 6.2_

- [x] 8. Papyrus background and global styles
  - [x] 8.1 Implement the papyrus CSS in `app/globals.css`
    - Add `.papyrus-bg` class with `position: fixed; inset: 0; z-index: -1`
    - Add the base `background-color: #c8a96e` and the five-layer `background-image` (two `repeating-linear-gradient` striations + three `radial-gradient` mottling layers) exactly as specified in the design
    - Apply `filter: url(#papyrus-noise)` referencing the inline SVG filter
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 8.2 Add the inline SVG `feTurbulence` filter to `app/layout.tsx`
    - Insert the hidden `<svg aria-hidden="true">` block with `<filter id="papyrus-noise">` containing `feTurbulence`, `feDisplacementMap` (scale=4), `feColorMatrix` (saturate 0.7), and `feBlend multiply` exactly as specified in the design
    - _Requirements: 1.2, 1.3_

  - [x] 8.3 Add typography and text contrast styles
    - Load a serif/uncial font appropriate for Greek/Coptic script (e.g., Google Fonts `Noto Serif` or `GFS Didot`) in `app/layout.tsx`
    - Set body text color to `#2a1a0a` to achieve ≥ 4.5:1 contrast ratio against `#c8a96e`
    - Add `.voce-magica` base styles: `--glow-blur: 0px`, `--glow-brightness: 1`, `filter: drop-shadow(0 0 var(--glow-blur) hsl(40, 90%, 55%)) brightness(var(--glow-brightness))`, `will-change: filter`
    - Add `.voce-magica[data-fading="true"]` rule with `transition: filter 500ms ease-out`
    - Add distinct typographic style for voces magicae (larger font size or increased letter-spacing)
    - _Requirements: 2.2, 2.3, 2.4, 5.3, 5.7_

  - [x] 8.4 Call `validateEnv()` at the top of `app/layout.tsx`
    - Import and call `validateEnv()` so missing environment variables cause a fast startup failure
    - _Requirements: 9.5_

- [x] 9. RitualPage Server Component
  - [x] 9.1 Implement `app/page.tsx` as a Server Component
    - Import the server Supabase client and fetch `ritual_sections` ordered by `sort_order` and all `phonetic_mappings`
    - Wrap both fetches in `try/catch`; on error fall back to `FALLBACK_SECTIONS` / `FALLBACK_PHONETICS` and log the error to console
    - Build a `PhoneticMap` (`Record<string, string>`) from the fetched or fallback phonetic mappings
    - Render the `.papyrus-bg` div and map over sections to render a `<RitualSection>` for each
    - _Requirements: 2.1, 2.5, 2.6, 3.3, 3.4_

  - [ ]* 9.2 Write property test for ritual section sort order — Property 1
    - **Property 1: Ritual sections always sort to canonical order**
    - **Validates: Requirements 2.1**
    - Use `fc.shuffledSubarray(allFiveSections, {minLength: 5, maxLength: 5})` as the arbitrary
    - Assert the sorted result matches the canonical sequence (sort_order 1 → 5)
    - Tag: `// Feature: pgm-bornless-ritual, Property 1: Section sort order`

- [x] 10. RitualSection Client Component
  - [x] 10.1 Implement `components/RitualSection.tsx`
    - Accept `RitualSectionProps` (`section: RitualSection`, `phoneticMap: PhoneticMap`)
    - Render the section `title` as a heading and parse `section.body` to identify voces magicae tokens (keys present in `phoneticMap`)
    - Wrap each matched token in a `<VoceMagica>` component; render non-matching text as plain spans
    - _Requirements: 2.1, 2.2_

- [x] 11. VoceMagica Client Component
  - [x] 11.1 Implement `components/VoceMagica.tsx` — interaction and accessibility
    - Accept `VoceMagicaProps` (`original`, `phonetic`, `ariaLabel`)
    - Set `tabIndex={0}`, `role="button"`, `aria-label={ariaLabel}` on the root element
    - Wire `onMouseEnter`/`onFocus` to trigger TTS; `onMouseLeave`/`onBlur` to cancel pending request
    - Wire `onKeyDown` to trigger TTS on Enter or Space (same logic as hover)
    - Hold an `AbortController` ref; create a new controller on each trigger; call `controller.abort()` on leave/blur before playback starts
    - Apply `--glow-blur` and `--glow-brightness` CSS custom properties via inline style
    - _Requirements: 4.1, 4.3, 4.4, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 11.2 Write property test for tabIndex — Property 10
    - **Property 10: Every VoceMagica element is keyboard-accessible**
    - **Validates: Requirements 8.1**
    - Use `fc.record({original: fc.string({minLength:1}), phonetic: fc.string({minLength:1})})` as the arbitrary
    - Assert the rendered DOM element has `tabIndex === 0`
    - Tag: `// Feature: pgm-bornless-ritual, Property 10: tabIndex on all elements`

  - [ ]* 11.3 Write property test for aria-label — Property 12
    - **Property 12: aria-label always equals the phonetic spelling**
    - **Validates: Requirements 8.4**
    - Use `fc.record({original: fc.string({minLength:1}), phonetic: fc.string({minLength:1})})` as the arbitrary
    - Assert `aria-label === phonetic`
    - Tag: `// Feature: pgm-bornless-ritual, Property 12: aria-label = phonetic`

  - [ ]* 11.4 Write property test for keyboard/hover parity — Property 11
    - **Property 11: Keyboard interaction is behaviourally equivalent to hover**
    - **Validates: Requirements 8.2, 8.3**
    - Use `fc.record({original: fc.string({minLength:1}), phonetic: fc.string({minLength:1})})` as the arbitrary
    - Assert focus CSS state equals hover CSS state; assert TTS request body from Enter keypress equals body from mouseenter
    - Tag: `// Feature: pgm-bornless-ritual, Property 11: Keyboard parity`

  - [ ]* 11.5 Write unit tests for `components/VoceMagica.tsx`
    - Hover triggers fetch to `/api/tts` with correct body
    - Mouse-leave before response calls `abort()`
    - API error shows toast notification; text display is not interrupted
    - Voice settings in request body are `{stability: 0.2, style: 0.9}`
    - _Requirements: 4.1, 4.2, 4.4, 4.6_

- [x] 12. `/api/tts` Route Handler
  - [x] 12.1 Implement `app/api/tts/route.ts`
    - Call `validateEnv()` at the top of the handler
    - Parse `{ text, voiceId }` from the POST request body; return 400 if either is missing
    - Proxy a POST to `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}/stream` with `Authorization: xi-api-key ${ELEVENLABS_API_KEY}` header
    - Include voice settings `{ stability: 0.2, style: 0.9 }` in the request body
    - Pipe the ElevenLabs `ReadableStream` directly to the response with `Content-Type: audio/mpeg`
    - Return 502 on ElevenLabs error, 500 on unexpected error
    - _Requirements: 4.1, 4.2, 4.7, 9.1, 9.5_

  - [ ]* 12.2 Write property test for TTS phonetic substitution — Property 3
    - **Property 3: TTS request body always contains phonetic spelling, never the original**
    - **Validates: Requirements 4.1, 4.7**
    - Use `fc.constantFrom(...Object.entries(phoneticMap))` as the arbitrary
    - Assert the request body `.text` field equals the phonetic value and does not equal the original string
    - Tag: `// Feature: pgm-bornless-ritual, Property 3: TTS uses phonetic spelling`

  - [ ]* 12.3 Write unit tests for `/api/tts` route
    - Returns 400 when `text` or `voiceId` is missing
    - Returns `audio/mpeg` content-type on success (mocked ElevenLabs)
    - Returns 502 when ElevenLabs returns an error
    - Voice settings `stability: 0.2, style: 0.9` are present in the proxied request body
    - _Requirements: 4.2, 4.6_

- [x] 13. Checkpoint — verify data flow end-to-end
  - Ensure the page renders with fallback content when Supabase is unreachable
  - Ensure `/api/tts` returns audio/mpeg with a mocked ElevenLabs response
  - Ask the user if questions arise before continuing.

- [x] 14. `useAudioAnalyzer` hook
  - [x] 14.1 Implement `hooks/useAudioAnalyzer.ts`
    - Create `AudioContext` lazily on first `connectAudio` call (satisfies browser autoplay policy)
    - `connectAudio(audioElement)`: create `MediaElementAudioSourceNode`, connect through `AnalyserNode` to `destination`
    - `disconnectAudio()`: disconnect the source node and close the context
    - `getAmplitude()`: call `getByteTimeDomainData`, compute RMS, normalise to [0, 1]
    - On `AudioContext` creation failure: log error, return `getAmplitude` that always returns 0
    - _Requirements: 5.1_

  - [ ]* 14.2 Write unit tests for `hooks/useAudioAnalyzer.ts`
    - `connectAudio()` creates `MediaElementAudioSourceNode` and connects to analyser
    - `getAmplitude()` returns 0 when `AudioContext` creation fails
    - _Requirements: 5.1_

- [x] 15. `useGlowController` hook
  - [x] 15.1 Implement `hooks/useGlowController.ts`
    - Accept `{ getAmplitude, elementRef, isPlaying }` options
    - While `isPlaying` is true, run a `requestAnimationFrame` loop: compute `blur = amplitude × 24`, `brightness = 1 + amplitude × 0.6`, set `--glow-blur` and `--glow-brightness` on `elementRef.current`
    - `stopGlow()`: set `data-fading="true"` on the element, then animate `--glow-blur` and `--glow-brightness` back to `0px` / `1.0` over 500ms using a linear per-frame decay; remove `data-fading` when complete
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 15.2 Write property test for glow proportionality — Property 6
    - **Property 6: Glow values are proportional to amplitude**
    - **Validates: Requirements 5.2, 5.4, 5.5**
    - Use `fc.float({min: 0, max: 1})` as the arbitrary
    - Assert `blur === amplitude × 24` and `brightness === 1 + amplitude × 0.6`
    - Assert boundary conditions: at `a=1.0` blur ≥ 16px and brightness ≥ 1.5; at `a=0.0` blur = 0px and brightness = 1.0
    - Tag: `// Feature: pgm-bornless-ritual, Property 6: Amplitude proportionality`

  - [ ]* 15.3 Write property test for glow reset — Property 5
    - **Property 5: Glow state resets to defaults after playback ends**
    - **Validates: Requirements 4.5, 5.6**
    - Use `fc.constantFrom(...allVoceMagicaElements)` as the arbitrary
    - Assert that after `stopGlow()` and the 500ms fade, `--glow-blur === '0px'` and `--glow-brightness === '1'`
    - Tag: `// Feature: pgm-bornless-ritual, Property 5: Glow resets after playback`

  - [ ]* 15.4 Write unit tests for `hooks/useGlowController.ts`
    - `stopGlow()` sets `data-fading="true"` on the element
    - Custom properties return to `0px` / `1` after the fade duration
    - _Requirements: 5.6_

- [x] 16. Wire audio pipeline into VoceMagica
  - [x] 16.1 Integrate `useAudioAnalyzer` and `useGlowController` into `components/VoceMagica.tsx`
    - Create an `<audio>` element ref; on TTS response, set `src` to an object URL from the streamed blob and call `audioEl.play()`
    - Call `connectAudio(audioEl)` after the audio element is ready
    - Pass `getAmplitude` and `elementRef` to `useGlowController`; set `isPlaying` based on audio play/ended events
    - On `audio.ended`: call `stopGlow()` and `disconnectAudio()`
    - _Requirements: 4.5, 5.1, 5.2, 5.6_

  - [ ]* 16.2 Write property test for no duplicate concurrent requests — Property 4
    - **Property 4: At most one concurrent TTS request per element**
    - **Validates: Requirements 4.3**
    - Use `fc.array(fc.constant('hover'), {minLength: 2, maxLength: 10})` as the arbitrary
    - Assert in-flight request count for a single element never exceeds 1
    - Tag: `// Feature: pgm-bornless-ritual, Property 4: No duplicate concurrent requests`

- [x] 17. Usage logging
  - [x] 17.1 Implement usage logging in `components/VoceMagica.tsx`
    - After audio playback successfully begins, fire-and-forget an async function that calls `getSessionId()` and inserts a `UsageLog` record via the browser Supabase client
    - On insert failure, wait 2 seconds and retry once; on second failure, log to console and discard
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 17.2 Write property test for usage log completeness — Property 7
    - **Property 7: Usage log records contain all required fields**
    - **Validates: Requirements 6.1**
    - Use `fc.record({vox: fc.string({minLength:1}), session: fc.uuid()})` as the arbitrary
    - Assert the constructed `UsageLog` object has non-empty `vox_magica`, valid ISO 8601 `triggered_at`, and non-empty `session_id`
    - Tag: `// Feature: pgm-bornless-ritual, Property 7: Usage log completeness`

  - [ ]* 17.3 Write unit tests for usage logging
    - Successful playback triggers Supabase insert with correct fields
    - First insert failure triggers a retry after 2 seconds
    - Second failure logs to console and does not throw
    - _Requirements: 6.1, 6.3, 6.4_

- [x] 18. Toast notification component
  - [x] 18.1 Implement `components/Toast.tsx`
    - Render a non-blocking, visually distinct notification that auto-dismisses
    - Expose a `useToast` hook or context so `VoceMagica` can trigger it on ElevenLabs API errors
    - Integrate `useToast` into `VoceMagica.tsx` to display the toast on 4xx/5xx responses and on network timeout
    - _Requirements: 4.6, 3.4_

- [x] 19. Checkpoint — full feature smoke test
  - Ensure all unit and property tests pass
  - Ensure the page renders with real Supabase data (or fallback) and the papyrus background is visible
  - Ask the user if questions arise before continuing.

- [ ] 20. Property-based tests — remaining properties
  - [x] 20.1 Write property test for phonetic mapping completeness — Property 2
    - **Property 2: Phonetic mapping records are structurally complete**
    - **Validates: Requirements 3.1**
    - Use `fc.record({id: fc.uuid(), original: fc.string({minLength:1}), phonetic: fc.string({minLength:1})})` as the arbitrary
    - Assert all three fields are non-empty strings
    - Tag: `// Feature: pgm-bornless-ritual, Property 2: Phonetic mapping completeness`

- [ ] 21. Integration tests
  - [x] 21.1 Write Supabase integration test
    - Verify `ritual_sections` table returns 5 rows after seeding
    - Verify `phonetic_mappings` table returns 13 rows after seeding
    - _Requirements: 7.1, 7.2_

  - [x] 21.2 Write `/api/tts` Route Handler integration test
    - Mock ElevenLabs; verify the route returns `Content-Type: audio/mpeg`
    - Verify the proxied request body contains `stability: 0.2` and `style: 0.9`
    - _Requirements: 4.2_

  - [x] 21.3 Write full-page fallback integration test
    - Mock Supabase to be unreachable; render `app/page.tsx`
    - Assert fallback ritual text is displayed and no unhandled error is thrown
    - _Requirements: 2.6, 3.4_

- [x] 22. Final checkpoint — all tests pass
  - Run the full test suite; ensure all tests pass
  - Verify `npm run seed` completes without error
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at natural integration boundaries
- Property tests validate universal correctness properties (13 properties from design.md)
- Unit tests validate specific examples, error conditions, and edge cases
- The design uses TypeScript throughout — all code examples should use TypeScript
