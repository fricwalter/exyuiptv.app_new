import fs from "node:fs";
import path from "node:path";
import {
  decodeUtf8Strict,
  hasMojibake,
  repairMojibake,
  walkFiles,
  htmlHasUtf8Meta,
} from "./encoding-utils.mjs";

const distDir = path.join(process.cwd(), "dist");
const files = walkFiles(distDir, new Set([".html"]));
const fixed = [];
const invalid = [];
const missingMeta = [];

for (const file of files) {
  const buffer = fs.readFileSync(file);
  let text;

  try {
    text = decodeUtf8Strict(buffer);
  } catch {
    invalid.push(path.relative(process.cwd(), file));
    text = buffer.toString("latin1");
  }

  if (!htmlHasUtf8Meta(text)) missingMeta.push(path.relative(process.cwd(), file));

  if (hasMojibake(text) || invalid.includes(path.relative(process.cwd(), file))) {
    const repaired = repairMojibake(text);
    fs.writeFileSync(file, repaired, "utf8");
    fixed.push(path.relative(process.cwd(), file));
  }
}

console.log(`Checked ${files.length} HTML files in dist/.`);
console.log(`Invalid UTF-8 files: ${invalid.length}`);
console.log(`Files fixed: ${fixed.length}`);
for (const file of fixed) console.log(`fixed ${file}`);

if (missingMeta.length) {
  console.log(`HTML files missing UTF-8 meta: ${missingMeta.length}`);
  for (const file of missingMeta) console.log(`missing-meta ${file}`);
}
