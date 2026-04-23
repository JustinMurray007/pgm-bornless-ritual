/**
 * Integration test for app/page.tsx — Full-page fallback rendering
 *
 * Validates: Requirements 2.6, 3.4
 *
 * This test verifies that when Supabase is unreachable:
 * 1. The page renders without throwing an error
 * 2. The fallback ritual text from lib/ritualText.ts is displayed
 * 3. No unhandled errors are thrown
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RitualPage from '../page';
import { FALLBACK_SECTIONS } from '@/lib/ritualText';
import { ToastProvider } from '@/components/Toast';

// ---------------------------------------------------------------------------
// Mock Supabase server client to simulate unreachable database
// ---------------------------------------------------------------------------

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServerClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: null,
            error: new Error('Supabase connection failed'),
          })
        ),
      })),
    })),
  })),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('app/page.tsx — Supabase fallback integration', () => {
  beforeEach(() => {
    // Set up required environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Requirement 2.6: IF the Supabase_Client fails to retrieve Ritual_Text,
   * THEN THE Application SHALL display the locally bundled fallback
   * Ritual_Text and log the error to the browser console.
   *
   * Requirement 3.4: IF the Supabase_Client fails to fetch Phonetic_Mappings,
   * THEN THE Application SHALL fall back to a hardcoded set of
   * Phonetic_Mappings bundled with the application and display a non-blocking
   * warning indicator.
   */
  it('renders fallback ritual text when Supabase is unreachable', async () => {
    // Spy on console.error to verify error logging
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act: Render the page (Server Component)
    const pageElement = await RitualPage();
    const { container } = render(<ToastProvider>{pageElement}</ToastProvider>);

    // Assert: No unhandled errors thrown (page renders successfully)
    expect(container).toBeTruthy();

    // Assert: Fallback notice is displayed
    const fallbackNotice = screen.getByRole('status');
    expect(fallbackNotice).toBeInTheDocument();
    expect(fallbackNotice).toHaveTextContent(/database unavailable/i);

    // Assert: Fallback ritual text is displayed
    // Check that the first section title from FALLBACK_SECTIONS is present
    // Note: The page renders sections multiple times (original, voice, phonetic)
    const firstSectionTitle = FALLBACK_SECTIONS[0].title;
    const titleElements = screen.getAllByText(firstSectionTitle);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[0]).toBeInTheDocument();

    // Assert: Check that some of the fallback body text is present
    // We'll check for a distinctive phrase from the first section
    const bodyTextSnippet = 'Ἀκέφαλον'; // "Headless One" in Greek
    const bodyElements = screen.getAllByText(new RegExp(bodyTextSnippet));
    expect(bodyElements.length).toBeGreaterThan(0);
    expect(bodyElements[0]).toBeInTheDocument();

    // Assert: Error was logged to console
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[RitualPage] Supabase fetch failed'),
      expect.any(Error)
    );

    // Cleanup
    consoleErrorSpy.mockRestore();
  });

  /**
   * Verify that all five fallback sections are rendered when Supabase fails.
   */
  it('renders all five fallback sections in correct order', async () => {
    // Act: Render the page
    const pageElement = await RitualPage();
    render(<ToastProvider>{pageElement}</ToastProvider>);

    // Assert: All section titles are present (using getAllByText since titles appear multiple times)
    for (const section of FALLBACK_SECTIONS) {
      const titleElements = screen.getAllByText(section.title);
      expect(titleElements.length).toBeGreaterThan(0);
    }

    // Assert: Check that the first ritual section (in the main content) contains expected body text
    const bodyTextSnippet = 'Ἀκέφαλον'; // "Headless One" in Greek from first section
    const bodyElements = screen.getAllByText(new RegExp(bodyTextSnippet));
    expect(bodyElements.length).toBeGreaterThan(0);
    expect(bodyElements[0]).toBeInTheDocument();
  });

  /**
   * Verify that the page title and subtitle are rendered correctly.
   */
  it('renders the page title and subtitle', async () => {
    // Act: Render the page
    const pageElement = await RitualPage();
    render(<ToastProvider>{pageElement}</ToastProvider>);

    // Assert: Title is present
    expect(screen.getByText('The Bornless Ritual')).toBeInTheDocument();

    // Assert: Subtitle is present
    expect(
      screen.getByText(/Stele of Jeu the Hieroglyphist — PGM V\. 96–172/i)
    ).toBeInTheDocument();
  });

  /**
   * Verify that the papyrus background element is rendered.
   */
  it('renders the papyrus background element', async () => {
    // Act: Render the page
    const pageElement = await RitualPage();
    const { container } = render(<ToastProvider>{pageElement}</ToastProvider>);

    // Assert: Papyrus background div is present
    const papyrusBackground = container.querySelector('.papyrus-bg');
    expect(papyrusBackground).toBeInTheDocument();
    expect(papyrusBackground).toHaveAttribute('aria-hidden', 'true');
  });

  /**
   * Verify that the mist overlay element is rendered.
   */
  it('renders the mist overlay element', async () => {
    // Act: Render the page
    const pageElement = await RitualPage();
    const { container } = render(<ToastProvider>{pageElement}</ToastProvider>);

    // Assert: Mist overlay div is present
    const mistOverlay = container.querySelector('.mist-overlay');
    expect(mistOverlay).toBeInTheDocument();
    expect(mistOverlay).toHaveAttribute('aria-hidden', 'true');
  });
});
