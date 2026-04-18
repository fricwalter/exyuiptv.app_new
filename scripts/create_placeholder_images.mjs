import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../dist/images/blog");
await mkdir(OUT, { recursive: true });

const posts = [
  { slug: "bosna-sp-2026-gledanje-iz-europe",         r: 30, g: 58, b: 138, r2: 88,  g2: 28, b2: 135 },
  { slug: "hrvatska-srbija-sp-2026-exyu-diaspora",     r: 30, g: 58, b: 138, r2: 21,  g2: 128,b2: 61  },
  { slug: "ex-yu-iptv-velika-britanija-2026-balkanski-kanali", r: 30, g: 58, b: 138, r2: 185,g2: 28, b2: 28 },
  { slug: "google-tv-chromecast-iptv-balkanski-kanali-2026",   r: 30, g: 58, b: 138, r2: 3,  g2: 105,b2: 161},
  { slug: "vpn-i-iptv-exyu-kanali-da-li-treba",        r: 30, g: 58, b: 138, r2: 67,  g2: 20, b2: 7   },
  { slug: "djecji-exyu-program-iptv-dijaspora-setup",  r: 30, g: 58, b: 138, r2: 13,  g2: 148,b2: 136 },
  { slug: "internet-brzina-iptv-hd-4k-streaming-koliko-mbps", r: 30, g: 58, b: 138, r2: 76, g2: 29, b2: 149},
  { slug: "ex-yu-iptv-holandija-belgija-beneluks-dijaspora",   r: 30, g: 58, b: 138, r2: 234,g2: 88, b2: 12 },
  { slug: "iptv-racunar-laptop-exyu-kanali-windows-mac",       r: 30, g: 58, b: 138, r2: 15, g2: 118,b2: 110},
  { slug: "iptv-za-roditelje-starije-dijaspora-vodic", r: 30, g: 58, b: 138, r2: 126,g2: 34, b2: 206 },
];

for (const p of posts) {
  const outPath = path.join(OUT, `${p.slug}.webp`);
  // Create a 1200x630 gradient image using raw pixel data
  const width = 1200, height = 630;
  const pixels = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = x / width;
      const s = y / height;
      const mix = t * 0.7 + s * 0.3;
      const i = (y * width + x) * 3;
      pixels[i]     = Math.round(p.r  + (p.r2  - p.r)  * mix);
      pixels[i + 1] = Math.round(p.g  + (p.g2  - p.g)  * mix);
      pixels[i + 2] = Math.round(p.b  + (p.b2  - p.b)  * mix);
    }
  }
  await sharp(pixels, { raw: { width, height, channels: 3 } })
    .webp({ quality: 85 })
    .toFile(outPath);
  console.log(`✓ ${p.slug}.webp`);
}
console.log("Done.");
