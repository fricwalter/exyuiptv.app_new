import fs from "node:fs";
import path from "node:path";
import { TextDecoder } from "node:util";

const MOJIBAKE_RE = new RegExp([
  "\\u00c3\\u0192",
  "\\u00c3\\u2026",
  "\\u00c3\\u201e",
  "\\u00c5\\u00a1",
  "\\u00c5\\u00be",
  "\\u00c4\\u2021",
  "\\u00c4\\u008d",
  "\\u00c4\\u2018",
  "\\u00e2\\u20ac\\u2122",
  "\\u00e2\\u20ac\\u0153",
  "\\u00e2\\u20ac",
  "\\u00f0\\u0178",
  "\\ufffd",
].join("|"));

const cp1252 = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

export function walkFiles(root, extensions, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git" && entry.name !== ".wrangler") {
        walkFiles(full, extensions, out);
      }
    } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

export function decodeUtf8Strict(buffer) {
  return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}

export function hasMojibake(text) {
  return MOJIBAKE_RE.test(text);
}

export function repairMojibake(text) {
  const bytes = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp1252.has(cp)) bytes.push(cp1252.get(cp));
    else if (cp <= 0xff) bytes.push(cp);
    else bytes.push(...Buffer.from(ch, "utf8"));
  }
  return Buffer.from(bytes)
    .toString("utf8")
    .replace(/\uFFFD/g, "")
    .replace(new RegExp("Naru\\u00c4i", "g"), "Naru\u010di")
    .replace(new RegExp("Po\\u00c4etna", "g"), "Po\u010detna");
}

export function htmlHasUtf8Meta(text) {
  return /<meta\s+charset=["']utf-8["']/i.test(text) ||
    /<meta\s+http-equiv=["']content-type["'][^>]+charset=utf-8/i.test(text);
}
