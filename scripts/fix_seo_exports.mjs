import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://exyuiptv.app";

const REDIRECTED_PATHS = new Set([
  "/exyu-iptv-deutschland/",
  "/blog/sta-je-iptv-i-kako-radi/",
  "/blog/tivimate-vs-iptv-smarters-pro-2026/",
  "/blog/iptv-lista-kanala-2026/",
  "/blog/najbolji-iptv-provider-2026/",
  "/osnovni-paket/"
]);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function toUrlPath(indexFile) {
  const rel = path.relative(DIST, indexFile).replaceAll(path.sep, "/");
  if (rel === "index.html") return "/";
  if (!rel.endsWith("/index.html")) return null;
  return `/${rel.slice(0, -"/index.html".length)}/`;
}

function normalizeHreflang(html) {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canonical) return html;

  const isHome = canonical === `${SITE}/`;
  const hreflang = isHome
    ? `<link rel="alternate" hreflang="bs" href="${canonical}"><link rel="alternate" hreflang="x-default" href="${canonical}">`
    : `<link rel="alternate" hreflang="bs" href="${canonical}">`;
  const withoutAlternates = html.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+">/g, "");

  if (withoutAlternates.includes('<link rel="canonical"')) {
    return withoutAlternates.replace(/(<link rel="canonical" href="[^"]+">)/, `$1${hreflang}`);
  }

  return withoutAlternates;
}

function fixHomeH1(html) {
  let next = html.replace(/\s*<h1 class="sr-only">EXYU IPTV kanali za dijasporu<\/h1>\s*/, " ");
  next = next.replace(
    /<h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">([\s\S]*?)<\/h2>/,
    '<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">$1</h1>'
  );
  return next;
}

function updateHtml() {
  let changed = 0;
  for (const file of walk(DIST).filter((f) => f.endsWith(".html"))) {
    const original = readFileSync(file, "utf8");
    let html = normalizeHreflang(original);
    if (path.relative(DIST, file).replaceAll(path.sep, "/") === "index.html") {
      html = fixHomeH1(html);
    }
    if (html !== original) {
      writeFileSync(file, html, "utf8");
      changed += 1;
    }
  }
  return changed;
}

function updateRobots() {
  writeFileSync(
    path.join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap-0.xml\n`,
    "utf8"
  );
}

function updateSitemap() {
  const paths = walk(DIST)
    .filter((file) => file.endsWith("index.html"))
    .map(toUrlPath)
    .filter(Boolean)
    .filter((urlPath) => !REDIRECTED_PATHS.has(urlPath))
    .sort((a, b) => {
      if (a === "/") return -1;
      if (b === "/") return 1;
      return a.localeCompare(b);
    });

  const body = paths.map((urlPath) => `<ns0:url><ns0:loc>${SITE}${urlPath}</ns0:loc></ns0:url>`).join("");
  writeFileSync(
    path.join(DIST, "sitemap-0.xml"),
    `<?xml version='1.0' encoding='utf-8'?>\n<ns0:urlset xmlns:ns0="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</ns0:urlset>\n`,
    "utf8"
  );
  writeFileSync(
    path.join(DIST, "sitemap-index.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap></sitemapindex>\n`,
    "utf8"
  );
  return paths.length;
}

const changedHtml = updateHtml();
updateRobots();
const sitemapUrls = updateSitemap();

console.log(`SEO exports fixed: ${changedHtml} HTML files updated, ${sitemapUrls} sitemap URLs written.`);
