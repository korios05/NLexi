// Νέες έτοιμες τράπουλες
(function () {
  const mk = (prefix, category, rows) =>
    rows.map((r, i) => ({
      id: `${prefix}-${i + 1}`,
      dutch: r[0], greek: r[1], phonetic: r[2], partOfSpeech: r[3],
      exampleDutch: r[4], exampleGreek: r[5], category,
    }));

  window.BUILTIN_DECKS.push(
    {
      id: "home-living",
      name: "Στο Σπίτι",
      description: "Δωμάτια, έπιπλα και λέξεις για την καθημερινή ζωή στο σπίτι.",
      iconName: "Home",
      cards: mk("hm", "Σπίτι", [
        ["het huis", "το σπίτι", "χετ χάους", "ουσιαστικό", "Ons huis is niet groot.", "Το σπίτι μας δεν είναι μεγάλο."],
        ["de keuken", "η κουζίνα", "ντε κέκεν", "ουσιαστικό", "De keuken is erg schoon.", "Η κουζίνα είναι πολύ καθαρή."],
        ["de slaapkamer", "το υπνοδωμάτιο", "ντε σλάαπ-κάμερ", "ουσιαστικό", "Mijn slaapkamer is boven.", "Το υπνοδωμάτιό μου είναι πάνω."],
        ["de badkamer", "το μπάνιο", "ντε μπατ-κάμερ", "ουσιαστικό", "Waar is de badkamer?", "Πού είναι το μπάνιο;"],
        ["de tafel", "το τραπέζι", "ντε τάαφελ", "ουσιαστικό", "Het eten staat op de tafel.", "Το φαγητό είναι στο τραπέζι."],
        ["de stoel", "η καρέκλα", "ντε στουλ", "ουσιαστικό", "Deze stoel is heel comfortabel.", "Αυτή η καρέκλα είναι πολύ άνετη."],
        ["het raam", "το παράθυρο", "χετ ράαμ", "ουσιαστικό", "Kun je het raam openen?", "Μπορείς να ανοίξεις το παράθυρο;"],
        ["de deur", "η πόρτα", "ντε ντερ", "ουσιαστικό", "Doe de deur dicht, alsjeblieft.", "Κλείσε την πόρτα, σε παρακαλώ."],
        ["de sleutel", "το κλειδί", "ντε σλέτελ", "ουσιαστικό", "Ik kan mijn sleutel niet vinden.", "Δεν μπορώ να βρω το κλειδί μου."],
        ["wonen", "μένω / κατοικώ", "βόονεν", "ρήμα", "Wij wonen in Amsterdam.", "Μένουμε στο Άμστερνταμ."],
      ]),
    },
    {
      id: "shopping-money",
      name: "Ψώνια & Χρήματα",
      description: "Ό,τι χρειάζεσαι στο σούπερ μάρκετ, στα μαγαζιά και στο ταμείο.",
      iconName: "Cart",
      cards: mk("sh", "Ψώνια", [
        ["de winkel", "το κατάστημα", "ντε βίνκελ", "ουσιαστικό", "De winkel gaat om negen uur open.", "Το κατάστημα ανοίγει στις εννιά."],
        ["de supermarkt", "το σούπερ μάρκετ", "ντε σύπερμαρκτ", "ουσιαστικό", "Ik ga naar de supermarkt.", "Πάω στο σούπερ μάρκετ."],
        ["kopen", "αγοράζω", "κόοπεν", "ρήμα", "Wij willen een fiets kopen.", "Θέλουμε να αγοράσουμε ένα ποδήλατο."],
        ["betalen", "πληρώνω", "μπετάαλεν", "ρήμα", "Kan ik met de kaart betalen?", "Μπορώ να πληρώσω με κάρτα;"],
        ["duur", "ακριβός", "ντυρ", "επίθετο", "Dit is te duur voor mij.", "Αυτό είναι πολύ ακριβό για μένα."],
        ["goedkoop", "φθηνός", "χουτ-κόοπ", "επίθετο", "Deze schoenen zijn goedkoop.", "Αυτά τα παπούτσια είναι φθηνά."],
        ["de kassa", "το ταμείο", "ντε κάσα", "ουσιαστικό", "U kunt betalen bij de kassa.", "Μπορείτε να πληρώσετε στο ταμείο."],
        ["het bonnetje", "η απόδειξη", "χετ μπόνετιε", "ουσιαστικό", "Mag ik het bonnetje, alstublieft?", "Μπορώ να έχω την απόδειξη, παρακαλώ;"],
        ["de korting", "η έκπτωση", "ντε κόρτινγκ", "ουσιαστικό", "Er is vandaag twintig procent korting.", "Σήμερα υπάρχει έκπτωση είκοσι τοις εκατό."],
        ["Hoeveel kost het?", "Πόσο κοστίζει;", "χούβεελ κοστ χετ", "έκφραση", "Mooie tas! Hoeveel kost het?", "Ωραία τσάντα! Πόσο κοστίζει;"],
      ]),
    },
    {
      id: "health-doctor",
      name: "Υγεία & Γιατρός",
      description: "Λέξεις για τον γιατρό, το φαρμακείο και πώς νιώθεις.",
      iconName: "Health",
      cards: mk("he", "Υγεία", [
        ["de dokter", "ο γιατρός", "ντε ντόκτερ", "ουσιαστικό", "Ik moet naar de dokter.", "Πρέπει να πάω στον γιατρό."],
        ["de huisarts", "ο οικογενειακός γιατρός", "ντε χάουσ-αρτς", "ουσιαστικό", "Ik bel morgen de huisarts.", "Θα πάρω αύριο τηλέφωνο τον οικογενειακό γιατρό."],
        ["ziek", "άρρωστος", "ζικ", "επίθετο", "Ik ben ziek vandaag.", "Είμαι άρρωστος σήμερα."],
        ["de pijn", "ο πόνος", "ντε πέιν", "ουσιαστικό", "Ik heb pijn in mijn rug.", "Έχω πόνο στην πλάτη μου."],
        ["de apotheek", "το φαρμακείο", "ντε απότεεκ", "ουσιαστικό", "De apotheek is om de hoek.", "Το φαρμακείο είναι στη γωνία."],
        ["het medicijn", "το φάρμακο", "χετ μεντισέιν", "ουσιαστικό", "Neem dit medicijn twee keer per dag.", "Πάρε αυτό το φάρμακο δύο φορές τη μέρα."],
        ["de koorts", "ο πυρετός", "ντε κόορτς", "ουσιαστικό", "Het kind heeft koorts.", "Το παιδί έχει πυρετό."],
        ["de afspraak", "το ραντεβού", "ντε άφσπραακ", "ουσιαστικό", "Ik wil graag een afspraak maken.", "Θα ήθελα να κλείσω ένα ραντεβού."],
        ["het ziekenhuis", "το νοσοκομείο", "χετ ζίκεν-χάους", "ουσιαστικό", "Hij ligt in het ziekenhuis.", "Είναι στο νοσοκομείο."],
        ["beter worden", "γίνομαι καλά", "μπέτερ βόρντεν", "έκφραση", "Je moet eerst beter worden.", "Πρέπει πρώτα να γίνεις καλά."],
      ]),
    },
    {
      id: "work-office",
      name: "Δουλειά & Γραφείο",
      description: "Συνάδελφοι, συσκέψεις, μισθός και αιτήσεις για δουλειά.",
      iconName: "Work",
      cards: mk("wk", "Δουλειά", [
        ["het werk", "η δουλειά", "χετ βερκ", "ουσιαστικό", "Ik ga elke dag naar het werk.", "Πηγαίνω κάθε μέρα στη δουλειά."],
        ["werken", "δουλεύω", "βέρκεν", "ρήμα", "Wij werken van negen tot vijf.", "Δουλεύουμε από τις εννιά μέχρι τις πέντε."],
        ["de collega", "ο/η συνάδελφος", "ντε κολέχα", "ουσιαστικό", "Mijn collega komt uit Spanje.", "Ο συνάδελφός μου είναι από την Ισπανία."],
        ["de vergadering", "η σύσκεψη", "ντε φερχάαντερινγκ", "ουσιαστικό", "De vergadering begint om tien uur.", "Η σύσκεψη αρχίζει στις δέκα."],
        ["de baas", "το αφεντικό", "ντε μπάας", "ουσιαστικό", "De baas is vandaag niet hier.", "Το αφεντικό δεν είναι εδώ σήμερα."],
        ["het salaris", "ο μισθός", "χετ σαλάαρις", "ουσιαστικό", "Het salaris komt aan het eind van de maand.", "Ο μισθός έρχεται στο τέλος του μήνα."],
        ["de vakantie", "οι διακοπές / η άδεια", "ντε φακάνσι", "ουσιαστικό", "Volgende week heb ik vakantie.", "Την επόμενη εβδομάδα έχω άδεια."],
        ["solliciteren", "κάνω αίτηση για δουλειά", "σολισιτέερεν", "ρήμα", "Ik wil solliciteren bij dit bedrijf.", "Θέλω να κάνω αίτηση σε αυτή την εταιρεία."],
        ["het bedrijf", "η εταιρεία", "χετ μπεντρέιφ", "ουσιαστικό", "Het bedrijf heeft honderd werknemers.", "Η εταιρεία έχει εκατό υπαλλήλους."],
        ["Tot morgen!", "Τα λέμε αύριο!", "τοτ μόρχεν", "έκφραση", "Fijne avond, tot morgen!", "Καλό βράδυ, τα λέμε αύριο!"],
      ]),
    }
  );
})();
