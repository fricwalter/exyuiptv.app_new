// Fix remaining SemRush errors:
// - Issue #12: Add rel="nofollow" to wa.me links so crawlers stop hitting it (429)
// - Issue #213: Add a small "Related posts" linkblock to the 3 underconnected blog posts

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

let waFixed = 0;
let relatedAdded = 0;

// Find every <a href="https://wa.me/..."> with optional existing rel="..."
const WA_HREF = /<a([^>]*?)href="https:\/\/wa\.me\/[^"]*"([^>]*)>/g;

function addNofollow(attrsBefore, attrsAfter) {
  const all = attrsBefore + " " + attrsAfter;
  const relMatch = all.match(/\brel="([^"]*)"/);
  if (relMatch) {
    if (relMatch[1].includes("nofollow")) return null; // already has it
    const newRel = (relMatch[1] + " nofollow").trim();
    // Replace rel="..." in whichever attr list it's in
    if (/\brel="/.test(attrsBefore)) {
      attrsBefore = attrsBefore.replace(/\brel="[^"]*"/, `rel="${newRel}"`);
    } else {
      attrsAfter = attrsAfter.replace(/\brel="[^"]*"/, `rel="${newRel}"`);
    }
  } else {
    // No rel attribute — add one
    attrsAfter = attrsAfter + ' rel="nofollow"';
  }
  return { attrsBefore, attrsAfter };
}

// Related-posts block to inject before </main> on the 3 underconnected pages.
const RELATED_PAGES = new Set([
  "/blog/iptv-osterreich-bosanski-srpski-kanali/",
  "/blog/legalnost-iptv-u-njemackoj/",
  "/blog/najbolji-sportski-kanali-exyu-iptv/",
]);

const RELATED_LINKS = {
  "/blog/iptv-osterreich-bosanski-srpski-kanali/": [
    ["/blog/ex-yu-iptv-svicarska-2026-bosanski-hrvatski-srpski-kanali/", "EX YU IPTV Švicarska 2026"],
    ["/blog/ex-yu-iptv-njemacka-2026-bundesliga-balkan-kanali/", "EX YU IPTV Njemačka 2026"],
    ["/exyuiptv-austrija/", "EXYU IPTV Austrija"],
    ["/blog/legalnost-iptv-u-njemackoj/", "Legalnost IPTV u Njemačkoj"],
    ["/blog/najbolji-iptv-2026/", "Najbolji IPTV 2026"],
  ],
  "/blog/legalnost-iptv-u-njemackoj/": [
    ["/blog/ex-yu-iptv-njemacka-2026-bundesliga-balkan-kanali/", "EX YU IPTV Njemačka 2026"],
    ["/blog/iptv-osterreich-bosanski-srpski-kanali/", "IPTV Österreich za EXYU dijasporu"],
    ["/exyuiptv-njemacka/", "EXYU IPTV Njemačka"],
    ["/blog/najbolji-iptv-2026/", "Najbolji IPTV 2026"],
    ["/blog/iptv-besplatno-testirati-24h/", "IPTV besplatno testirati 24h"],
  ],
  "/blog/najbolji-sportski-kanali-exyu-iptv/": [
    ["/blog/arena-sport-premier-league-ex-yu-iptv-dijaspora-2026/", "Arena Sport i Premier League IPTV 2026"],
    ["/blog/arena-sport-sport-klub-iptv-4k-2026/", "Arena Sport i Sport Klub 4K 2026"],
    ["/blog/euroleague-aba-liga-iptv-dijaspora-2026/", "Euroleague i ABA liga IPTV 2026"],
    ["/blog/balkanski-sportski-kanali-iptv-dijaspora-2026/", "Balkanski sportski kanali IPTV 2026"],
    ["/blog/liga-prvaka-arena-sport-iptv-dijaspora-2026/", "Liga prvaka Arena Sport IPTV 2026"],
  ],
};

function buildRelatedBlock(slug) {
  const links = RELATED_LINKS[slug];
  const items = links.map(([href, label]) =>
    `<li><a href="${href}" class="text-blue-400 hover:text-blue-300 underline">${label}</a></li>`
  ).join("");
  return `<aside class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-8 border-t border-stone-800"><h2 class="text-2xl font-bold text-white mb-4">Povezani članci</h2><ul class="space-y-2 text-gray-300">${items}</ul></aside>`;
}

function htmlToCanonicalPath(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

for (const file of walk(DIST)) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  // wa.me nofollow
  html = html.replace(WA_HREF, (full, b, a) => {
    const fixed = addNofollow(b, a);
    if (!fixed) return full;
    waFixed++;
    return `<a${fixed.attrsBefore}href="https://wa.me/4915251741280"${fixed.attrsAfter}>`;
  });

  // Related posts block
  const canonical = htmlToCanonicalPath(file);
  if (RELATED_PAGES.has(canonical) && !html.includes("Povezani članci")) {
    const block = buildRelatedBlock(canonical);
    if (html.includes("</main>")) {
      html = html.replace("</main>", block + "</main>");
      relatedAdded++;
    }
  }

  if (html !== before) fs.writeFileSync(file, html);
}

// Create llms.txt at /dist root
const LLMS = `# EXYU IPTV

> Premium IPTV za EX YU dijasporu: 25.000+ balkanskih kanala u 4K, sport, filmovi, serije i besplatan test 24h. Stabilan stream uz EPG i podršku.

## Glavne stranice

- [Početna](https://exyuiptv.app/): pregled ponude, paketa i prednosti
- [Naručite](https://exyuiptv.app/narudzba/): standardni i premium IPTV paketi
- [TV lista kanala](https://exyuiptv.app/tv-lista-kanala/): kompletan popis kanala
- [Instalacija](https://exyuiptv.app/instalacija/): vodič za sve uređaje
- [Sve države](https://exyuiptv.app/sve-drzave/): IPTV po zemljama dijaspore
- [Blog](https://exyuiptv.app/blog/): vodiči, savjeti i novosti

## Države

- [Njemačka](https://exyuiptv.app/exyuiptv-njemacka/)
- [Austrija](https://exyuiptv.app/exyuiptv-austrija/)
- [Švicarska](https://exyuiptv.app/exyuiptv-svicarska/)
- [Bosna i Hercegovina](https://exyuiptv.app/exyuiptv-bosna/)
- [Hrvatska](https://exyuiptv.app/exyuiptv-hrvatska/)
- [Srbija](https://exyuiptv.app/exyuiptv-srbija/)
- [Crna Gora](https://exyuiptv.app/exyuiptv-crna-gora/)
- [Makedonija](https://exyuiptv.app/exyuiptv-makedonija/)
- [Slovenija](https://exyuiptv.app/exyuiptv-slovenija/)
- [USA](https://exyuiptv.app/exyuiptv-usa/)
- [Australija](https://exyuiptv.app/exyuiptv-australija/)
- [Velika Britanija](https://exyuiptv.app/exyuiptv-velika-britanija/)
- [Švedska](https://exyuiptv.app/exyuiptv-svedska/)
- [Belgija](https://exyuiptv.app/exyuiptv-belgija/)
- [Španija](https://exyuiptv.app/exyuiptv-spanija/)

## Pravne informacije

- [Impressum](https://exyuiptv.app/impressum/)
- [Politika privatnosti](https://exyuiptv.app/politika-privatnosti/)
- [Politika kolačića](https://exyuiptv.app/politika-kolacica/)
- [Politika povrata novca](https://exyuiptv.app/politika-povrata-novca/)
- [Uslovi korištenja](https://exyuiptv.app/uslovi-koristenja/)

## Kontakt

- WhatsApp: +4915251741280
- E-mail: info@exyuiptv.app
- Sitemap: https://exyuiptv.app/sitemap-0.xml
`;

fs.writeFileSync(path.join(DIST, "llms.txt"), LLMS);

console.log(`wa.me links fixed: ${waFixed}`);
console.log(`Related-posts blocks added: ${relatedAdded}`);
console.log(`llms.txt created at dist/llms.txt`);
