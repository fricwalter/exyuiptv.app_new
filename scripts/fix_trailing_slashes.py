import glob, re, sys
sys.stdout.reconfigure(encoding='utf-8')

html_files = glob.glob('dist/**/*.html', recursive=True)
fixed_count = 0
file_count = 0

# Links that need trailing slash added
targets = [
    '/blog/apple-tv-ex-yu-iptv-2026-podesavanje',
    '/blog/arena-sport-sport-klub-iptv-4k-2026',
    '/blog/balkanski-sportski-kanali-iptv-dijaspora-2026',
    '/blog/besplatni-vs-placeni-ex-yu-iptv-2026',
    '/blog/bosna-svjetsko-prvenstvo-2026-live-stream-iptv',
    '/blog/epg-catch-up-snimanje-ex-yu-iptv-2026',
    '/blog/ex-yu-iptv-australija-2026-sydney-melbourne',
    '/blog/ex-yu-iptv-sad-2026-new-york-chicago',
    '/blog/ex-yu-iptv-skandinavija-2026-svedska-norveska-danska',
    '/blog/ex-yu-iptv-svicarska-2026-bosanski-hrvatski-srpski-kanali',
    '/blog/kako-gledati-derbije-ex-yu-u-inostranstvu-iptv-2026',
    '/blog/samsung-lg-balkan-iptv-postavke-2026',
    '/narudzba',
]

for f in html_files:
    content = open(f, encoding='utf-8').read()
    original = content
    for path in targets:
        # Replace href="path" with href="path/" but not href="path/"
        content = re.sub(
            r'href="' + re.escape(path) + r'"',
            f'href="{path}/"',
            content
        )
    if content != original:
        open(f, 'w', encoding='utf-8').write(content)
        file_count += 1
        fixes = sum(original.count(f'href="{p}"') for p in targets)
        fixed_count += fixes

print(f'Fixed trailing slashes in {file_count} files, ~{fixed_count} link instances')
