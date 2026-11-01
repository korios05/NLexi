/* NLexi — εκμάθηση Ολλανδικών για Έλληνες */
(function () {
  "use strict";

  // ================= Βοηθητικά =================
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const addDays = (n, from = new Date()) => { const d = new Date(from); d.setDate(d.getDate() + n); return dayKey(d); };
  const today = () => dayKey();
  const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast("Δεν έγινε αποθήκευση (γεμάτη μνήμη)"); } };

  const Cap = window.Capacitor;
  const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  const pluginCache = {};
  const plugin = (name) => {
    if (!isNative) return null;
    if (name in pluginCache) return pluginCache[name];
    const reg = (window.capacitorExports && window.capacitorExports.registerPlugin) || Cap.registerPlugin;
    let p = (Cap.Plugins && Cap.Plugins[name]) || null;
    try { if (!p && reg) p = reg(name); } catch { p = null; }
    return (pluginCache[name] = p);
  };

  // ================= Εικονίδια =================
  const svg = (p, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
  const I = {
    home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
    decks: svg('<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>'),
    chart: svg('<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    back: svg('<path d="M15 18l-6-6 6-6"/>'),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    speak: svg('<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    spark: svg('<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    trash: svg('<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>'),
    edit: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    list: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
    swap: svg('<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/>'),
  };

  // ================= Δεδομένα =================
  const DEFAULT_SETTINGS = {
    direction: "nl-gr", dailyGoal: 20, newPerDay: 10, autoSpeak: true, speechRate: 0.85,
    reminder: false, reminderTime: "19:00", apiKey: "", aiModel: "", name: "",
  };
  const ICON_EMOJI = { MessageCircle: "👋", Utensils: "🍽️", MapPin: "🗺️", Clock: "🕒", Activity: "⚡", Home: "🏠", Cart: "🛒", Health: "🩺", Work: "💼" };
  const EMOJIS = ["📘", "🏠", "🍽️", "🛒", "🚲", "💼", "🩺", "🎉", "⚽", "🌷", "🧀", "🐄", "☀️", "🎵", "👨‍👩‍👧", "✈️"];
  const INTERVALS = [0, 1, 3, 7, 14, 30, 90]; // ημέρες ανά «κουτί» επανάληψης

  const S = {
    settings: Object.assign({}, DEFAULT_SETTINGS, load("nlx_settings", {})),
    decks: load("nlx_decks", null),
    stats: load("nlx_stats", null),
  };

  function freshStats() {
    return { streak: 0, best: 0, lastDay: null, sessions: 0, days: {}, modes: { flip: { s: 0, c: 0, t: 0 }, write: { s: 0, c: 0, t: 0 }, quiz: { s: 0, c: 0, t: 0 }, gap: { s: 0, c: 0, t: 0 } } };
  }

  function initData() {
    if (!S.stats) S.stats = freshStats();
    if (!S.decks) {
      S.decks = JSON.parse(JSON.stringify(window.BUILTIN_DECKS)).map((d) => ({ ...d, emoji: ICON_EMOJI[d.iconName] || "📘" }));
      // Μεταφορά προσωπικών τραπουλών από την παλιά εφαρμογή NLexi (αν υπάρχουν)
      const old = load("nl_flashcards_decks", null);
      if (Array.isArray(old)) {
        old.filter((d) => d && d.isCustom && Array.isArray(d.cards)).forEach((d) => {
          S.decks.push({ id: "old-" + d.id, name: d.name, description: d.description || "", emoji: "📘", isCustom: true,
            cards: d.cards.map((c) => ({ id: c.id || uid(), dutch: c.dutch, greek: c.greek, phonetic: c.phonetic || "", partOfSpeech: c.partOfSpeech || "", exampleDutch: c.exampleDutch || "", exampleGreek: c.exampleGreek || "" })) });
        });
      }
    } else {
      // Πρόσθεσε νέες έτοιμες τράπουλες από ενημερώσεις
      const deleted = load("nlx_deleted_builtin", []);
      window.BUILTIN_DECKS.forEach((b) => {
        if (!S.decks.some((d) => d.id === b.id) && !deleted.includes(b.id))
          S.decks.push({ ...JSON.parse(JSON.stringify(b)), emoji: ICON_EMOJI[b.iconName] || "📘" });
      });
    }
    saveDecks(); saveStats();
  }
  const saveDecks = () => store("nlx_decks", S.decks);
  const saveStats = () => store("nlx_stats", S.stats);
  const saveSettings = () => store("nlx_settings", S.settings);

  const allCards = () => S.decks.flatMap((d) => d.cards.map((c) => (c._deck = d.id, c)));
  const findDeck = (id) => S.decks.find((d) => d.id === id);
  const dayStat = (k = today()) => (S.stats.days[k] = S.stats.days[k] || { r: 0, c: 0, n: 0 });

  // ================= Επανάληψη σε διαστήματα (SRS) =================
  const isNew = (c) => !c.box;
  const isDue = (c) => c.box > 0 && (c.due || "") <= today();
  const isKnown = (c) => c.box >= 4;
  const level = (c) => (!c.box ? "new" : c.box >= 4 ? "known" : "learning");

  function reviewQueue() {
    const cards = allCards();
    const due = cards.filter(isDue).sort((a, b) => (a.due || "").localeCompare(b.due || ""));
    const newLeft = Math.max(0, S.settings.newPerDay - (S.stats.days[today()]?.n || 0));
    const fresh = cards.filter(isNew).slice(0, newLeft);
    return { due, fresh, all: [...due.slice(0, 100), ...fresh] };
  }

  function touchStreak() {
    const t = today();
    if (S.stats.lastDay === t) return;
    S.stats.streak = S.stats.lastDay === addDays(-1) ? S.stats.streak + 1 : 1;
    S.stats.best = Math.max(S.stats.best || 0, S.stats.streak);
    S.stats.lastDay = t;
  }
  const currentStreak = () => (S.stats.lastDay === today() || S.stats.lastDay === addDays(-1) ? S.stats.streak : 0);

  function recordAnswer(card, correct, mode, firstTry) {
    const strong = mode === "flip" || mode === "write" || mode === "review";
    const wasNew = isNew(card);
    if (correct) {
      if (strong) { card.box = Math.min((card.box || 0) + 1, 6); card.due = addDays(INTERVALS[card.box]); }
      else if (wasNew) { card.box = 1; card.due = addDays(1); }
    } else {
      card.lapses = (card.lapses || 0) + (wasNew ? 0 : 1);
      card.box = 1; card.due = today();
    }
    card.last = today();
    if (firstTry) {
      touchStreak();
      const d = dayStat(); d.r++; if (correct) d.c++; if (wasNew) d.n++;
      const m = S.stats.modes[mode === "review" ? "flip" : mode]; m.t++; if (correct) m.c++;
    }
    saveDecks(); saveStats();
  }

  // ================= Native: φωνή, δόνηση, υπενθυμίσεις =================
  let webVoices = [];
  if ("speechSynthesis" in window) {
    const lv = () => (webVoices = speechSynthesis.getVoices());
    lv(); speechSynthesis.onvoiceschanged = lv;
  }
  function speak(text, lang = "nl-NL") {
    if (!text) return;
    const rate = S.settings.speechRate || 0.85;
    const tts = plugin("TextToSpeech");
    if (tts) {
      tts.stop().catch(() => {}).finally(() =>
        tts.speak({ text, lang, rate, pitch: 1, volume: 1, category: "ambient" }).catch(() =>
          toast(lang.startsWith("nl") ? "Εγκατάστησε ολλανδική φωνή: Ρυθμίσεις κινητού → Μετατροπή κειμένου σε ομιλία" : "Η φωνή δεν είναι διαθέσιμη")));
      return;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = rate;
      const v = webVoices.find((v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    }
  }
  function buzz(kind) {
    const h = plugin("Haptics");
    if (h) h.impact({ style: kind === "bad" ? "HEAVY" : "LIGHT" }).catch(() => {});
    else if (navigator.vibrate) navigator.vibrate(kind === "bad" ? 60 : 15);
  }
  async function scheduleReminder() {
    const ln = plugin("LocalNotifications");
    if (!ln) return false;
    try {
      await ln.cancel({ notifications: [{ id: 1 }] }).catch(() => {});
      if (!S.settings.reminder) return true;
      let p = await ln.checkPermissions();
      if (p.display !== "granted") p = await ln.requestPermissions();
      if (p.display !== "granted") { toast("Χρειάζεται άδεια ειδοποιήσεων"); return false; }
      const [hour, minute] = (S.settings.reminderTime || "19:00").split(":").map(Number);
      await ln.schedule({ notifications: [{
        id: 1, title: "NLexi 🇳🇱", body: "Ώρα για 5 λεπτά Ολλανδικά! Κράτα ζωντανό το σερί σου 🔥",
        schedule: { on: { hour, minute }, allowWhileIdle: true },
      }] });
      return true;
    } catch (e) { console.error(e); toast("Η υπενθύμιση δεν ρυθμίστηκε"); return false; }
  }

  // ================= UI βασικά =================
  let toastTimer;
  function toast(msg, ms = 2600) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  let sheetOnClose = null;
  function openSheet(html, onClose) {
    $("#sheet-root").innerHTML = `<div class="sheet-backdrop" data-act="sheet-bg"><div class="sheet" role="dialog"><div class="grab"></div>${html}</div></div>`;
    sheetOnClose = onClose || null;
  }
  function closeSheet() {
    if (!$("#sheet-root").innerHTML) return false;
    $("#sheet-root").innerHTML = "";
    const f = sheetOnClose; sheetOnClose = null; if (f) f();
    return true;
  }
  const sheetOpen = () => !!$("#sheet-root").innerHTML;

  function confirmBox(text, ok = "Ναι", danger = false) {
    return new Promise((resolve) => {
      let done = false;
      openSheet(`<div class="stack-lg"><h2>${esc(text)}</h2>
        <div class="row"><button class="btn grow" data-act="cf-no">Άκυρο</button><button class="btn grow ${danger ? "bad" : "primary"}" data-act="cf-yes">${esc(ok)}</button></div></div>`,
        () => { if (!done) resolve(false); });
      ACT["cf-yes"] = () => { done = true; closeSheet(); resolve(true); };
      ACT["cf-no"] = () => { done = true; closeSheet(); resolve(false); };
    });
  }

  function setBusy(btn, busy, label) {
    if (!btn) return;
    if (busy) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>${esc(label || "Περιμένετε…")}`; }
    else { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
  }
  const aiErr = (e) => { console.error(e); toast(e.message || "Σφάλμα AI", 5000); };

  // ================= Πλοήγηση =================
  const TABS = [["home", "Σήμερα", I.home], ["decks", "Τράπουλες", I.decks], ["stats", "Πρόοδος", I.chart], ["settings", "Ρυθμίσεις", I.gear]];
  let stack = [{ v: "home", p: {} }];
  const cur = () => stack[stack.length - 1];
  function go(v, p = {}) { stack.push({ v, p }); render(true); }
  function tab(v) { stack = [{ v, p: {} }]; render(true); }
  function replace(v, p = {}) { stack[stack.length - 1] = { v, p }; render(true); }
  async function back() {
    if (closeSheet()) return true;
    if (cur().v === "study" && session && !session.done && session.answered > 0) {
      if (!(await confirmBox("Έξοδος από την εξάσκηση; Οι απαντήσεις σου έχουν ήδη αποθηκευτεί."))) return true;
    }
    if (stack.length > 1) { stack.pop(); render(true); return true; }
    if (cur().v !== "home") { tab("home"); return true; }
    return false;
  }

  function render(scrollTop) {
    const { v, p } = cur();
    const fullScreen = ["study", "results"].includes(v);
    document.body.classList.toggle("no-tabs", fullScreen || stack.length > 1);
    $("#tabbar").innerHTML = TABS.map(([id, label, ico]) =>
      `<button class="tab ${stack[0].v === id ? "active" : ""}" data-act="tab" data-v="${id}"><span class="tab-ico">${ico}</span>${label}</button>`).join("");
    $("#view").innerHTML = `<div class="fade-in">${VIEWS[v](p)}</div>`;
    if (scrollTop) window.scrollTo(0, 0);
    AFTER[v] && AFTER[v](p);
  }

  const topbar = (title, right = "") => `<div class="topbar"><button class="icon-btn" data-act="back" aria-label="Πίσω">${I.back}</button><h2>${title}</h2>${right}</div>`;
  const deckEmoji = (d) => esc(d.emoji || ICON_EMOJI[d.iconName] || "📘");
  const front = (c, dir) => (dir === "gr-nl" ? c.greek : c.dutch);
  const backSide = (c, dir) => (dir === "gr-nl" ? c.dutch : c.greek);

  // ================= Οθόνες =================
  const VIEWS = {};
  const AFTER = {};

  // ---------- Σήμερα ----------
  VIEWS.home = () => {
    const q = reviewQueue();
    const d = S.stats.days[today()] || { r: 0 };
    const goal = S.settings.dailyGoal;
    const pct = Math.min(1, d.r / goal);
    const R = 40, C = 2 * Math.PI * R;
    const streak = currentStreak();
    const cards = allCards();
    const wotd = cards.length ? cards[[...today()].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) % cards.length] : null;
    const h = new Date().getHours();
    const hello = h < 12 ? "Goedemorgen" : h < 18 ? "Goedemiddag" : "Goedenavond";
    const unknown = cards.filter((c) => c.box === 1 && c.last).length;

    return `
      <div class="hello row between">
        <div><div class="muted small" style="font-weight:700">${esc(hello)}${S.settings.name ? ", " + esc(S.settings.name) : ""}! 👋</div>
        <div class="display">Ας μάθουμε ολλανδικά</div></div>
      </div>

      <div class="box today-card">
        <div class="ring">
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${R}" stroke="#E8E4DC" stroke-width="12" fill="none"/>
          <circle cx="50" cy="50" r="${R}" stroke="${pct >= 1 ? "#1F9D55" : "#FF5733"}" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
          <div class="ring-label"><div><b>${d.r}</b><span class="tiny muted">/ ${goal}</span></div></div>
        </div>
        <div class="grow stack">
          <div><h3>${pct >= 1 ? "Στόχος επιτεύχθηκε! 🎉" : "Ο στόχος της ημέρας"}</h3>
          <p class="small muted">${q.due.length} για επανάληψη · ${q.fresh.length} νέες λέξεις</p></div>
          ${q.all.length
            ? `<button class="btn primary block" data-act="start-review">▶ Ξεκίνα (${q.all.length})</button>`
            : `<button class="btn block sun" data-act="extra-practice">Όλα έτοιμα — εξάσκηση ✨</button>`}
        </div>
      </div>

      <div class="stat-grid" style="margin-top:14px">
        <div class="stat"><b>🔥 ${streak}</b><span>μέρες σερί</span></div>
        <div class="stat"><b>${cards.filter(isKnown).length}</b><span>έμαθες</span></div>
        <div class="stat"><b>${cards.length}</b><span>λέξεις</span></div>
      </div>

      ${wotd ? `
      <div class="section-title"><h2>Λέξη της ημέρας</h2></div>
      <div class="box sky row">
        <div class="grow"><div class="display" style="font-size:24px;font-weight:700">${esc(wotd.dutch)}</div>
        <div class="small" style="font-weight:700">${esc(wotd.phonetic || "")}</div>
        <div style="margin-top:4px">${esc(wotd.greek)}</div>
        ${wotd.exampleDutch ? `<div class="small muted" style="margin-top:8px"><i>${esc(wotd.exampleDutch)}</i></div>` : ""}</div>
        <button class="icon-btn" data-act="speak" data-t="${esc(wotd.dutch)}" aria-label="Άκουσε">${I.speak}</button>
      </div>` : ""}

      <div class="section-title"><h2>Γρήγορη εξάσκηση</h2><span class="small muted">όλες οι τράπουλες</span></div>
      <div class="mode-grid">
        <button class="mode-tile" data-act="practice" data-mode="flip" data-deck="all"><span class="emoji">🃏</span><div><b>Κάρτες</b><br><span>γύρνα & θυμήσου</span></div></button>
        <button class="mode-tile" data-act="practice" data-mode="quiz" data-deck="all"><span class="emoji">🎯</span><div><b>Κουίζ</b><br><span>4 επιλογές</span></div></button>
        <button class="mode-tile" data-act="practice" data-mode="write" data-deck="all"><span class="emoji">⌨️</span><div><b>Γράψε το</b><br><span>ορθογραφία</span></div></button>
        <button class="mode-tile" data-act="practice" data-mode="gap" data-deck="all"><span class="emoji">🧩</span><div><b>Κενά</b><br><span>λέξη σε πρόταση</span></div></button>
      </div>
      ${unknown ? `<button class="btn block" style="margin-top:12px" data-act="practice" data-mode="flip" data-deck="weak">🔁 Λέξεις που με δυσκολεύουν (${unknown})</button>` : ""}
    `;
  };

  // ---------- Τράπουλες ----------
  let searchQ = "";
  VIEWS.decks = () => `
    <div class="row between" style="margin-bottom:14px"><h1>Τράπουλες</h1></div>
    <label class="search">${I.search}<input id="search" type="search" placeholder="Αναζήτηση λέξης (ελληνικά ή ολλανδικά)" value="${esc(searchQ)}" autocomplete="off"></label>
    <div class="row" style="margin:14px 0 16px">
      <button class="btn grow" data-act="new-deck">${I.plus} Νέα</button>
      <button class="btn primary grow" data-act="ai-deck">${I.spark} AI τράπουλα</button>
    </div>
    <div id="deck-results">${deckResults()}</div>`;
  function deckResults() {
    const q = searchQ.trim().toLowerCase();
    if (q) {
      const hits = allCards().filter((c) => (c.dutch + " " + c.greek).toLowerCase().includes(q)).slice(0, 60);
      if (!hits.length) return `<div class="empty"><span class="emoji">🔍</span>Δεν βρέθηκε «${esc(searchQ)}».<br><br><button class="btn primary" data-act="add-word-search">${I.plus} Πρόσθεσέ το</button></div>`;
      return `<div class="box flat">${hits.map((c) => wordRow(c, true)).join("")}</div>`;
    }
    if (!S.decks.length) return `<div class="empty"><span class="emoji">📭</span>Δεν υπάρχουν τράπουλες.</div>`;
    return `<div class="deck-list">${S.decks.map((d) => {
      const known = d.cards.filter(isKnown).length, due = d.cards.filter(isDue).length;
      const pct = d.cards.length ? Math.round((known / d.cards.length) * 100) : 0;
      return `<button class="deck-item" data-act="open-deck" data-id="${esc(d.id)}">
        <span class="deck-emoji">${deckEmoji(d)}</span>
        <span class="grow"><b>${esc(d.name)}</b><span class="small muted">${d.cards.length} λέξεις · ${pct}% μαθημένες</span>
        <div class="progress"><i style="width:${pct}%"></i></div></span>
        ${due ? `<span class="chip accent">${due}</span>` : ""}
      </button>`;
    }).join("")}</div>`;
  }
  function wordRow(c, showDeck) {
    const dl = c.lapses && c.box === 1 ? "lapse" : "l" + (c.box || 0);
    const d = showDeck ? findDeck(c._deck) : null;
    return `<div class="word-row">
      <span class="dot ${dl}" title="${level(c)}"></span>
      <button class="grow" style="text-align:left;background:none;border:0;padding:0" data-act="edit-card" data-deck="${esc(c._deck)}" data-id="${esc(c.id)}">
        <div class="w">${esc(c.dutch)}</div><div class="small muted">${esc(c.greek)}${d ? ` · ${deckEmoji(d)} ${esc(d.name)}` : ""}</div>
      </button>
      <button class="icon-btn plain" data-act="speak" data-t="${esc(c.dutch)}" aria-label="Άκουσε">${I.speak}</button>
    </div>`;
  }
  AFTER.decks = () => {
    const inp = $("#search");
    inp.addEventListener("input", () => { searchQ = inp.value; $("#deck-results").innerHTML = deckResults(); });
  };

  // ---------- Τράπουλα ----------
  VIEWS.deck = ({ id }) => {
    const d = findDeck(id);
    if (!d) return topbar("—") + `<div class="empty">Η τράπουλα δεν βρέθηκε.</div>`;
    d.cards.forEach((c) => (c._deck = d.id));
    const known = d.cards.filter(isKnown).length, due = d.cards.filter(isDue).length, fresh = d.cards.filter(isNew).length;
    const weak = d.cards.filter((c) => c.box === 1 && c.last).length;
    const hasEx = d.cards.filter((c) => c.exampleDutch).length;
    return topbar(`${deckEmoji(d)} ${esc(d.name)}`, `<button class="icon-btn" data-act="deck-menu" data-id="${esc(d.id)}" aria-label="Επεξεργασία">${I.edit}</button>`) + `
      ${d.description ? `<p class="muted" style="margin:-6px 0 14px">${esc(d.description)}</p>` : ""}
      <div class="stat-grid">
        <div class="stat"><b>${fresh}</b><span>νέες</span></div>
        <div class="stat"><b>${due}</b><span>για επανάληψη</span></div>
        <div class="stat"><b>${known}</b><span>μαθημένες</span></div>
      </div>
      ${d.cards.length ? `
      <div class="section-title"><h2>Εξάσκηση</h2></div>
      <div class="mode-grid">
        <button class="mode-tile" data-act="practice" data-mode="flip" data-deck="${esc(d.id)}"><span class="emoji">🃏</span><div><b>Κάρτες</b><br><span>${d.cards.length} λέξεις</span></div></button>
        <button class="mode-tile" data-act="practice" data-mode="quiz" data-deck="${esc(d.id)}" ${d.cards.length < 4 && allCards().length < 4 ? "disabled" : ""}><span class="emoji">🎯</span><div><b>Κουίζ</b><br><span>4 επιλογές</span></div></button>
        <button class="mode-tile" data-act="practice" data-mode="write" data-deck="${esc(d.id)}"><span class="emoji">⌨️</span><div><b>Γράψε το</b><br><span>ορθογραφία</span></div></button>
        <button class="mode-tile" data-act="practice" data-mode="gap" data-deck="${esc(d.id)}"><span class="emoji">🧩</span><div><b>Κενά</b><br><span>${hasEx} προτάσεις</span></div></button>
      </div>
      ${weak ? `<button class="btn block" style="margin-top:12px" data-act="practice" data-mode="flip" data-deck="${esc(d.id)}" data-weak="1">🔁 Μόνο όσες δεν ήξερα (${weak})</button>` : ""}` : ""}

      <div class="section-title"><h2>Λέξεις (${d.cards.length})</h2></div>
      <div class="row" style="margin-bottom:12px">
        <button class="btn grow sm" data-act="add-word" data-deck="${esc(d.id)}">${I.plus} Λέξη</button>
        <button class="btn grow sm primary" data-act="bulk-add" data-deck="${esc(d.id)}">${I.list} Πολλές μαζί</button>
      </div>
      ${d.cards.length ? `<div class="box flat">${d.cards.map((c) => wordRow(c)).join("")}</div>`
        : `<div class="empty"><span class="emoji">✍️</span>Η τράπουλα είναι άδεια. Πρόσθεσε τις πρώτες σου λέξεις!</div>`}
      <p class="tiny muted center" style="margin-top:14px">⚪ νέα · 🟡 μαθαίνεις · 🟢 την ξέρεις · 🔴 τη ξέχασες</p>`;
  };

  // ---------- Εξάσκηση ----------
  let session = null;

  function normalize(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[.,!?¿¡;:'"«»()\-–]/g, " ").replace(/\s+/g, " ").trim();
  }
  const stripArticle = (s) => s.replace(/^(de|het|een|'t)\s+/i, "");
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i), pp = prev;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], pp[j - 2] + 1);
      }
      pp = prev; prev = cur;
    }
    return prev[n];
  }
  function checkWritten(input, answer) {
    const a = normalize(input);
    if (!a) return "wrong";
    const variants = String(answer).split("/").map(normalize).filter(Boolean);
    for (const v of variants) if (a === v) return "right";
    for (const v of variants) {
      if (stripArticle(a) === stripArticle(v)) return a !== v && /^(de|het|een) /.test(v) ? "article" : "right";
    }
    for (const v of variants) {
      const x = stripArticle(v);
      if (x.length >= 4 && (lev(a, v) <= 1 || lev(stripArticle(a), x) <= 1)) return "almost";
    }
    return "wrong";
  }

  function gapFor(card) {
    const ex = card.exampleDutch || "";
    if (!ex) return null;
    const escRe = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    for (const w of [card.dutch.replace(/[!?.]+$/, ""), stripArticle(card.dutch.replace(/[!?.]+$/, ""))]) {
      if (w.length < 2) continue;
      const re = new RegExp("(^|[^\\p{L}])(" + escRe(w) + ")(?=$|[^\\p{L}])", "iu");
      const m = ex.match(re);
      if (m) return { sentence: ex.replace(re, (all, pre) => pre + "\u0000"), word: m[2] };
    }
    return null;
  }

  function pickCards(deckId, opts = {}) {
    let pool;
    if (deckId === "all") pool = allCards();
    else if (deckId === "weak") pool = allCards().filter((c) => c.box === 1 && c.last);
    else { const d = findDeck(deckId); pool = d ? d.cards.map((c) => (c._deck = d.id, c)) : []; }
    if (opts.weak) pool = pool.filter((c) => c.box === 1 && c.last);
    return pool;
  }

  function startSession(mode, deckId, opts = {}) {
    const dir = S.settings.direction;
    let pool = opts.cards || pickCards(deckId, opts);
    const title = opts.title || (deckId === "all" ? "Όλες οι τράπουλες" : deckId === "weak" ? "Δύσκολες λέξεις" : findDeck(deckId)?.name || "");
    const limit = opts.cards ? 999 : deckId === "all" || deckId === "weak" ? 15 : 30;
    // Προτεραιότητα σε λέξεις που χρειάζονται επανάληψη
    if (!opts.cards && !opts.ordered) pool = shuffle(pool).sort((a, b) => (isDue(b) - isDue(a)) || ((a.box || 0) - (b.box || 0)));
    const distractPool = allCards();
    let items;
    if (mode === "gap") {
      items = shuffle(pool).map((c) => { const g = gapFor(c); return g && { card: c, ...g }; }).filter(Boolean).slice(0, Math.min(limit, 15));
      if (items.length < 1) return toast("Δεν υπάρχουν λέξεις με παραδείγματα προτάσεων εδώ.", 3500);
      items.forEach((it) => {
        const noArt = !/^(de|het|een)\s/i.test(it.word);
        const others = shuffle(distractPool.filter((c) => normalize(c.dutch) !== normalize(it.card.dutch)))
          .map((c) => (noArt ? stripArticle(c.dutch) : c.dutch).replace(/[!?.]+$/, ""))
          .filter((w, i, a) => a.indexOf(w) === i && normalize(w) !== normalize(it.word)).slice(0, 3);
        it.options = shuffle([it.word, ...others]); it.answer = it.word;
      });
    } else if (mode === "quiz") {
      if (distractPool.length < 4) return toast("Χρειάζονται τουλάχιστον 4 λέξεις για κουίζ.");
      items = pool.slice(0, Math.min(limit, 15)).map((c) => {
        const ans = backSide(c, dir);
        const others = shuffle(distractPool.filter((o) => normalize(backSide(o, dir)) !== normalize(ans)))
          .map((o) => backSide(o, dir)).filter((w, i, a) => a.indexOf(w) === i).slice(0, 3);
        return { card: c, options: shuffle([ans, ...others]), answer: ans };
      });
    } else {
      items = pool.slice(0, limit).map((c) => ({ card: c }));
    }
    if (!items.length) return toast("Δεν υπάρχουν λέξεις για εξάσκηση.");
    session = { mode, dir, title, deckId, items, idx: 0, right: 0, wrong: 0, wrongCards: [], requeued: new Set(), answered: 0, state: null, done: false, review: !!opts.review };
    S.stats.sessions++; S.stats.modes[mode].s++; saveStats();
    go("study");
  }

  const MODE_NAMES = { flip: "Κάρτες", quiz: "Κουίζ", write: "Γράψε το", gap: "Κενά" };

  VIEWS.study = () => {
    const s = session;
    if (!s) return `<div class="empty">Καμία εξάσκηση.</div>`;
    const it = s.items[s.idx];
    const pct = (s.idx / s.items.length) * 100;
    const top = `<div class="session-top"><button class="icon-btn" data-act="back" aria-label="Κλείσιμο">${I.close}</button>
      <div class="progress"><i style="width:${pct}%"></i></div><span class="counter">${s.idx + 1}/${s.items.length}</span></div>
      <div class="row between" style="margin:-6px 0 14px"><span class="chip">${MODE_NAMES[s.mode]}${s.review ? " · Επανάληψη" : ""}</span><span class="small muted" style="font-weight:700">${esc(s.title)}</span></div>`;
    const c = it.card;
    const nlFront = s.dir !== "gr-nl";

    if (s.mode === "flip") {
      const f = front(c, s.dir), b = backSide(c, s.dir);
      return top + `
        <div class="flash-wrap"><div class="flashcard ${s.state === "flipped" ? "flipped" : ""}" id="fc" data-act="flip">
          <div class="face front">
            ${nlFront ? `<button class="icon-btn speak" data-act="speak" data-t="${esc(c.dutch)}" aria-label="Άκουσε">${I.speak}</button>` : ""}
            ${c.partOfSpeech ? `<span class="chip">${esc(c.partOfSpeech)}</span>` : ""}
            <div class="big">${esc(f)}</div>
            ${nlFront && c.phonetic ? `<div class="phon">[ ${esc(c.phonetic)} ]</div>` : ""}
            <div class="hint">Πάτα για να γυρίσει · σύρε ← → για απάντηση</div>
          </div>
          <div class="face back">
            <button class="icon-btn speak" data-act="speak" data-t="${esc(c.dutch)}" aria-label="Άκουσε">${I.speak}</button>
            <div class="big">${esc(b)}</div>
            ${c.phonetic ? `<div class="phon">[ ${esc(c.phonetic)} ]</div>` : ""}
            ${c.exampleDutch ? `<div class="ex"><b>${esc(c.exampleDutch)}</b><div class="small muted">${esc(c.exampleGreek || "")}</div></div>` : ""}
          </div>
        </div></div>
        <div class="answer-row">
          <button class="btn bad" data-act="flip-answer" data-ok="0">${I.close} Δεν το ήξερα</button>
          <button class="btn good" data-act="flip-answer" data-ok="1">${I.check} Το ήξερα</button>
        </div>`;
    }

    if (s.mode === "quiz" || s.mode === "gap") {
      const answered = s.state && s.state.picked != null;
      const prompt = s.mode === "quiz"
        ? `<div class="box prompt-card">
            ${nlFront ? `<button class="icon-btn" style="float:right" data-act="speak" data-t="${esc(c.dutch)}">${I.speak}</button>` : ""}
            <div class="small muted" style="font-weight:700">Τι σημαίνει;</div>
            <div class="big">${esc(front(c, s.dir))}</div>
            ${nlFront && c.phonetic ? `<div class="small" style="color:var(--accent);font-weight:700">[ ${esc(c.phonetic)} ]</div>` : ""}
          </div>`
        : `<div class="box prompt-card">
            <div class="small muted" style="font-weight:700;margin-bottom:8px">Συμπλήρωσε το κενό</div>
            <div class="display" style="font-size:22px;font-weight:700;line-height:1.35">${esc(it.sentence).replace("\u0000", answered ? `<u style="color:var(--accent)">${esc(it.word)}</u>` : '<span class="gap">&nbsp;</span>')}</div>
            <div class="muted" style="margin-top:10px">${esc(c.exampleGreek || "")}</div>
          </div>`;
      return top + prompt + `<div class="options" style="margin-top:18px">${it.options.map((o, i) => {
        let cls = "";
        if (answered) cls = o === it.answer ? "correct" : i === s.state.picked ? "wrong" : "dim";
        return `<button class="option ${cls}" data-act="pick" data-i="${i}" ${answered ? "disabled" : ""}>${esc(o)}</button>`;
      }).join("")}</div>
      ${answered ? `<div class="feedback ${s.state.ok ? "ok" : "no"}" style="margin-top:16px">${s.state.ok ? "Σωστά! 🎉" : `Η σωστή απάντηση: ${esc(it.answer)}`}
        <div class="small" style="font-weight:600;margin-top:4px">${esc(c.dutch)} = ${esc(c.greek)}</div></div>
        <button class="btn dark block" style="margin-top:14px" data-act="next">Συνέχεια →</button>` : ""}`;
    }

    if (s.mode === "write") {
      const st = s.state;
      return top + `
        <div class="box prompt-card">
          <div class="small muted" style="font-weight:700">Γράψε στα ολλανδικά</div>
          <div class="big">${esc(c.greek)}</div>
          ${c.partOfSpeech ? `<span class="chip" style="margin-top:8px">${esc(c.partOfSpeech)}</span>` : ""}
        </div>
        <form id="write-form" style="margin-top:18px" class="stack" autocomplete="off">
          <input id="write-input" class="text-input" placeholder="π.χ. de fiets" autocapitalize="off" autocorrect="off" spellcheck="false" ${st ? "disabled" : ""} value="${esc(st?.input || "")}">
          ${st ? `<div class="feedback ${st.result === "wrong" ? "no" : "ok"}">
              ${st.result === "right" ? "Σωστά! 🎉" : st.result === "almost" ? "Σχεδόν! Μικρό ορθογραφικό λάθος 👌" : st.result === "article" ? "Σωστά — πρόσεξε όμως το άρθρο 👀" : "Όχι ακριβώς."}
              <div style="margin-top:6px">Σωστό: <b>${esc(c.dutch)}</b> ${c.phonetic ? `<span class="small">[${esc(c.phonetic)}]</span>` : ""}</div>
              ${c.exampleDutch ? `<div class="small" style="margin-top:6px;font-weight:600"><i>${esc(c.exampleDutch)}</i></div>` : ""}
            </div>
            <button type="button" class="btn dark block" data-act="next">Συνέχεια →</button>`
          : `<div class="row"><button type="button" class="btn grow" data-act="write-skip">Δεν ξέρω</button><button type="submit" class="btn primary grow">Έλεγχος</button></div>`}
        </form>`;
    }
    return "";
  };

  AFTER.study = () => {
    const s = session; if (!s) return;
    const it = s.items[s.idx];
    if (s.mode === "write") {
      const f = $("#write-form"), inp = $("#write-input");
      if (!s.state) setTimeout(() => inp && inp.focus(), 60);
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        if (s.state) return;
        const result = checkWritten(inp.value, it.card.dutch);
        answer(result !== "wrong", { input: inp.value, result });
      });
    }
    if (s.mode === "flip") {
      if (S.settings.autoSpeak && s.dir !== "gr-nl" && !s.state) speak(it.card.dutch);
      attachSwipe($("#fc"));
    }
    if (s.mode === "quiz" && S.settings.autoSpeak && s.dir !== "gr-nl" && !s.state) speak(it.card.dutch);
  };

  function attachSwipe(el) {
    if (!el) return;
    let x0 = null, y0 = null, dx = 0, moved = false;
    el.addEventListener("pointerdown", (e) => { x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; });
    el.addEventListener("pointermove", (e) => {
      if (x0 == null) return;
      dx = e.clientX - x0;
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(e.clientY - y0)) {
        moved = true;
        const flipped = el.classList.contains("flipped");
        el.style.transition = "none";
        el.style.transform = `translateX(${dx}px) rotate(${dx / 25}deg)${flipped ? " rotateY(180deg)" : ""}`;
      }
    });
    const end = () => {
      if (x0 == null) return;
      x0 = null; el.style.transition = ""; el.style.transform = "";
      if (moved && Math.abs(dx) > 90) { el.dataset.swiped = "1"; flipAnswer(dx > 0); }
      else if (moved) el.dataset.swiped = "1";
      setTimeout(() => delete el.dataset.swiped, 50);
    };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  }

  function answer(ok, state) {
    const s = session, it = s.items[s.idx];
    s.seen = s.seen || new Set();
    const first = !s.seen.has(it.card.id);
    s.seen.add(it.card.id);
    recordAnswer(it.card, ok, s.review ? "review" : s.mode, first);
    if (first) { s.answered++; ok ? s.right++ : (s.wrong++, s.wrongCards.push(it.card)); }
    buzz(ok ? "good" : "bad");
    // Στις κάρτες/γραφή, ό,τι δεν ήξερες ξαναεμφανίζεται στο τέλος (μία φορά)
    if (!ok && (s.mode === "flip" || s.mode === "write") && !s.requeued.has(it.card.id)) {
      s.requeued.add(it.card.id); s.items.push({ card: it.card });
    }
    if (s.mode === "flip") return next();
    s.state = state; render();
    if (s.mode === "write") speak(it.card.dutch);
    if (s.mode === "gap") speak(it.card.exampleDutch);
  }
  function flipAnswer(ok) {
    const el = $("#fc");
    if (el) { el.classList.remove("flipped"); el.classList.add(ok ? "swipe-right" : "swipe-left"); }
    setTimeout(() => answer(ok), el ? 220 : 0);
  }
  function next() {
    const s = session;
    s.state = null;
    if (s.idx + 1 >= s.items.length) { s.done = true; replace("results"); return; }
    s.idx++; render(true);
  }

  // ---------- Αποτελέσματα ----------
  VIEWS.results = () => {
    const s = session;
    const total = s.right + s.wrong;
    const pct = total ? Math.round((s.right / total) * 100) : 0;
    const msg = pct === 100 ? "Τέλεια! 🏆" : pct >= 80 ? "Μπράβο! 🎉" : pct >= 50 ? "Καλή δουλειά! 💪" : "Συνέχισε, θα τα μάθεις! 🌱";
    return `
      <div class="box result-hero ${pct >= 80 ? "sun" : ""}" style="margin-top:20px">
        <div class="score">${pct}%</div>
        <h2 style="margin-top:8px">${msg}</h2>
        <p class="muted" style="margin-top:6px">${s.right} σωστές · ${s.wrong} λάθος · 🔥 ${currentStreak()} μέρες σερί</p>
      </div>
      ${s.wrongCards.length ? `
        <div class="section-title"><h2>Για επανάληψη</h2></div>
        <div class="box flat">${s.wrongCards.map((c) => wordRow(c)).join("")}</div>
        <button class="btn primary block" style="margin-top:16px" data-act="retry-wrong">🔁 Ξανά μόνο τα λάθη</button>` : ""}
      <button class="btn dark block" style="margin-top:12px" data-act="finish">Τέλος</button>`;
  };

  // ---------- Πρόοδος ----------
  let coachText = null;
  VIEWS.stats = () => {
    const cards = allCards();
    const lv = { new: 0, learning: 0, known: 0 };
    cards.forEach((c) => lv[level(c)]++);
    const days = [];
    for (let i = 34; i >= 0; i--) days.push(addDays(-i));
    const firstDow = (new Date(days[0]).getDay() + 6) % 7;
    const totalR = Object.values(S.stats.days).reduce((a, d) => a + d.r, 0);
    const totalC = Object.values(S.stats.days).reduce((a, d) => a + d.c, 0);
    const hard = cards.filter((c) => c.lapses).sort((a, b) => b.lapses - a.lapses).slice(0, 6);
    const m = S.stats.modes;
    const acc = (x) => (x.t ? Math.round((x.c / x.t) * 100) : 0);
    return `
      <h1 style="margin-bottom:16px">Πρόοδος</h1>
      <div class="stat-grid">
        <div class="stat"><b>🔥 ${currentStreak()}</b><span>σερί (ρεκόρ ${S.stats.best || 0})</span></div>
        <div class="stat"><b>${totalC ? Math.round((totalC / totalR) * 100) : 0}%</b><span>επιτυχία</span></div>
        <div class="stat"><b>${totalR}</b><span>απαντήσεις</span></div>
      </div>

      <div class="section-title"><h2>Τελευταίες 5 εβδομάδες</h2></div>
      <div class="box flat">
        <div class="heat">${"<i style='visibility:hidden'></i>".repeat(firstDow)}${days.map((k) => {
          const r = S.stats.days[k]?.r || 0;
          const h = r === 0 ? "" : r < 10 ? "h1" : r < S.settings.dailyGoal ? "h2" : "h3";
          return `<i class="${h} ${k === today() ? "today" : ""}" title="${k}: ${r}"></i>`;
        }).join("")}</div>
        <div class="row tiny muted" style="margin-top:10px;justify-content:flex-end;gap:6px">λίγο <span class="heat" style="display:flex;gap:4px"><i style="width:14px"></i><i class="h1" style="width:14px"></i><i class="h2" style="width:14px"></i><i class="h3" style="width:14px"></i></span> στόχος</div>
      </div>

      <div class="section-title"><h2>Οι λέξεις σου</h2></div>
      <div class="box flat bars">
        <div><span>⚪ Νέες</span><div class="progress"><i style="width:${(lv.new / Math.max(1, cards.length)) * 100}%;background:#D6D2CA"></i></div><span>${lv.new}</span></div>
        <div><span>🟡 Μαθαίνεις</span><div class="progress"><i style="width:${(lv.learning / Math.max(1, cards.length)) * 100}%;background:var(--sun)"></i></div><span>${lv.learning}</span></div>
        <div><span>🟢 Τις ξέρεις</span><div class="progress"><i style="width:${(lv.known / Math.max(1, cards.length)) * 100}%;background:var(--good)"></i></div><span>${lv.known}</span></div>
      </div>

      <div class="section-title"><h2>Ανά παιχνίδι</h2></div>
      <div class="box flat bars">
        ${[["🃏 Κάρτες", m.flip], ["🎯 Κουίζ", m.quiz], ["⌨️ Γράψε το", m.write], ["🧩 Κενά", m.gap]].map(([n, x]) =>
          `<div><span>${n}</span><div class="progress"><i style="width:${acc(x)}%"></i></div><span>${x.t ? acc(x) + "%" : "–"}</span></div>`).join("")}
      </div>

      ${hard.length ? `<div class="section-title"><h2>Σε δυσκολεύουν</h2></div>
        <div class="box flat">${hard.map((c) => wordRow(c, true)).join("")}</div>` : ""}

      <div class="section-title"><h2>Ο AI καθηγητής σου</h2></div>
      <div class="box sky stack">
        ${coachText ? `<p class="ai-text">${esc(coachText)}</p>` : `<p class="small">Πάρε προσωπικές συμβουλές με βάση την πρόοδό σου.</p>`}
        <button class="btn dark block" data-act="coach">${I.spark} ${coachText ? "Νέα ανάλυση" : "Ανάλυσε την πρόοδό μου"}</button>
      </div>`;
  };

  // ---------- Ρυθμίσεις ----------
  VIEWS.settings = () => {
    const st = S.settings;
    const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button class="${String(st[key]) === String(v) ? "on" : ""}" data-act="set" data-k="${key}" data-v="${v}">${l}</button>`).join("")}</div>`;
    const sw = (key) => `<label class="switch"><input type="checkbox" data-set="${key}" ${st[key] ? "checked" : ""}><i></i></label>`;
    return `
      <h1 style="margin-bottom:16px">Ρυθμίσεις</h1>

      <div class="box flat">
        <div class="setting"><div class="grow"><b>Το όνομά σου</b></div><input class="text-input" style="width:150px;padding:9px 12px" data-set-text="name" value="${esc(st.name)}" placeholder="προαιρετικό"></div>
        <div class="setting"><div class="grow"><b>Κατεύθυνση</b><span class="small muted">τι βλέπεις πρώτα στην κάρτα</span></div>${seg("direction", [["nl-gr", "🇳🇱→🇬🇷"], ["gr-nl", "🇬🇷→🇳🇱"]])}</div>
        <div class="setting"><div class="grow"><b>Στόχος ημέρας</b><span class="small muted">απαντήσεις</span></div>${seg("dailyGoal", [[10, "10"], [20, "20"], [40, "40"]])}</div>
        <div class="setting"><div class="grow"><b>Νέες λέξεις / μέρα</b></div>${seg("newPerDay", [[5, "5"], [10, "10"], [20, "20"]])}</div>
      </div>

      <div class="section-title"><h2>Ήχος & υπενθύμιση</h2></div>
      <div class="box flat">
        <div class="setting"><div class="grow"><b>Αυτόματη προφορά</b><span class="small muted">διαβάζει τη λέξη στις κάρτες</span></div>${sw("autoSpeak")}</div>
        <div class="setting"><div class="grow"><b>Ταχύτητα φωνής</b></div>${seg("speechRate", [[0.6, "Αργά"], [0.85, "Μέτρια"], [1, "Κανονικά"]])}</div>
        <div class="setting"><div class="grow"><b>Δοκιμή φωνής</b></div><button class="icon-btn" data-act="speak" data-t="Goedemorgen! Hoe gaat het met je?">${I.speak}</button></div>
        <div class="setting"><div class="grow"><b>Καθημερινή υπενθύμιση</b><span class="small muted">${isNative ? "ειδοποίηση στο κινητό" : "μόνο στην εφαρμογή Android"}</span></div>${sw("reminder")}</div>
        <div class="setting ${st.reminder ? "" : "hidden"}"><div class="grow"><b>Ώρα</b></div><input type="time" class="text-input" style="width:130px;padding:9px 12px" data-set-text="reminderTime" value="${esc(st.reminderTime)}"></div>
      </div>

      <div class="section-title"><h2>AI (Gemini)</h2>${st.apiKey ? `<span class="chip good">ενεργό</span>` : `<span class="chip bad">χωρίς κλειδί</span>`}</div>
      <div class="box flat stack">
        <p class="small">Για μετάφραση και τράπουλες με AI χρειάζεσαι ένα <b>δωρεάν</b> κλειδί από τη Google. Μένει μόνο σε αυτό το κινητό.</p>
        <ol class="small" style="margin:0;padding-left:20px">
          <li>Άνοιξε το <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a></li>
          <li>Πάτα «Create API key» και αντέγραψέ το</li>
          <li>Επικόλλησέ το εδώ κάτω</li>
        </ol>
        <input id="api-key" class="text-input" type="password" placeholder="AIza…" value="${esc(st.apiKey)}" autocomplete="off" autocapitalize="off" spellcheck="false">
        <div class="row"><button class="btn grow sm" data-act="toggle-key">Εμφάνιση</button><button class="btn primary grow sm" data-act="save-key">Αποθήκευση</button></div>
        <details class="small"><summary style="font-weight:800">Όριο AI & προχωρημένα</summary>
          <p style="margin-top:8px">Το δωρεάν πακέτο της Google έχει ημερήσιο όριο. Η εφαρμογή μεταφράζει πολλές λέξεις με μία κλήση, θυμάται όσες έχει ήδη μεταφράσει και, αν ένα μοντέλο γεμίσει, αλλάζει αυτόματα σε άλλο. Αν το όριο σού φτάνει ακόμα λίγο, μπορείς να ενεργοποιήσεις χρέωση στο AI Studio (κοστίζει ελάχιστα λεπτά τον μήνα για προσωπική χρήση).</p>
          <label class="field" style="margin-top:10px"><span>Μοντέλο (κενό = αυτόματα)</span><input class="text-input" data-set-text="aiModel" value="${esc(st.aiModel)}" placeholder="gemini-flash-latest" autocapitalize="off"></label>
        </details>
      </div>

      <div class="section-title"><h2>Δεδομένα</h2></div>
      <div class="box flat stack">
        <button class="btn block" data-act="export">💾 Αντίγραφο ασφαλείας</button>
        <button class="btn block" data-act="import">📥 Επαναφορά από αντίγραφο</button>
        <button class="btn block" data-act="reset-stats">Μηδενισμός προόδου</button>
        <button class="btn bad block" data-act="reset-all">Διαγραφή όλων</button>
      </div>
      <p class="tiny muted center" style="margin-top:18px">NLexi 2.0 · φτιαγμένο για Έλληνες που μαθαίνουν ολλανδικά 🇬🇷🇳🇱</p>`;
  };
  AFTER.settings = () => {
    document.querySelectorAll("[data-set]").forEach((el) => el.addEventListener("change", async () => {
      S.settings[el.dataset.set] = el.checked; saveSettings();
      if (el.dataset.set === "reminder") {
        if (!isNative && el.checked) toast("Οι υπενθυμίσεις λειτουργούν στην εφαρμογή Android");
        await scheduleReminder(); render();
      }
    }));
    document.querySelectorAll("[data-set-text]").forEach((el) => el.addEventListener("change", () => {
      S.settings[el.dataset.setText] = el.value.trim(); saveSettings();
      if (el.dataset.setText === "reminderTime") scheduleReminder().then((ok) => ok && toast("Υπενθύμιση στις " + el.value));
    }));
  };

  // ================= Φύλλα (sheets) =================
  function cardForm(c = {}) {
    return `
      <label class="field"><span>🇳🇱 Ολλανδικά</span><input class="text-input" id="f-dutch" value="${esc(c.dutch)}" placeholder="π.χ. de fiets" autocapitalize="off" spellcheck="false"></label>
      <label class="field"><span>🇬🇷 Ελληνικά</span><input class="text-input" id="f-greek" value="${esc(c.greek)}" placeholder="π.χ. το ποδήλατο"></label>
      <button class="btn primary block" data-act="ai-fill">${I.spark} Συμπλήρωσε τα υπόλοιπα με AI</button>
      <div class="row"><label class="field grow"><span>Προφορά</span><input class="text-input" id="f-phonetic" value="${esc(c.phonetic)}" placeholder="ντε φιτς"></label>
      <label class="field grow"><span>Μέρος λόγου</span><input class="text-input" id="f-pos" value="${esc(c.partOfSpeech)}" placeholder="ουσιαστικό"></label></div>
      <label class="field"><span>Παράδειγμα (ολλανδικά)</span><input class="text-input" id="f-exnl" value="${esc(c.exampleDutch)}" autocapitalize="off"></label>
      <label class="field"><span>Παράδειγμα (ελληνικά)</span><input class="text-input" id="f-exgr" value="${esc(c.exampleGreek)}"></label>`;
  }
  const readCardForm = () => ({
    dutch: $("#f-dutch").value.trim(), greek: $("#f-greek").value.trim(), phonetic: $("#f-phonetic").value.trim(),
    partOfSpeech: $("#f-pos").value.trim(), exampleDutch: $("#f-exnl").value.trim(), exampleGreek: $("#f-exgr").value.trim(),
  });
  function fillCardForm(r) {
    const set = (id, v) => { if (v) $(id).value = v; };
    set("#f-dutch", r.dutch); set("#f-greek", r.greek); set("#f-phonetic", r.phonetic); set("#f-pos", r.partOfSpeech); set("#f-exnl", r.exampleDutch); set("#f-exgr", r.exampleGreek);
  }

  function chooseDeckOptions(selected) {
    return S.decks.map((d) => `<option value="${esc(d.id)}" ${d.id === selected ? "selected" : ""}>${esc(d.name)}</option>`).join("");
  }

  function addWordSheet(deckId, preset = {}) {
    const needDeck = !deckId;
    openSheet(`<div class="stack"><h2>Νέα λέξη</h2>
      ${needDeck ? `<label class="field"><span>Τράπουλα</span><select class="text-input" id="f-deck">${chooseDeckOptions(S.decks[0]?.id)}</select></label>` : ""}
      ${cardForm(preset)}
      <button class="btn dark block" data-act="save-card" data-deck="${esc(deckId || "")}">${I.check} Αποθήκευση</button></div>`);
    setTimeout(() => $("#f-dutch")?.focus(), 80);
  }

  function editCardSheet(deckId, cardId) {
    const d = findDeck(deckId), c = d?.cards.find((x) => x.id === cardId);
    if (!c) return;
    openSheet(`<div class="stack"><div class="row between"><h2>Επεξεργασία</h2><button class="icon-btn" data-act="speak" data-t="${esc(c.dutch)}">${I.speak}</button></div>
      <p class="small muted">${deckEmoji(d)} ${esc(d.name)} · ${c.box ? `επίπεδο ${c.box}/6 · επόμενη επανάληψη ${esc(c.due || "")}` : "νέα λέξη"}</p>
      ${cardForm(c)}
      <div class="row"><button class="btn bad" data-act="del-card" data-deck="${esc(deckId)}" data-id="${esc(cardId)}" aria-label="Διαγραφή">${I.trash}</button>
      <button class="btn dark grow" data-act="save-card" data-deck="${esc(deckId)}" data-id="${esc(cardId)}">${I.check} Αποθήκευση</button></div></div>`);
  }

  function bulkSheet(deckId) {
    openSheet(`<div class="stack"><h2>Πολλές λέξεις μαζί</h2>
      <p class="small muted">Γράψε μία ολλανδική λέξη ή φράση σε κάθε γραμμή και το AI θα τις μεταφράσει όλες μαζί. Αν ξέρεις ήδη τη μετάφραση, γράψε <b>λέξη = μετάφραση</b>.</p>
      <textarea class="text-input" id="bulk-text" placeholder="de fiets\nhet brood\nlopen = περπατάω\nGoede reis!"></textarea>
      <button class="btn primary block" data-act="bulk-go" data-deck="${esc(deckId)}">${I.spark} Μετάφραση & προεπισκόπηση</button>
      <div id="bulk-preview"></div></div>`);
    setTimeout(() => $("#bulk-text")?.focus(), 80);
  }
  let bulkPending = [];
  function renderBulkPreview(deckId) {
    $("#bulk-preview").innerHTML = bulkPending.length ? `
      <div class="section-title" style="margin-top:6px"><h3>${bulkPending.length} κάρτες</h3><span class="small muted">αφαίρεσε ό,τι δεν θέλεις</span></div>
      ${bulkPending.map((c, i) => `<div class="preview-card row"><div class="grow"><b>${esc(c.dutch)}</b> <span class="small" style="color:var(--accent)">${esc(c.phonetic || "")}</span><div class="small">${esc(c.greek)}</div>${c.exampleDutch ? `<div class="tiny muted"><i>${esc(c.exampleDutch)}</i></div>` : ""}</div>
        <button class="icon-btn plain" data-act="bulk-remove" data-i="${i}" data-deck="${esc(deckId)}" aria-label="Αφαίρεση">${I.close}</button></div>`).join("")}
      <button class="btn dark block" style="margin-top:12px" data-act="bulk-save" data-deck="${esc(deckId)}">${I.check} Προσθήκη ${bulkPending.length} λέξεων</button>` : "";
  }

  function newDeckSheet(edit) {
    const d = edit ? findDeck(edit) : null;
    let picked = d?.emoji || EMOJIS[0];
    openSheet(`<div class="stack"><h2>${d ? "Επεξεργασία τράπουλας" : "Νέα τράπουλα"}</h2>
      <label class="field"><span>Όνομα</span><input class="text-input" id="d-name" value="${esc(d?.name || "")}" placeholder="π.χ. Στη δουλειά"></label>
      <label class="field"><span>Περιγραφή</span><input class="text-input" id="d-desc" value="${esc(d?.description || "")}" placeholder="προαιρετικό"></label>
      <div class="field"><span style="display:block;font-weight:800;font-size:13.5px;margin-bottom:6px">Εικονίδιο</span>
      <div class="row" style="flex-wrap:wrap;gap:8px" id="emoji-pick">${EMOJIS.map((e) => `<button class="icon-btn" style="font-size:22px;${e === picked ? "background:var(--accent)" : ""}" data-act="pick-emoji" data-e="${e}">${e}</button>`).join("")}</div></div>
      <button class="btn dark block" data-act="save-deck" data-id="${esc(edit || "")}">${I.check} ${d ? "Αποθήκευση" : "Δημιουργία"}</button>
      ${d ? `<button class="btn bad block" data-act="del-deck" data-id="${esc(d.id)}">${I.trash} Διαγραφή τράπουλας</button>` : ""}</div>`);
    ACT["pick-emoji"] = (el) => {
      picked = el.dataset.e;
      document.querySelectorAll("#emoji-pick .icon-btn").forEach((b) => (b.style.background = b.dataset.e === picked ? "var(--accent)" : ""));
    };
    ACT["save-deck"] = (el) => {
      const name = $("#d-name").value.trim();
      if (!name) return toast("Δώσε ένα όνομα");
      if (el.dataset.id) {
        const dd = findDeck(el.dataset.id); dd.name = name; dd.description = $("#d-desc").value.trim(); dd.emoji = picked;
        saveDecks(); closeSheet(); render();
      } else {
        const nd = { id: "d-" + uid(), name, description: $("#d-desc").value.trim(), emoji: picked, isCustom: true, cards: [] };
        S.decks.unshift(nd); saveDecks(); closeSheet(); go("deck", { id: nd.id });
      }
    };
  }

  let aiDeckDraft = null;
  function aiDeckSheet() {
    aiDeckDraft = null;
    openSheet(`<div class="stack"><h2>${I.spark.replace("<svg", '<svg style="width:22px;height:22px;vertical-align:-3px"')} Τράπουλα με AI</h2>
      <p class="small muted">Γράψε ένα θέμα και το AI θα φτιάξει κάρτες με προφορά και παραδείγματα.</p>
      <input class="text-input" id="ai-topic" placeholder="π.χ. στο κομμωτήριο, ποδήλατο, Sinterklaas">
      <div class="row" style="flex-wrap:wrap;gap:6px">${["Στο σούπερ μάρκετ", "Καιρός", "Οικογένεια", "Στον σταθμό", "Ρούχα", "Χόμπι"].map((t) => `<button class="chip" data-act="ai-topic" data-t="${t}">${t}</button>`).join("")}</div>
      <div class="row"><label class="field grow"><span>Κάρτες</span><select class="text-input" id="ai-count"><option>6</option><option selected>10</option><option>15</option><option>20</option></select></label>
      <label class="field grow"><span>Επίπεδο</span><select class="text-input" id="ai-level"><option value="A1">A1 αρχάριος</option><option value="A2">A2</option><option value="B1">B1</option></select></label></div>
      <button class="btn primary block" data-act="ai-deck-go">${I.spark} Δημιουργία</button>
      <div id="ai-preview"></div></div>`);
  }

  function backupJSON() {
    return JSON.stringify({ app: "nlexi", v: 2, at: new Date().toISOString(), decks: S.decks, stats: S.stats, settings: { ...S.settings, apiKey: "" } });
  }

  // ================= Ενέργειες =================
  const ACT = {
    tab: (el) => tab(el.dataset.v),
    back: () => back(),
    "sheet-bg": (el, e) => { if (e.target === el) closeSheet(); },
    speak: (el) => speak(el.dataset.t, el.dataset.lang || "nl-NL"),
    "start-review": () => {
      const q = reviewQueue();
      startSession("flip", "all", { cards: shuffle(q.due.slice(0, 100)).concat(q.fresh), title: "Επανάληψη ημέρας", review: true });
    },
    "extra-practice": () => startSession("quiz", "all"),
    practice: (el) => startSession(el.dataset.mode, el.dataset.deck, { weak: !!el.dataset.weak }),
    "open-deck": (el) => go("deck", { id: el.dataset.id }),
    "new-deck": () => newDeckSheet(),
    "deck-menu": (el) => newDeckSheet(el.dataset.id),
    "del-deck": async (el) => {
      const d = findDeck(el.dataset.id);
      if (!(await confirmBox(`Διαγραφή της τράπουλας «${d.name}» και των ${d.cards.length} λέξεών της;`, "Διαγραφή", true))) return;
      S.decks = S.decks.filter((x) => x.id !== d.id);
      if (!d.isCustom) { const del = load("nlx_deleted_builtin", []); del.push(d.id); store("nlx_deleted_builtin", del); }
      saveDecks(); stack = [{ v: "decks", p: {} }]; render(true); toast("Η τράπουλα διαγράφηκε");
    },
    "ai-deck": () => aiDeckSheet(),
    "ai-topic": (el) => { $("#ai-topic").value = el.dataset.t; },
    "ai-deck-go": async (el) => {
      const topic = $("#ai-topic").value.trim();
      if (!topic) return toast("Γράψε ένα θέμα");
      setBusy(el, true, "Το AI φτιάχνει την τράπουλα…");
      try {
        const r = await AI.generateDeck(topic, +$("#ai-count").value, $("#ai-level").value);
        aiDeckDraft = r;
        $("#ai-preview").innerHTML = `<div class="box flat" style="margin-top:6px"><h3>${esc(r.emoji || "✨")} ${esc(r.deckName)}</h3><p class="small muted">${esc(r.description)}</p>
          <div style="margin-top:10px">${(r.cards || []).map((c) => `<div class="preview-card"><b>${esc(c.dutch)}</b> <span class="small" style="color:var(--accent)">${esc(c.phonetic)}</span><div class="small">${esc(c.greek)}</div></div>`).join("")}</div></div>
          <button class="btn dark block" style="margin-top:12px" data-act="ai-deck-save">${I.check} Αποθήκευση τράπουλας</button>`;
      } catch (e) { aiErr(e); }
      setBusy(el, false);
    },
    "ai-deck-save": () => {
      const r = aiDeckDraft; if (!r) return;
      const nd = { id: "d-" + uid(), name: r.deckName || "AI τράπουλα", description: r.description || "", emoji: (r.emoji || "✨").slice(0, 4), isCustom: true,
        cards: (r.cards || []).filter((c) => c.dutch && c.greek).map((c) => ({ id: uid(), dutch: c.dutch, greek: c.greek, phonetic: c.phonetic || "", partOfSpeech: c.partOfSpeech || "", exampleDutch: c.exampleDutch || "", exampleGreek: c.exampleGreek || "" })) };
      S.decks.unshift(nd); saveDecks(); closeSheet(); go("deck", { id: nd.id }); toast(`Προστέθηκαν ${nd.cards.length} κάρτες ✨`);
    },
    "add-word": (el) => addWordSheet(el.dataset.deck),
    "add-word-search": () => {
      const q = searchQ.trim();
      addWordSheet(null, /[α-ωάέήίόύώ]/i.test(q) ? { greek: q } : { dutch: q });
    },
    "edit-card": (el) => editCardSheet(el.dataset.deck, el.dataset.id),
    "ai-fill": async (el) => {
      const dutch = $("#f-dutch").value.trim(), greek = $("#f-greek").value.trim();
      if (!dutch && !greek) return toast("Γράψε πρώτα την ολλανδική ή την ελληνική λέξη");
      setBusy(el, true, "Το AI σκέφτεται…");
      try {
        const r = dutch ? await AI.translateOne(dutch) : await AI.fromGreek(greek);
        if (dutch) delete r.dutch;
        if (greek && dutch) delete r.greek;
        fillCardForm(r);
        toast("Συμπληρώθηκε ✨");
      } catch (e) { aiErr(e); }
      setBusy(el, false);
    },
    "save-card": (el) => {
      const data = readCardForm();
      if (!data.dutch || !data.greek) return toast("Χρειάζονται τουλάχιστον ολλανδικά και ελληνικά");
      const deckId = el.dataset.deck || $("#f-deck")?.value;
      const d = findDeck(deckId); if (!d) return toast("Διάλεξε τράπουλα");
      if (el.dataset.id) Object.assign(d.cards.find((c) => c.id === el.dataset.id), data);
      else {
        if (d.cards.some((c) => normalize(c.dutch) === normalize(data.dutch))) toast("Υπάρχει ήδη — προστέθηκε ξανά");
        d.cards.push({ id: uid(), ...data });
      }
      saveDecks(); closeSheet(); render(); toast(el.dataset.id ? "Αποθηκεύτηκε" : "Η λέξη προστέθηκε ✓");
    },
    "del-card": async (el) => {
      const d = findDeck(el.dataset.deck);
      if (!(await confirmBox("Διαγραφή αυτής της λέξης;", "Διαγραφή", true))) return;
      d.cards = d.cards.filter((c) => c.id !== el.dataset.id); saveDecks(); render(); toast("Διαγράφηκε");
    },
    "bulk-add": (el) => bulkSheet(el.dataset.deck),
    "bulk-go": async (el) => {
      const lines = $("#bulk-text").value.split(/\n|;/).map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return toast("Γράψε τουλάχιστον μία λέξη");
      if (lines.length > 100) return toast("Έως 100 λέξεις τη φορά");
      const manual = [], toAI = [];
      lines.forEach((l) => {
        const m = l.split(/\s*=\s*/);
        if (m.length >= 2 && m[0] && m[1]) manual.push({ dutch: m[0], greek: m.slice(1).join(" = ") });
        else toAI.push(l);
      });
      bulkPending = manual;
      if (toAI.length) {
        setBusy(el, true, `Μετάφραση ${toAI.length} λέξεων…`);
        try { bulkPending = bulkPending.concat(await AI.translateMany(toAI)); }
        catch (e) { aiErr(e); }
        setBusy(el, false);
      }
      renderBulkPreview(el.dataset.deck);
    },
    "bulk-remove": (el) => { bulkPending.splice(+el.dataset.i, 1); renderBulkPreview(el.dataset.deck); },
    "bulk-save": (el) => {
      const d = findDeck(el.dataset.deck);
      bulkPending.forEach((c) => d.cards.push({ id: uid(), dutch: c.dutch, greek: c.greek, phonetic: c.phonetic || "", partOfSpeech: c.partOfSpeech || "", exampleDutch: c.exampleDutch || "", exampleGreek: c.exampleGreek || "" }));
      const n = bulkPending.length; bulkPending = [];
      saveDecks(); closeSheet(); render(); toast(`Προστέθηκαν ${n} λέξεις ✓`);
    },
    flip: (el) => {
      if (el.dataset.swiped) return;
      session.state = session.state === "flipped" ? null : "flipped";
      el.classList.toggle("flipped");
      if (session.state === "flipped" && S.settings.autoSpeak && session.dir === "gr-nl") speak(session.items[session.idx].card.dutch);
    },
    "flip-answer": (el) => flipAnswer(el.dataset.ok === "1"),
    pick: (el) => {
      const s = session, it = s.items[s.idx], i = +el.dataset.i;
      const ok = it.options[i] === it.answer;
      answer(ok, { picked: i, ok });
    },
    "write-skip": () => answer(false, { input: "", result: "wrong" }),
    next: () => next(),
    "retry-wrong": () => {
      const s = session;
      startSession(s.mode === "gap" || s.mode === "quiz" ? s.mode : s.mode, s.deckId, { cards: s.wrongCards.slice(), title: "Επανάληψη λαθών" });
      stack.splice(stack.length - 2, 1);
    },
    finish: () => { session = null; stack.pop(); if (!stack.length) stack = [{ v: "home", p: {} }]; render(true); },
    coach: async (el) => {
      const cards = allCards(), m = S.stats.modes;
      const acc = (x) => (x.t ? Math.round((x.c / x.t) * 100) + "%" : "καμία");
      const hard = cards.filter((c) => c.lapses).sort((a, b) => b.lapses - a.lapses).slice(0, 8).map((c) => `${c.dutch} (${c.greek})`);
      const last7 = Array.from({ length: 7 }, (_, i) => S.stats.days[addDays(-i)]?.r || 0);
      const summary = `Σερί: ${currentStreak()} μέρες (ρεκόρ ${S.stats.best || 0}). Λέξεις: ${cards.length}, μαθημένες: ${cards.filter(isKnown).length}, νέες: ${cards.filter(isNew).length}.
Απαντήσεις τις τελευταίες 7 μέρες (σήμερα πρώτα): ${last7.join(", ")}. Στόχος ημέρας: ${S.settings.dailyGoal}.
Επιτυχία: κάρτες ${acc(m.flip)}, κουίζ ${acc(m.quiz)}, γραφή ${acc(m.write)}, κενά ${acc(m.gap)}.
Δύσκολες λέξεις: ${hard.join(", ") || "καμία ακόμα"}.`;
      setBusy(el, true, "Ο καθηγητής διαβάζει…");
      try { coachText = await AI.coach(summary); render(); }
      catch (e) { aiErr(e); setBusy(el, false); }
    },
    set: (el) => {
      const k = el.dataset.k, v = el.dataset.v;
      S.settings[k] = isNaN(+v) ? v : +v; saveSettings(); render();
      if (k === "speechRate") speak("Goedemorgen");
    },
    "toggle-key": (el) => { const i = $("#api-key"); i.type = i.type === "password" ? "text" : "password"; el.textContent = i.type === "password" ? "Εμφάνιση" : "Απόκρυψη"; },
    "save-key": async (el) => {
      S.settings.apiKey = $("#api-key").value.trim(); saveSettings();
      if (!S.settings.apiKey) { render(); return toast("Το κλειδί αφαιρέθηκε"); }
      setBusy(el, true, "Δοκιμή…");
      try { await AI.test(); toast("Το AI λειτουργεί! ✨"); render(); }
      catch (e) { aiErr(e); setBusy(el, false); }
    },
    export: async () => {
      const data = backupJSON();
      let copied = false;
      try { const cb = plugin("Clipboard"); if (cb) { await cb.write({ string: data }); copied = true; } else if (navigator.clipboard) { await navigator.clipboard.writeText(data); copied = true; } } catch {}
      openSheet(`<div class="stack"><h2>Αντίγραφο ασφαλείας</h2>
        <p class="small">${copied ? "✅ Αντιγράφηκε στο πρόχειρο. " : ""}Επικόλλησέ το κάπου ασφαλές (π.χ. σημείωση, email στον εαυτό σου). Για επαναφορά, επικόλλησέ το στο «Επαναφορά από αντίγραφο».</p>
        <textarea class="text-input" readonly style="min-height:160px;font-size:12px">${esc(data)}</textarea>
        <button class="btn dark block" data-act="close-sheet">Εντάξει</button></div>`);
    },
    import: () => {
      openSheet(`<div class="stack"><h2>Επαναφορά</h2>
        <p class="small">Επικόλλησε εδώ το αντίγραφο ασφαλείας. <b>Θα αντικαταστήσει</b> τις τωρινές τράπουλες και την πρόοδο.</p>
        <textarea class="text-input" id="import-text" style="min-height:160px;font-size:12px" placeholder='{"app":"nlexi",…}'></textarea>
        <button class="btn primary block" data-act="import-go">📥 Επαναφορά</button></div>`);
    },
    "import-go": () => {
      try {
        const d = JSON.parse($("#import-text").value);
        if (d.app !== "nlexi" || !Array.isArray(d.decks)) throw 0;
        S.decks = d.decks; S.stats = Object.assign(freshStats(), d.stats || {});
        const key = S.settings.apiKey; S.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings || {}, { apiKey: key });
        saveDecks(); saveStats(); saveSettings(); closeSheet(); tab("home"); toast("Η επαναφορά ολοκληρώθηκε ✓");
      } catch { toast("Μη έγκυρο αντίγραφο ασφαλείας"); }
    },
    "close-sheet": () => closeSheet(),
    "reset-stats": async () => {
      if (!(await confirmBox("Μηδενισμός όλης της προόδου; Οι λέξεις σου μένουν.", "Μηδενισμός", true))) return;
      S.stats = freshStats();
      allCards().forEach((c) => { delete c.box; delete c.due; delete c.lapses; delete c.last; });
      saveStats(); saveDecks(); render(); toast("Η πρόοδος μηδενίστηκε");
    },
    "reset-all": async () => {
      if (!(await confirmBox("Διαγραφή ΟΛΩΝ: τράπουλες, λέξεις, πρόοδος; Δεν αναιρείται.", "Διαγραφή όλων", true))) return;
      ["nlx_decks", "nlx_stats", "nlx_deleted_builtin", "nlx_ai_cache"].forEach((k) => localStorage.removeItem(k));
      S.decks = null; S.stats = null; initData(); tab("home"); toast("Η εφαρμογή επανήλθε");
    },
  };

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = ACT[el.dataset.act];
    if (!fn) return;
    if (el.dataset.act !== "sheet-bg" && el.dataset.act !== "flip") e.stopPropagation();
    fn(el, e);
  });

  // Πληκτρολόγιο (για υπολογιστή)
  document.addEventListener("keydown", (e) => {
    if (cur().v !== "study" || !session || sheetOpen()) return;
    if (session.mode === "flip") {
      if (e.key === " ") { e.preventDefault(); $("#fc")?.click(); }
      if (e.key === "ArrowRight") flipAnswer(true);
      if (e.key === "ArrowLeft") flipAnswer(false);
    }
    if ((session.mode === "quiz" || session.mode === "gap") && !session.state && /^[1-4]$/.test(e.key)) document.querySelectorAll(".option")[+e.key - 1]?.click();
    if (e.key === "Enter" && session.state && session.mode !== "write") next();
    else if (e.key === "Enter" && session.state && session.mode === "write") { e.preventDefault(); next(); }
  });

  // ================= Εκκίνηση =================
  initData();
  render();
  const appPlugin = plugin("App");
  if (appPlugin) {
    appPlugin.addListener("backButton", async () => { if (!(await back())) appPlugin.minimizeApp(); });
    appPlugin.addListener("resume", () => { if (cur().v === "home") render(); });
  }
  if (S.settings.reminder) scheduleReminder();

  window.NLexi = { S, startSession, reviewQueue, checkWritten, gapFor }; // για δοκιμές
})();
