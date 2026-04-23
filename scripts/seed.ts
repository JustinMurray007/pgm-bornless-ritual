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
  // ── Common Greek words (prose) ──────────────────────────────────────────
  { original: 'Σὲ',               phonetic: 'seh' },
  { original: 'σὲ',               phonetic: 'seh' },
  { original: 'καλῶ',             phonetic: 'kah-loh' },
  { original: 'τὸν',              phonetic: 'ton' },
  { original: 'τὸ',               phonetic: 'to' },
  { original: 'τῷ',               phonetic: 'toh' },
  { original: 'τὴν',              phonetic: 'tayn' },
  { original: 'τῆς',              phonetic: 'tays' },
  { original: 'τῶν',              phonetic: 'tone' },
  { original: 'τοῦ',              phonetic: 'too' },
  { original: 'τοῖς',             phonetic: 'tois' },
  { original: 'τοὺς',             phonetic: 'toos' },
  { original: 'τὰ',               phonetic: 'tah' },
  { original: 'Ἀκέφαλον',         phonetic: 'ah-keh-fah-lon' },
  { original: 'Ἀκέφαλε',          phonetic: 'ah-keh-fah-leh' },
  { original: 'Ἀκέφαλος',         phonetic: 'ah-keh-fah-los' },
  { original: 'κτίσαντα',         phonetic: 'ktee-sahn-tah' },
  { original: 'γῆν',              phonetic: 'gayn' },
  { original: 'γῆ',               phonetic: 'gay' },
  { original: 'καὶ',              phonetic: 'keh' },
  { original: 'οὐρανόν',          phonetic: 'oo-rah-non' },
  { original: 'νύκτα',            phonetic: 'neek-tah' },
  { original: 'ἡμέραν',           phonetic: 'hay-meh-rahn' },
  { original: 'φῶς',              phonetic: 'fohs' },
  { original: 'σκότος',           phonetic: 'skoh-tos' },
  { original: 'Σὺ',               phonetic: 'soo' },
  { original: 'σὺ',               phonetic: 'soo' },
  { original: 'σου',              phonetic: 'soo' },
  { original: 'σοῦ',              phonetic: 'soo' },
  { original: 'εἶ',               phonetic: 'ay' },
  { original: 'Ὀσοροννωφρις',     phonetic: 'oh-soh-ron-noh-frees' },
  { original: 'ὃν',               phonetic: 'hon' },
  { original: 'οὗ',               phonetic: 'hoo' },
  { original: 'οὐδεὶς',           phonetic: 'oo-dees' },
  { original: 'εἶδε',             phonetic: 'ay-deh' },
  { original: 'πώποτε',           phonetic: 'poh-poh-teh' },
  { original: 'διέκρινας',        phonetic: 'dee-eh-kree-nahs' },
  { original: 'δίκαιον',          phonetic: 'dee-keh-on' },
  { original: 'ἄδικον',           phonetic: 'ah-dee-kon' },
  { original: 'ἐποίησας',         phonetic: 'eh-poy-ay-sahs' },
  { original: 'θῆλυ',             phonetic: 'thay-loo' },
  { original: 'ἄρρεν',            phonetic: 'ah-ren' },
  { original: 'ἔδειξας',          phonetic: 'eh-dex-ahs' },
  { original: 'σπορὰν',           phonetic: 'spoh-rahn' },
  { original: 'καρπούς',          phonetic: 'kar-poos' },
  { original: 'ἀνθρώπους',        phonetic: 'an-throh-poos' },
  { original: 'ἀλληλοφιλεῖν',     phonetic: 'ah-lay-loh-fee-len' },
  { original: 'ἀλληλομισεῖν',     phonetic: 'ah-lay-loh-mee-sen' },
  
  // ── Moses Invocation words ──────────────────────────────────────────────
  { original: 'Ἐγώ',              phonetic: 'eh-goh' },
  { original: 'εἰμι',             phonetic: 'ay-mee' },
  { original: 'Μοϋσῆς',           phonetic: 'moh-oo-says' },
  { original: 'ὁ',                phonetic: 'ho' },
  { original: 'ἡ',                phonetic: 'hay' },
  { original: 'προφήτης',         phonetic: 'proh-fay-tays' },
  { original: 'προφήταις',        phonetic: 'proh-fay-tais' },
  { original: 'ᾧ',                phonetic: 'hoh' },
  { original: 'παρέδωκας',        phonetic: 'pah-reh-doh-kahs' },
  { original: 'μυστήριά',         phonetic: 'mee-stay-ree-ah' },
  { original: 'συντελούμενα',     phonetic: 'seen-teh-loo-meh-nah' },
  { original: 'Ἰστραήλ',          phonetic: 'ee-strah-ayl' },
  { original: 'ὑγρὸν',            phonetic: 'ee-gron' },
  { original: 'ξηρὸν',            phonetic: 'ksay-ron' },
  { original: 'πᾶσαν',            phonetic: 'pah-sahn' },
  { original: 'τροφήν',           phonetic: 'troh-fayn' },
  { original: 'Ἐπάκουσόν',        phonetic: 'eh-pah-koo-son' },
  { original: 'μου',              phonetic: 'moo' },
  { original: 'μοι',              phonetic: 'moy' },
  { original: 'ἄγγελος',          phonetic: 'ahn-geh-los' },
  { original: 'Φαπρω',            phonetic: 'fah-proh' },
  { original: 'Τοῦτό',            phonetic: 'too-toh' },
  { original: 'ἐστιν',            phonetic: 'eh-steen' },
  { original: 'ὄνομα',            phonetic: 'oh-noh-mah' },
  { original: 'ὄνομά',            phonetic: 'oh-noh-mah' },
  { original: 'ἀληθινὸν',         phonetic: 'ah-lay-thee-non' },
  { original: 'παραδιδόμενον',    phonetic: 'pah-rah-dee-doh-meh-non' },
  { original: 'Εἰσάκουσόν',       phonetic: 'ay-sah-koo-son' },
  { original: 'ἀποστρεψον',       phonetic: 'ah-poh-strep-son' },
  { original: 'δαιμόνιον',        phonetic: 'deh-moh-nee-on' },
  { original: 'δαίμονος',         phonetic: 'deh-moh-nos' },
  { original: 'Δαίμων',           phonetic: 'deh-mohn' },
  { original: 'τοῦτο',            phonetic: 'too-toh' },
  
  // ── Headless Invocation words ───────────────────────────────────────────
  { original: 'Ἐπικαλοῦμαί',      phonetic: 'eh-pee-kah-loo-meh' },
  { original: 'σε',               phonetic: 'seh' },
  { original: 'ἐν',               phonetic: 'en' },
  { original: 'κενῷ',             phonetic: 'keh-noh' },
  { original: 'πνεύματι',         phonetic: 'pnev-mah-tee' },
  { original: 'δεινὸν',           phonetic: 'day-non' },
  { original: 'δεῖνα',            phonetic: 'day-nah' },
  { original: 'ἀόρατον',          phonetic: 'ah-oh-rah-ton' },
  { original: 'θεὸν',             phonetic: 'theh-on' },
  { original: 'θεοῦ',             phonetic: 'theh-oo' },
  { original: 'θεῶν',             phonetic: 'theh-ohn' },
  { original: 'Ἅγιε',             phonetic: 'hah-gee-eh' },
  { original: 'Ἀπάλλαξον',        phonetic: 'ah-pahl-lah-kson' },
  { original: 'ἀπὸ',              phonetic: 'ah-poh' },
  { original: 'συνέχοντος',       phonetic: 'see-neh-khon-tos' },
  { original: 'αὐτὸν',            phonetic: 'ahf-ton' },
  { original: 'Ἰσχυρὲ',           phonetic: 'ee-skhee-reh' },
  { original: 'Ἰσχυρὸς',          phonetic: 'ee-skhee-ros' },
  
  // ── Lord of the Gods words ──────────────────────────────────────────────
  { original: 'Οὗτος',            phonetic: 'hoo-tos' },
  { original: 'κύριος',           phonetic: 'kee-ree-os' },
  { original: 'Κύριε',            phonetic: 'kee-ree-eh' },
  { original: 'οἰκουμένης',       phonetic: 'oy-koo-meh-nays' },
  { original: 'ὂν',               phonetic: 'on' },
  { original: 'οἱ',               phonetic: 'hoy' },
  { original: 'ἄνεμοι',           phonetic: 'ah-neh-moy' },
  { original: 'φοβοῦνται',        phonetic: 'foh-boon-teh' },
  { original: 'ποιήσας',          phonetic: 'poy-ay-sahs' },
  { original: 'φωνῆς',            phonetic: 'foh-nays' },
  { original: 'προστάγματι',      phonetic: 'proh-stahg-mah-tee' },
  { original: 'ἑαυτοῦ',           phonetic: 'heh-ahf-too' },
  { original: 'πάντα',            phonetic: 'pahn-tah' },
  { original: 'Βασιλεῦ',          phonetic: 'bah-see-lev' },
  { original: 'Δυνάστα',          phonetic: 'dee-nah-stah' },
  { original: 'Βοηθέ',            phonetic: 'boh-ay-theh' },
  { original: 'Σῶσον',            phonetic: 'soh-son' },
  { original: 'ψυχὴν',            phonetic: 'psee-khayn' },
  { original: 'ΕΗδη',             phonetic: 'ay-ay-day' },
  { original: 'εδη',              phonetic: 'eh-day' },
  { original: 'εὐαγγελος',        phonetic: 'ev-ahn-geh-los' },
  
  // ── Self-Identification words ───────────────────────────────────────────
  { original: 'ποσὶν',            phonetic: 'poh-seen' },
  { original: 'ἔχων',             phonetic: 'eh-khohn' },
  { original: 'ὅρασιν',           phonetic: 'hoh-rah-seen' },
  { original: 'πῦρ',              phonetic: 'peer' },
  { original: 'ἀθάνατον',         phonetic: 'ah-thah-nah-ton' },
  { original: 'Ἀλήθεια',          phonetic: 'ah-lay-thay-ah' },
  { original: 'μισῶν',            phonetic: 'mee-sohn' },
  { original: 'ἀδικήματα',        phonetic: 'ah-dee-kay-mah-tah' },
  { original: 'γίνεσθαι',         phonetic: 'gee-neh-stheh' },
  { original: 'κόσμῳ',            phonetic: 'koz-moh' },
  { original: 'ἀστράπτων',        phonetic: 'ah-strahp-tohn' },
  { original: 'βροντῶν',          phonetic: 'bron-tohn' },
  { original: 'ἱδρὼς',            phonetic: 'hee-drohs' },
  { original: 'ὄμβρος',           phonetic: 'om-bros' },
  { original: 'ἐπιπίπτων',        phonetic: 'eh-pee-peep-tohn' },
  { original: 'ἐπὶ',              phonetic: 'eh-pee' },
  { original: 'ἵνα',              phonetic: 'hee-nah' },
  { original: 'ὀχεύῃ',            phonetic: 'oh-khev-ay' },
  { original: 'στόμα',            phonetic: 'stoh-mah' },
  { original: 'καίεται',          phonetic: 'keh-eh-teh' },
  { original: 'δι\'',             phonetic: 'dee' },
  { original: 'ὅλου',             phonetic: 'hoh-loo' },
  { original: 'γεννῶν',           phonetic: 'geh-nohn' },
  { original: 'ἀπογεννῶν',        phonetic: 'ah-poh-geh-nohn' },
  { original: 'Χάρις',            phonetic: 'khah-rees' },
  { original: 'Αἰῶνος',           phonetic: 'eh-oh-nos' },
  { original: 'καρδία',           phonetic: 'kar-dee-ah' },
  { original: 'περιεζωσμένη',     phonetic: 'peh-ree-eh-zoh-smeh-nay' },
  { original: 'ὄφιν',             phonetic: 'oh-feen' },
  { original: 'Ἔξελθε',           phonetic: 'ex-el-theh' },
  { original: 'ἀκολούθησον',      phonetic: 'ah-koh-loo-thay-son' },
  
  // ── Core voces magicae ──────────────────────────────────────────────────
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
