import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist", "images", "blog");

const POSTS = [
  ["ex-yu-iptv-utakmice-uzivo-dijaspora-2026", "#0f172a", "#2563eb", "#f97316"],
  ["bosna-utakmice-uzivo-iptv-dijaspora-2026", "#082f49", "#0ea5e9", "#facc15"],
  ["srbija-utakmice-uzivo-iptv-nemacka-2026", "#111827", "#dc2626", "#2563eb"],
  ["hrvatska-nogomet-uzivo-iptv-dijaspora-2026", "#0f172a", "#ef4444", "#38bdf8"],
  ["liga-prvaka-arena-sport-iptv-dijaspora-2026", "#020617", "#1d4ed8", "#f59e0b"],
  ["formula-1-motogp-iptv-balkan-dijaspora-2026", "#111827", "#ef4444", "#e5e7eb"],
  ["euroleague-aba-liga-iptv-dijaspora-2026", "#18181b", "#f97316", "#2563eb"],
  ["iptv-vikend-raspored-utakmica-dijaspora-2026", "#0f172a", "#22c55e", "#38bdf8"],
  ["iptv-za-kafice-utakmice-dijaspora-2026", "#1c1917", "#f97316", "#22c55e"],
  ["najbolja-iptv-aplikacija-za-utakmice-smart-tv-2026", "#020617", "#8b5cf6", "#06b6d4"],
];

function svg(slug, bg, primary, accent) {
  const seed = [...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const ballX = 1060 + (seed % 120);
  const ballY = 510 + (seed % 80);
  const glowX = 420 + (seed % 220);
  const glowY = 180 + (seed % 120);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="0.55" stop-color="#111827"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${primary}" stop-opacity="0.65"/>
      <stop offset="1" stop-color="${primary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="accent" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="${glowX}" cy="${glowY}" r="330" fill="url(#glow)" filter="url(#soft)"/>
  <circle cx="1210" cy="250" r="270" fill="url(#accent)" filter="url(#soft)"/>
  <path d="M0 690 C240 615 420 750 660 680 C930 600 1070 650 1600 560 L1600 900 L0 900 Z" fill="#030712" opacity="0.82"/>
  <path d="M0 735 C260 670 460 790 720 715 C980 640 1190 710 1600 635" fill="none" stroke="${primary}" stroke-width="5" opacity="0.55"/>
  <g transform="translate(420 195)">
    <rect x="0" y="0" width="760" height="430" rx="28" fill="#020617" stroke="#475569" stroke-width="10"/>
    <rect x="34" y="34" width="692" height="362" rx="18" fill="#111827"/>
    <path d="M70 310 C185 220 310 330 420 220 C520 120 610 190 705 95 L705 396 L70 396 Z" fill="${primary}" opacity="0.38"/>
    <path d="M72 82 C190 170 320 70 460 150 C560 210 625 120 706 160" fill="none" stroke="${accent}" stroke-width="18" opacity="0.5"/>
    <circle cx="255" cy="200" r="54" fill="${accent}" opacity="0.75"/>
    <circle cx="510" cy="230" r="42" fill="${primary}" opacity="0.65"/>
    <rect x="330" y="430" width="100" height="55" fill="#020617"/>
    <rect x="220" y="485" width="320" height="22" rx="11" fill="#020617"/>
  </g>
  <g opacity="0.72">
    <circle cx="${ballX}" cy="${ballY}" r="58" fill="#f8fafc"/>
    <path d="M${ballX - 40} ${ballY} L${ballX} ${ballY - 35} L${ballX + 40} ${ballY} L${ballX + 20} ${ballY + 45} L${ballX - 20} ${ballY + 45} Z" fill="#111827" opacity="0.82"/>
    <circle cx="${ballX}" cy="${ballY}" r="56" fill="none" stroke="#111827" stroke-width="5" opacity="0.6"/>
  </g>
  <g transform="translate(260 615) rotate(-8)">
    <rect x="0" y="0" width="310" height="92" rx="46" fill="#020617" stroke="#334155" stroke-width="6"/>
    <circle cx="66" cy="46" r="18" fill="${primary}"/>
    <circle cx="122" cy="46" r="15" fill="${accent}"/>
    <rect x="178" y="34" width="72" height="24" rx="12" fill="#475569"/>
  </g>
  <g opacity="0.26">
    <circle cx="125" cy="125" r="4" fill="#e5e7eb"/>
    <circle cx="180" cy="220" r="3" fill="#e5e7eb"/>
    <circle cx="1385" cy="140" r="5" fill="#e5e7eb"/>
    <circle cx="1460" cy="310" r="3" fill="#e5e7eb"/>
    <circle cx="760" cy="95" r="4" fill="#e5e7eb"/>
  </g>
</svg>`;
}

await mkdir(OUT, { recursive: true });

for (const [slug, bg, primary, accent] of POSTS) {
  const output = path.join(OUT, `${slug}.webp`);
  await sharp(Buffer.from(svg(slug, bg, primary, accent)))
    .resize(1600, 900, { fit: "cover" })
    .webp({ quality: 88, effort: 6 })
    .toFile(output);
  console.log(output);
}
