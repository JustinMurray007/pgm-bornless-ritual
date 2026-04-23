// PGM V. 96-172 — The Bornless Ritual (Stele of Jeu the Hieroglyphist)
// Lines prefixed with § are "vox lines" — rendered with a play button.
// Plain lines are flowing prose, each word is individually speakable on hover/click.
//
// Each section has:
//   original:    the Greek source text (shown large, primary)
//   translation: English translation (shown beneath Greek, italic)
//   body:        phonetic reconstruction (interactive, speakable)

import type { PhoneticSection } from './phoneticScript';

export const BORNLESS_SCRIPT: PhoneticSection[] = [
  {
    slug: 'opening',
    title: 'The Opening',
    sort_order: 1,
    original: `Σὲ καλῶ, τὸν Ἀκέφαλον, τὸν κτίσαντα γῆν καὶ οὐρανόν, τὸν κτίσαντα νύκτα καὶ ἡμέραν, σὲ τὸν κτίσαντα φῶς καὶ σκότος. Σὺ εἶ Ὀσοροννωφρις, ὃν οὐδεὶς εἶδε πώποτε.\n§Σὺ εἶ ΙΑΒΑΣ!\n§Σὺ εἶ ΙΑΠΩΣ!\nΣὺ διέκρινας τὸ δίκαιον καὶ τὸ ἄδικον. Σὺ ἐποίησας θῆλυ καὶ ἄρρεν. Σὺ ἔδειξας σπορὰν καὶ καρπούς. Σὺ ἐποίησας τοὺς ἀνθρώπους ἀλληλοφιλεῖν καὶ ἀλληλομισεῖν.`,
    translation: `I call upon thee, the Headless One, who created earth and heaven, who created night and day, thee who created light and darkness. Thou art Osoronnophris, whom no one has ever seen.\n§Thou art IABAS!\n§Thou art IAPOS!\nThou didst distinguish the just and the unjust. Thou didst make female and male. Thou didst reveal seed and fruits. Thou didst make men love one another and hate one another.`,
    body: `seh kah-LOH, ton ah-KEH-fah-lon, ton KTEE-sahn-tah gayn keh oo-rah-NON, ton KTEE-sahn-tah NEEK-tah keh hay-MEH-rahn, seh ton KTEE-sahn-tah fohs keh SKOH-tos. see ay oh-soh-ron-NOH-frees, hon oo-DEES AY-deh POH-poh-teh.\n§see ay ee-AH-bahs!\n§see ay ee-ah-POHS!\nsee dee-EH-kree-nahs toh DEE-keh-on keh toh AH-dee-kon. see eh-POY-ay-sahs THAY-lee keh AHR-ren. see EH-day-ksahs spoh-RAHN keh kar-POOS. see eh-POY-ay-sahs toos ahn-THROH-poos ahl-lay-loh-fee-LAYN keh ahl-lay-loh-mee-SAYN.`,
  },
  {
    slug: 'moses-invocation',
    title: 'The Invocation of Moses',
    sort_order: 2,
    original: `Ἐγώ εἰμι Μοϋσῆς ὁ προφήτης σου, ᾧ παρέδωκας τὰ μυστήριά σου τὰ συντελούμενα Ἰστραήλ. Σὺ ἔδειξας ὑγρὸν καὶ ξηρὸν καὶ πᾶσαν τροφήν.\nἘπάκουσόν μου!\nἘγώ εἰμι ἄγγελος τοῦ Φαπρω Ὀσοροννωφρις. Τοῦτό ἐστιν σοῦ τὸ ὄνομα τὸ ἀληθινὸν τὸ παραδιδόμενον τοῖς προφήταις Ἰστραήλ.\nἘπάκουσόν μου·\n§ΑΡΒΑΘΙΑΩ ΡΕΙΒΕΤ ΑΘΕΛΕΒΕΡΣΗΘ ΑΡΑ ΒΛΑΘΑ ΑΛΒΕΥ ΕΒΕΝΦΧΙ ΧΙΤΑΣΓΟΗ ΙΒ ΑΩΘ ΙΑΩ\nΕἰσάκουσόν μου καὶ ἀποστρεψον τὸ δαιμόνιον τοῦτο.`,
    translation: `I am Moses thy prophet, to whom thou didst commit thy mysteries, the celebrations of Israel. Thou didst reveal the moist and the dry and all nourishment.\nHearken to me!\nI am the messenger of Pharaoh Osoronnophris. This is thy true name, handed down to the prophets of Israel.\nHearken to me:\n§ARBATHIAO REIBET ATHELEBERSETH ARA BLATHA ALBEU EBENPHCHI CHITASGOE IB AOTH IAO\nHear me and turn away this daimon.`,
    body: `eh-GOH ay-MEE moy-SAYS ho proh-FAY-tays soo, hoh pah-REH-doh-kahs tah mees-TAY-ree-ah soo tah seen-teh-LOO-meh-nah ees-trah-AYL. see EH-day-ksahs ee-GRON keh ksay-RON keh PAH-sahn troh-FAYN.\neh-PAH-koo-son moo!\neh-GOH ay-MEE AHN-geh-los too fah-PROH oh-soh-ron-NOH-frees. TOO-toh EH-steen soo toh OH-noh-mah toh ah-lay-thee-NON toh pah-rah-dee-DOH-meh-non tees proh-FAY-tees ees-trah-AYL.\neh-PAH-koo-son moo:\n§ar-bah-thee-AH-oh RAY-bet ah-theh-leh-ber-SAYTH AH-rah BLAH-thah AHL-beh-oo eh-ben-FKHEE khee-tahs-GOH-ay eeb ah-ohth ee-ah-oh\nay-SAH-koo-son moo keh ah-poh-STREH-pson toh day-MOH-nee-on TOO-toh.`,
  },
  {
    slug: 'headless-invocation',
    title: 'The Headless Invocation',
    sort_order: 3,
    original: `Ἐπικαλοῦμαί σε, τὸν ἐν τῷ κενῷ πνεύματι δεινὸν καὶ ἀόρατον θεὸν·\n§ΑΡΟΓΟΓΟΡΟΒΡΑΩ ΣΟΧΟΥ ΜΟΔΟΡΙΩ ΦΑΛΑΡΧΑΩ ΟΟΟ\nἍγιε Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΡΟΥΒΡΙΑΩ ΜΑΡΙ ΩΔΑΜ ΒΑΑΒΝΑΒΑΩΘ ΑΣΣ ΑΔΩΝΑΙ ΑΦΝΙΑΩ ΙΘΩΛΗΘ ΑΒΡΑΣΑΞ ΑΗΩΩΥ\nἸσχυρὲ Ἀκέφαλε! Ἀπάλλαξον τὸν δεῖνα ἀπὸ τοῦ συνέχοντος αὐτὸν δαίμονος·\n§ΜΑΒΑΡΡΑΙΩ ΙΟΗΛ ΚΟΘΑ ΑΘΟΡΗΒΑΛΩ ΑΒΡΑΩΘ\nἈπάλλαξον τὸν δεῖνα·\n§ΑΩΘ ΑΒΑΩΘ ΒΑΣΥΜ ΙΣΑΚ ΣΑΒΑΩΘ ΙΑΩ`,
    translation: `I call upon thee, the terrible and invisible god dwelling in the empty wind:\n§AROGŌROBRAŌ SOCHOU MODORIŌ PHALARCHAŌ OOO\nHoly Headless One! Free the subject from the daimon that restrains him:\n§ROUBRIAŌ MARI ŌDAM BAABNABAŌTH ASS ADŌNAI APHNIAŌ ITHŌLĒTH ABRASAX AĒŌŌU\nMighty Headless One! Free the subject from the daimon that restrains him:\n§MABARRAIŌ IOEL KOTHA ATHŌRĒBALŌ ABRAŌTH\nFree the subject:\n§AŌTH ABAŌTH BASYM ISAK SABAŌTH IAŌ`,
    body: `eh-pee-kah-LOO-meh seh, ton en toh keh-NOH PNEV-mah-tee day-NON keh ah-OH-rah-ton theh-ON:\n§ah-roh-goh-goh-roh-BRAH-oh SOH-khoo moh-doh-REE-oh fah-lar-KHAH-oh oh-oh-oh\nAH-ghee-eh ah-KEH-fah-leh! ah-PAHL-lah-kson ton DAY-nah ah-POH too see-NEH-khon-tos af-TON DAY-moh-nos:\n§roo-bree-AH-oh MAH-ree OH-dahm bah-ahb-nah-bah-OHTH ahs ah-doh-NYE ahf-nee-AH-oh ee-thoh-LAYTH ah-brah-SAHKS ah-ay-oh-oh-ee\nees-khee-REH ah-KEH-fah-leh! ah-PAHL-lah-kson ton DAY-nah ah-POH too see-NEH-khon-tos af-TON DAY-moh-nos:\n§mah-bahr-rah-EE-oh ee-oh-AYL KOH-thah ah-thoh-ray-BAH-loh ah-brah-OHTH\nah-PAHL-lah-kson ton DAY-nah:\n§ah-ohth ah-bah-OHTH bah-SEEM ee-SAHK sah-bah-OHTH ee-ah-oh`,
  },
  {
    slug: 'lord-of-gods',
    title: 'Lord of the Gods',
    sort_order: 4,
    original: `Οὗτος ἐστιν ὁ κύριος τῶν θεῶν. Οὗτος ἐστιν ὁ κύριος τῆς οἰκουμένης. Οὗτος ἐστιν ὂν οἱ ἄνεμοι φοβοῦνται. Οὗτος ἐστιν ὁ ποιήσας φωνῆς προστάγματι ἑαυτοῦ πάντα.\nΚύριε! Βασιλεῦ! Δυνάστα! Βοηθέ! Σῶσον ψυχὴν·\n§ΙΕΟΥ ΠΥΡ ΙΟΥ ΠΥΡ ΙΑΩΤ ΙΑΗΩ ΙΟΟΥ ΑΒΡΑΣΑΞ ΣΑΒΡΙΑΜ ΟΟ ΥΥ ΕΥ ΟΟ ΥΥ ΑΔΩΝΑΙ\nἨδη ἤδη, εὐάγγελος τοῦ θεοῦ·\n§ΑΝΛΑΛΑ ΛΑΙ ΓΑΙΑ ΑΠΑ ΔΙΑΧΑΝΝΑ ΧΟΡΥΝ`,
    translation: `This is the lord of the gods. This is the lord of the inhabited world. This is he whom the winds fear. This is he who made all things by the command of his voice.\nLord! King! Master! Helper! Save the soul:\n§IEOU PYR IOU PYR IAŌT IAĒŌ IOOU ABRASAX SABRIAM OO UU EU OO UU ADŌNAI\nAlready, already, messenger of god:\n§ANLALA LAI GAIA APA DIACHANNA CHORYN`,
    body: `HOO-tos EH-steen ho KEE-ree-os tohn theh-OHN. HOO-tos EH-steen ho KEE-ree-os tays ee-koo-MEH-nays. HOO-tos EH-steen hon hoy AH-neh-moy foh-BOO-ntay. HOO-tos EH-steen ho poy-AY-sahs foh-NAYS proh-STAHG-mah-tee heh-af-TOO PAHN-tah.\nKEE-ree-eh! bah-see-LEV! dee-NAH-stah! boh-ay-THEH! SOH-son psee-KHAYN:\n§ee-eh-OO peer ee-OO peer ee-ah-OHT ee-ah-AY-oh ee-oh-OO ah-brah-SAHKS sah-bree-AHM oh-oh ee-ee eh-ee oh-oh ee-ee ah-doh-NYE\nAY-day AY-day, ev-AHN-geh-los too theh-OO:\n§ahn-LAH-lah lye GYE-ah AH-pah dee-ah-KHAHN-nah KHOH-reen`,
  },
  {
    slug: 'self-identification',
    title: 'The Self-Identification',
    sort_order: 5,
    original: `Ἐγώ εἰμι ὁ Ἀκέφαλος Δαίμων, ἐν τοῖς ποσὶν ἔχων τὴν ὅρασιν, Ἰσχυρὸς, ὁ ἔχων τὸ πῦρ τὸ ἀθάνατον. Ἐγώ εἰμι ἡ Ἀλήθεια, ὁ μισῶν ἀδικήματα γίνεσθαι ἐν τῷ κόσμῳ. Ἐγώ εἰμι ὁ ἀστράπτων καὶ βροντῶν. Ἐγώ εἰμι οὗ ἐστιν ὁ ἱδρὼς ὄμβρος ἐπιπίπτων ἐπὶ τὴν γῆν ἵνα ὀχεύῃ. Ἐγώ εἰμι οὗ τὸ στόμα καίεται δι' ὅλου. Ἐγώ εἰμι ὁ γεννῶν καὶ ἀπογεννῶν. Ἐγώ εἰμι ἡ Χάρις τοῦ Αἰῶνος, ὄνομά μοι καρδία περιεζωσμένη ὄφιν.\n§Ἔξελθε καὶ ἀκολούθησον.`,
    translation: `I am the Headless Daimon with sight in my feet, the Mighty One who possesses the immortal fire. I am the Truth who hates that unjust deeds are done in the world. I am the one who makes lightning flash and thunder roll. I am the one whose sweat falls upon the earth as rain so that it may be inseminated. I am the one whose mouth burns completely. I am the one who begets and destroys. I am the Grace of the Aeon; my name is a heart encircled by a serpent.\n§Come forth and follow.`,
    body: `eh-GOH ay-MEE ho ah-KEH-fah-los DAY-mohn, en tees poh-SEEN EH-khohn tayn HOH-rah-seen, ees-khee-ROS, ho EH-khohn toh peer toh ah-THAH-nah-ton. eh-GOH ay-MEE hay ah-LAY-thay-ah, ho mee-SOHN ah-dee-KAY-mah-tah GHEE-neh-sthay en toh KOS-moh. eh-GOH ay-MEE ho ah-STRAHP-tohn keh bron-TOHN. eh-GOH ay-MEE hoo EH-steen ho hee-DROHS OM-bros eh-pee-PEEP-tohn eh-PEE tayn gayn HEE-nah oh-KHEV-ay. eh-GOH ay-MEE hoo toh STOH-mah KYE-eh-tay dee HOH-loo. eh-GOH ay-MEE ho ghen-NOHN keh ah-poh-ghen-NOHN. eh-GOH ay-MEE hay KHAH-rees too eye-OH-nos, OH-noh-mah moy kar-DEE-ah peh-ree-eh-zoh-SMEH-nay OH-feen.\n§EHK-sel-theh keh ah-koh-LOO-thay-son.`,
  },
];
