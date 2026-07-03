import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./encoding-utils.mjs";

const replacements = [
  [/\u0160\u0160/g, "\u0160"],
  [/\u0161\u0161/g, "\u0161"],
  [/(?<![\u0160\u0161])\bvicarska\b/g, "\u0160vicarska"],
  [/(?<![\u0160\u0161])\bvicarske\b/g, "\u0160vicarske"],
  [/(?<![\u0160\u0161])\bvicarskoj\b/g, "\u0160vicarskoj"],
  [/\bDravama\b/g, "Dr\u017eavama"],
  [/\bdravama\b/g, "dr\u017eavama"],
  [/\bdrave\b/g, "dr\u017eave"],
  [/\bdrava\b/g, "dr\u017eava"],
  [/(?<![\u0160\u0161])\bta ka/g, "\u0160ta ka"],
  [/(?<![\u0160\u0161])\bpanija\b/g, "\u0160panija"],
  [/(?<![\u0160\u0161])\bpanije\b/g, "\u0160panije"],
  [/(?<![\u0160\u0161])\bvedska\b/g, "\u0160vedska"],
  [/(?<![\u0160\u0161])\bvedske\b/g, "\u0160vedske"],
  [/\bKoritenja\b/g, "Kori\u0161tenja"],
  [/\bkoritenja\b/g, "kori\u0161tenja"],
];

const files = walkFiles(path.join(process.cwd(), "dist"), new Set([".html", ".xml"]));
const changed = [];

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;

  for (const [pattern, replacement] of replacements) {
    after = after.replace(pattern, replacement);
  }

  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed.push(path.relative(process.cwd(), file));
  }
}

console.log(`Checked ${files.length} dist HTML/XML files for stripped diacritics.`);
console.log(`Files fixed: ${changed.length}`);
for (const file of changed) console.log(`fixed ${file}`);
