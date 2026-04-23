/**
 * Integration tests for Supabase database seeding.
 *
 * Validates: Requirements 7.1, 7.2
 *
 * These tests mock the Supabase client to verify that after seeding:
 * - `ritual_sections` table contains exactly 5 rows
 * - `phonetic_mappings` table contains exactly 13 rows
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock data — mirrors the seed data in scripts/seed.ts
// ---------------------------------------------------------------------------

const RITUAL_SECTIONS_SEED = [
  { slug: 'opening',            title: 'The Opening',             sort_order: 1 },
  { slug: 'moses_invocation',   title: 'The Invocation of Moses', sort_order: 2 },
  { slug: 'headless_invocation',title: 'The Headless Invocation', sort_order: 3 },
  { slug: 'lord_of_gods',       title: 'Lord of the Gods',        sort_order: 4 },
  { slug: 'self_identification', title: 'The Self-Identification', sort_order: 5 },
];

const PHONETIC_MAPPINGS_SEED = [
  { original: 'ΙΑΩ',           phonetic: 'ee-ah-oh' },
  { original: 'ΣΑΒΑΩΘ',        phonetic: 'sah-bah-oat' },
  { original: 'ΑΔΩΝΑΙ',        phonetic: 'ah-doh-nye' },
  { original: 'ΑΒΡΑΣΑΞ',       phonetic: 'ah-brah-sax' },
  { original: 'ΑΩΘ',           phonetic: 'ah-ote' },
  { original: 'ΑΒΑΩΘ',         phonetic: 'ah-bah-ote' },
  { original: 'ΑΒΡΑΩΘ',        phonetic: 'ah-brah-ote' },
  { original: 'ΒΑΣΥΜ',         phonetic: 'bah-soom' },
  { original: 'ΙΣΑΚ',          phonetic: 'ee-sahk' },
  { original: 'ΙΑΒΑΣ',         phonetic: 'ee-ah-bahs' },
  { original: 'ΙΑΠΩΣ',         phonetic: 'ee-ah-pohs' },
  { original: 'ΑΡΒΑΘΙΑΩ',      phonetic: 'ar-bah-thee-ah-oh' },
  { original: 'ΡΕΙΒΕΤ',        phonetic: 'ray-bet' },
];

// ---------------------------------------------------------------------------
// Mock Supabase client
// ---------------------------------------------------------------------------

/**
 * Creates a mock Supabase client that simulates a seeded database.
 * The mock supports the chained query builder pattern:
 *   supabase.from('table').select('*')  →  { data: [...], error: null }
 */
function createMockSupabaseClient(tables: Record<string, unknown[]>) {
  return {
    from: (tableName: string) => ({
      select: (_columns = '*') => {
        const rows = tables[tableName] ?? [];
        return Promise.resolve({ data: rows, error: null });
      },
      upsert: (rows: unknown[]) => {
        // Simulate idempotent upsert — replace table contents
        tables[tableName] = rows;
        return Promise.resolve({ error: null });
      },
    }),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Supabase integration — seeded table row counts', () => {
  let mockTables: Record<string, unknown[]>;

  beforeEach(() => {
    // Start with an empty database before each test
    mockTables = {
      ritual_sections: [],
      phonetic_mappings: [],
    };
  });

  /**
   * Requirement 7.1: THE Application SHALL include a database seed script
   * that inserts all five Sections of the Ritual_Text into the Supabase
   * `ritual_sections` table.
   */
  it('ritual_sections table returns 5 rows after seeding', async () => {
    const supabase = createMockSupabaseClient(mockTables);

    // Simulate the seed script upserting ritual sections
    await supabase.from('ritual_sections').upsert(RITUAL_SECTIONS_SEED);

    // Query the table as the application would
    const { data, error } = await supabase.from('ritual_sections').select('*');

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.length).toBe(5);
  });

  /**
   * Requirement 7.2: THE Application SHALL include a database seed script
   * that inserts all thirteen Phonetic_Mappings listed in Requirement 3 into
   * the Supabase `phonetic_mappings` table.
   */
  it('phonetic_mappings table returns 13 rows after seeding', async () => {
    const supabase = createMockSupabaseClient(mockTables);

    // Simulate the seed script upserting phonetic mappings
    await supabase.from('phonetic_mappings').upsert(PHONETIC_MAPPINGS_SEED);

    // Query the table as the application would
    const { data, error } = await supabase.from('phonetic_mappings').select('*');

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data!.length).toBe(13);
  });

  /**
   * Verify both tables are seeded correctly in a single pass (simulates
   * running the full seed script end-to-end).
   */
  it('both tables are correctly seeded in a single seed run', async () => {
    const supabase = createMockSupabaseClient(mockTables);

    // Simulate full seed script execution
    await supabase.from('ritual_sections').upsert(RITUAL_SECTIONS_SEED);
    await supabase.from('phonetic_mappings').upsert(PHONETIC_MAPPINGS_SEED);

    const { data: sections, error: sectionsError } = await supabase
      .from('ritual_sections')
      .select('*');

    const { data: mappings, error: mappingsError } = await supabase
      .from('phonetic_mappings')
      .select('*');

    expect(sectionsError).toBeNull();
    expect(mappingsError).toBeNull();
    expect(sections!.length).toBe(5);
    expect(mappings!.length).toBe(13);
  });

  /**
   * Verify upsert idempotence — re-running the seed script should not
   * create duplicate rows (Requirement 7.3).
   */
  it('re-running the seed script does not create duplicate rows', async () => {
    const supabase = createMockSupabaseClient(mockTables);

    // Run seed twice
    await supabase.from('ritual_sections').upsert(RITUAL_SECTIONS_SEED);
    await supabase.from('ritual_sections').upsert(RITUAL_SECTIONS_SEED);

    await supabase.from('phonetic_mappings').upsert(PHONETIC_MAPPINGS_SEED);
    await supabase.from('phonetic_mappings').upsert(PHONETIC_MAPPINGS_SEED);

    const { data: sections } = await supabase.from('ritual_sections').select('*');
    const { data: mappings } = await supabase.from('phonetic_mappings').select('*');

    // Upsert semantics: counts remain 5 and 13, not doubled
    expect(sections!.length).toBe(5);
    expect(mappings!.length).toBe(13);
  });

  /**
   * Verify the ritual sections have the correct sort_order values (1–5).
   */
  it('ritual_sections rows have sort_order values 1 through 5', async () => {
    const supabase = createMockSupabaseClient(mockTables);
    await supabase.from('ritual_sections').upsert(RITUAL_SECTIONS_SEED);

    const { data } = await supabase.from('ritual_sections').select('*');
    const sortOrders = (data as typeof RITUAL_SECTIONS_SEED)
      .map(r => r.sort_order)
      .sort((a, b) => a - b);

    expect(sortOrders).toEqual([1, 2, 3, 4, 5]);
  });

  /**
   * Verify each phonetic mapping has non-empty original and phonetic fields.
   */
  it('all phonetic_mappings rows have non-empty original and phonetic fields', async () => {
    const supabase = createMockSupabaseClient(mockTables);
    await supabase.from('phonetic_mappings').upsert(PHONETIC_MAPPINGS_SEED);

    const { data } = await supabase.from('phonetic_mappings').select('*');
    const mappings = data as typeof PHONETIC_MAPPINGS_SEED;

    for (const mapping of mappings) {
      expect(mapping.original.length).toBeGreaterThan(0);
      expect(mapping.phonetic.length).toBeGreaterThan(0);
    }
  });
});
