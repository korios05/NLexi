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
