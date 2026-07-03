import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SOURCE_LOGO = "C:/Users/admir/OneDrive/Desktop/logo.webp";

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function icoBuffer(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const image of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 0);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += image.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

async function generateFavicons() {
  fs.copyFileSync(SOURCE_LOGO, path.join(DIST, "logo.webp"));

  const sizes = [16, 32, 48, 180, 192, 512];
  const pngs = new Map();
  for (const size of sizes) {
    const buffer = await sharp(SOURCE_LOGO)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    pngs.set(size, buffer);
  }

  fs.writeFileSync(path.join(DIST, "favicon-16x16.png"), pngs.get(16));
  fs.writeFileSync(path.join(DIST, "favicon-32x32.png"), pngs.get(32));
  fs.writeFileSync(path.join(DIST, "favicon-48x48.png"), pngs.get(48));
  fs.writeFileSync(path.join(DIST, "apple-touch-icon.png"), pngs.get(180));
  fs.writeFileSync(path.join(DIST, "android-chrome-192x192.png"), pngs.get(192));
  fs.writeFileSync(path.join(DIST, "android-chrome-512x512.png"), pngs.get(512));
  fs.writeFileSync(path.join(DIST, "favicon.ico"), icoBuffer([
    { size: 16, buffer: pngs.get(16) },
    { size: 32, buffer: pngs.get(32) },
    { size: 48, buffer: pngs.get(48) },
  ]));

  const svgPng = pngs.get(192).toString("base64");
  fs.writeFileSync(path.join(DIST, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image href="data:image/png;base64,${svgPng}" width="192" height="192"/></svg>`, "utf8");
}

const faviconLinks = '<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="shortcut icon" href="/favicon.ico">';

const logoAnchor = '<a href="/" class="flex items-center gap-3 group mb-6"><img src="/logo.webp" alt="EXYU IPTV Logo" width="320" height="320" class="h-14 md:h-16 w-auto object-contain drop-shadow-lg group-hover:opacity-90 transition-opacity duration-300" loading="lazy" decoding="async"><div class="flex flex-col leading-tight"><span class="text-xl md:text-2xl font-extrabold tracking-tight"><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">EXYU</span> <span class="text-white">IPTV</span></span><span class="text-xs text-gray-500 font-medium tracking-widest uppercase">Premium Streaming</span></div></a>';

const compactLogoAnchor = '<a href="/" class="flex items-center gap-3 group"><img src="/logo.webp" alt="EXYU IPTV Logo" width="320" height="320" class="h-12 md:h-14 w-auto object-contain drop-shadow-lg group-hover:opacity-90 transition-opacity duration-300" loading="lazy" decoding="async"><div class="flex flex-col leading-tight"><span class="text-lg md:text-xl font-extrabold tracking-tight"><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">EXYU</span> <span class="text-white">IPTV</span></span><span class="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Premium Streaming</span></div></a>';

function updateHtml(file) {
  let html = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const before = html;

  html = html
    .replace(/<link rel="icon"[^>]+>/g, "")
    .replace(/<link rel="shortcut icon"[^>]+>/g, "")
    .replace(/<link rel="apple-touch-icon"[^>]+>/g, "")
    .replace(/(<meta name="viewport" content="width=device-width, initial-scale=1\.0">)/, `$1${faviconLinks}`);

  html = html.replace(
    /<a href="\/" class="flex items-center gap-2 mb-6">\s*<div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">\s*<span class="text-white font-bold text-xl">EX<\/span>\s*<\/div>\s*<span class="text-2xl font-bold">[\s\S]*?<\/span>\s*<\/a>/g,
    logoAnchor,
  );

  html = html.replace(
    /<footer class="border-t border-stone-800 bg-stone-(?:900|950) py-(?:8|10)"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 text-sm text-gray-400">([\s\S]*?)<\/div><\/footer>/g,
    (_match, links) => `<footer class="border-t border-stone-800 bg-stone-950 py-10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">${compactLogoAnchor}<div class="flex flex-wrap gap-4 text-sm text-gray-400">${links}</div></div></footer>`,
  );

  if (html !== before) fs.writeFileSync(file, html, "utf8");
  return html !== before;
}

await generateFavicons();

let changed = 0;
for (const file of walkHtml(DIST)) {
  if (updateHtml(file)) changed += 1;
}

console.log(`Brand assets installed. Updated ${changed} HTML files.`);
