import fs from "node:fs";
import path from "node:path";
import {
  decodeUtf8Strict,
  hasMojibake,
  htmlHasUtf8Meta,
  walkFiles,
} from "./encoding-utils.mjs";

const roots = ["src", "content", "scripts", "dist"]
  .map((dir) => path.join(process.cwd(), dir))
  .filter((dir) => fs.existsSync(dir));

const extensions = new Set([
  ".astro", ".md", ".mdx", ".json", ".js", ".mjs", ".ts", ".tsx", ".jsx", ".html", ".xml",
]);

const failures = [];
const warnings = [];
const strippedDiacritics = [
  /\u0160\u0160/,
  /\u0161\u0161/,
  /(?<![\u0160\u0161])\bvicarska\b/,
  /\bDravama\b/,
  /\bdrave\b/,
  /(?<![\u0160\u0161])\bta ka/,
  /(?<![\u0160\u0161])\bpanija\b/,
  /(?<![\u0160\u0161])\bvedska\b/,
  /\bKoritenja\b/,
];

for (const root of roots) {
  for (const file of walkFiles(root, extensions)) {
    const rel = path.relative(process.cwd(), file);
    const buffer = fs.readFileSync(file);
    let text;

    try {
      text = decodeUtf8Strict(buffer);
    } catch {
      failures.push(`${rel}: invalid UTF-8 bytes`);
      continue;
    }

    if (hasMojibake(text)) failures.push(`${rel}: mojibake pattern found`);
    if (strippedDiacritics.some((pattern) => pattern.test(text))) {
      failures.push(`${rel}: stripped diacritic word found`);
    }
    if (path.extname(file).toLowerCase() === ".html" && !htmlHasUtf8Meta(text)) {
      warnings.push(`${rel}: missing UTF-8 meta tag`);
    }
  }
}

for (const warning of warnings) console.log(`warning ${warning}`);
for (const failure of failures) console.error(`error ${failure}`);

console.log(`Encoding verification checked ${roots.map((r) => path.relative(process.cwd(), r)).join(", ")}.`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${failures.length}`);

if (failures.length) process.exit(1);
