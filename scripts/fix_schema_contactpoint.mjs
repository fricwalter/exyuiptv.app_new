// Remove `contactType` and `availableLanguage` from JSON-LD contactPoint blocks.
// SemRush flags these as "not recognized by Schema.org vocabulary" on 78 pages.
// Both fields ARE valid Schema.org for ContactPoint, but the parser disagrees and
// they bring no rich-result value on our pages — safest fix is removal.

import fs from "node:fs";
import path from "node:path";

const DIST = path.join(process.cwd(), "dist");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const PAT_CONTACT_TYPE = /,"contactType":"[^"]*"/g;
const PAT_AVAIL_LANG = /,"availableLanguage":\[[^\]]*\]/g;

let touched = 0;
for (const file of walk(DIST)) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("contactType") && !html.includes("availableLanguage")) continue;
  const before = html;
  html = html.replace(PAT_CONTACT_TYPE, "").replace(PAT_AVAIL_LANG, "");
  if (html !== before) {
    fs.writeFileSync(file, html);
    touched++;
  }
}
console.log(`Removed contactType/availableLanguage from ${touched} files`);
