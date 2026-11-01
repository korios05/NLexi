// Προσθέτει την άδεια ειδοποιήσεων (Android 13+) στο AndroidManifest.
import { readFileSync, writeFileSync } from "node:fs";
const f = "android/app/src/main/AndroidManifest.xml";
let x = readFileSync(f, "utf8");
const perms = ["android.permission.POST_NOTIFICATIONS", "android.permission.RECEIVE_BOOT_COMPLETED"];
for (const p of perms) {
  if (!x.includes(p)) x = x.replace("</manifest>", `    <uses-permission android:name="${p}" />\n</manifest>`);
}
writeFileSync(f, x);
console.log("✓ AndroidManifest permissions");

// Αριθμός έκδοσης: κάθε build παίρνει μεγαλύτερο αριθμό, ώστε το Android να το δέχεται ως ενημέρωση.
const g = "android/app/build.gradle";
let gradle = readFileSync(g, "utf8");
const code = parseInt(process.env.VERSION_CODE || "1", 10);
const name = process.env.VERSION_NAME || "2.0";
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "${name}"`);
writeFileSync(g, gradle);
console.log(`✓ versionCode ${code}, versionName ${name}`);

// Υπογραφή ΠΑΝΤΑ με το σταθερό κλειδί του project (για να γίνονται ενημερώσεις χωρίς απεγκατάσταση).
import { resolve } from "node:path";
import { existsSync } from "node:fs";
const ks = resolve("android-keys/debug.keystore");
if (!existsSync(ks)) { console.error("✗ Λείπει το android-keys/debug.keystore"); process.exit(1); }
let gb = readFileSync(g, "utf8");
if (!gb.includes("NLEXI_SIGNING")) {
  const block = `
    // NLEXI_SIGNING
    signingConfigs {
        debug {
            storeFile file(${JSON.stringify(ks)})
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }
`;
  gb = gb.replace(/android\s*\{/, (m) => m + block);
  writeFileSync(g, gb);
}
console.log("✓ signing με " + ks);
