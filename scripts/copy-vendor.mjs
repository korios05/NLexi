// Αντιγράφει το Capacitor runtime στο www/vendor (η εφαρμογή δεν χρειάζεται bundler).
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
const src = "node_modules/@capacitor/core/dist/capacitor.js";
if (!existsSync(src)) { console.error("Δεν βρέθηκε το " + src + " — τρέξε πρώτα npm install"); process.exit(1); }
mkdirSync("www/vendor", { recursive: true });
copyFileSync(src, "www/vendor/capacitor.js");
console.log("✓ www/vendor/capacitor.js");
