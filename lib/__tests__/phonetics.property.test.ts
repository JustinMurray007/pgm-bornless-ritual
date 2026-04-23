// Feature: pgm-bornless-ritual, Property 2: Phonetic mapping completeness
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import type { PhoneticMapping } from '../types';

/**
 * Property 2: Phonetic mapping records are structurally complete
 * Validates: Requirements 3.1
 *
 * For any PhoneticMapping record returned by Supabase or present in the
 * fallback set, the record SHALL have a non-empty `id`, a non-empty `original`
 * string, and a non-empty `phonetic` string.
 */
describe('Property 2: Phonetic mapping records are structurally complete', () => {
  it('all three fields (id, original, phonetic) are non-empty strings for any valid PhoneticMapping', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          original: fc.string({ minLength: 1 }),
          phonetic: fc.string({ minLength: 1 }),
        }),
        (mapping: PhoneticMapping) => {
          // id must be a non-empty string
          expect(typeof mapping.id).toBe('string');
          expect(mapping.id.length).toBeGreaterThan(0);

          // original must be a non-empty string
          expect(typeof mapping.original).toBe('string');
          expect(mapping.original.length).toBeGreaterThan(0);

          // phonetic must be a non-empty string
          expect(typeof mapping.phonetic).toBe('string');
          expect(mapping.phonetic.length).toBeGreaterThan(0);
        },
      ),
      { numRuns: 100 },
    );
  });
});
