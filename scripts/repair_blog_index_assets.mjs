import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const BLOG_INDEX = path.join(DIST, "blog", "index.html");
const IMAGE_DIR = path.join(DIST, "images", "blog");

const repairedPosts = [
  {
    slug: "sta-je-iptv",
    label: "Sta je IPTV",
    source: "sta-je-iptv-i-kako-radi.webp",
  },
  {
    slug: "tivimate-setup",
    label: "TiviMate setup",
    source: "tivimate-vs-iptv-smarters-pro-2026.webp",
  },
  {
    slug: "gse-smart-iptv-pro",
    label: "GSE Smart IPTV Pro",
    source: "kako-instalirati-iptv-na-samsung-tv.webp",
  },
  {
    slug: "iptv-lista-kanala",
    label: "IPTV lista kanala",
    source: "kako-gledati-exyu-kanale-u-inostranstvu.webp",
  },
  {
    slug: "najbolji-iptv-2026",
    label: "Najbolji IPTV 2026",
    source: "iptv-vs-kabelska-televizija.webp",
  },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

async function createImage({ slug, source }) {
  const out = path.join(IMAGE_DIR, `${slug}.webp`);
  const sourcePath = path.join(IMAGE_DIR, source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source image missing: ${sourcePath}`);
  }

  await sharp(sourcePath)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(out);
  return true;
}

function replaceIndexCards() {
  let html = fs.readFileSync(BLOG_INDEX, "utf8");
  let changed = 0;

  for (const post of repairedPosts) {
    const href = `/blog/${post.slug}/`;
    const hrefIndex = html.indexOf(`href="${href}"`);
    if (hrefIndex === -1) continue;

    const articleStart = html.lastIndexOf("<article", hrefIndex);
    const articleEnd = html.indexOf("</article>", hrefIndex);
    if (articleStart === -1 || articleEnd === -1) continue;

    const article = html.slice(articleStart, articleEnd + "</article>".length);
    if (article.includes(`/images/blog/${post.slug}.webp`)) continue;

    const nextArticle = article.replace(
      /<div class="h-48 bg-gradient-to-br from-blue-700 to-stone-900 flex items-center justify-center text-gray-400">[^<]*<\/div>/,
      `<div class="h-48 bg-stone-900 overflow-hidden"><img src="/images/blog/${post.slug}.webp" alt="${escapeHtml(post.label)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async"></div>`
    );

    if (nextArticle !== article) {
      html = `${html.slice(0, articleStart)}${nextArticle}${html.slice(articleEnd + "</article>".length)}`;
      changed += 1;
    }
  }

  if (changed > 0) fs.writeFileSync(BLOG_INDEX, html, "utf8");
  return changed;
}

function replaceArticleHeroImages() {
  let changed = 0;

  for (const post of repairedPosts) {
    const file = path.join(DIST, "blog", post.slug, "index.html");
    if (!fs.existsSync(file)) continue;

    let html = fs.readFileSync(file, "utf8");
    const imageUrl = `/images/blog/${post.slug}.webp`;
    const absoluteImageUrl = `https://exyuiptv.app${imageUrl}`;
    const heroImage = `<figure class="mt-10 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900"><img src="${imageUrl}" alt="${escapeHtml(post.label)}" class="w-full aspect-video object-cover" loading="eager" decoding="async" width="1200" height="630"></figure>`;
    let next = html.replace(
      /<div class="mt-10 aspect-video rounded-2xl border border-stone-800 bg-gradient-to-br from-blue-900 to-stone-900 flex items-center justify-center text-gray-400">Screenshot \/ vodič placeholder<\/div>/,
      heroImage
    );

    next = next.replace(
      /<meta property="og:image" content="[^"]*">/,
      `<meta property="og:image" content="${absoluteImageUrl}">`
    );

    if (next.includes('<meta property="twitter:image"')) {
      next = next.replace(
        /<meta property="twitter:image" content="[^"]*">/,
        `<meta property="twitter:image" content="${absoluteImageUrl}">`
      );
    } else {
      next = next.replace(
        /<meta name="twitter:card" content="summary_large_image">/,
        `<meta name="twitter:card" content="summary_large_image"><meta property="twitter:image" content="${absoluteImageUrl}">`
      );
    }

    next = next.replace(
      /"publisher":\{"@type":"Organization","name":"EXYU IPTV","logo":\{"@type":"ImageObject","url":"https:\/\/exyuiptv\.app\/logo\.webp"\}\},"datePublished"/,
      `"publisher":{"@type":"Organization","name":"EXYU IPTV","logo":{"@type":"ImageObject","url":"https://exyuiptv.app/logo.webp"}},"image":"${absoluteImageUrl}","datePublished"`
    );

    if (next !== html) {
      fs.writeFileSync(file, next, "utf8");
      changed += 1;
    }
  }

  return changed;
}

await fs.promises.mkdir(IMAGE_DIR, { recursive: true });

let imagesCreated = 0;
for (const post of repairedPosts) {
  if (await createImage(post)) imagesCreated += 1;
}

const cardsUpdated = replaceIndexCards();
const articlesUpdated = replaceArticleHeroImages();

console.log(`Blog assets repaired: ${imagesCreated} images created, ${cardsUpdated} index cards updated, ${articlesUpdated} article hero images updated.`);
