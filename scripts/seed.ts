/**
 * Seed script for the PGM Bornless Ritual database.
 *
 * IMPORTANT: The Supabase tables must be created manually in the Supabase
 * dashboard (or via migrations) before running this script.
 *
 * SQL DDL:
 *
 -- ritual_sections table
 CREATE TABLE IF NOT EXISTS ritual_sections (
 id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 slug        TEXT NOT NULL UNIQUE,
 title       TEXT NOT NULL,
 body        TEXT NOT NULL,
 sort_order  INTEGER NOT NULL,
 created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
 );
 
 -- phonetic_mappings table
 CREATE TABLE IF NOT EXISTS phonetic_mappings (
 id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 original    TEXT NOT NULL UNIQUE,
 phonetic    TEXT NOT NULL,
 created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
 );
 
 -- usage_logs table
 CREATE TABLE IF NOT EXISTS usage_logs (
 id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 vox_magica   TEXT NOT NULL,
 session_id   UUID NOT NULL,
 triggered_at TIMESTAMPTZ NOT NULL DEFAULT now()
 );
 
 CREATE INDEX IF NOT EXISTS usage_logs_vox_magica_idx ON usage_logs (vox_magica);
 CREATE INDEX IF NOT EXISTS usage_logs_session_id_idx ON usage_logs (session_id);
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and ' +
      'SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Ritual sections — PGM V. 96-172 (Stele of Jeu the Hieroglyphist)
// Original Greek text. Lines prefixed with § are "vox lines" — rendered with a play button.
// ---------------------------------------------------------------------------

const ritualSections = [
  {
    slug: 'opening',
    title: 'The Opening',
    sort_order: 1,
    body: 'Σὲ καλῶ, τὸν Ἀκέφαλον, τὸν κτίσαντα γῆν καὶ οὐρανόν, τὸν κτίσαντα νύκτα καὶ ἡμέραν, σὲ τὸν κτίσαντα φῶς καὶ σκότος. Σὺ εἶ Ὀσοροννωφρις, ὃν οὐδεὶς εἶδε πώποτε.\n§Σὺ εἶ ΙΑΒΑΣ!\n§Σὺ εἶ ΙΑΠΩΣ!\nΣὺ διέκρινας τὸ δίκαιον καὶ τὸ ἄδικον. Σὺ ἐποίησας θῆλυ καὶ ἄρρεν. Σὺ ἔδειξας σπορὰν καὶ καρπούς. Σὺ ἐποίησας τοὺς ἀνθρώπους ἀλληλοφιλεῖν καὶ ἀλληλομισεῖν.',
  },
  {
    slug: 'moses_invocation',
    title: 'The Invocation of Moses',
    sort_order: 2,
    body: 'Ἐγώ εἰμι Μοϋσῆς ὁ προφήτης σου, ᾧ παρέδωκας τὰ μυστήριά σου τὰ συντελούμενα Ἰστραήλ. Σὺ ἔδειξας ὑγρὸν καὶ ξηρὸν καὶ πᾶσαν τροφήν.\nἘπάκουσόν μου!\nἘγώ εἰμι ἄγγελος τοῦ Φαπρω Ὀσοροννωφρις. Τοῦτό ἐστιν σοῦ τὸ ὄνομα τὸ ἀληθινὸν τὸ παραδιδόμενον τοῖς προφήταις Ἰστραήλ.\nἘπάκουσόν μου·\n§ΑΡΒΑΘΙΑΩ ΡΕΙΒΕΤ ΑΘΕΛΕΒΕΡΣΗΘ ΑΡΑ ΒΛΑΘΑ ΑΛΒΕΥ ΕΒΕΝΦΧΙ ΧΙΤΑΣΓΟΗ ΙΒ ΑΩΘ ΙΑΩ\nΕἰσάκουσόν μου καὶ ἀποστρεψον τὸ δαιμόνιον τοῦτο.',
  },
  {
    slug: 'headless_invocation',
    title: 'The Headless Invocation',
    sort_order: 3,
    body: 'Ἐπικαλοῦμαί σε, τὸν ἐν τῷ κενῷ πνεύματι δεινὸν καὶ ἀόρατον θεὸν·\n§ΑΡΟΓΟΓΟΡΟΒΡΑΩ ΣΟΧΟΥ ΜΟΔΟΡΙΩ ΦΑΛΑΡΧΑΩ ΟΟΟ\nἍγιε Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΡΟΥΒΡΙΑΩ ΜΑΡΙ ΩΔΑΜ ΒΑΑΒΝΑΒΑΩΘ ΑΣΣ ΑΔΩΝΑΙ ΑΦΝΙΑΩ ΙΘΩΛΗΘ ΑΒΡΑΣΑΞ ΑΗΩΩΥ\nἸσχυρὲ Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΜΑΒΑΡΡΑΙΩ ΙΟΗΛ ΚΟΘΑ ΑΘΟΡΗΒΑΛΩ ΑΒΡΑΩΘ\nἈπάλλαξον τὸν δεῖνα·\n§ΑΩΘ ΑΒΑΩΘ ΒΑΣΥΜ ΙΣΑΚ ΣΑΒΑΩΘ ΙΑΩ',
  },
  {
    slug: 'lord_of_gods',
    title: 'Lord of the Gods',
    sort_order: 4,
    body: 'Οὗτος ἐστιν ὁ κύριος τῶν θεῶν. Οὗτος ἐστιν ὁ κύριος τῆς οἰκουμένης. Οὗτος ἐστιν ὂν οἱ ἄνεμοι φοβοῦνται. Οὗτος ἐστιν ὁ ποιήσας φωνῆς προστάγματι ἑαυτοῦ πάντα.\nΚύριε! Βασιλεῦ! Δυνάστα! Βοηθέ! Σῶσον ψυχὴν·\n§ΙΕΟΥ ΠΥΡ ΙΟΥ ΠΥΡ ΙΑΩΤ ΙΑΗΩ ΙΟΟΥ ΑΒΡΑΣΑΞ ΣΑΒΡΙΑΜ ΟΟ ΥΥ ΕΥ ΟΟ ΥΥ ΑΔΩΝΑΙ\nΕΗδη εδη, εὐαγγελος τοῦ θεοῦ·\n§ΑΝΛΑΛΑ ΛΑΙ ΓΑΙΑ ΑΠΑ ΔΙΑΧΑΝΝΑ ΧΟΡΥΝ',
  },
  {
    slug: 'self_identification',
    title: 'The Self-Identification',
    sort_order: 5,
    body: 'Ἐγώ εἰμι ὁ Ἀκέφαλος Δαίμων, ἐν τοῖς ποσὶν ἔχων τὴν ὅρασιν, Ἰσχυρὸς, ὁ ἔχων τὸ πῦρ τὸ ἀθάνατον. Ἐγώ εἰμι ἡ Ἀλήθεια, ὁ μισῶν ἀδικήματα γίνεσθαι ἐν τῷ κόσμῳ. Ἐγώ εἰμι ὁ ἀστράπτων καὶ βροντῶν. Ἐγώ εἰμι οὗ ἐστιν ὁ ἱδρὼς ὄμβρος ἐπιπίπτων ἐπὶ τὴν γῆν ἵνα ὀχεύῃ. Ἐγώ εἰμι οὗ τὸ στόμα καίεται δι\' ὅλου. Ἐγώ εἰμι ὁ γεννῶν καὶ ἀπογεννῶν. Ἐγώ εἰμι ἡ Χάρις τοῦ Αἰῶνος, ὄνομά μοι καρδία περιεζωσμένη ὄφιν.\n§Ἔξελθε καὶ ἀκολούθησον.',
  },
];

// ---------------------------------------------------------------------------
// Phonetic mappings — voces magicae from PGM V. 96-172 (Greek text)
// ---------------------------------------------------------------------------

const phoneticMappings = [
  // Core voces magicae
  { original: 'ΙΑΩ',              phonetic: 'ee-ah-oh' },
  { original: 'ΣΑΒΑΩΘ',           phonetic: 'sah-bah-oat' },
  { original: 'ΑΔΩΝΑΙ',           phonetic: 'ah-doh-nye' },
  { original: 'ΑΒΡΑΣΑΞ',          phonetic: 'ah-brah-sax' },
  { original: 'ΑΩΘ',              phonetic: 'ah-ote' },
  { original: 'ΑΒΑΩΘ',            phonetic: 'ah-bah-ote' },
  { original: 'ΑΒΡΑΩΘ',           phonetic: 'ah-brah-ote' },
  { original: 'ΒΑΣΥΜ',            phonetic: 'bah-soom' },
  { original: 'ΙΣΑΚ',             phonetic: 'ee-sahk' },
  // Opening voces magicae
  { original: 'ΙΑΒΑΣ',            phonetic: 'ee-ah-bahs' },
  { original: 'ΙΑΠΩΣ',            phonetic: 'ee-ah-pohs' },
  // Moses invocation barbarous names
  { original: 'ΑΡΒΑΘΙΑΩ',         phonetic: 'ar-bah-thee-ah-oh' },
  { original: 'ΡΕΙΒΕΤ',           phonetic: 'ray-bet' },
  { original: 'ΑΘΕΛΕΒΕΡΣΗΘ',      phonetic: 'ah-theh-leh-ber-seth' },
  { original: 'ΑΡΑ',              phonetic: 'ah-rah' },
  { original: 'ΒΛΑΘΑ',            phonetic: 'blah-thah' },
  { original: 'ΑΛΒΕΥ',            phonetic: 'al-bev' },
  { original: 'ΕΒΕΝΦΧΙ',          phonetic: 'eh-ben-fkhee' },
  { original: 'ΧΙΤΑΣΓΟΗ',         phonetic: 'khee-tahs-goh-ay' },
  { original: 'ΙΒ',               phonetic: 'eeb' },
  // Headless invocation barbarous names
  { original: 'ΑΡΟΓΟΓΟΡΟΒΡΑΩ',    phonetic: 'ah-roh-goh-goh-roh-brah-oh' },
  { original: 'ΣΟΧΟΥ',            phonetic: 'soh-khoo' },
  { original: 'ΜΟΔΟΡΙΩ',          phonetic: 'moh-doh-ree-oh' },
  { original: 'ΦΑΛΑΡΧΑΩ',         phonetic: 'fah-lar-khah-oh' },
  { original: 'ΟΟΟ',              phonetic: 'oh-oh-oh' },
  { original: 'ΡΟΥΒΡΙΑΩ',         phonetic: 'roo-bree-ah-oh' },
  { original: 'ΜΑΡΙ',             phonetic: 'mah-ree' },
  { original: 'ΩΔΑΜ',             phonetic: 'oh-dahm' },
  { original: 'ΒΑΑΒΝΑΒΑΩΘ',       phonetic: 'bah-ab-nah-bah-ote' },
  { original: 'ΑΣΣ',              phonetic: 'ahss' },
  { original: 'ΑΦΝΙΑΩ',           phonetic: 'af-nee-ah-oh' },
  { original: 'ΙΘΩΛΗΘ',           phonetic: 'ee-thoh-layth' },
  { original: 'ΑΗΩΩΥ',            phonetic: 'ah-ay-oh-oh-oo' },
  { original: 'ΜΑΒΑΡΡΑΙΩ',        phonetic: 'mah-bar-rah-ee-oh' },
  { original: 'ΙΟΗΛ',             phonetic: 'ee-oh-ayl' },
  { original: 'ΚΟΘΑ',             phonetic: 'koh-thah' },
  { original: 'ΑΘΟΡΗΒΑΛΩ',        phonetic: 'ah-thoh-ray-bah-loh' },
  // Lord of the Gods voces magicae
  { original: 'ΙΕΟΥ',             phonetic: 'ee-eh-oo' },
  { original: 'ΠΥΡ',              phonetic: 'peer' },
  { original: 'ΙΟΥ',              phonetic: 'ee-oo' },
  { original: 'ΙΑΩΤ',             phonetic: 'ee-ah-oat' },
  { original: 'ΙΑΗΩ',             phonetic: 'ee-ah-ay-oh' },
  { original: 'ΙΟΟΥ',             phonetic: 'ee-oh-oo' },
  { original: 'ΣΑΒΡΙΑΜ',          phonetic: 'sah-bree-ahm' },
  { original: 'ΟΟ',               phonetic: 'oh-oh' },
  { original: 'ΥΥ',               phonetic: 'oo-oo' },
  { original: 'ΕΥ',               phonetic: 'ev' },
  { original: 'ΑΝΛΑΛΑ',           phonetic: 'an-lah-lah' },
  { original: 'ΛΑΙ',              phonetic: 'lah-ee' },
  { original: 'ΓΑΙΑ',             phonetic: 'gah-ee-ah' },
  { original: 'ΑΠΑ',              phonetic: 'ah-pah' },
  { original: 'ΔΙΑΧΑΝΝΑ',         phonetic: 'dee-ah-khan-nah' },
  { original: 'ΧΟΡΥΝ',            phonetic: 'khoh-reen' },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Seeding ritual_sections…');
  const { error: sectionsError } = await supabase
    .from('ritual_sections')
    .upsert(ritualSections, { onConflict: 'slug' });

  if (sectionsError) {
    console.error('Failed to upsert ritual_sections:', sectionsError.message);
    process.exit(1);
  }
  console.log(`  ✓ ${ritualSections.length} ritual sections upserted.`);

  console.log('Seeding phonetic_mappings…');
  const { error: phoneticsError } = await supabase
    .from('phonetic_mappings')
    .upsert(phoneticMappings, { onConflict: 'original' });

  if (phoneticsError) {
    console.error(
      'Failed to upsert phonetic_mappings:',
      phoneticsError.message
    );
    process.exit(1);
  }
  console.log(`  ✓ ${phoneticMappings.length} phonetic mappings upserted.`);

  console.log('Seed complete.');
}

main();
