# Requirements Document

## Introduction

The Bornless Ritual is a Next.js web application that digitally reconstructs the Stele of Jeu the Hieroglyphist (PGM V. 96-172) from the Greek Magical Papyri. The application renders the ritual text in Greek/Coptic script over a photorealistic papyrus background and uses the ElevenLabs API to vocalize the voces magicae (magical words of power) with phonetically accurate pronunciation. As audio plays, CSS animations driven by real-time Web Audio API analysis cause the text to glow and pulse in synchrony with the spoken words, creating an immersive, ancient-mystical experience. Ritual texts, phonetic mappings, and usage logs are persisted in a Supabase database.

## Glossary

- **Application**: The Bornless Ritual Next.js web application.
- **Ritual_Text**: The full textual content of PGM V. 96-172, divided into sections (Opening, First Vocal Key, Barbarous Names, Self-Identification, Final Seal).
- **Voces_Magicae**: The strings of magical names within the Ritual_Text (e.g., IAŌ, SABAŌTH, ABRASAX) that require phonetic reconstruction.
- **Phonetic_Mapping**: A record pairing a Voces_Magicae string with its ElevenLabs-compatible phonetic spelling.
- **ElevenLabs_Client**: The browser-side integration with the ElevenLabs Text-to-Speech API.
- **Audio_Analyzer**: The Web Audio API AnalyserNode used to extract real-time amplitude data from the ElevenLabs audio stream.
- **Glow_Animation**: The CSS filter and keyframe animation applied to a text element that pulses in amber/gold tones in proportion to the Audio_Analyzer amplitude.
- **Papyrus_Background**: The full-viewport photorealistic CSS/image texture simulating aged Egyptian papyrus.
- **Supabase_Client**: The browser/server-side Supabase SDK instance used to read and write database records.
- **Usage_Log**: A Supabase database record capturing which Voces_Magicae string was triggered, a timestamp, and optional session metadata.
- **Section**: A named subdivision of the Ritual_Text (Opening, First_Vocal_Key, Barbarous_Names, Self_Identification, Final_Seal).

---

## Requirements

### Requirement 1: Papyrus Background Rendering

**User Story:** As a visitor, I want to see a full-viewport photorealistic papyrus texture as the page background, so that the ritual text feels authentically ancient.

#### Acceptance Criteria

1. THE Application SHALL render a full-viewport background that covers 100% of the viewport width and height without gaps or white space.
2. THE Papyrus_Background SHALL display a golden-brown color gradient with visible vertical and horizontal fibrous striations that simulate woven Egyptian papyrus.
3. THE Papyrus_Background SHALL appear aged and worn, with irregular mottling and subtle color variation across the surface.
4. THE Papyrus_Background SHALL tile or scale seamlessly so that no visible seam or repetition artifact appears at any standard viewport size (320px–2560px wide).
5. WHEN the viewport is resized, THE Papyrus_Background SHALL reflow to maintain full coverage without distortion of the fibrous texture pattern.

---

### Requirement 2: Ritual Text Display

**User Story:** As a visitor, I want to read the full Bornless Ritual text in Greek/Coptic script overlaid on the papyrus, so that I can engage with the authentic source material.

#### Acceptance Criteria

1. THE Application SHALL display all five Sections of the Ritual_Text in the following order: Opening, First_Vocal_Key, Barbarous_Names, Self_Identification, Final_Seal.
2. THE Application SHALL render Voces_Magicae strings in a visually distinct typographic style (e.g., larger font size or letter-spacing) compared to the surrounding prose text.
3. THE Application SHALL use a serif or uncial-style font appropriate for Greek/Coptic script rendering.
4. THE Application SHALL ensure all Ritual_Text remains legible against the Papyrus_Background with a contrast ratio of at least 4.5:1 (WCAG AA) for body text.
5. WHEN the Ritual_Text content is loaded from Supabase, THE Application SHALL display the text within 2 seconds of the initial page load on a standard broadband connection.
6. IF the Supabase_Client fails to retrieve Ritual_Text, THEN THE Application SHALL display the locally bundled fallback Ritual_Text and log the error to the browser console.

---

### Requirement 3: Phonetic Mapping Storage and Retrieval

**User Story:** As a developer, I want phonetic mappings for all Voces_Magicae stored in Supabase, so that the ElevenLabs API receives accurate pronunciation instructions without manual hardcoding.

#### Acceptance Criteria

1. THE Supabase_Client SHALL store each Phonetic_Mapping as a record containing: a unique identifier, the original Voces_Magicae string, and the ElevenLabs-compatible phonetic spelling.
2. THE Application SHALL include Phonetic_Mappings for at minimum the following strings: IAŌ (ee-ah-oh), SABAŌTH (sah-bah-oat), ADŌNAI (ah-doh-nye), ABRASAX (ah-brah-sax), ITHYPHALLŌ (ee-thee-fah-loh), ARTHEXOUTH (ar-theks-ooth), THIAF (thee-af), RHEIBET (hray-bet), ATHELEBER-SĒTH (ah-theh-leh-ber-seth), AŌTH (ah-ote), ABRAŌTH (ah-brah-ote), BASUM (bah-soom), ISAK (ee-sahk).
3. WHEN the Application initialises, THE Supabase_Client SHALL fetch all Phonetic_Mappings and cache them in application state before any audio playback is permitted.
4. IF the Supabase_Client fails to fetch Phonetic_Mappings, THEN THE Application SHALL fall back to a hardcoded set of Phonetic_Mappings bundled with the application and display a non-blocking warning indicator.

---

### Requirement 4: Hover-Triggered Audio Playback

**User Story:** As a visitor, I want the voces magicae to be spoken aloud when I hover over them, so that I can hear the phonetic reconstruction of the ancient magical words.

#### Acceptance Criteria

1. WHEN a user hovers over a Voces_Magicae text element, THE ElevenLabs_Client SHALL initiate a Text-to-Speech request using the phonetic spelling from the corresponding Phonetic_Mapping.
2. THE ElevenLabs_Client SHALL use the ElevenLabs Greek voice model with a stability value of 0.2 (low) and a style exaggeration value of 0.9 (high) for all Voces_Magicae playback.
3. WHEN a Text-to-Speech request is in flight, THE Application SHALL prevent duplicate concurrent requests for the same Voces_Magicae element.
4. WHEN the user's pointer leaves a Voces_Magicae text element before audio playback has begun, THE ElevenLabs_Client SHALL cancel the pending request.
5. WHEN audio playback completes, THE Application SHALL reset the Voces_Magicae element to its default (non-glowing) visual state.
6. IF the ElevenLabs API returns an error response, THEN THE Application SHALL display a non-blocking toast notification indicating that audio is unavailable and SHALL NOT interrupt the text display.
7. THE ElevenLabs_Client SHALL substitute each Voces_Magicae string with its Phonetic_Mapping spelling in the API request body so that the model does not apply English phonetic rules to the original string.

---

### Requirement 5: Real-Time Audio-Driven Glow Animation

**User Story:** As a visitor, I want the ritual text to glow and pulse in time with the audio, so that the visual and auditory experience feel unified and immersive.

#### Acceptance Criteria

1. WHEN audio playback begins, THE Audio_Analyzer SHALL connect to the ElevenLabs audio stream and begin sampling amplitude data at a minimum rate of 30 frames per second.
2. WHILE audio is playing, THE Glow_Animation SHALL update the CSS `filter: drop-shadow` and `brightness` values of the active Voces_Magicae element on each animation frame in proportion to the current amplitude value from the Audio_Analyzer.
3. THE Glow_Animation SHALL use amber/gold tones (hue range 30°–50°) for the drop-shadow color.
4. WHEN the amplitude value is at maximum (normalised 1.0), THE Glow_Animation SHALL apply a drop-shadow blur radius of at least 16px and a brightness multiplier of at least 1.5.
5. WHEN the amplitude value is at minimum (normalised 0.0), THE Glow_Animation SHALL apply a drop-shadow blur radius of 0px and a brightness multiplier of 1.0 (no glow).
6. WHEN audio playback ends, THE Glow_Animation SHALL smoothly transition the Voces_Magicae element back to its default visual state over a duration of 500ms.
7. THE Glow_Animation SHALL not cause layout reflow; it SHALL use only CSS properties that are composited on the GPU (filter, opacity, transform).

---

### Requirement 6: Usage Logging

**User Story:** As a developer, I want every audio playback event logged to Supabase, so that I can analyse which voces magicae are most frequently invoked.

#### Acceptance Criteria

1. WHEN a Voces_Magicae audio playback successfully begins, THE Supabase_Client SHALL insert a Usage_Log record containing: the Voces_Magicae string, a UTC timestamp, and an anonymous session identifier.
2. THE Application SHALL generate the anonymous session identifier as a UUID stored in the browser's sessionStorage for the duration of the session.
3. IF the Supabase_Client fails to insert a Usage_Log record, THEN THE Application SHALL silently retry the insert once after a 2-second delay without interrupting audio playback.
4. IF the retry also fails, THEN THE Application SHALL discard the Usage_Log record and log the failure to the browser console.

---

### Requirement 7: Ritual Text and Phonetic Mapping Seeding

**User Story:** As a developer, I want the Supabase database to be pre-seeded with all Ritual_Text sections and Phonetic_Mappings, so that the application is fully functional immediately after deployment.

#### Acceptance Criteria

1. THE Application SHALL include a database seed script that inserts all five Sections of the Ritual_Text into the Supabase `ritual_sections` table.
2. THE Application SHALL include a database seed script that inserts all thirteen Phonetic_Mappings listed in Requirement 3 into the Supabase `phonetic_mappings` table.
3. WHEN the seed script is executed, THE Supabase_Client SHALL use upsert semantics so that re-running the script does not create duplicate records.
4. THE seed script SHALL be executable via a single `npm run seed` command defined in `package.json`.

---

### Requirement 8: Accessibility and Keyboard Navigation

**User Story:** As a visitor using a keyboard or assistive technology, I want to be able to trigger audio playback without a mouse, so that the experience is accessible.

#### Acceptance Criteria

1. THE Application SHALL make each Voces_Magicae text element focusable via the Tab key.
2. WHEN a Voces_Magicae element receives keyboard focus, THE Application SHALL apply the same visual highlight state as on pointer hover.
3. WHEN a focused Voces_Magicae element receives a keypress of Enter or Space, THE ElevenLabs_Client SHALL initiate audio playback using the same logic as the hover trigger.
4. THE Application SHALL provide an `aria-label` attribute on each Voces_Magicae element containing the phonetic spelling of the word, so that screen readers announce the pronunciation.
5. THE Application SHALL include a visible focus indicator on all interactive elements that meets WCAG 2.1 AA focus-visible requirements.

---

### Requirement 9: Environment Configuration

**User Story:** As a developer, I want all API keys and service URLs managed via environment variables, so that secrets are never committed to source control.

#### Acceptance Criteria

1. THE Application SHALL read the ElevenLabs API key exclusively from the `ELEVENLABS_API_KEY` environment variable.
2. THE Application SHALL read the Supabase project URL exclusively from the `NEXT_PUBLIC_SUPABASE_URL` environment variable.
3. THE Application SHALL read the Supabase anonymous key exclusively from the `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable.
4. THE Application SHALL include a `.env.example` file listing all required environment variables with placeholder values and inline comments.
5. IF any required environment variable is absent at application startup, THEN THE Application SHALL throw a descriptive startup error identifying the missing variable by name.
