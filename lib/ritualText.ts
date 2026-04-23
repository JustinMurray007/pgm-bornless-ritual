import { RitualSection } from './types';

// Lines prefixed with § are "vox lines" — rendered as their own block with a play button.
// Plain lines are rendered as flowing prose.
//
// The body contains the original Greek text from PGM V. 96-172.
// The translation field contains the English meaning, shown in the ? expansion bubble.
export const FALLBACK_SECTIONS: RitualSection[] = [
  {
    id: 'fallback-1',
    slug: 'opening',
    title: 'The Opening',
    sort_order: 1,
    body: `Σὲ καλῶ, τὸν Ἀκέφαλον, τὸν κτίσαντα γῆν καὶ οὐρανόν, τὸν κτίσαντα νύκτα καὶ ἡμέραν, σὲ τὸν κτίσαντα φῶς καὶ σκότος. Σὺ εἶ Ὀσοροννωφρις, ὃν οὐδεὶς εἶδε πώποτε.\n§Σὺ εἶ ΙΑΒΑΣ!\n§Σὺ εἶ ΙΑΠΩΣ!\nΣὺ διέκρινας τὸ δίκαιον καὶ τὸ ἄδικον. Σὺ ἐποίησας θῆλυ καὶ ἄρρεν. Σὺ ἔδειξας σπορὰν καὶ καρπούς. Σὺ ἐποίησας τοὺς ἀνθρώπους ἀλληλοφιλεῖν καὶ ἀλληλομισεῖν.`,
    translation: `I call upon thee, the Headless One, who created earth and heaven, who created night and day, thee who created light and darkness. Thou art Osoronnophris, whom no one has ever seen. Thou art IABAS! Thou art IAPOS! Thou didst distinguish the just and the unjust. Thou didst make female and male. Thou didst reveal seed and fruits. Thou didst make men love one another and hate one another.`,
  },
  {
    id: 'fallback-2',
    slug: 'moses_invocation',
    title: 'The Invocation of Moses',
    sort_order: 2,
    body: `Ἐγώ εἰμι Μοϋσῆς ὁ προφήτης σου, ᾧ παρέδωκας τὰ μυστήριά σου τὰ συντελούμενα Ἰστραήλ. Σὺ ἔδειξας ὑγρὸν καὶ ξηρὸν καὶ πᾶσαν τροφήν.\nἘπάκουσόν μου!\nἘγώ εἰμι ἄγγελος τοῦ Φαπρω Ὀσοροννωφρις. Τοῦτό ἐστιν σοῦ τὸ ὄνομα τὸ ἀληθινὸν τὸ παραδιδόμενον τοῖς προφήταις Ἰστραήλ.\nἘπάκουσόν μου·\n§ΑΡΒΑΘΙΑΩ ΡΕΙΒΕΤ ΑΘΕΛΕΒΕΡΣΗΘ ΑΡΑ ΒΛΑΘΑ ΑΛΒΕΥ ΕΒΕΝΦΧΙ ΧΙΤΑΣΓΟΗ ΙΒ ΑΩΘ ΙΑΩ\nΕἰσάκουσόν μου καὶ ἀποστρεψον τὸ δαιμόνιον τοῦτο.`,
    translation: `I am Moses thy prophet, to whom thou didst commit thy mysteries, the celebrations of Israel. Thou didst reveal the moist and the dry and all nourishment. Hearken to me! I am the messenger of Pharaoh Osoronnophris. This is thy true name, handed down to the prophets of Israel. Hearken to me: ARBATHIAO REIBET ATHELEBERSETH ARA BLATHA ALBEU EBENPHCHI CHITASGOE IB AOTH IAO. Hear me and turn away this daimon.`,
  },
  {
    id: 'fallback-3',
    slug: 'headless_invocation',
    title: 'The Headless Invocation',
    sort_order: 3,
    body: `Ἐπικαλοῦμαί σε, τὸν ἐν τῷ κενῷ πνεύματι δεινὸν καὶ ἀόρατον θεὸν·\n§ΑΡΟΓΟΓΟΡΟΒΡΑΩ ΣΟΧΟΥ ΜΟΔΟΡΙΩ ΦΑΛΑΡΧΑΩ ΟΟΟ\nἍγιε Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΡΟΥΒΡΙΑΩ ΜΑΡΙ ΩΔΑΜ ΒΑΑΒΝΑΒΑΩΘ ΑΣΣ ΑΔΩΝΑΙ ΑΦΝΙΑΩ ΙΘΩΛΗΘ ΑΒΡΑΣΑΞ ΑΗΩΩΥ\nἸσχυρὲ Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΜΑΒΑΡΡΑΙΩ ΙΟΗΛ ΚΟΘΑ ΑΘΟΡΗΒΑΛΩ ΑΒΡΑΩΘ\nἈπάλλαξον τὸν δεῖνα·\n§ΑΩΘ ΑΒΑΩΘ ΒΑΣΥΜ ΙΣΑΚ ΣΑΒΑΩΘ ΙΑΩ`,
    translation: `I call upon thee, the terrible and invisible god dwelling in the empty wind: AROGŌROBRAŌ SOCHOU MODORIŌ PHALARCHAŌ OOO. Holy Headless One! Free the subject from the daimon that restrains him: ROUBRIAŌ MARI ŌDAM BAABNABAŌTH ASS ADŌNAI APHNIAŌ ITHŌLĒTH ABRASAX AĒŌŌU. Mighty Headless One! Free the subject from the daimon that restrains him: MABARRAIŌ IOEL KOTHA ATHŌRĒBALŌ ABRAŌTH. Free the subject: AŌTH ABAŌTH BASYM ISAK SABAŌTH IAŌ.`,
  },
  {
    id: 'fallback-4',
    slug: 'lord_of_gods',
    title: 'Lord of the Gods',
    sort_order: 4,
    body: `Οὗτος ἐστιν ὁ κύριος τῶν θεῶν. Οὗτος ἐστιν ὁ κύριος τῆς οἰκουμένης. Οὗτος ἐστιν ὂν οἱ ἄνεμοι φοβοῦνται. Οὗτος ἐστιν ὁ ποιήσας φωνῆς προστάγματι ἑαυτοῦ πάντα.\nΚύριε! Βασιλεῦ! Δυνάστα! Βοηθέ! Σῶσον ψυχὴν·\n§ΙΕΟΥ ΠΥΡ ΙΟΥ ΠΥΡ ΙΑΩΤ ΙΑΗΩ ΙΟΟΥ ΑΒΡΑΣΑΞ ΣΑΒΡΙΑΜ ΟΟ ΥΥ ΕΥ ΟΟ ΥΥ ΑΔΩΝΑΙ\nΕΗδη εδη, εὐαγγελος τοῦ θεοῦ·\n§ΑΝΛΑΛΑ ΛΑΙ ΓΑΙΑ ΑΠΑ ΔΙΑΧΑΝΝΑ ΧΟΡΥΝ`,
    translation: `This is the lord of the gods. This is the lord of the inhabited world. This is he whom the winds fear. This is he who made all things by the command of his voice. Lord! King! Master! Helper! Save the soul: IEOU PYR IOU PYR IAŌT IAĒŌ IOOU ABRASAX SABRIAM OO UU EU OO UU ADŌNAI. Already, already, messenger of god: ANLALA LAI GAIA APA DIACHANNA CHORYN.`,
  },
  {
    id: 'fallback-5',
    slug: 'self_identification',
    title: 'The Self-Identification',
    sort_order: 5,
    body: `Ἐγώ εἰμι ὁ Ἀκέφαλος Δαίμων, ἐν τοῖς ποσὶν ἔχων τὴν ὅρασιν, Ἰσχυρὸς, ὁ ἔχων τὸ πῦρ τὸ ἀθάνατον. Ἐγώ εἰμι ἡ Ἀλήθεια, ὁ μισῶν ἀδικήματα γίνεσθαι ἐν τῷ κόσμῳ. Ἐγώ εἰμι ὁ ἀστράπτων καὶ βροντῶν. Ἐγώ εἰμι οὗ ἐστιν ὁ ἱδρὼς ὄμβρος ἐπιπίπτων ἐπὶ τὴν γῆν ἵνα ὀχεύῃ. Ἐγώ εἰμι οὗ τὸ στόμα καίεται δι' ὅλου. Ἐγώ εἰμι ὁ γεννῶν καὶ ἀπογεννῶν. Ἐγώ εἰμι ἡ Χάρις τοῦ Αἰῶνος, ὄνομά μοι καρδία περιεζωσμένη ὄφιν.\n§Ἔξελθε καὶ ἀκολούθησον.`,
    translation: `I am the Headless Daimon with sight in my feet, the Mighty One who possesses the immortal fire. I am the Truth who hates that unjust deeds are done in the world. I am the one who makes lightning flash and thunder roll. I am the one whose sweat falls upon the earth as rain so that it may be inseminated. I am the one whose mouth burns completely. I am the one who begets and destroys. I am the Grace of the Aeon; my name is a heart encircled by a serpent. Come forth and follow.`,
  },
];
