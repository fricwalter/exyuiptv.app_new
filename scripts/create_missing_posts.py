import sys, os, json
sys.stdout.reconfigure(encoding='utf-8')

# Read template from a working new post
TEMPLATE = open('dist/blog/ex-yu-iptv-holandija-belgija-beneluks-dijaspora/index.html', encoding='utf-8').read()

HEADER_FOOTER = """<!DOCTYPE html><html lang="bs"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="shortcut icon" href="/favicon.ico"><!-- Primary Meta Tags -->"""

def build_post(slug, title, description, category, read_min, date, h1, lead, sections, faq, related):
    blog_schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": f"https://exyuiptv.app/images/blog/{slug}.webp",
        "url": f"https://exyuiptv.app/blog/{slug}/",
        "datePublished": date,
        "dateModified": date,
        "author": {"@type": "Organization", "name": "EXYU IPTV"},
        "publisher": {"@type": "Organization", "name": "EXYU IPTV",
                      "logo": {"@type": "ImageObject", "url": "https://exyuiptv.app/logo.webp"}},
        "inLanguage": "bs"
    }, ensure_ascii=False, separators=(',', ':'))

    org_schema = json.dumps({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "EXYU IPTV",
        "url": "https://exyuiptv.app",
        "logo": {"@type": "ImageObject", "url": "https://exyuiptv.app/logo.webp"},
        "contactPoint": {"@type": "ContactPoint", "telephone": "+4915251741280",
                         "contactType": "customer service",
                         "availableLanguage": ["Croatian", "Serbian", "Bosnian", "English", "German"]},
        "sameAs": ["https://www.facebook.com/FluidVisionTV"]
    }, ensure_ascii=False, separators=(',', ':'))

    sections_html = ""
    for s_title, s_items in sections:
        items_html = "\n".join(f"""            <li class="flex items-start gap-3">
              <span class="mt-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
              <span class="text-gray-300">{item}</span>
            </li>""" for item in s_items)
        sections_html += f"""
          <h2 class="text-2xl font-bold text-white mt-10 mb-4">{s_title}</h2>
          <ul class="space-y-3 my-4">
{items_html}
          </ul>
"""

    faq_html = ""
    for q, a in faq:
        faq_html += f"""
            <div class="border border-stone-700 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-2">{q}</h3>
              <p class="text-gray-300">{a}</p>
            </div>"""

    related_html = ""
    for r_slug, r_title, r_cat in related:
        related_html += f"""
              <a href="/blog/{r_slug}/" class="group block bg-stone-800 rounded-xl p-4 border border-stone-700 hover:border-blue-500 transition-all duration-300">
                <img src="/images/blog/{r_slug}.webp" alt="{r_title}" class="w-full h-32 object-cover rounded-lg mb-3" loading="lazy">
                <span class="text-xs text-blue-400 font-medium">{r_cat}</span>
                <h4 class="text-white font-semibold mt-1 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">{r_title}</h4>
              </a>"""

    wa_text = title.replace(' ', '%20')
    html = f"""<!DOCTYPE html><html lang="bs">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="shortcut icon" href="/favicon.ico">
<title>{title} | EXYU IPTV Blog</title>
<meta name="title" content="{title} | EXYU IPTV Blog">
<meta name="description" content="{description}">
<meta name="author" content="EXYU IPTV">
<meta name="language" content="Bosnian">
<link rel="canonical" href="https://exyuiptv.app/blog/{slug}/">
<meta property="og:type" content="article">
<meta property="og:url" content="https://exyuiptv.app/blog/{slug}/">
<meta property="og:title" content="{title} | EXYU IPTV Blog">
<meta property="og:description" content="{description}">
<meta property="og:image" content="https://exyuiptv.app/images/blog/{slug}.webp">
<meta property="og:site_name" content="EXYU IPTV">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://exyuiptv.app/blog/{slug}/">
<meta property="twitter:title" content="{title} | EXYU IPTV Blog">
<meta property="twitter:description" content="{description}">
<meta property="twitter:image" content="https://exyuiptv.app/images/blog/{slug}.webp">
<script type="application/ld+json">{org_schema}</script>
<script type="application/ld+json">{blog_schema}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/_astro/_slug_.CRSqJ9Es.css">
<script src="https://analytics.ahrefs.com/analytics.js" data-key="UL9cBYJfUSUY5pn/zmgU7A" async></script>
</head>
<body class="min-h-screen flex flex-col bg-stone-900 font-sans antialiased">
<header class="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-stone-800">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20 md:h-24">
      <a href="/" class="flex items-center gap-3 group flex-shrink-0">
        <img src="/logo.webp" alt="EXYU IPTV Logo" width="320" height="320" class="h-14 md:h-16 w-auto object-contain drop-shadow-lg group-hover:opacity-90 transition-opacity duration-300" loading="eager" decoding="async">
        <div class="flex flex-col leading-tight">
          <span class="text-xl md:text-2xl font-extrabold tracking-tight">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">EXYU</span>
            <span class="text-white"> IPTV</span>
          </span>
          <span class="text-xs text-gray-500 font-medium tracking-widest uppercase">Premium Streaming</span>
        </div>
      </a>
      <div class="hidden lg:flex items-center gap-1">
        <a href="/" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">Po\u010detna</a>
        <a href="/#features" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">Prednosti</a>
        <a href="/tv-lista-kanala/" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">Kanali</a>
        <a href="/#pricing" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">Cijene</a>
        <a href="/instalacija/" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">Instalacija</a>
        <a href="/#faq" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">FAQ</a>
        <a href="/blog/" class="px-3 py-2 text-gray-300 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-all duration-200 text-sm">Blog</a>
      </div>
      <div class="hidden lg:block flex-shrink-0">
        <a href="/narudzba/" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">Naru\u010di Odmah <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></a>
      </div>
      <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-lg hover:bg-stone-800 transition-colors" aria-label="Meni">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>
    <div id="mobile-menu" class="hidden lg:hidden pb-4">
      <div class="flex flex-col gap-2">
        <a href="/" class="px-4 py-3 text-gray-200 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-colors">Po\u010detna</a>
        <a href="/blog/" class="px-4 py-3 text-gray-200 hover:text-blue-400 font-medium rounded-lg hover:bg-stone-800 transition-colors">Blog</a>
        <a href="/narudzba/" class="mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-center">Naru\u010di Odmah</a>
      </div>
    </div>
  </nav>
</header>
<script type="module">const n=document.getElementById("mobile-menu-btn"),e=document.getElementById("mobile-menu");n.addEventListener("click",()=>{{e.classList.toggle("hidden")}});e.querySelectorAll("a").forEach(t=>{{t.addEventListener("click",()=>{{e.classList.add("hidden")}})}});</script>

<main class="flex-grow pt-24">
  <!-- Hero -->
  <div class="relative h-64 md:h-80 overflow-hidden">
    <img src="/images/blog/{slug}.webp" alt="{h1}" class="w-full h-full object-cover" width="1200" height="630" loading="eager">
    <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
      <div class="max-w-4xl mx-auto">
        <nav class="text-sm text-gray-400 mb-3">
          <a href="/" class="hover:text-blue-400 transition-colors">Po\u010detna</a>
          <span class="mx-2">/</span>
          <a href="/blog/" class="hover:text-blue-400 transition-colors">Blog</a>
          <span class="mx-2">/</span>
          <span class="text-gray-200">{category}</span>
        </nav>
        <h1 class="text-2xl md:text-4xl font-bold text-white leading-tight">{h1}</h1>
      </div>
    </div>
  </div>

  <!-- Article -->
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-wrap items-center gap-4 mb-8 text-sm">
      <span class="px-3 py-1 bg-blue-900/60 text-blue-300 font-semibold rounded-full">{category}</span>
      <time datetime="{date}" class="text-gray-400">{date[8:]}.{date[5:7]}.{date[:4]}.</time>
      <span class="text-gray-500">&middot; {read_min} min \u010ditanja</span>
    </div>

    <!-- Lead paragraph -->
    <p class="text-lg text-gray-200 leading-relaxed border-l-4 border-blue-500 pl-6 mb-10">{lead}</p>

    <!-- Main image -->
    <figure class="my-10">
      <img src="/images/blog/{slug}.webp" alt="{h1}" class="w-full rounded-2xl" width="1200" height="630" loading="lazy">
    </figure>

    <!-- Sections -->
    {sections_html}

    <!-- Useful links -->
    <div class="my-10 p-6 bg-stone-800 rounded-2xl border border-stone-700">
      <h2 class="text-xl font-bold text-white mb-4">Korisni linkovi</h2>
      <ul class="space-y-2">
        <li><a href="/narudzba/" class="text-blue-400 hover:text-blue-300 transition-colors">&rarr; Naru\u010di EXYU IPTV pretplatu</a></li>
        <li><a href="/instalacija/" class="text-blue-400 hover:text-blue-300 transition-colors">&rarr; Vodič za instalaciju</a></li>
        <li><a href="/tv-lista-kanala/" class="text-blue-400 hover:text-blue-300 transition-colors">&rarr; Lista svih kanala</a></li>
        <li><a href="/blog/" class="text-blue-400 hover:text-blue-300 transition-colors">&rarr; Vi\u0161e blog postova</a></li>
      </ul>
    </div>

    <!-- FAQ -->
    <div class="my-10">
      <h2 class="text-2xl font-bold text-white mb-6">Česta pitanja</h2>
      <div class="space-y-4">
        {faq_html}
      </div>
    </div>

    <!-- CTA -->
    <div class="my-10 p-8 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-2xl border border-blue-700/40 text-center">
      <h3 class="text-2xl font-bold text-white mb-3">Spreman/a za po\u010detak?</h3>
      <p class="text-gray-300 mb-6">Isprobaj EXYU IPTV besplatno 24 sata &mdash; bez ugovora, bez rizika.</p>
      <a href="/narudzba/" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
        Besplatni Test 24h &rarr;
      </a>
    </div>

    <!-- Share -->
    <div class="my-8 flex flex-wrap gap-3">
      <a href="https://wa.me/?text={wa_text}%20https://exyuiptv.app/blog/{slug}/" target="_blank" rel="noopener" class="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.551 4.103 1.515 5.833L0 24l6.335-1.493A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.877 9.877 0 01-5.017-1.369l-.36-.214-3.727.878.933-3.613-.235-.373A9.851 9.851 0 012.106 12c0-5.458 4.436-9.894 9.894-9.894 5.459 0 9.894 4.436 9.894 9.894 0 5.459-4.435 9.894-9.894 9.894z"/></svg>
        WhatsApp
      </a>
      <a href="mailto:?subject={wa_text}&body=https://exyuiptv.app/blog/{slug}/" class="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium text-sm transition-colors">
        Email
      </a>
    </div>

    <!-- Related -->
    <div class="my-12">
      <h2 class="text-2xl font-bold text-white mb-6">Sli\u010dni \u010dlanci</h2>
      <div class="grid sm:grid-cols-3 gap-4">
        {related_html}
      </div>
    </div>
  </div>
</main>

<footer class="bg-stone-800 border-t border-stone-700 mt-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div>
        <a href="/" class="flex items-center gap-2 mb-4">
          <img src="/logo.webp" alt="EXYU IPTV" class="h-10 w-auto">
          <span class="text-white font-bold">EXYU IPTV</span>
        </a>
        <p class="text-gray-400 text-sm">Premium IPTV servis za EX-YU dijasporu.</p>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">Linkovi</h4>
        <ul class="space-y-2 text-sm text-gray-400">
          <li><a href="/" class="hover:text-blue-400 transition-colors">Po\u010detna</a></li>
          <li><a href="/blog/" class="hover:text-blue-400 transition-colors">Blog</a></li>
          <li><a href="/narudzba/" class="hover:text-blue-400 transition-colors">Naru\u010dba</a></li>
          <li><a href="/kontakt/" class="hover:text-blue-400 transition-colors">Kontakt</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-stone-700 pt-6 text-center text-gray-500 text-sm">
      <p>&copy; 2026 EXYU IPTV. Sva prava zadr\u017eana.</p>
    </div>
  </div>
</footer>
</body>
</html>"""
    return html

# ─── Post 1: IPTV na računaru / laptopu ───────────────────────────────────────
os.makedirs('dist/blog/iptv-racunar-laptop-exyu-kanali-windows-mac', exist_ok=True)
html1 = build_post(
    slug='iptv-racunar-laptop-exyu-kanali-windows-mac',
    title='IPTV na računaru i laptopu: Kako gledati EX-YU kanale na Windows i Mac',
    description='Kompletan vodič za gledanje EX-YU IPTV kanala na računaru ili laptopu. Najbolje IPTV player aplikacije za Windows i Mac korisnike.',
    category='Instalacija',
    read_min=6,
    date='2026-04-18',
    h1='IPTV na računaru i laptopu: Kako gledati EX-YU kanale na Windows i Mac',
    lead='Gledanje EX-YU kanala na računaru ili laptopu je jednostavnije nego što misliš. Uz pravu IPTV player aplikaciju i stabilnu internet vezu, možeš uživati u omiljenim kanalima direktno na svom ekranu — bez set-top box-a, bez kablovske, bez komplikacija.',
    sections=[
        ('Zašto gledati IPTV na računaru?', [
            'Nema potrebe za dodatnim uređajem — laptop koji već imaš je dovoljan',
            'Veći ekran od mobitela, fleksibilnost tableta i mobitela u jednom',
            'Lako prebacivanje između rada i gledanja TV-a',
            'Jednostavna instalacija — bez tehničkog znanja',
            'Možeš koristiti i VLC player koji je besplatan i dostupan svuda',
        ]),
        ('Najbolje IPTV aplikacije za Windows', [
            'VLC Media Player — besplatan, otvoren kod, podržava M3U liste direktno',
            'IPTV Smarters Pro — dostupan na Windows, profesionalan interfejs sa EPG-om',
            'Kodi sa IPTV Simple Client pluginom — moćan, prilagodljiv, popularan',
            'TiviMate za Windows (web verzija) — intuitivno sučelje, catch-up podrška',
            'Pot Player — lagan, brz, odličan za HD i 4K streamove',
        ]),
        ('IPTV na Mac računarima (macOS)', [
            'IPTV Smarters Pro — dostupan u Mac App Store, odlično sučelje',
            'Infuse 7 — premium player za macOS sa podrškom za sve formate',
            'VLC za Mac — ista funkcionalnost kao Windows verzija, besplatan',
            'GSE Smart IPTV — popularan izbor za Apple ekosistem',
            'Silicone TV — jednostavan, namijenjen macOS korisnicima',
        ]),
        ('Kako podesiti VLC za IPTV (korak po korak)', [
            'Preuzmi VLC sa videolan.org i instaliraj ga',
            'Otvori VLC i idi na Media → Open Network Stream',
            'Unesi URL M3U liste koji si dobio od EXYU IPTV servisa',
            'Klikni Play — kanali se učitavaju automatski za nekoliko sekundi',
            'Za EPG (raspored programa) koristi poseban EPG URL koji dajemo uz pretplatu',
        ]),
    ],
    faq=[
        ('Mogu li gledati IPTV na laptopu bez instalacije aplikacije?',
         'Da — neki IPTV servisi nude web player koji radi direktno u browseru (Chrome, Firefox). Kod nas je primarna metoda aplikacija, ali možeš isprobati i VLC koji je lagan za instalaciju.'),
        ('Kolika brzina interneta treba za gledanje na računaru?',
         'Za HD kvalitet dovoljna je veza od 10 Mbps. Za Full HD preporučujemo 20 Mbps, a za 4K minimalno 25-30 Mbps. Ethernet kabel umjesto Wi-Fi-a uvijek daje stabilniji stream.'),
        ('Mogu li gledati na dva računara istovremeno s jednom pretplatom?',
         'Svaka pretplata dolazi s određenim brojem konekcija. Standardna pretplata pokriva 1 uređaj, a porodični paket pokriva do 3 uređaja simultano — idealno za porodice.'),
    ],
    related=[
        ('fire-tv-stick-iptv-instalacija', 'Fire TV Stick: Kako instalirati IPTV za EX-YU kanale', 'Instalacija'),
        ('google-tv-chromecast-iptv-balkanski-kanali-2026', 'Google TV i Chromecast za EX-YU IPTV', 'Instalacija'),
        ('samsung-lg-balkan-iptv-postavke-2026', 'Samsung i LG Smart TV: IPTV postavke za balkanske kanale', 'Smart TV'),
    ]
)
open('dist/blog/iptv-racunar-laptop-exyu-kanali-windows-mac/index.html', 'w', encoding='utf-8').write(html1)
print('Created: iptv-racunar-laptop-exyu-kanali-windows-mac')

# ─── Post 2: IPTV za roditelje i starije ──────────────────────────────────────
os.makedirs('dist/blog/iptv-za-roditelje-starije-dijaspora-vodic', exist_ok=True)
html2 = build_post(
    slug='iptv-za-roditelje-starije-dijaspora-vodic',
    title='Kako podesiti IPTV za roditelje i starije: Jednostavan vodič za dijasporu',
    description='Vodič za postavljanje IPTV servisa za starije osobe i roditelje u dijaspori. Jednostavno kao kablovska TV — bez komplikacija.',
    category='Savjeti',
    read_min=6,
    date='2026-04-18',
    h1='Kako podesiti IPTV za roditelje i starije: Jednostavan vodič za dijasporu',
    lead='Mnogi od nas žele da roditelji i djedovi/nane u inostranstvu imaju pristup domaćim kanalima — BHT1, HRT, RTS, Pink — ali se brinu da li će moći to koristiti. Dobra vijest: uz pravu postavku, IPTV je jednostavan kao kablovska televizija. Ovaj vodič je napisan upravo za tu situaciju.',
    sections=[
        ('Zašto je IPTV idealan za starije osobe?', [
            'Radi na bilo kom Smart TV-u — nema potrebe za novim uređajem',
            'Jedna daljinska za sve — nema prebacivanja između uređaja',
            'Isti interfejs kao kablovska TV — lista kanala, promjena programa',
            'Automatski se uključuje pri svakom paljenju TV-a',
            'Ne treba nikakvo tehničko znanje nakon postavljanja',
        ]),
        ('Koji uređaj je najprikladniji za starije?', [
            'Smart TV (Samsung, LG, Sony) — najlakša opcija, direktna instalacija aplikacije',
            'Android TV Box — spoji na bilo koji stari TV i pretvori ga u Smart TV',
            'Fire TV Stick Lite — jeftino, jednostavno, plug and play',
            'Apple TV — za korisnike Apple ekosistema, odlična kvaliteta',
            'MAG Box — klasičan set-top box, sučelje slično staroj kabelskoj',
        ]),
        ('Korak po korak: Postavljanje za roditelje', [
            'Korak 1: Naruči pretplatu i dobij M3U link ili Xtream login podake',
            'Korak 2: Instaliraj IPTV aplikaciju na njihov Smart TV ili Android Box',
            'Korak 3: Unesi login podatke jednom — to je sve, ne treba ponavljati',
            'Korak 4: Postavi listu favorita s kanalima koje najčešće gledaju (BHT1, RTS...)',
            'Korak 5: Objasni im kako se mjenjaju kanali — identično kablovskoj',
        ]),
        ('Savjeti za lakše korištenje', [
            'Postavi TV da se automatski uključuje na njihovom omiljenom kanalu',
            'Napiši kratke upute na papiru i stavi pored TV-a ako treba',
            'Koristi aplikaciju s velikim fontovima i jednostavnim interfejsom',
            'Provjeri internet vezu — preporučujemo žičanu (ethernet) konekciju za stabilnost',
            'Pozovi ih jednom tjedno da provjeriš radi li sve OK',
        ]),
    ],
    faq=[
        ('Da li roditelji mogu sami podesiti IPTV?',
         'Uz naš vodič — da! Ali preporučujemo da to uradi neko od mlađih članova porodice prvi put. Nakon toga, korištenje je toliko jednostavno da ga ne treba ponavljati. Neke naše stranke su to podesile roditelji video pozivom uz naše upute.'),
        ('Šta ako im nešto prestane raditi?',
         'Naša podrška je dostupna 24/7. Uz to, većina problema se riješava jednostavnim restartom aplikacije ili TV-a. Možeš ih i ti pomoći daljinski putem TeamViewer ili AnyDesk ako koriste Android Box.'),
        ('Da li IPTV podržava starije Smart TV-e?',
         'Da! Ako TV ima Android TV sistem ili podržava instalaciju aplikacija, IPTV radi savršeno. Za starije TV-e bez Smarta, preporučujemo dodati jeftian Android TV Box ili Fire TV Stick koji se spoji na HDMI ulaz.'),
    ],
    related=[
        ('android-box-iptv-instalacija', 'Android Box: Kako instalirati i podesiti IPTV', 'Instalacija'),
        ('apple-tv-ex-yu-iptv-2026-podesavanje/', 'Apple TV i EX-YU IPTV: Kompletno podešavanje', 'Apple'),
        ('iptv-racunar-laptop-exyu-kanali-windows-mac', 'IPTV na računaru i laptopu: Windows i Mac', 'Instalacija'),
    ]
)
open('dist/blog/iptv-za-roditelje-starije-dijaspora-vodic/index.html', 'w', encoding='utf-8').write(html2)
print('Created: iptv-za-roditelje-starije-dijaspora-vodic')
print('Done!')
