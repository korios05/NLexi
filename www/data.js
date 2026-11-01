// Έτοιμες τράπουλες

window.BUILTIN_DECKS = [
  {
    id: "basic-greetings",
    name: "Καθημερινοί Χαιρετισμοί",
    description: "Οι πιο βασικές εκφράσεις, χαιρετισμοί και ευγένειες για την καθημερινότητά σας στην Ολλανδία.",
    iconName: "MessageCircle",
    cards: [
      {
        id: "bg-1",
        dutch: "Goedendag",
        greek: "Καλημέρα / Γεια σας",
        phonetic: "χούιεν-νταχ",
        partOfSpeech: "έκφραση / χαιρετισμός",
        exampleDutch: "Goedendag, hoe gaat het met u?",
        exampleGreek: "Καλημέρα σας, πώς είστε;",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-2",
        dutch: "Dank u wel",
        greek: "Ευχαριστώ πολύ (επίσημο)",
        phonetic: "ντανκ υ βελ",
        partOfSpeech: "έκφραση",
        exampleDutch: "Dank u wel voor uw hulp.",
        exampleGreek: "Ευχαριστώ πολύ για τη βοήθειά σας.",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-3",
        dutch: "Alstublieft",
        greek: "Παρακαλώ / Ορίστε",
        phonetic: "άλστ-υ-μπλιφτ",
        partOfSpeech: "έκφραση",
        exampleDutch: "Een kopje koffie, alstublieft.",
        exampleGreek: "Ένα φλιτζάνι καφέ, παρακαλώ.",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-4",
        dutch: "Hoe gaat het?",
        greek: "Πώς πάει; / Τι κάνεις;",
        phonetic: "χου χάατ χετ;",
        partOfSpeech: "έκφραση / ερώτηση",
        exampleDutch: "Hallo! Hoe gaat het met jou?",
        exampleGreek: "Γεια σου! Πώς είσαι;",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-5",
        dutch: "Tot ziens",
        greek: "Εις το επανιδείν / Αντίο",
        phonetic: "τοτ ζινς",
        partOfSpeech: "έκφραση",
        exampleDutch: "Fijne dag en tot ziens!",
        exampleGreek: "Καλή μέρα και αντίο!",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-6",
        dutch: "Sorry",
        greek: "Συγγνώμη / Λυπάμαι",
        phonetic: "σόρι",
        partOfSpeech: "έκφραση",
        exampleDutch: "Sorry, ik begrijp het niet.",
        exampleGreek: "Συγγνώμη, δεν καταλαβαίνω.",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-7",
        dutch: "Spreekt u Engels?",
        greek: "Μιλάτε Αγγλικά;",
        phonetic: "σπρέικτ υ ένγκελς;",
        partOfSpeech: "έκφραση / ερώτηση",
        exampleDutch: "Sorry, ik spreek geen Nederlands. Spreekt u Engels?",
        exampleGreek: "Συγγνώμη, δεν μιλώ Ολλανδικά. Μιλάτε Αγγλικά;",
        category: "Χαιρετισμοί"
      },
      {
        id: "bg-8",
        dutch: "Fijne dag",
        greek: "Να έχετε μια καλή μέρα",
        phonetic: "φέινε νταχ",
        partOfSpeech: "έκφραση",
        exampleDutch: "Dank je wel, fijne dag nog!",
        exampleGreek: "Ευχαριστώ, καλή συνέχεια (καλή μέρα) επίσης!",
        category: "Χαιρετισμοί"
      }
    ]
  },
  {
    id: "food-dining",
    name: "Φαγητό & Εστιατόριο",
    description: "Χρήσιμες λέξεις για να παραγγέλνετε φαγητό, να ζητάτε τον λογαριασμό και να περιγράφετε γεύσεις.",
    iconName: "Utensils",
    cards: [
      {
        id: "fd-1",
        dutch: "De menukaart",
        greek: "Ο κατάλογος / Το μενού",
        phonetic: "ντε μενύ-κααρτ",
        partOfSpeech: "ουσιαστικό (αρσενικό)",
        exampleDutch: "Mag ik de menukaart, alstublieft?",
        exampleGreek: "Μπορώ να έχω τον κατάλογο, παρακαλώ;",
        category: "Εστιατόριο"
      },
      {
        id: "fd-2",
        dutch: "De rekening",
        greek: "Ο λογαριασμός",
        phonetic: "ντε ρέικενινγκ",
        partOfSpeech: "ουσιαστικό (θηλυκό)",
        exampleDutch: "Wij willen graag de rekening betalen.",
        exampleGreek: "Θα θέλαμε να πληρώσουμε τον λογαριασμό.",
        category: "Εστιατόριο"
      },
      {
        id: "fd-3",
        dutch: "Lekker",
        greek: "Νόστιμος / Ωραίος / Απολαυστικός",
        phonetic: "λέκερ",
        partOfSpeech: "επίθετο",
        exampleDutch: "Dit eten is echt heel lekker!",
        exampleGreek: "Αυτό το φαγητό είναι πραγματικά πάρα πολύ νόστιμο!",
        category: "Εστιατόριο"
      },
      {
        id: "fd-4",
        dutch: "Het water",
        greek: "Το νερό",
        phonetic: "χετ βάτερ",
        partOfSpeech: "ουσιαστικό (ουδέτερο)",
        exampleDutch: "Een fles water για de tafel, alstublieft.",
        exampleGreek: "Ένα μπουκάλι νερό για το τραπέζι, παρακαλώ.",
        category: "Φαγητό"
      },
      {
        id: "fd-5",
        dutch: "Eet smakelijk",
        greek: "Καλή όρεξη",
        phonetic: "έιτ σμάκελικ",
        partOfSpeech: "έκφραση",
        exampleDutch: "Het eten είναι klaar, eet smakelijk!",
        exampleGreek: "Το φαγητό είναι έτοιμο, καλή όρεξη!",
        category: "Εστιατόριο"
      },
      {
        id: "fd-6",
        dutch: "Het ontbijt",
        greek: "Το πρωινό",
        phonetic: "χετ οντ-μπέιτ",
        partOfSpeech: "ουσιαστικό (ουδέτερο)",
        exampleDutch: "Ik eet graag brood bij het ontbijt.",
        exampleGreek: "Μου αρέσει να τρώω ψωμί στο πρωινό.",
        category: "Φαγητό"
      }
    ]
  },
  {
    id: "travel-directions",
    name: "Ταξίδια & Προσανατολισμός",
    description: "Πώς να ρωτήσετε για κατευθύνσεις, να βρείτε τον σταθμό των τρένων και να πλοηγηθείτε στην πόλη.",
    iconName: "MapPin",
    cards: [
      {
        id: "td-1",
        dutch: "Waar is...?",
        greek: "Πού είναι...;",
        phonetic: "βαρ ις...;",
        partOfSpeech: "έκφραση / ερώτηση",
        exampleDutch: "Pardon, waar is het treinstation?",
        exampleGreek: "Με συγχωρείτε, πού είναι ο σιδηροδρομικός σταθμός;",
        category: "Προσανατολισμός"
      },
      {
        id: "td-2",
        dutch: "Het treinstation",
        greek: "Ο σταθμός των τρένων",
        phonetic: "χετ τρέιν-στασιον",
        partOfSpeech: "ουσιαστικό (ουδέτερο)",
        exampleDutch: "Het treinstation is om de hoek.",
        exampleGreek: "Ο σταθμός των τρένων είναι στη γωνία.",
        category: "Ταξίδι"
      },
      {
        id: "td-3",
        dutch: "Links / Rechts",
        greek: "Αριστερά / Δεξιά",
        phonetic: "λινκς / ρεχτς",
        partOfSpeech: "επίρρημα",
        exampleDutch: "Ga hier links en daarna rechts.",
        exampleGreek: "Πηγαίνετε εδώ αριστερά και μετά δεξιά.",
        category: "Προσανατολισμός"
      },
      {
        id: "td-4",
        dutch: "De fiets",
        greek: "Το ποδήλατο",
        phonetic: "ντε φιτς",
        partOfSpeech: "ουσιαστικό (θηλυκό)",
        exampleDutch: "Iedereen in Nederland heeft een fiets.",
        exampleGreek: "Όλοι στην Ολλανδία έχουν ένα ποδήλατο.",
        category: "Ταξίδι"
      },
      {
        id: "td-5",
        dutch: "Een ticket",
        greek: "Ένα εισιτήριο",
        phonetic: "έιν τίκετ",
        partOfSpeech: "ουσιαστικό (ουδέτερο)",
        exampleDutch: "Ik moet een ticket kopen voor de tram.",
        exampleGreek: "Πρέπει να αγοράσω ένα εισιτήριο για το τραμ.",
        category: "Ταξίδι"
      }
    ]
  },
  {
    id: "numbers-time",
    name: "Αριθμοί & Ώρα",
    description: "Μάθετε να μετράτε και να ρωτάτε ή να λέτε την ώρα στα ολλανδικά.",
    iconName: "Clock",
    cards: [
      {
        id: "nt-1",
        dutch: "Hoe laat is het?",
        greek: "Τι ώρα είναι;",
        phonetic: "χου λαατ ις χετ;",
        partOfSpeech: "έκφραση / ερώτηση",
        exampleDutch: "Weet u hoe laat is het?",
        exampleGreek: "Γνωρίζετε τι ώρα είναι;",
        category: "Ώρα"
      },
      {
        id: "nt-2",
        dutch: "Vandaag / Morgen",
        greek: "Σήμερα / Αύριο",
        phonetic: "βαν-ντάαχ / μόρχεν",
        partOfSpeech: "επίρρημα",
        exampleDutch: "Vandaag werk ik, morgen ben ik vrij.",
        exampleGreek: "Σήμερα δουλεύω, αύριο έχω ρεπό.",
        category: "Ώρα"
      },
      {
        id: "nt-3",
        dutch: "Tellen (1, 2, 3)",
        greek: "Een, twee, drie",
        phonetic: "έιν, τβέι, ντρι",
        partOfSpeech: "αριθμοί",
        exampleDutch: "Ik heb drie katten.",
        exampleGreek: "Έχω τρεις γάτες.",
        category: "Αριθμοί"
      },
      {
        id: "nt-4",
        dutch: "Vier, vijf, zes",
        greek: "Τέσσερα, πέντε, έξι",
        phonetic: "φιρ, φέιφ, ζες",
        partOfSpeech: "αριθμοί",
        exampleDutch: "De winkel sluit om zes uur.",
        exampleGreek: "Το κατάστημα κλείνει στις έξι η ώρα.",
        category: "Αριθμοί"
      }
    ]
  },
  {
    id: "essential-verbs",
    name: "Χρήσιμα Ρήματα",
    description: "Τα πιο συχνά χρησιμοποιούμενα ρήματα της ολλανδικής γλώσσας που πρέπει να ξέρετε.",
    iconName: "Activity",
    cards: [
      {
        id: "ev-1",
        dutch: "Zijn",
        greek: "Είμαι (ρήμα)",
        phonetic: "ζέιν",
        partOfSpeech: "ρήμα",
        exampleDutch: "Wij zijn heel blij om hier te zijn.",
        exampleGreek: "Είμαστε πολύ χαρούμενοι που είμαστε εδώ.",
        category: "Ρήματα"
      },
      {
        id: "ev-2",
        dutch: "Hebben",
        greek: "Έχω (ρήμα)",
        phonetic: "χέμπεν",
        partOfSpeech: "ρήμα",
        exampleDutch: "Hebt u een vraag?",
        exampleGreek: "Έχετε κάποια ερώτηση;",
        category: "Ρήματα"
      },
      {
        id: "ev-3",
        dutch: "Spreken",
        greek: "Μιλάω (ρήμα)",
        phonetic: "σπρέικεν",
        partOfSpeech: "ρήμα",
        exampleDutch: "Ik spreek een beetje Nederlands.",
        exampleGreek: "Μιλάω λίγα Ολλανδικά.",
        category: "Ρήματα"
      },
      {
        id: "ev-4",
        dutch: "Leren",
        greek: "Μαθαίνω / Μελετάω (ρήμα)",
        phonetic: "λέιρεν",
        partOfSpeech: "ρήμα",
        exampleDutch: "Wij leren Nederlands met flashcards!",
        exampleGreek: "Μαθαίνουμε Ολλανδικά με κάρτες (flashcards)!",
        category: "Ρήματα"
      },
      {
        id: "ev-5",
        dutch: "Kopen",
        greek: "Αγοράζω (ρήμα)",
        phonetic: "κόουπεν",
        partOfSpeech: "ρήμα",
        exampleDutch: "Ik wil graag brood kopen.",
        exampleGreek: "Θα ήθελα να αγοράσω ψωμί.",
        category: "Ρήματα"
      }
    ]
  }
];
