export interface RitualSection {
  id: string;
  slug: string;
  title: string;
  body: string;
  sort_order: number;
  translation?: string; // optional English translation shown in expandable bubble
}

export interface PhoneticMapping {
  id: string;
  original: string;
  phonetic: string;
}

export type PhoneticMap = Record<string, string>;

export interface UsageLog {
  vox_magica: string;
  session_id: string;
  triggered_at: string;
}
