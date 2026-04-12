from __future__ import annotations

import html
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(r"C:\Dev\github\exyuiptv.app_new")
DIST = ROOT / "dist"
IMPORT_DIR = ROOT / "content" / "blog-import-2026-04"
TEMPLATE_ARTICLE = DIST / "blog" / "iptv-besplatno-testirati-24h" / "index.html"
BLOG_INDEX = DIST / "blog" / "index.html"
SITEMAP = DIST / "sitemap-0.xml"
SITE = "https://exyuiptv.app"

PUBLISH_ORDER = [
    "bosna-svjetsko-prvenstvo-2026-live-stream-iptv",
    "ex-yu-iptv-sad-2026-new-york-chicago",
    "ex-yu-iptv-kanada-2026-toronto-vancouver",
    "ex-yu-iptv-skandinavija-2026-svedska-norveska-danska",
    "ex-yu-iptv-australija-2026-sydney-melbourne",
    "arena-sport-sport-klub-iptv-4k-2026",
    "apple-tv-ex-yu-iptv-2026-podesavanje",
    "besplatni-vs-placeni-ex-yu-iptv-2026",
    "epg-catch-up-snimanje-ex-yu-iptv-2026",
    "samsung-lg-balkan-iptv-postavke-2026",
]


@dataclass
class Post:
    slug: str
    title: str
    description: str
    publish_date: str
    tags: list[str]
    cover_image: str
    cover_image_alt: str
    body: str

    @property
    def category(self) -> str:
        joined = " ".join(self.tags).lower()
        if "sport" in joined or "premier league" in joined or "derbi" in joined:
            return "Sport"
        if "apple tv" in joined or "smart tv" in joined or "samsung" in joined or "lg" in joined:
            return "Uredaji"
        if (
            "sad" in joined
            or "kanada" in joined
            or "skandinavija" in joined
            or "australija" in joined
            or "njemacka" in joined
            or "svicarska" in joined
            or "austrija" in joined
            or "dijaspora" in joined
        ):
            return "Dijaspora"
        return "Savjeti"

    @property
    def date_display(self) -> str:
        y, m, d = self.publish_date.split("-")
        return f"{int(d)}.{int(m)}.{y}"

    @property
    def read_time(self) -> str:
        words = len(re.findall(r"\w+", self.body))
        minutes = max(4, round(words / 180))
        return f"{minutes} min"


def parse_frontmatter(text: str) -> Post:
    if not text.startswith("---\n"):
        raise ValueError("Missing frontmatter")
    _, rest = text.split("---\n", 1)
    frontmatter, body = rest.split("\n---\n", 1)
    lines = frontmatter.splitlines()
    data: dict[str, object] = {}
    current_list: list[str] | None = None
    current_key = ""
    for line in lines:
        if not line.strip():
            continue
        if line.startswith("  - ") and current_list is not None:
            current_list.append(line[4:].strip().strip('"'))
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value == "":
            current_list = []
            current_key = key
            data[key] = current_list
        else:
            current_list = None
            data[key] = value.strip('"')
    return Post(
        slug=str(data["slug"]),
        title=str(data["title"]),
        description=str(data["description"]),
        publish_date=str(data["publishDate"]),
        tags=list(data.get("tags", [])),
        cover_image=str(data.get("coverImage", "/images/hero-bg-compressed.webp")),
        cover_image_alt=str(data.get("coverImageAlt", data["title"])),
        body=body.strip(),
    )


def md_links(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        label = html.escape(match.group(1))
        href = html.escape(match.group(2), quote=True)
        extra = ' target="_blank" rel="noopener noreferrer"' if href.startswith("http") else ""
        color = "text-blue-400 hover:text-blue-300 underline"
        return f'<a href="{href}" class="{color}"{extra}>{label}</a>'

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl, html.escape(text))


def render_markdown(body: str) -> str:
    lines = body.splitlines()
    out: list[str] = []
    list_open = False
    for raw in lines:
        line = raw.rstrip()
        stripped = line.strip()
        if not stripped:
            if list_open:
                out.append("</ul>")
                list_open = False
            continue
        if stripped.startswith("- "):
            if not list_open:
                out.append('<ul class="space-y-3 my-4">')
                list_open = True
            out.append(
                '<li class="flex items-start gap-3">'
                '<span class="mt-1 w-5 h-5 flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">'
                '<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>'
                "</span>"
                f"<span>{md_links(stripped[2:])}</span></li>"
            )
            continue
        if list_open:
            out.append("</ul>")
            list_open = False
        image_match = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", stripped)
        if image_match:
            alt = html.escape(image_match.group(1))
            src = html.escape(image_match.group(2), quote=True)
            out.append(
                '<figure class="my-8 overflow-hidden rounded-2xl border border-stone-700 bg-stone-800/60">'
                f'<img src="{src}" alt="{alt}" loading="lazy" class="w-full h-auto object-cover">'
                f'<figcaption class="px-4 py-3 text-sm text-gray-400">{alt}</figcaption>'
                "</figure>"
            )
            continue
        if stripped.startswith("# "):
            continue
        if stripped.startswith("## "):
            out.append(f'<h2 class="text-2xl font-bold text-white mt-10 mb-4">{md_links(stripped[3:])}</h2>')
            continue
        if stripped.startswith("### "):
            out.append(f'<h3 class="text-xl font-semibold text-white mt-8 mb-3">{md_links(stripped[4:])}</h3>')
            continue
        out.append(f'<p>{md_links(stripped)}</p>')
    if list_open:
        out.append("</ul>")
    return "\n".join(out)


def extract_article_template() -> tuple[str, str]:
    text = TEMPLATE_ARTICLE.read_text(encoding="utf-8")
    marker_start = '<main class="flex-grow">'
    marker_end = "</main>"
    before = text.split(marker_start, 1)[0]
    after = text.split(marker_end, 1)[1]
    return before, after


def build_article_html(post: Post, related: list[Post]) -> str:
    before, after = extract_article_template()
    title = html.escape(f"{post.title} | EXYU IPTV Blog")
    description = html.escape(post.description)
    canonical = f"{SITE}/blog/{post.slug}/"
    cover_image_url = (
        post.cover_image
        if post.cover_image.startswith("http")
        else f"{SITE}{post.cover_image}"
    )
    before = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", before, count=1)
    before = re.sub(r'<meta name="title" content=".*?">', f'<meta name="title" content="{title}">', before, count=1)
    before = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{description}">', before, count=1)
    before = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical}">', before, count=1)
    before = re.sub(r'<meta property="og:url" content=".*?">', f'<meta property="og:url" content="{canonical}">', before, count=1)
    before = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', before, count=1)
    before = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{description}">', before, count=1)
    before = re.sub(r'<meta property="og:image" content=".*?">', f'<meta property="og:image" content="{cover_image_url}">', before, count=1)
    before = re.sub(r'<meta property="twitter:url" content=".*?">', f'<meta property="twitter:url" content="{canonical}">', before, count=1)
    before = re.sub(r'<meta property="twitter:title" content=".*?">', f'<meta property="twitter:title" content="{title}">', before, count=1)
    before = re.sub(r'<meta property="twitter:description" content=".*?">', f'<meta property="twitter:description" content="{description}">', before, count=1)
    before = re.sub(r'<meta property="twitter:image" content=".*?">', f'<meta property="twitter:image" content="{cover_image_url}">', before, count=1)

    related_html = "".join(
        f'<li><a href="/blog/{r.slug}/" class="block p-4 rounded-xl border border-stone-700 hover:border-blue-500 hover:bg-stone-700 transition-colors">'
        f'<p class="font-semibold text-white">{html.escape(r.title)}</p>'
        f'<p class="text-sm text-gray-400 mt-1">{html.escape(r.description)}</p></a></li>'
        for r in related[:3]
    )

    content = f"""
<main class="flex-grow">
    <div class="pt-20 min-h-screen" style="background: rgb(28 25 23);">
    <div class="w-full h-56 bg-gradient-to-br from-blue-700 via-purple-700 to-blue-900 relative overflow-hidden flex items-center justify-center">
      <img src="{html.escape(post.cover_image)}" alt="{html.escape(post.cover_image_alt)}" width="1200" height="224" class="absolute inset-0 w-full h-full object-cover opacity-70">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
    </div>
    <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="/" class="hover:text-blue-400 transition-colors">Početna</a>
        <span>/</span>
        <a href="/blog/" class="hover:text-blue-400 transition-colors">Blog</a>
        <span>/</span>
        <span class="text-gray-300 truncate">{html.escape(post.title)}</span>
      </nav>
      <header class="mb-10">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-sm font-semibold rounded-full">{html.escape(post.category)}</span>
          <time datetime="{post.publish_date}" class="text-gray-500 text-sm">{post.date_display}</time>
          <span class="text-gray-600">·</span>
          <span class="text-gray-500 text-sm">{post.read_time} čitanja</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight">{html.escape(post.title)}</h1>
      </header>
      <div class="prose-custom text-gray-300 space-y-6 leading-relaxed">
        <p class="text-xl text-gray-200 font-medium border-l-4 border-blue-500 pl-4">{html.escape(post.description)}</p>
        {render_markdown(post.body)}
        <div class="mt-10 p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-700/40">
          <p class="font-bold text-white text-lg mb-2">Počni sa EXYU IPTV</p>
          <p class="text-gray-300 mb-4">Pregledaj listu kanala, instalaciju i narudžbu ako želiš aktivirati stabilan EXYU IPTV setup za dijasporu.</p>
          <a href="/narudzba/" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">Kontaktirajte nas →</a>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-stone-700">
        <p class="font-semibold text-white mb-4">Podijelite ovaj članak:</p>
        <div class="flex gap-4">
          <a href="https://wa.me/4915251741280?text={html.escape(post.title)}%20-%20{canonical}" target="_blank" rel="noopener noreferrer" class="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors font-semibold text-sm">WhatsApp</a>
          <a href="mailto:?subject={html.escape(post.title)}&body={html.escape(post.description)}%0A%0A{canonical}" class="px-5 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold text-sm">Email</a>
        </div>
      </div>
      <section class="mt-12 pt-8 border-t border-stone-700">
        <h2 class="text-2xl font-bold text-white mb-6">Slični članci</h2>
        <ul class="space-y-4">{related_html}</ul>
      </section>
      <div class="mt-10">
        <a href="/blog/" class="inline-flex items-center gap-2 text-blue-400 font-semibold hover:gap-3 transition-all">← Nazad na blog</a>
      </div>
    </article>
    <div class="pb-16"></div>
  </div>
</main>
"""
    return before + content + after


def build_card(post: Post) -> str:
    return (
        '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 '
        'hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
        '<div class="h-48 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden relative flex items-center justify-center">'
        f'<img src="{html.escape(post.cover_image)}" alt="{html.escape(post.cover_image_alt)}" loading="lazy" width="480" height="192" '
        'class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">'
        '</div><div class="p-6">'
        f'<div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">{html.escape(post.category)}</span>'
        f'<time datetime="{post.publish_date}" class="text-gray-500 text-sm">{post.date_display}</time><span class="text-gray-600 text-sm">· {post.read_time}</span></div>'
        f'<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/{post.slug}/">{html.escape(post.title)}</a></h2>'
        f'<p class="text-gray-400 text-sm mb-4 line-clamp-3">{html.escape(post.description)}</p>'
        f'<a href="/blog/{post.slug}/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pročitaj više →</a>'
        "</div></article>"
    )


def inject_cards(posts: list[Post]) -> None:
    text = BLOG_INDEX.read_text(encoding="utf-8")
    marker = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">'
    start = text.find(marker)
    if start == -1:
        return
    after_start = start + len(marker)
    end = text.find("</div> </div> </div>", after_start)
    if end == -1:
        return

    grid_inner = text[after_start:end]
    article_blocks = re.findall(r"<article[\s\S]*?</article>", grid_inner)
    imported_slugs = {post.slug for post in posts}
    preserved_blocks = [
        block
        for block in article_blocks
        if not any(f'/blog/{slug}/' in block for slug in imported_slugs)
    ]

    rebuilt_inner = " " + "".join(build_card(post) for post in posts) + "".join(preserved_blocks)
    text = text[:after_start] + rebuilt_inner + text[end:]
    BLOG_INDEX.write_text(text, encoding="utf-8")


def update_sitemap(posts: list[Post]) -> None:
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    existing = {loc.text for loc in root.findall("sm:url/sm:loc", ns)}
    for post in posts:
        loc = f"{SITE}/blog/{post.slug}/"
        if loc in existing:
            continue
        url_el = ET.SubElement(root, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        loc_el = ET.SubElement(url_el, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        loc_el.text = loc
    tree.write(SITEMAP, encoding="utf-8", xml_declaration=True)


def main() -> None:
    posts: list[Post] = []
    md_paths = sorted(IMPORT_DIR.glob("*.md"))
    for md_path in md_paths:
        post = parse_frontmatter(md_path.read_text(encoding="utf-8"))
        posts.append(post)
    posts.sort(key=lambda post: (post.publish_date, post.slug), reverse=True)
    for idx, post in enumerate(posts):
        related = [p for p in posts if p.slug != post.slug]
        html_text = build_article_html(post, related[idx:] + related[:idx])
        out = DIST / "blog" / post.slug / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html_text, encoding="utf-8")
    inject_cards(posts)
    update_sitemap(posts)
    print(f"Published {len(posts)} imported posts")


if __name__ == "__main__":
    main()
