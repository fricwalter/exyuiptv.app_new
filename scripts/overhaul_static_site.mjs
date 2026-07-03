import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

const cp1252 = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function repairMojibake(input) {
  if (!new RegExp("[\\u00c3\\u00c2\\u00c4\\u00c5\\u00c6\\u00d0\\u00d1\\u00d2\\u00d3\\u00d4\\u00d5\\u00d6\\u00d8\\u00d9\\u00da\\u00db\\u00dc\\u00dd\\u00de\\u00df\\u00f0\\u00e2]").test(input)) return input;
  const bytes = [];
  for (const ch of input) {
    const cp = ch.codePointAt(0);
    if (cp1252.has(cp)) bytes.push(cp1252.get(cp));
    else if (cp <= 0xff) bytes.push(cp);
    else bytes.push(...Buffer.from(ch, "utf8"));
  }
  let output = Buffer.from(bytes).toString("utf8");
  output = output
    .replace(/\uFFFD/g, "")
    .replace(new RegExp("Naru\\u00c4i", "g"), "Naruči")
    .replace(new RegExp("Narud\\u00c5\\u00be", "g"), "Narudž")
    .replace(new RegExp("Po\\u00c4etna", "g"), "Početna");
  return output;
}

function ensureHead(html) {
  html = html.replace(/<meta charset="UTF-8">/i, '<meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
  html = html.replace(/(<head>(?:(?!<\/head>).)*?)<meta http-equiv="Content-Type" content="text\/html; charset=UTF-8"><meta http-equiv="Content-Type" content="text\/html; charset=UTF-8">/is, '$1<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
  return html;
}

function homeMeta() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EXYU IPTV",
    url: "https://exyuiptv.app",
    logo: "https://exyuiptv.app/logo.webp",
    description: "Premium Balkanska TV za dijasporu - 25.000+ kanala u 4K",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-152-51741280",
      contactType: "customer service",
      availableLanguage: ["German", "Croatian", "Serbian", "Bosnian"],
    },
    sameAs: ["https://www.facebook.com/FluidVisionTV"],
  };
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "EXYU IPTV Premium Paket",
    description: "25.000+ kanala, 4K kvalitet, bez ugovora",
    brand: { "@type": "Brand", name: "EXYU IPTV" },
    offers: [
      { "@type": "Offer", name: "1 Mjesec", price: "15", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "3 Mjeseca", price: "40", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "6 Mjeseci", price: "60", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "12 Mjeseci", price: "84", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "5000" },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Kolika mi je minimalna brzina interneta potrebna?", acceptedAnswer: { "@type": "Answer", text: "Za normalno gledanje preporučujemo minimalnu brzinu od 30 Mbps. Za 4K sadržaj potrebno je najmanje 50 Mbps." } },
      { "@type": "Question", name: "Da li IPTV radi u Njemačkoj, Austriji, Švicarskoj ili USA?", acceptedAnswer: { "@type": "Answer", text: "Da. Serveri su locirani u Njemačkoj i Holandiji, što daje nisku latenciju i stabilnu konekciju za korisnike širom Evrope i svijeta." } },
      { "@type": "Question", name: "Da li mogu dobiti besplatan test na 24 sata?", acceptedAnswer: { "@type": "Answer", text: "Da. Nudimo besplatan test od 24 sata kako biste mogli isprobati uslugu prije pretplate." } },
    ],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EXYU IPTV",
    url: "https://exyuiptv.app",
    potentialAction: { "@type": "SearchAction", target: "https://exyuiptv.app/?s={search_term_string}", "query-input": "required name=search_term_string" },
  };
  return `<title>EXYU IPTV | Premium Balkanska TV za Dijasporu - 25.000+ Kanala u 4K</title>
<meta name="title" content="EXYU IPTV | Premium Balkanska TV za Dijasporu - 25.000+ Kanala u 4K">
<meta name="description" content="Gledajte najbolje EXYU kanale bilo gdje u svijetu. 25.000+ kanala, 4K kvalitet, bez zamrzavanja, bez ugovora. Besplatan test 24h. Serveri u Njemačkoj i Holandiji.">
<meta name="keywords" content="IPTV, EXYU IPTV, balkanska TV, dijaspora, Njemačka, Austrija, Švicarska, 4K streaming, Arena Sport, RTL, HRT, RTS, Pink TV">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="author" content="EXYU IPTV">
<meta name="language" content="Bosnian">
<meta name="yandex-verification" content="f9a64c607c5f7f54">
<link rel="canonical" href="https://exyuiptv.app/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://exyuiptv.app/">
<meta property="og:title" content="EXYU IPTV | Premium Balkanska TV za Dijasporu">
<meta property="og:description" content="25.000+ kanala u 4K kvalitetu. Bez ugovora, bez zamrzavanja. Besplatan test 24h.">
<meta property="og:image" content="https://exyuiptv.app/wp-content/uploads/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="bs_BA">
<meta property="og:locale:alternate" content="de_DE">
<meta property="og:locale:alternate" content="hr_HR">
<meta property="og:locale:alternate" content="sr_RS">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="EXYU IPTV | Premium Balkanska TV">
<meta name="twitter:description" content="25.000+ kanala u 4K. Besplatan test 24h.">
<meta name="twitter:image" content="https://exyuiptv.app/wp-content/uploads/twitter-card.jpg">
<link rel="alternate" hreflang="de" href="https://exyuiptv.app/exyu-iptv-deutschland/">
<link rel="alternate" hreflang="de-at" href="https://exyuiptv.app/exyuiptv-austrija/">
<link rel="alternate" hreflang="de-ch" href="https://exyuiptv.app/exyuiptv-svicarska/">
<link rel="alternate" hreflang="hr" href="https://exyuiptv.app/exyuiptv-hrvatska/">
<link rel="alternate" hreflang="bs" href="https://exyuiptv.app/exyuiptv-bosna/">
<link rel="alternate" hreflang="sr" href="https://exyuiptv.app/exyuiptv-srbija/">
<link rel="alternate" hreflang="x-default" href="https://exyuiptv.app/">
<script type="application/ld+json">${JSON.stringify(org)}</script>
<script type="application/ld+json">${JSON.stringify(product)}</script>
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<script type="application/ld+json">${JSON.stringify(website)}</script>`;
}

function updateHomeHead(html) {
  const headStart = html.match(/<head>([\s\S]*?)<link rel="icon"/i);
  if (!headStart) return html;
  const replacement = `<head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`;
  html = html.replace(/<head>[\s\S]*?<link rel="icon"/i, `${replacement}<link rel="icon"`);
  html = html.replace(/<!-- Primary Meta Tags -->[\s\S]*?<!-- Fonts -->/i, `<!-- Primary Meta Tags -->${homeMeta()}<!-- Fonts -->`);
  return html;
}

function pricingSection() {
  return `<section id="pricing" class="py-20 bg-stone-950">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Jasni paketi, bez skrivenih troškova</h2>
      <p class="text-lg text-gray-300">Standard za osnovno gledanje. Premium za punu listu, sport i prioritetnu WhatsApp podršku.</p>
    </div>
    <div class="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
      ${planCard("Standard", "15.000+ kanala", "Full HD", "Email podrška", [["1 Mjesec", "12€"], ["3 Mjeseca", "30€"], ["6 Mjeseci", "50€"], ["12 Mjeseci", "70€"]], false)}
      ${planCard("Premium", "25.000+ kanala", "4K + Full HD", "WhatsApp prioritet", [["1 Mjesec", "15€"], ["3 Mjeseca", "40€"], ["6 Mjeseci", "60€"], ["12 Mjeseci", "84€"]], true)}
    </div>
    <div class="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
      <span class="px-4 py-2 rounded-full bg-green-500/10 text-green-300 border border-green-500/30">7 dana garancija povrata novca</span>
      <span class="px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">256-bit SSL zaštita</span>
      <span class="px-4 py-2 rounded-full bg-stone-800 border border-stone-700">PayPal · Visa · Mastercard · Überweisung</span>
    </div>
  </div>
</section>`;
}

function planCard(name, channels, quality, support, prices, hot) {
  return `<article class="relative rounded-2xl border ${hot ? "border-orange-400 bg-stone-900 shadow-xl shadow-orange-950/40" : "border-stone-700 bg-stone-900"} p-6 md:p-8">
    ${hot ? '<div class="absolute -top-3 left-6 rounded-full bg-orange-400 px-3 py-1 text-xs font-bold text-stone-950">NAJPOPULARNIJE</div>' : ""}
    <h3 class="text-2xl font-bold text-white">${name}</h3>
    <ul class="mt-5 space-y-3 text-gray-300">
      <li>✓ ${channels}</li><li>✓ ${quality}</li><li>✓ 1 konekcija</li><li>✓ VOD videoteka</li><li>✓ ${support}</li>
    </ul>
    <div class="mt-7 grid sm:grid-cols-2 gap-3">
      ${prices.map(([label, price]) => `<a href="/narudzba/" class="rounded-xl border border-stone-700 bg-stone-800 p-4 hover:border-orange-400 hover:-translate-y-0.5 transition">
        <span class="block text-sm text-gray-400">${label}${label === "12 Mjeseci" ? " · NAJPOVOLJNIJE" : ""}</span>
        <span class="mt-1 block text-3xl font-bold text-orange-300">${price}</span>
        <span class="mt-2 block text-sm font-semibold text-white">Naruči</span>
      </a>`).join("")}
    </div>
  </article>`;
}

function testimonialsSection() {
  const reviews = [
    ["Marko Petrović", "Frankfurt", "Konačno gledam Arena Sport i RTS bez prekida. Slika je stabilna čak i u 4K."],
    ["Ana Kovačević", "Wien", "Test od 24 sata mi je odmah radio na Samsung TV-u. Podrška je sve podesila preko WhatsAppa."],
    ["Emir Hadžić", "London", "Najbolji paket koji sam probao za naše kanale u inostranstvu. Sport radi bez kašnjenja."],
    ["Jelena Nikolić", "Zürich", "Naručila sam za porodicu i instalacija je bila gotova za par minuta."],
    ["Stefan Jovanović", "Amsterdam", "Pratim utakmice i domaće kanale bez traženja streamova svake sedmice."],
    ["Sabina Mujić", "Malmö", "Stabilno radi i navečer kada svi gledaju. To mi je bilo najvažnije."],
    ["Dino Mehić", "Chicago", "Vremenska razlika nije problem jer VOD i kanali rade kad god mi treba."],
    ["Maja Stojanović", "Bruxelles", "Jednostavno za roditelje, a lista kanala je baš velika."],
    ["Haris Bajrić", "Sydney", "Sport, filmovi i naši kanali na jednom mjestu. Vrijedi svake pare."],
    ["Ivana Marković", "Toronto", "Djeca prate RTL Kids, a mi domaće vijesti. Sve na jednom nalogu."],
    ["Nikola Đorđević", "Stockholm", "Fire TV Stick instalacija je prošla brzo i bez komplikacija."],
    ["Amira Selimović", "Genf", "Roditelji koriste bez problema, što mi je najbolja potvrda da je servis dobar."],
  ];
  return `<!-- ===== TESTIMONIALS ===== -->
<section class="py-20 bg-stone-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Šta kažu naši <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">korisnici</span>?</h2>
      <p class="text-gray-400 text-lg">Svaka recenzija je prikazana jednom, bez dupliranja i bez beskonačnog ponavljanja.</p>
    </div>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      ${reviews.map(([name, city, text]) => `<article class="rounded-2xl border border-stone-700 bg-stone-800 p-5 hover:border-blue-500 hover:-translate-y-0.5 transition">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div><p class="text-white font-semibold">${name}</p><p class="text-gray-500 text-sm">${city}</p></div>
          <div class="text-yellow-400 text-sm" aria-label="5 od 5 zvjezdica">★★★★★</div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">${text}</p>
      </article>`).join("")}
    </div>
  </div>
</section>
<!-- ===== END TESTIMONIALS ===== -->`;
}

function cookieBanner() {
  return `<div id="cookie-consent" class="fixed inset-x-4 bottom-4 z-[80] hidden rounded-2xl border border-stone-700 bg-stone-950/95 p-5 text-white shadow-2xl backdrop-blur md:left-auto md:max-w-xl" role="dialog" aria-live="polite" aria-label="Cookie postavke">
  <div class="flex items-start justify-between gap-4">
    <div>
      <h2 class="text-lg font-bold">Cookies / Kolačići</h2>
      <p class="mt-2 text-sm text-gray-300">Koristimo neophodne kolačiće za rad stranice. Analytics i marketing uključujemo samo uz vašu saglasnost. Wir nutzen notwendige Cookies; Analytics und Marketing nur mit Zustimmung.</p>
      <a href="/politika-kolacica/" class="mt-2 inline-block text-sm text-blue-300 underline">Politika kolačića</a>
    </div>
  </div>
  <div id="cookie-settings" class="mt-4 hidden grid gap-3 text-sm">
    <label class="flex items-center justify-between gap-4 rounded-xl bg-stone-900 p-3"><span>Neophodni / Notwendig</span><input type="checkbox" checked disabled></label>
    <label class="flex items-center justify-between gap-4 rounded-xl bg-stone-900 p-3"><span>Analytics</span><input id="cookie-analytics" type="checkbox"></label>
    <label class="flex items-center justify-between gap-4 rounded-xl bg-stone-900 p-3"><span>Marketing</span><input id="cookie-marketing" type="checkbox"></label>
  </div>
  <div class="mt-4 flex flex-wrap gap-2">
    <button data-cookie-action="accept-all" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500">Alle akzeptieren</button>
    <button data-cookie-action="necessary" class="rounded-xl bg-stone-800 px-4 py-2 text-sm font-semibold hover:bg-stone-700">Nur notwendige</button>
    <button data-cookie-action="settings" class="rounded-xl border border-stone-600 px-4 py-2 text-sm font-semibold hover:bg-stone-800">Einstellungen</button>
    <button data-cookie-action="save" class="hidden rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-500">Speichern</button>
  </div>
</div>
<script>
(function(){
  var key='exyu_cookie_consent_v1';
  var banner=document.getElementById('cookie-consent');
  if(!banner || localStorage.getItem(key)) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  banner.classList.remove('hidden');
  function store(value){
    localStorage.setItem(key, JSON.stringify(value));
    gtag('consent','update',{
      analytics_storage:value.analytics?'granted':'denied',
      ad_storage:value.marketing?'granted':'denied',
      ad_user_data:value.marketing?'granted':'denied',
      ad_personalization:value.marketing?'granted':'denied'
    });
    banner.classList.add('hidden');
  }
  banner.addEventListener('click',function(event){
    var action=event.target && event.target.getAttribute('data-cookie-action');
    if(action==='accept-all') store({necessary:true,analytics:true,marketing:true});
    if(action==='necessary') store({necessary:true,analytics:false,marketing:false});
    if(action==='settings'){
      document.getElementById('cookie-settings').classList.toggle('hidden');
      banner.querySelector('[data-cookie-action="save"]').classList.remove('hidden');
    }
    if(action==='save') store({
      necessary:true,
      analytics:document.getElementById('cookie-analytics').checked,
      marketing:document.getElementById('cookie-marketing').checked
    });
  });
})();
</script>`;
}

function trustSection() {
  return `<section class="py-12 bg-stone-950 border-y border-stone-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-4 gap-4 text-center">
      <div class="rounded-2xl bg-stone-900 p-5 border border-stone-800"><div class="text-2xl font-bold text-white">5.000+</div><p class="text-sm text-gray-400">zadovoljnih korisnika u 30+ zemalja</p></div>
      <div class="rounded-2xl bg-stone-900 p-5 border border-stone-800"><div class="text-2xl font-bold text-white">SSL</div><p class="text-sm text-gray-400">256-bit enkripcija i sigurna narudžba</p></div>
      <div class="rounded-2xl bg-stone-900 p-5 border border-stone-800"><div class="text-2xl font-bold text-white">7 dana</div><p class="text-sm text-gray-400">garancija povrata novca</p></div>
      <div class="rounded-2xl bg-stone-900 p-5 border border-stone-800"><div class="text-2xl font-bold text-white">PayPal · Visa</div><p class="text-sm text-gray-400">Mastercard, kartica i Überweisung</p></div>
    </div>
  </div>
</section>`;
}

function updateFooter(html) {
  html = html.replace(/(<a href="\/o-nama\/"[^>]*>\s*O Nama\s*<\/a>\s*<\/li>)/, '$1<li><a href="/sve-drzave/" class="text-gray-400 hover:text-white transition-colors">Sve države</a></li>');
  html = html.replace(/(<a href="\/politika-kolacica\/"[^>]*>\s*Politika Kolačića\s*<\/a>\s*<\/li>)/, '$1<li><a href="/impressum/" class="text-gray-400 hover:text-white transition-colors">Impressum</a></li>');
  html = html.replace(/<a href="\/exyuiptv-bosna\/" class="text-blue-400 hover:text-blue-300 transition-colors font-medium">Pogledaj sve države[^<]*<\/a>/, '<a href="/sve-drzave/" class="text-blue-400 hover:text-blue-300 transition-colors font-medium">Pogledaj sve države →</a>');
  return html;
}

function updateHome(html) {
  html = updateHomeHead(html);
  html = html.replace(/<astro-island uid="Za33Lu"[\s\S]*?<\/astro-island>\s*(?=<!-- ===== TESTIMONIALS)/, pricingSection());
  html = html.replace(/<!-- ===== TESTIMONIALS MARQUEE ===== -->[\s\S]*?<!-- ===== END TESTIMONIALS ===== -->/, testimonialsSection());
  html = html.replace(/(<\/main>\s*<footer)/, `${trustSection()}$1`);
  html = updateFooter(html);
  if (!html.includes('id="cookie-consent"')) html = html.replace(/<\/body>/, `${cookieBanner()}</body>`);
  return html;
}

function pageTemplate({ title, description, slug, body }) {
  return `<!DOCTYPE html><html lang="bs"><head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index, follow"><link rel="canonical" href="https://exyuiptv.app/${slug}/"><link rel="stylesheet" href="/_astro/_slug_.CRSqJ9Es.css"></head><body class="min-h-screen bg-stone-950 text-white font-sans antialiased"><header class="border-b border-stone-800 bg-stone-900"><nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"><a href="/" class="text-2xl font-extrabold"><span class="text-blue-400">EXYU</span> IPTV</a><a href="/narudzba/" class="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500">Naruči</a></nav></header><main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 prose prose-invert prose-stone max-w-none">${body}</main><footer class="border-t border-stone-800 bg-stone-900 py-8"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 text-sm text-gray-400"><a href="/" class="hover:text-white">Početna</a><a href="/blog/" class="hover:text-white">Blog</a><a href="/sve-drzave/" class="hover:text-white">Sve države</a><a href="/impressum/" class="hover:text-white">Impressum</a><a href="/politika-privatnosti/" class="hover:text-white">Privatnost</a></div></footer>${cookieBanner()}</body></html>`;
}

function writePage(slug, title, description, body) {
  const dir = path.join(DIST, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageTemplate({ title, description, slug, body }), "utf8");
}

function createPages() {
  writePage("impressum", "Impressum | EXYU IPTV", "Impressum und Anbieterkennzeichnung von EXYU IPTV.", `<h1>Impressum</h1><article><h2>Angaben gemäß § 5 TMG</h2><p><strong>EXYU IPTV</strong><br>Josefa Carolina Dallas<br>1007 Whitman Avenue<br>Claremont, CA 91711<br>United States of America</p><h2>Kontakt</h2><p>Telefon: +49 152 51741280<br>E-Mail: <a href="mailto:josefa.dallas284@carpkingdom.com">josefa.dallas284@carpkingdom.com</a><br>WhatsApp: +49 152 51741280</p><h2>Umsatzsteuer-ID</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br>[USt-ID wird nachgereicht - Firma ist in den USA registriert]</p><h2>Handelsregister</h2><p>Eingetragen beim Secretary of State, State of California<br>Registrierungsnummer: [wird nachgereicht]</p><h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2><p>Berufsbezeichnung: Dienstleister für IPTV-Streaming-Dienste<br>Zuständige Kammer: Keine (Dienstleistung im Bereich Telekommunikation/Streaming)<br>Verliehen in: United States of America</p><h2>Streitschlichtung</h2><p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a><br>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p><p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p><h2>Haftung für Inhalte</h2><p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p><p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p><h2>Haftung für Links</h2><p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p><p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p><h2>Urheberrecht</h2><p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p><p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p><h2>Hinweis zur IPTV-Dienstleistung</h2><p>EXYU IPTV bietet einen Streaming-Dienst für Fernsehinhalte an. Wir stellen sicher, dass alle bereitgestellten Inhalte rechtmäßig lizenziert sind und den geltenden Urheberrechtsgesetzen entsprechen. Bei Fragen zu unseren Inhalten oder Lizenzvereinbarungen kontaktieren Sie uns bitte über die oben angegebenen Kontaktmöglichkeiten.</p></article>`);
  writePage("sve-drzave", "EXYU IPTV po državama | Sve lokacije", "Pregled svih država u kojima EXYU IPTV koriste korisnici iz dijaspore.", `<h1>EXYU IPTV po državama</h1><p>Pregled najvažnijih lokacija za naše korisnike u dijaspori. Svaka država vodi na lokalnu stranicu sa detaljima.</p><div class="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">${[
    ["🇩🇪 Njemačka", "/exyu-iptv-deutschland/"], ["🇦🇹 Austrija", "/exyuiptv-austrija/"], ["🇨🇭 Švicarska", "/exyuiptv-svicarska/"], ["🇭🇷 Hrvatska", "/exyuiptv-hrvatska/"], ["🇧🇦 Bosna", "/exyuiptv-bosna/"], ["🇷🇸 Srbija", "/exyuiptv-srbija/"], ["🇺🇸 USA", "/exyuiptv-usa/"], ["🇬🇧 Velika Britanija", "/exyuiptv-velika-britanija/"], ["🇦🇺 Australija", "/exyuiptv-australija/"], ["🇧🇪 Belgija", "/exyuiptv-belgija/"], ["🇲🇰 Makedonija", "/exyuiptv-makedonija/"], ["🇸🇮 Slovenija", "/exyuiptv-slovenija/"], ["🇲🇪 Crna Gora", "/exyuiptv-crna-gora/"], ["🇪🇸 Španija", "/exyuiptv-spanija/"], ["🇸🇪 Švedska", "/exyuiptv-svedska/"]
  ].map(([label, href]) => `<a class="rounded-2xl border border-stone-700 bg-stone-900 p-5 hover:border-blue-500 transition" href="${href}"><span class="text-xl font-bold text-white">${label}</span><span class="block mt-2 text-sm text-gray-400">EXYU kanali, sport i VOD za korisnike u ovoj državi.</span></a>`).join("")}</div>`);
}

function updateLegalPages() {
  const pages = [
    ["politika-privatnosti", "Politika privatnosti / Datenschutzerklärung", "DSGVO-konforme informacije o obradi podataka.", `<h1>Politika privatnosti / Datenschutzerklärung</h1><p>Obrađujemo podatke koje nam pošaljete putem narudžbe, e-maila ili WhatsAppa radi aktivacije usluge, podrške i ispunjenja ugovora.</p><h2>Welche Daten?</h2><p>Kontaktdaten, Bestelldaten, Zahlungsstatus, technische Logdaten und freiwillige Support-Informationen.</p><h2>Zweck und Dauer</h2><p>Daten werden für Vertragsabwicklung, Support, Sicherheit und gesetzliche Pflichten genutzt und nur so lange gespeichert, wie es dafür nötig ist.</p><h2>Vaša prava</h2><p>Imate pravo na pristup, ispravku, brisanje, ograničenje obrade, prenosivost podataka i prigovor. Kontakt: info@exyuiptv.app.</p>`],
    ["uslovi-koristenja", "Uslovi korištenja / AGB", "Uslovi korištenja, plaćanje, odgovornost i pravo povrata.", `<h1>Uslovi korištenja / AGB</h1><p>Korištenjem EXYU IPTV usluge prihvatate ove uslove. Paketi se plaćaju unaprijed i aktiviraju nakon potvrde narudžbe.</p><h2>Widerruf und povrat</h2><p>Za digitalne usluge vrijedi zakonski okvir DACH tržišta. Dodatno nudimo 7 dana garancije povrata novca ako usluga tehnički ne radi nakon pokušaja podrške.</p><h2>Plaćanje</h2><p>Podržani su PayPal, kartice, Visa, Mastercard i bankovni transfer gdje je dostupno.</p><h2>Odgovornost</h2><p>Korisnik je odgovoran za stabilnu internet konekciju i kompatibilan uređaj. Ne odgovaramo za prekide uzrokovane lokalnom mrežom ili uređajem korisnika.</p>`],
    ["politika-kolacica", "Politika kolačića / Cookie-Richtlinie", "Cookie kategorije, saglasnost i Google Consent Mode v2.", `<h1>Politika kolačića / Cookie-Richtlinie</h1><p>Koristimo neophodne kolačiće za rad stranice. Analytics i marketing kolačići aktiviraju se samo uz saglasnost.</p><h2>Kategorije</h2><ul><li>Neophodni: tehničko funkcionisanje stranice.</li><li>Analytics: mjerenje posjeta i poboljšanje sadržaja.</li><li>Marketing: oglašavanje i remarketing ako je uključeno.</li></ul><p>Ihre Einwilligung können Sie jederzeit im Browser-Speicher löschen und neu setzen. Banner podržava Google Consent Mode v2.</p>`],
  ];
  for (const [slug, title, desc, body] of pages) writePage(slug, title, desc, body);
}

function updateSitemap() {
  const file = path.join(DIST, "sitemap-0.xml");
  if (!fs.existsSync(file)) return;
  let xml = fs.readFileSync(file, "utf8");
  for (const url of ["https://exyuiptv.app/impressum/", "https://exyuiptv.app/sve-drzave/"]) {
    if (!xml.includes(url)) xml = xml.replace("</urlset>", `<url><loc>${url}</loc></url></urlset>`);
  }
  fs.writeFileSync(file, xml, "utf8");
}

for (const file of walk(DIST, new Set([".html", ".xml"]))) {
  const before = fs.readFileSync(file, "utf8");
  const after = ensureHead(repairMojibake(before));
  if (after !== before) fs.writeFileSync(file, after, "utf8");
}

const homeFile = path.join(DIST, "index.html");
fs.writeFileSync(homeFile, updateHome(fs.readFileSync(homeFile, "utf8")), "utf8");
createPages();
updateLegalPages();
updateSitemap();

console.log("Static EXYU IPTV overhaul completed.");
