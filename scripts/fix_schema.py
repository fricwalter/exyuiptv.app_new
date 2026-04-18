import glob, re, sys, json
sys.stdout.reconfigure(encoding='utf-8')

# Fixed Organization schema
ORGANIZATION_SCHEMA = json.dumps({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EXYU IPTV",
    "url": "https://exyuiptv.app",
    "logo": {
        "@type": "ImageObject",
        "url": "https://exyuiptv.app/logo.webp"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+4915251741280",
        "contactType": "customer service",
        "availableLanguage": ["Croatian", "Serbian", "Bosnian", "English", "German"]
    },
    "sameAs": ["https://www.facebook.com/FluidVisionTV"]
}, ensure_ascii=False, separators=(',', ':'))

OLD_SCHEMA = '{"@context":"https://schema.org","@type":"Organization","name":"EXYU IPTV","url":"https://exyuiptv.app","logo":"https://exyuiptv.app/logo.webp","telephone":"+4915251741280","contactType":"customer service","availableLanguage":["Croatian","Serbian","Bosnian","English","German"],"sameAs":["https://www.facebook.com/FluidVisionTV"]}'

html_files = glob.glob('dist/**/*.html', recursive=True)
org_fixed = 0
blog_added = 0

for f in html_files:
    content = open(f, encoding='utf-8').read()
    original = content

    # Fix Organization schema
    if OLD_SCHEMA in content:
        content = content.replace(OLD_SCHEMA, ORGANIZATION_SCHEMA)
        org_fixed += 1

    # Add BlogPosting schema for blog posts
    slug_match = re.search(r'dist[/\]blog[/\]([^/\]+)[/\]index\.html', f)
    if slug_match and 'BlogPosting' not in content:
        slug = slug_match.group(1)

        # Extract title from <title> tag
        title_match = re.search(r'<title>([^<]+)</title>', content)
        title = title_match.group(1).replace(' | EXYU IPTV Blog', '').strip() if title_match else 'EXYU IPTV Blog'

        # Extract description
        desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
        desc = desc_match.group(1) if desc_match else ''

        # Extract date
        date_match = re.search(r'<time datetime="([^"]+)"', content)
        date = date_match.group(1) if date_match else '2026-04-18'

        blog_schema = json.dumps({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": desc,
            "image": f"https://exyuiptv.app/images/blog/{slug}.webp",
            "url": f"https://exyuiptv.app/blog/{slug}/",
            "datePublished": date,
            "dateModified": date,
            "author": {
                "@type": "Organization",
                "name": "EXYU IPTV"
            },
            "publisher": {
                "@type": "Organization",
                "name": "EXYU IPTV",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://exyuiptv.app/logo.webp"
                }
            },
            "inLanguage": "bs"
        }, ensure_ascii=False, separators=(',', ':'))

        blog_schema_tag = f'\n<script type="application/ld+json">{blog_schema}</script>'
        content = content.replace('</head>', blog_schema_tag + '\n</head>', 1)
        blog_added += 1

    if content != original:
        open(f, 'w', encoding='utf-8').write(content)

print(f'Fixed Organization schema on {org_fixed} pages')
print(f'Added BlogPosting schema to {blog_added} blog posts')
