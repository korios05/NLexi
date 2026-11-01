// Απευθείας σύνδεση με Gemini API — χωρίς server.
// Το κλειδί αποθηκεύεται μόνο στο κινητό (Ρυθμίσεις).
(function () {
  const API = "https://generativelanguage.googleapis.com/v1beta/models/";
  // Σειρά μοντέλων: αν ένα «γεμίσει» (όριο δωρεάν χρήσης), δοκιμάζουμε το επόμενο.
  const DEFAULT_MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"];
  const TIMEOUT_MS = 45000;
  const CACHE_KEY = "nlx_ai_cache";

  const TEACHER = `Είσαι έμπειρος καθηγητής Ολλανδικών για Έλληνες μαθητές.
Η φωνητική προφορά γράφεται ΜΕ ΕΛΛΗΝΙΚΟΥΣ ΧΑΡΑΚΤΗΡΕΣ και με τόνο στη συλλαβή που τονίζεται (π.χ. "Goedendag" → "χούιεν-νταχ", "Dank u" → "ντανκ υ", "huis" → "χάους").
Στα ουσιαστικά γράφε το άρθρο (de/het) μπροστά από την ολλανδική λέξη.
Το παράδειγμα στα ολλανδικά πρέπει να περιέχει ΑΚΡΙΒΩΣ τη λέξη/φράση όπως είναι γραμμένη (χωρίς το άρθρο αν δεν ταιριάζει), είναι απλό και καθημερινό (επίπεδο A1–A2).`;

  const CARD_PROPS = {
    dutch: { type: "STRING" },
    greek: { type: "STRING" },
    phonetic: { type: "STRING" },
    partOfSpeech: { type: "STRING" },
    exampleDutch: { type: "STRING" },
    exampleGreek: { type: "STRING" },
  };
  const CARD_SCHEMA = { type: "OBJECT", properties: CARD_PROPS, required: Object.keys(CARD_PROPS) };

  class AIError extends Error {
    constructor(msg, kind) { super(msg); this.kind = kind; }
  }

  function settings() {
    try { return JSON.parse(localStorage.getItem("nlx_settings") || "{}"); } catch { return {}; }
  }
  function modelChain() {
    const s = settings();
    const custom = (s.aiModel || "").trim();
    return custom ? [custom, ...DEFAULT_MODELS.filter((m) => m !== custom)] : DEFAULT_MODELS;
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function loadCache() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; } }
  function saveCache(c) {
    const keys = Object.keys(c);
    if (keys.length > 800) keys.slice(0, keys.length - 800).forEach((k) => delete c[k]);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
  }
  const cacheKey = (w) => w.trim().toLowerCase();

  async function callOnce(model, key, body) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    let res;
    try {
      res = await fetch(API + encodeURIComponent(model) + ":generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
    } catch (e) {
      if (e.name === "AbortError") throw new AIError("Το AI άργησε πολύ να απαντήσει. Δοκίμασε ξανά.", "timeout");
      throw new AIError("Δεν υπάρχει σύνδεση στο internet.", "network");
    } finally { clearTimeout(t); }

    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const msg = data?.error?.message || "";
      const status = data?.error?.status || "";
      if (res.status === 429 || status === "RESOURCE_EXHAUSTED") throw new AIError(msg, "quota");
      if (res.status === 404 || status === "NOT_FOUND") throw new AIError(msg, "model");
      if (res.status === 400 && /api key/i.test(msg)) throw new AIError("Το κλειδί Gemini δεν είναι έγκυρο. Έλεγξέ το στις Ρυθμίσεις.", "key");
      if (res.status === 403) throw new AIError("Το κλειδί Gemini δεν έχει πρόσβαση. Έλεγξέ το στις Ρυθμίσεις.", "key");
      if (res.status >= 500) throw new AIError(msg, "server");
      throw new AIError("Σφάλμα AI: " + (msg || res.status), "other");
    }
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.filter((p) => !p.thought).map((p) => p.text || "").join("").trim();
    if (!text) throw new AIError("Το AI δεν επέστρεψε απάντηση. Δοκίμασε ξανά.", "empty");
    return text;
  }

  // Δοκιμάζει τα μοντέλα με τη σειρά, με επαναλήψεις για προσωρινά σφάλματα.
  async function generate({ system, prompt, schema, temperature = 0.4 }) {
    const key = (settings().apiKey || "").trim();
    if (!key) throw new AIError("Πρόσθεσε πρώτα το δωρεάν κλειδί Gemini στις Ρυθμίσεις.", "nokey");

    const body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    if (schema) {
      body.generationConfig.responseMimeType = "application/json";
      body.generationConfig.responseSchema = schema;
    }

    let lastErr = null;
    for (const model of modelChain()) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const text = await callOnce(model, key, body);
          if (!schema) return text;
          try { return JSON.parse(text); }
          catch { throw new AIError("Μη έγκυρη απάντηση AI.", "server"); }
        } catch (e) {
          lastErr = e;
          if (e.kind === "key" || e.kind === "nokey" || e.kind === "network") throw e;
          if (e.kind === "quota" || e.kind === "model") break;          // επόμενο μοντέλο
          if (e.kind === "server" || e.kind === "timeout" || e.kind === "empty") {
            await sleep(1500 * (attempt + 1));                          // ξαναδοκίμασε
            continue;
          }
          throw e;
        }
      }
    }
    if (lastErr?.kind === "quota")
      throw new AIError("Έφτασες το όριο δωρεάν χρήσης της Google για τώρα. Δοκίμασε σε λίγα λεπτά ή αύριο. (Δες «Όριο AI» στις Ρυθμίσεις.)", "quota");
    if (lastErr?.kind === "model")
      throw new AIError("Το μοντέλο AI δεν βρέθηκε. Άφησε κενό το πεδίο «Μοντέλο» στις Ρυθμίσεις.", "model");
    throw lastErr || new AIError("Άγνωστο σφάλμα AI.", "other");
  }

  // Μετάφραση ΠΟΛΛΩΝ λέξεων με ΜΙΑ κλήση (+ αποθήκευση για να μην ξαναζητηθούν).
  async function translateMany(words) {
    const clean = [...new Set(words.map((w) => w.trim()).filter(Boolean))];
    const cache = loadCache();
    const missing = clean.filter((w) => !cache[cacheKey(w)]);

    for (let i = 0; i < missing.length; i += 25) {
      const chunk = missing.slice(i, i + 25);
      const data = await generate({
        system: TEACHER,
        prompt: `Μετέφρασε στα ελληνικά τις παρακάτω ολλανδικές λέξεις/φράσεις. Επίστρεψε μία κάρτα για κάθε μία, με την ίδια σειρά. Στο πεδίο "source" βάλε την αρχική λέξη ακριβώς όπως δόθηκε.\n\n${chunk.map((w, n) => `${n + 1}. ${w}`).join("\n")}`,
        schema: {
          type: "OBJECT",
          properties: {
            cards: {
              type: "ARRAY",
              items: { type: "OBJECT", properties: { source: { type: "STRING" }, ...CARD_PROPS }, required: ["source", ...Object.keys(CARD_PROPS)] },
            },
          },
          required: ["cards"],
        },
      });
      (data.cards || []).forEach((c, n) => {
        const src = c.source || chunk[n];
        if (src) cache[cacheKey(src)] = c;
      });
      saveCache(cache);
    }
    return clean.map((w) => {
      const c = cache[cacheKey(w)];
      return c ? { ...c, dutch: c.dutch || w } : null;
    }).filter(Boolean);
  }

  async function translateOne(word) {
    const r = await translateMany([word]);
    if (!r.length) throw new AIError("Δεν βρέθηκε μετάφραση.", "empty");
    return r[0];
  }

  // Ελληνικά → Ολλανδικά (όταν ο χρήστης ξέρει μόνο την ελληνική λέξη)
  async function fromGreek(greek) {
    return generate({
      system: TEACHER,
      prompt: `Δώσε την πιο συνηθισμένη ολλανδική απόδοση της ελληνικής λέξης/φράσης: "${greek.trim()}". Στο πεδίο greek βάλε την ελληνική λέξη (μπορείς να τη διορθώσεις ελαφρά).`,
      schema: CARD_SCHEMA,
    });
  }

  async function generateDeck(topic, count = 10, level = "A1") {
    return generate({
      system: TEACHER,
      temperature: 0.7,
      prompt: `Φτιάξε τράπουλα με ${count} χρήσιμες κάρτες (λέξεις ή συχνές φράσεις) επιπέδου ${level} για το θέμα: "${topic.trim()}". Χωρίς επαναλήψεις. Δώσε σύντομο ελληνικό τίτλο, μία πρόταση περιγραφή και ένα emoji που ταιριάζει.`,
      schema: {
        type: "OBJECT",
        properties: {
          deckName: { type: "STRING" },
          description: { type: "STRING" },
          emoji: { type: "STRING" },
          cards: { type: "ARRAY", items: CARD_SCHEMA },
        },
        required: ["deckName", "description", "cards"],
      },
    });
  }

  async function coach(summary) {
    return generate({
      system: "Είσαι ζεστός, ενθαρρυντικός καθηγητής Ολλανδικών για Έλληνες. Γράφεις σύντομα (έως 120 λέξεις), στα ελληνικά, απλό κείμενο χωρίς markdown, με 2–3 συγκεκριμένες συμβουλές.",
      prompt: `Ανάλυσε την πρόοδο του μαθητή και δώσε ανατροφοδότηση:\n${summary}`,
      temperature: 0.7,
    });
  }

  async function test() {
    const t = await generate({ prompt: "Απάντησε μόνο με τη λέξη: OK", temperature: 0 });
    return t;
  }

  window.AI = { translateOne, translateMany, fromGreek, generateDeck, coach, test, AIError };
})();
