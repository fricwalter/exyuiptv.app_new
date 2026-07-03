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
  /\bNai\b/,
  /\bnai\b/,
  /(?<![\u0160\u0161])\birom\b/,
  /\btrokova\b/,
  /(?<![\u0160\u0161])\bta ako\b/,
  /\bsadraj\b/,
  /\bvaoj\b/,
  /\bVie\b/,
  /\bMoete\b/,
  /\bmoete\b/,
  /\bUivajte\b/,
  /\bauriranje\b/,
  /\bbalkansim\b/,
  /\brjeavanje\b/,
  /\bvae\b/,
  /(?<![\u0160\u0161])\bpanska Liga\b/,
  /\bvie\b/,
  /\bnaom\b/,
  /\bnaim\b/,
  /\bnau\b/,
  /\bNaa\b/,
  /\bnaa\b/,
  /\bvau\b/,
  /(?<![\u0160\u0161])\bampiona\b/,
  /Wir nutzen notwendige Cookies/i,
  /Zato Odabrati/i,
  /PayPal/i,
  /Mastercard/i,
  /\bVisa\b/i,
  /\u00dcberweisung/i,
  /berweisung/i,
];

for (const root of roots) {
  for (const file of walkFiles(root, extensions)) {
    const rel = path.relative(process.cwd(), file);
    const relUnix = rel.split(path.sep).join("/");
    const isDistPage = relUnix.startsWith("dist/") && [".html", ".xml"].includes(path.extname(file).toLowerCase());
    const skipCopyPatternChecks = new Set([
      "scripts/fix-main-copy.mjs",
      "scripts/fix-diacritics.mjs",
      "scripts/verify-encoding.mjs",
    ]).has(relUnix) || !isDistPage;
    const buffer = fs.readFileSync(file);
    let text;

    try {
      text = decodeUtf8Strict(buffer);
    } catch {
      failures.push(`${rel}: invalid UTF-8 bytes`);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const copyText = [".html", ".xml"].includes(ext)
      ? text
          .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
          .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
          .replace(/https?:\/\/[^\s"'<>]+/g, "")
          .replace(/\b(?:href|src|content|component-url|renderer-url|before-hydration-url)="[^"]*"/gi, "")
          .replace(/<[^>]+>/g, " ")
      : text;

    if (hasMojibake(text)) failures.push(`${rel}: mojibake pattern found`);
    if (!skipCopyPatternChecks && strippedDiacritics.some((pattern) => pattern.test(copyText))) {
      failures.push(`${rel}: stripped diacritic word found`);
    }
    if (isDistPage) {
      const trustSectionCount = (text.match(/<section class="py-12 bg-stone-950 border-y border-stone-800">[\s\S]*?5\.000\+[\s\S]*?SSL[\s\S]*?garancija povrata novca[\s\S]*?<\/section>/g) || []).length;
      if (trustSectionCount > 1) failures.push(`${rel}: duplicate trust section found`);

      const testimonialSection = text.match(/<section class="py-20 bg-stone-900">[\s\S]*?\u0160ta ka\u017eu[\s\S]*?<\/section>/)?.[0] || "";
      const testimonialCardCount = (testimonialSection.match(/<article class="rounded-2xl border border-stone-700 bg-stone-800 p-5 hover:border-blue-500 hover:-translate-y-0\.5 transition">/g) || []).length;
      if (testimonialCardCount > 6) failures.push(`${rel}: too many testimonial cards found`);
    }
    if (ext === ".html" && !htmlHasUtf8Meta(text)) {
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
