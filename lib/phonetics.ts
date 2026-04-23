import { PhoneticMap } from './types';

// Phonetic mappings for the voces magicae and key Greek terms in PGM V. 96-172.
// These are used to drive ElevenLabs TTS with accurate ancient pronunciation.
// Keys must exactly match tokens as they appear in the ritual body text.
export const FALLBACK_PHONETICS: PhoneticMap = {
  // ── Core voces magicae (original spec) ──────────────────────────────────
  'IAŌ':              'ee-ah-oh',
  'ΙΑΩ':              'ee-ah-oh',
  'SABAŌTH':          'sah-bah-oat',
  'ΣΑΒΑΩΘ':           'sah-bah-oat',
  'ADŌNAI':           'ah-doh-nye',
  'ΑΔΩΝΑΙ':           'ah-doh-nye',
  'ABRASAX':          'ah-brah-sax',
  'ΑΒΡΑΣΑΞ':          'ah-brah-sax',
  'AŌTH':             'ah-ote',
  'ΑΩΘ':              'ah-ote',
  'ABRAŌTH':          'ah-brah-ote',
  'ΑΒΡΑΩΘ':           'ah-brah-ote',
  'BASUM':            'bah-soom',
  'ΒΑΣΥΜ':            'bah-soom',
  'ISAK':             'ee-sahk',
  'ΙΣΑΚ':             'ee-sahk',

  // ── Opening voces magicae ────────────────────────────────────────────────
  'ΙΑΒΑΣ':            'ee-ah-bahs',
  'ΙΑΠΩΣ':            'ee-ah-pohs',

  // ── Moses invocation barbarous names ────────────────────────────────────
  'ΑΡΒΑΘΙΑΩ':         'ar-bah-thee-ah-oh',
  'ΡΕΙΒΕΤ':           'ray-bet',
  'ΑΘΕΛΕΒΕΡΣΗΘ':      'ah-theh-leh-ber-seth',
  'ΑΡΑ':              'ah-rah',
  'ΒΛΑΘΑ':            'blah-thah',
  'ΑΛΒΕΥ':            'al-bev',
  'ΕΒΕΝΦΧΙ':          'eh-ben-fkhee',
  'ΧΙΤΑΣΓΟΗ':         'khee-tahs-goh-ay',
  'ΙΒ':               'eeb',
  'ΑΒΑΩΘ':            'ah-bah-ote',

  // ── Headless invocation barbarous names ─────────────────────────────────
  'ΑΡΟΓΟΓΟΡΟΒΡΑΩ':    'ah-roh-goh-goh-roh-brah-oh',
  'ΣΟΧΟΥ':            'soh-khoo',
  'ΜΟΔΟΡΙΩ':          'moh-doh-ree-oh',
  'ΦΑΛΑΡΧΑΩ':         'fah-lar-khah-oh',
  'ΟΟΟ':              'oh-oh-oh',
  'ΡΟΥΒΡΙΑΩ':         'roo-bree-ah-oh',
  'ΜΑΡΙ':             'mah-ree',
  'ΩΔΑΜ':             'oh-dahm',
  'ΒΑΑΒΝΑΒΑΩΘ':       'bah-ab-nah-bah-ote',
  'ΑΣΣ':              'ahss',
  'ΑΦΝΙΑΩ':           'af-nee-ah-oh',
  'ΙΘΩΛΗΘ':           'ee-thoh-layth',
  'ΑΗΩΩΥ':            'ah-ay-oh-oh-oo',
  'ΜΑΒΑΡΡΑΙΩ':        'mah-bar-rah-ee-oh',
  'ΙΟΗΛ':             'ee-oh-ayl',
  'ΚΟΘΑ':             'koh-thah',
  'ΑΘΟΡΗΒΑΛΩ':        'ah-thoh-ray-bah-loh',

  // ── Lord of the Gods voces magicae ───────────────────────────────────────
  'ΙΕΟΥ':             'ee-eh-oo',
  'ΠΥΡ':              'peer',
  'ΙΟΥ':              'ee-oo',
  'ΙΑΩΤ':             'ee-ah-oat',
  'ΙΑΗΩ':             'ee-ah-ay-oh',
  'ΙΟΟΥ':             'ee-oh-oo',
  'ΣΑΒΡΙΑΜ':          'sah-bree-ahm',
  'ΟΟ':               'oh-oh',
  'ΥΥ':               'oo-oo',
  'ΕΥ':               'ev',
  'ΑΝΛΑΛΑ':           'an-lah-lah',
  'ΛΑΙ':              'lah-ee',
  'ΓΑΙΑ':             'gah-ee-ah',
  'ΑΠΑ':              'ah-pah',
  'ΔΙΑΧΑΝΝΑ':         'dee-ah-khan-nah',
  'ΧΟΡΥΝ':            'khoh-reen',

  // ── Self-identification closing ──────────────────────────────────────────
  'Ἔξελθε':           'ex-el-theh',
  'ἀκολούθησον':      'ah-koh-loo-thay-son',
};
