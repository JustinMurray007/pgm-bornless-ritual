// The full phonetic reconstruction of the Bornless Ritual (PGM V. 96-172).
// Lines prefixed with § are "vox lines" — rendered with a play button.
// Plain lines are flowing prose, each word is individually speakable on hover/click.
//
// Each section has:
//   original: the Greek source text (shown above, static display)
//   body:     the phonetic reconstruction (interactive, speakable)

export interface PhoneticSection {
  slug: string;
  title: string;
  sort_order: number;
  original: string;    // Greek source text — shown large, primary
  translation: string; // English translation — shown beneath Greek, italic
  body: string;        // Phonetic reconstruction — interactive, speakable
}

export const PHONETIC_SCRIPT: PhoneticSection[] = [
  {
    slug: 'ph-opening',
    title: 'The Opening',
    sort_order: 1,
    original: `Σὲ καλῶ, τὸν Ἀκέφαλον, τὸν κτίσαντα γῆν καὶ οὐρανόν, τὸν κτίσαντα νύκτα καὶ ἡμέραν, σὲ τὸν κτίσαντα φῶς καὶ σκότος. Σὺ εἶ Ὀσοροννωφρις, ὃν οὐδεὶς εἶδε πώποτε.\n§Σὺ εἶ ΙΑΒΑΣ!\n§Σὺ εἶ ΙΑΠΩΣ!\nΣὺ διέκρινας τὸ δίκαιον καὶ τὸ ἄδικον. Σὺ ἐποίησας θῆλυ καὶ ἄρρεν. Σὺ ἔδειξας σπορὰν καὶ καρπούς. Σὺ ἐποίησας τοὺς ἀνθρώπους ἀλληλοφιλεῖν καὶ ἀλληλομισεῖν.`,
    translation: `I call upon thee, the Headless One, who created earth and heaven, who created night and day, thee who created light and darkness. Thou art Osoronnophris, whom no one has ever seen.\n§Thou art IABAS!\n§Thou art IAPOS!\nThou didst distinguish the just and the unjust. Thou didst make female and male. Thou didst reveal seed and fruits. Thou didst make men love one another and hate one another.`,
    body: `Seh kah-LOH, ton ah-KEH-fah-lon, ton ktee-SAN-tah geen keh oo-rah-NON, ton ktee-SAN-tah NEEK-tah keh hay-MEH-rahn, seh ton ktee-SAN-tah fohs keh SKOH-tos. Soo ay oh-soh-ron-NOH-frees, hon oo-DEES AY-deh POH-poh-teh.\n§Soo ay EE-ah-bahs!\n§Soo ay EE-ah-pohs!\nSoo dee-EH-kree-nahs toh DEE-keh-on keh toh AH-dee-kon. Soo eh-POY-ay-sahs THAY-loo keh AH-ren. Soo EH-dex-ahs spoh-RAHN keh kar-POOS. Soo eh-POY-ay-sahs toos an-THROH-poos ah-lay-loh-fee-LEN keh ah-lay-loh-mee-SEN.`,
  },
  {
    slug: 'ph-moses-invocation',
    title: 'The Invocation of Moses',
    sort_order: 2,
    original: `Ἐγώ εἰμι Μοϋσῆς ὁ προφήτης σου, ᾧ παρέδωκας τὰ μυστήριά σου τὰ συντελούμενα Ἰστραήλ. Σὺ ἔδειξας ὑγρὸν καὶ ξηρὸν καὶ πᾶσαν τροφήν.\nἘπάκουσόν μου!\nἘγώ εἰμι ἄγγελος τοῦ Φαπρω Ὀσοροννωφρις. Τοῦτό ἐστιν σοῦ τὸ ὄνομα τὸ ἀληθινὸν τὸ παραδιδόμενον τοῖς προφήταις Ἰστραήλ.\nἘπάκουσόν μου·\n§ΑΡΒΑΘΙΑΩ ΡΕΙΒΕΤ ΑΘΕΛΕΒΕΡΣΗΘ ΑΡΑ ΒΛΑΘΑ ΑΛΒΕΥ ΕΒΕΝΦΧΙ ΧΙΤΑΣΓΟΗ ΙΒ ΑΩΘ ΙΑΩ\nΕἰσάκουσόν μου καὶ ἀποστρεψον τὸ δαιμόνιον τοῦτο.`,
    translation: `I am Moses thy prophet, to whom thou didst commit thy mysteries, the celebrations of Israel. Thou didst reveal the moist and the dry and all nourishment.\nHearken to me!\nI am the messenger of Pharaoh Osoronnophris. This is thy true name, handed down to the prophets of Israel.\nHearken to me:\n§ARBATHIAŌ REIBET ATHELEBERSĒTH ARA BLATHA ALBEU EBENPHCHI CHITASGOĒ IB AŌTH IAŌ\nHear me and turn away this daimon.`,
    body: `Eh-GOH AY-mee moh-oo-SAYS ho proh-FAY-tays soo, oh pah-REH-doh-kahs tah moos-TAY-ree-ah soo tah soon-teh-LOO-meh-nah ees-trah-AYL. Soo EH-dex-ahs hee-GRON keh xee-RON keh PAH-sahn troh-FAN.\nEh-PAH-koo-son MOO!\nEh-GOH AY-mee AHN-geh-los too FAH-proh oh-soh-ron-NOH-frees. TOO-toh EH-steen soo toh OH-noh-mah toh ah-lay-thee-NON toh pah-rah-dee-DOH-meh-non toys proh-FAY-tays ees-trah-AYL.\nEh-PAH-koo-son moo:\n§ar-bah-thee-AH-oh RAY-bet ah-theh-leh-ber-SETH AH-rah BLAH-thah al-BEV eh-ben-FKHEE khee-tahs-GOH-ay eeb ah-OTE ee-ah-OH\nEe-SAH-koo-son moo keh ah-poh-STREP-son toh deh-MOH-nee-on TOO-toh.`,
  },
  {
    slug: 'ph-headless-invocation',
    title: 'The Headless Invocation',
    sort_order: 3,
    original: `Ἐπικαλοῦμαί σε, τὸν ἐν τῷ κενῷ πνεύματι δεινὸν καὶ ἀόρατον θεὸν·\n§ΑΡΟΓΟΓΟΡΟΒΡΑΩ ΣΟΧΟΥ ΜΟΔΟΡΙΩ ΦΑΛΑΡΧΑΩ ΟΟΟ\nἍγιε Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΡΟΥΒΡΙΑΩ ΜΑΡΙ ΩΔΑΜ ΒΑΑΒΝΑΒΑΩΘ ΑΣΣ ΑΔΩΝΑΙ ΑΦΝΙΑΩ ΙΘΩΛΗΘ ΑΒΡΑΣΑΞ ΑΗΩΩΥ\nἸσχυρὲ Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΜΑΒΑΡΡΑΙΩ ΙΟΗΛ ΚΟΘΑ ΑΘΟΡΗΒΑΛΩ ΑΒΡΑΩΘ\nἈπάλλαξον τὸν δεῖνα·\n§ΑΩΘ ΑΒΑΩΘ ΒΑΣΥΜ ΙΣΑΚ ΣΑΒΑΩΘ ΙΑΩ`,
    translation: `I call upon thee, the terrible and invisible god dwelling in the empty wind:\n§AROGŌROBRAŌ SOCHOU MODORIŌ PHALARCHAŌ OOO\nHoly Headless One! Free the subject from the daimon that restrains him:\n§ROUBRIAŌ MARI ŌDAM BAABNABAŌTH ASS ADŌNAI APHNIAŌ ITHŌLĒTH ABRASAX AĒŌŌU\nMighty Headless One! Free the subject from the daimon that restrains him:\n§MABARRAIŌ IOEL KOTHA ATHŌRĒBALŌ ABRAŌTH\nFree the subject:\n§AŌTH ABAŌTH BASYM ISAK SABAŌTH IAŌ`,
    body: `Eh-pee-kah-LOO-meh seh, ton en toh keh-NOH PNEV-mah-tee deh-NON keh ah-OH-rah-ton theh-ON:\n§ah-roh-goh-goh-roh-BRAH-oh SOH-khoo moh-doh-REE-oh fah-lar-KHAH-oh oh-oh-oh\nHAH-ghee-eh ah-KEH-fah-leh! ah-PAL-lax-on ton DEH-nah ah-POH too see-NEH-khon-tos af-TON DEH-moh-nos:\n§roo-bree-AH-oh MAH-ree OH-dahm bah-ab-nah-bah-OTE ahss ah-doh-NYE af-nee-AH-oh ee-thoh-LAYTH ah-brah-SAX ah-ay-oh-oh-OO\nEes-khee-REH ah-KEH-fah-leh! ah-PAL-lax-on ton DEH-nah ah-POH too see-NEH-khon-tos af-TON DEH-moh-nos:\n§mah-bar-rah-EE-oh ee-oh-AYL KOH-thah ah-thoh-ray-bah-LOH ah-brah-OTE\nah-PAL-lax-on ton DEH-nah:\n§ah-OTE ah-bah-OTE bah-SOOM EE-sahk sah-bah-OTE ee-ah-OH`,
  },
  {
    slug: 'ph-lord-of-gods',
    title: 'Lord of the Gods',
    sort_order: 4,
    original: `Οὗτος ἐστιν ὁ κύριος τῶν θεῶν. Οὗτος ἐστιν ὁ κύριος τῆς οἰκουμένης. Οὗτος ἐστιν ὂν οἱ ἄνεμοι φοβοῦνται. Οὗτος ἐστιν ὁ ποιήσας φωνῆς προστάγματι ἑαυτοῦ πάντα.\nΚύριε! Βασιλεῦ! Δυνάστα! Βοηθέ! Σῶσον ψυχὴν·\n§ΙΕΟΥ ΠΥΡ ΙΟΥ ΠΥΡ ΙΑΩΤ ΙΑΗΩ ΙΟΟΥ ΑΒΡΑΣΑΞ ΣΑΒΡΙΑΜ ΟΟ ΥΥ ΕΥ ΟΟ ΥΥ ΑΔΩΝΑΙ\nΕΗδη εδη, εὐαγγελος τοῦ θεοῦ·\n§ΑΝΛΑΛΑ ΛΑΙ ΓΑΙΑ ΑΠΑ ΔΙΑΧΑΝΝΑ ΧΟΡΥΝ`,
    translation: `This is the lord of the gods. This is the lord of the inhabited world. This is he whom the winds fear. This is he who made all things by the command of his voice.\nLord! King! Master! Helper! Save the soul:\n§IEOU PYR IOU PYR IAŌT IAĒŌ IOOU ABRASAX SABRIAM OO UU EU OO UU ADŌNAI\nAlready, already, messenger of god:\n§ANLALA LAI GAIA APA DIACHANNA CHORYN`,
    body: `HOO-tos EH-steen ho KEE-ree-os ton theh-ON. HOO-tos EH-steen ho KEE-ree-os tees ee-koo-MEH-nays. HOO-tos EH-steen hon hoy AH-neh-moy foh-BOON-teh. HOO-tos EH-steen ho poy-AY-sahs foh-NAYS pros-TAG-mah-tee heh-af-TOO PAN-tah.\nKEE-ree-eh! bah-see-LEV! dee-NAH-stah! boh-ay-THEH! SOH-son psoo-KHEN:\n§ee-eh-OO peer ee-OO peer ee-ah-OTE ee-ah-ay-OH ee-oh-OO ah-brah-SAX sah-bree-AHM oh-oh oo-oo ev oh-oh oo-oo ah-doh-NYE\nAY-day EH-day, ev-AHN-geh-los too theh-OO:\n§an-LAH-lah lah-EE gah-EE-ah ah-PAH dee-ah-KHAN-nah khoh-REEN`,
  },
  {
    slug: 'ph-self-identification',
    title: 'The Self-Identification',
    sort_order: 5,
    original: `Ἐγώ εἰμι ὁ Ἀκέφαλος Δαίμων, ἐν τοῖς ποσὶν ἔχων τὴν ὅρασιν, Ἰσχυρὸς, ὁ ἔχων τὸ πῦρ τὸ ἀθάνατον. Ἐγώ εἰμι ἡ Ἀλήθεια, ὁ μισῶν ἀδικήματα γίνεσθαι ἐν τῷ κόσμῳ. Ἐγώ εἰμι ὁ ἀστράπτων καὶ βροντῶν. Ἐγώ εἰμι οὗ ἐστιν ὁ ἱδρὼς ὄμβρος ἐπιπίπτων ἐπὶ τὴν γῆν ἵνα ὀχεύῃ. Ἐγώ εἰμι οὗ τὸ στόμα καίεται δι' ὅλου. Ἐγώ εἰμι ὁ γεννῶν καὶ ἀπογεννῶν. Ἐγώ εἰμι ἡ Χάρις τοῦ Αἰῶνος, ὄνομά μοι καρδία περιεζωσμένη ὄφιν.\n§Ἔξελθε καὶ ἀκολούθησον.`,
    translation: `I am the Headless Daimon with sight in my feet, the Mighty One who possesses the immortal fire. I am the Truth who hates that unjust deeds are done in the world. I am the one who makes lightning flash and thunder roll. I am the one whose sweat falls upon the earth as rain so that it may be inseminated. I am the one whose mouth burns completely. I am the one who begets and destroys. I am the Grace of the Aeon; my name is a heart encircled by a serpent.\n§Come forth and follow.`,
    body: `Eh-GOH AY-mee ho ah-KEH-fah-los DEH-mohn, en toys poh-SEEN EH-khohn tayn HOH-rah-seen, ees-khee-ROS, ho EH-khohn toh peer toh ah-THAH-nah-ton. Eh-GOH AY-mee hay ah-LAY-theh-ah, ho mee-SOHN ah-dee-KAY-mah-tah GHEE-neh-stheh en toh KOS-moh. Eh-GOH AY-mee ho ah-STRAP-tohn keh bron-TOHN. Eh-GOH AY-mee hoo EH-steen ho hee-DROS OM-bros eh-pee-PEE-pton eh-PEE tayn geen HEE-nah oh-KHEV-ay. Eh-GOH AY-mee hoo toh STOH-mah KAY-eh-teh dee OH-loo. Eh-GOH AY-mee ho gheh-NOHN keh ah-poh-gheh-NOHN. Eh-GOH AY-mee hay KHA-rees too eh-OH-nos, OH-noh-mah moy kar-DEE-ah peh-ree-eh-zos-MEH-nay OH-feen.\n§EX-el-theh keh ah-koh-LOO-thay-son.`,
  },
];
