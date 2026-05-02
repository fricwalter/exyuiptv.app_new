// Ahrefs SEO fix round 2 - addresses post-deploy findings
// 1. Trailing-slash on internal links (/tv-lista-kanala -> /tv-lista-kanala/, etc.)
// 2. Add Open Graph tags on 5 admin pages (politika-*, impressum, sve-drzave, uslovi-koristenja)
// 3. Fix hreflang lang mismatch by simplifying language hreflang to bs + x-default only
// 4. Best-effort external redirect fixes (add www. or trailing slash to known hosts)

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

// Internal trailing-slash links (worker forces trailing slash, so add it)
const INTERNAL_NO_SLASH = [
  "/tv-lista-kanala",
  "/instalacija",
  "/narudzba",
  "/kontakt",
  "/o-nama",
  "/blog",
  "/sve-drzave",
  "/impressum",
  "/politika-privatnosti",
  "/politika-kolacica",
  "/politika-povrata-novca",
  "/uslovi-koristenja",
];

// Known external redirect targets (best-effort)
const EXTERNAL_REDIRECTS = {
  'href="https://iptvsmarters.com"': 'href="https://www.iptvsmarters.com/"',
  'href="https://videolan.org"': 'href="https://www.videolan.org/"',
  'href="https://www.atptour.com/"': 'href="https://www.atptour.com/en"',
  'href="https://www.samsung.com/support/"': 'href="https://www.samsung.com/us/support/"',
  'href="https://store.google.com/product/chromecast_google_tv"':
    'href="https://store.google.com/us/product/chromecast_google_tv_hd"',
};

const stats = {
  files: 0,
  trailingSlashFixed: 0,
  externalFixed: 0,
  ogAdded: 0,
  hreflangSimplified: 0,
};

function escReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function walkHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(full, out);
    else if (e.isFile() && e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function htmlToCanonical(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

function fixTrailingSlashes(html) {
  let count = 0;
  for (const p of INTERNAL_NO_SLASH) {
    // Match href="...{p}" without slash, followed by quote, ?, or #
    const patterns = [
      new RegExp(`href="${escReg(p)}(?=["?#])`, "g"),
      new RegExp(`href="https://exyuiptv\\.app${escReg(p)}(?=["?#])`, "g"),
    ];
    for (const pat of patterns) {
      html = html.replace(pat, (m) => {
        count++;
        return m + "/";
      });
    }
  }
  stats.trailingSlashFixed += count;
  return html;
}

function fixExternalRedirects(html) {
  for (const [from, to] of Object.entries(EXTERNAL_REDIRECTS)) {
    const before = html;
    html = html.split(from).join(to);
    if (html !== before) stats.externalFixed += (before.length - html.length === 0 ? 1 : 1);
  }
  return html;
}

const OG_PAGES = {
  "/impressum/": {
    title: "Impressum | EXYU IPTV",
    desc: "Impressum EXYU IPTV: pravne informacije, kontakt, sjedište firme i podaci o pružatelju usluge premium IPTV za EXYU dijasporu.",
    image: "https://exyuiptv.app/logo.webp",
  },
  "/politika-privatnosti/": {
    title: "Politika privatnosti | EXYU IPTV",
    desc: "Politika privatnosti EXYU IPTV: kako čuvamo vaše podatke, GDPR, kolačići i prava korisnika premium IPTV usluge za dijasporu.",
    image: "https://exyuiptv.app/logo.webp",
  },
  "/politika-kolacica/": {
    title: "Politika kolačića | EXYU IPTV",
    desc: "Politika kolačića EXYU IPTV: koje kolačiće koristimo, zašto i kako možete upravljati postavkama privatnosti na našoj web stranici.",
    image: "https://exyuiptv.app/logo.webp",
  },
  "/uslovi-koristenja/": {
    title: "Uslovi korištenja | EXYU IPTV",
    desc: "Uslovi korištenja EXYU IPTV: pravila, plaćanje, povrat, ograničenja i odgovornosti korisnika premium IPTV usluge za EXYU dijasporu.",
    image: "https://exyuiptv.app/logo.webp",
  },
  "/sve-drzave/": {
    title: "Sve države | EXYU IPTV",
    desc: "EXYU IPTV za sve države dijaspore: balkanski kanali, sport, filmovi i serije u 4K. Pregledajte ponudu po zemlji i odaberite paket.",
    image: "https://exyuiptv.app/logo.webp",
  },
};

function escAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function addOgTags(html, canonical) {
  const cfg = OG_PAGES[canonical];
  if (!cfg) return html;
  if (/property="og:/.test(html)) return html;

  const url = `https://exyuiptv.app${canonical}`;
  const og = [
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${escAttr(cfg.title)}">`,
    `<meta property="og:description" content="${escAttr(cfg.desc)}">`,
    `<meta property="og:image" content="${cfg.image}">`,
    `<meta property="og:site_name" content="EXYU IPTV">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:url" content="${url}">`,
    `<meta name="twitter:title" content="${escAttr(cfg.title)}">`,
    `<meta name="twitter:description" content="${escAttr(cfg.desc)}">`,
    `<meta name="twitter:image" content="${cfg.image}">`,
  ].join("");

  // Inject right after canonical link
  const newHtml = html.replace(
    /(<link rel="canonical"[^>]*>)/,
    (_, m) => m + og
  );
  if (newHtml !== html) stats.ogAdded++;
  return newHtml;
}

// Remove the language-variant hreflangs (de, de-at, de-ch, hr, sr) since all
// pages are written in Bosnian. Keep only hreflang="bs" and x-default.
function simplifyHreflang(html, canonical) {
  const before = html;
  // Drop variants but keep bs + x-default
  html = html.replace(
    /<link rel="alternate" hreflang="(de|de-at|de-ch|hr|sr)" href="https:\/\/exyuiptv\.app\/[^"]*"\s*\/?>/g,
    ""
  );
  if (html !== before) stats.hreflangSimplified++;
  return html;
}

const files = walkHtml(DIST);
for (const file of files) {
  const canonical = htmlToCanonical(file);
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  html = fixTrailingSlashes(html);
  html = fixExternalRedirects(html);
  html = addOgTags(html, canonical);
  html = simplifyHreflang(html, canonical);

  if (html !== before) {
    fs.writeFileSync(file, html);
    stats.files++;
  }
}

console.log("Ahrefs fix round 2 complete:");
console.log(JSON.stringify(stats, null, 2));
