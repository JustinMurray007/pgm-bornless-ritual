// PGM IV. 154-285 — The Vessel Inquiry (Lekanomanteia)
// Lines prefixed with § are "vox lines" — rendered with a play button.
// Plain lines are flowing prose, each word is individually speakable on hover/click.
//
// Each section has:
//   original:    the Greek source text (shown large, primary)
//   translation: English translation (shown beneath Greek, italic)
//   body:        phonetic reconstruction (interactive, speakable)

import type { PhoneticSection } from './phoneticScript';

export const VESSEL_SCRIPT: PhoneticSection[] = [
  {
    slug: 'vi-preparation',
    title: 'Preparation of the Vessel',
    sort_order: 1,
    original: `Λαβὼν λεκάνην καινὴν ἐπίχεε ὕδωρ καθαρόν, καὶ κατάθες ἐπὶ τοῦ ἐδάφους. Στῆθι δὲ πρὸς ἀνατολὰς καὶ εἰπὲ τὴν ἐπίκλησιν ταύτην ἐπὶ τοῦ ὕδατος.`,
    translation: `Take a new vessel and pour pure water into it, and set it down upon the ground. Stand facing east and speak this invocation over the water.`,
    body: `LAH-von leh-KAH-nayn KAY-nayn eh-PEE-kheh-eh HEE-dor kah-thah-RON, keh KAH-tah-thes eh-PEE too EH-dah-foos. STAY-thee deh pros ah-nah-toh-LAS keh EE-peh tayn eh-PEE-klay-seen TAF-tayn eh-PEE too HEE-dah-tos.`,
  },
  {
    slug: 'vi-solar-invocation',
    title: 'The Solar Invocation',
    sort_order: 2,
    original: `Ἐπικαλοῦμαί σε, τὸν μέγιστον θεὸν Ἥλιον, τὸν φωτίζοντα πᾶσαν τὴν οἰκουμένην, τὸν ἀνατέλλοντα ἀπ' ἀνατολῶν καὶ δύνοντα ἐπὶ δυσμῶν.\nΣύ εἶ ὁ μέγας Σαραπίς, ὁ συνέχων τὸν κόσμον.\n§ΑΧΕΒΥΚΡΩΜ ΡΟΙΧΘ ΙΠΠΟΧΘΩΝ ΠΥΡΙΠΗΓΑΝΥΞ\nΣύ εἶ ὁ κύριος τοῦ φωτός, ὁ βασιλεὺς τῶν θεῶν.\n§ΑΡΒΑΘΙΑΩ ΛΑΙΛΑΜ ΣΕΣΕΓΓΕΝΒΑΡΦΑΡΑΓΓΗΣ`,
    translation: `I call upon thee, the greatest god Helios, who illuminates the whole inhabited world, who rises in the east and sets in the west.\nThou art the great Sarapis, who holds the cosmos together.\n§ACHEBYCRŌM ROICHTH HIPPOCHTHŌN PYRIPĒGANYX\nThou art the lord of light, the king of the gods.\n§ARBATHIAŌ LAILAM SESENGENBARPHARANGĒS`,
    body: `Eh-pee-kah-LOO-meh seh, ton MEH-ghees-ton theh-ON AY-lee-on, ton foh-TEE-zon-tah PAH-sahn tayn ee-koo-MEH-nayn, ton ah-nah-TEL-lon-tah ap ah-nah-toh-LON keh DEE-non-tah eh-PEE dees-MON.\nSEE ay ho MEH-ghas sah-RAH-pees, ho see-NEH-khohn ton KOS-mon.\n§ah-kheh-BEE-krom ROYKTH ee-POH-khthohn pee-ree-PAY-gah-neex\nSEE ay ho KEE-ree-os too foh-TOS, ho bah-see-LEVS ton theh-ON.\n§ar-bah-thee-AH-oh LAY-lahm seh-seng-gen-bar-fah-RANG-gays`,
  },
  {
    slug: 'vi-light-invocation',
    title: 'Invocation of the Divine Light',
    sort_order: 3,
    original: `Ἐλθέ μοι, κύριε, φωτεινὸς καὶ ἀγαθός, ὁ φωτίζων τὴν ὑπὸ γῆν καὶ τὴν ἐπὶ γῆς οἰκουμένην.\nΣύ εἶ ὁ πατὴρ τοῦ φωτός.\n§ΙΑΩ ΣΑΒΑΩΘ ΑΔΩΝΑΙ ΑΒΡΑΣΑΞ\nΦάνηθί μοι ἐν τῷ ὕδατι τούτῳ καὶ ἀποκάλυψόν μοι τὴν ἀλήθειαν.\n§ΦΡΗΝ ΦΡΗΝ ΒΑΙΝΧΩΩΩΧ`,
    translation: `Come to me, lord, luminous and good, who illuminates the world below the earth and the world above the earth.\nThou art the father of light.\n§IAŌ SABAŌTH ADŌNAI ABRASAX\nAppear to me in this water and reveal to me the truth.\n§PHRĒN PHRĒN BAINCHŌŌŌCH`,
    body: `el-THEH moy, KEE-ree-eh, foh-teh-NOS keh ah-gah-THOS, ho foh-TEE-zon tayn ee-POH geen keh tayn eh-PEE gays ee-koo-MEH-nayn.\nSEE ay ho pah-TAYR too foh-TOS.\n§ee-ah-OH sah-bah-OTE ah-doh-NYE ah-brah-SAX\nFAH-nay-thee moy en toh HEE-dah-tee TOO-toh keh ah-poh-KAH-leep-son moy tayn ah-LAY-theh-ahn.\n§FRAYN FRAYN bah-een-KHOH-oh-okh`,
  },
  {
    slug: 'vi-boy-medium',
    title: 'The Boy Medium',
    sort_order: 4,
    original: `Παιδίον ἀγαθὸν κάθισον ἐπὶ τοῦ ἐδάφους πρὸ τῆς λεκάνης. Κάλυψον τοὺς ὀφθαλμοὺς αὐτοῦ καὶ εἰπὲ εἰς τὸ οὖς αὐτοῦ·\n§ΕΡΒΗΘ ΛΕΡΘΕΞΑΝΑΞ ΑΒΛΑΝΑΘΑΝΑΛΒΑ ΑΚΡΑΜΜΑΧΑΜΑΡΕΙ\nΚαὶ ἐρώτα αὐτὸν ὅ τι βούλει μαθεῖν. Ὁ θεὸς ἀποκρινεῖται διὰ τοῦ παιδίου.`,
    translation: `Seat a good boy upon the ground before the vessel. Cover his eyes and speak into his ear:\n§ERBĒTH LERTHEXANAX ABLANATHANALBA AKRAMMACHAMAREI\nAnd ask him whatever you wish to learn. The god will answer through the boy.`,
    body: `peh-DEE-on ah-gah-THON KAH-thee-son eh-PEE too EH-dah-foos pro tays leh-KAH-nays. KAH-leep-son toos of-thal-MOOS af-TOO keh EE-peh ees toh OOS af-TOO:\n§er-BAYTH ler-thex-AH-nax ah-blah-nah-thah-NAL-bah ah-kram-mah-khah-MAH-ray\nKeh eh-ROH-tah af-TON ho tee BOO-lay mah-THAYN. Ho theh-OS ah-poh-kree-NAY-teh dee-AH too peh-DEE-oo.`,
  },
  {
    slug: 'vi-names-of-power',
    title: 'The Names of Power',
    sort_order: 5,
    original: `Ταῦτά ἐστιν τὰ ὀνόματα τοῦ θεοῦ τοῦ μεγάλου, ἃ δεῖ λέγειν ἐπὶ τοῦ ὕδατος·\n§ΑΧΕΒΥΚΡΩΜ ΡΟΙΧΘ ΙΠΠΟΧΘΩΝ ΠΥΡΙΠΗΓΑΝΥΞ ΙΠΠΟΧΘΩΝ ΠΥΡΙΠΗΓΑΝΥΞ\n§ΜΑΣΚΕΛΛΙ ΜΑΣΚΕΛΛΩ ΦΝΟΥΚΕΝΤΑΒΑΩ ΟΡΕΟΒΑΖΑΓΡΑ ΡΗΞΙΧΘΩΝ ΙΠΠOΧΘΩΝ ΠΥΡΙΠΗΓΑΝΥΞ\nΛέγε δὲ ταῦτα ἑπτάκις πρὸς ἀνατολάς, ἑπτάκις πρὸς δυσμάς.`,
    translation: `These are the names of the great god, which must be spoken over the water:\n§ACHEBYCRŌM ROICHTH HIPPOCHTHŌN PYRIPĒGANYX HIPPOCHTHŌN PYRIPĒGANYX\n§MASKELLI MASKELLŌ PHNOUKENNTABAŌ OREOBAZAGRA RĒXICHTHŌN HIPPOCHTHŌN PYRIPĒGANYX\nSpeak these seven times toward the east, seven times toward the west.`,
    body: `TAF-tah EH-steen tah oh-NOH-mah-tah too theh-OO too meh-GAH-loo, hah day LEH-gheen eh-PEE too HEE-dah-tos:\n§ah-kheh-BEE-krom ROYKTH ee-POH-khthohn pee-ree-PAY-gah-neex ee-POH-khthohn pee-ree-PAY-gah-neex\n§mas-KEL-lee mas-KEL-loh fnoo-ken-tah-BAH-oh oh-reh-oh-bah-ZAH-grah ray-XEEKH-thohn ee-POH-khthohn pee-ree-PAY-gah-neex\nLEH-gheh deh TAF-tah hep-TAH-kees pros ah-nah-toh-LAS, hep-TAH-kees pros dees-MAS.`,
  },
  {
    slug: 'vi-dismissal',
    title: 'The Dismissal',
    sort_order: 6,
    original: `Ὅταν δὲ θέλῃς ἀπολῦσαι τὸν θεόν, εἰπὲ οὕτως·\nΑπελθε, κύριε, εἰς τὸν σὸν τόπον, εἰς τὸν σὸν κόσμον, εἰς τὴν σὴν τάξιν.\n§ΧΑΙΡΕ ΘΕΟΣ ΜΕΓΙΣΤΕ ΗΛΙΕ ΑΒΡΑΣΑΞ\nΚαὶ ἐκχέε τὸ ὕδωρ εἰς τὴν γῆν.`,
    translation: `When you wish to dismiss the god, speak thus:\nDepart, lord, to your own place, to your own cosmos, to your own order.\n§CHAIRE THEOS MEGISTE HĒLIE ABRASAX\nAnd pour the water out upon the earth.`,
    body: `HOH-tahn deh THEH-lay ah-poh-LEE-seh ton theh-ON, EE-peh HOO-tohs:\nah-PEL-theh, KEE-ree-eh, ees ton son TOH-pon, ees ton son KOS-mon, ees tayn sayn TAX-een.\n§KHAY-reh theh-OS meh-GHEES-teh AY-lee-eh ah-brah-SAX\nKeh ek-KHEH-eh toh HEE-dor ees tayn GAYN.`,
  },
];
