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
