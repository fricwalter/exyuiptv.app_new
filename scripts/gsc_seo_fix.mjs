import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE = "https://exyuiptv.app";
const today = "2026-05-02";

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function slugPath(slug) {
  return slug.endsWith("/") ? slug : `${slug}/`;
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbJson(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE}${item.url}`,
    })),
  };
}

function productJson() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "EXYU IPTV Premium Paket",
    description: "25.000+ kanala, 4K kvalitet, Standard i Premium IPTV paketi za EXYU dijasporu.",
    brand: { "@type": "Brand", name: "EXYU IPTV" },
    offers: [
      { "@type": "Offer", name: "Standard 1 mjesec", price: "12", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Premium 1 mjesec", price: "15", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Premium 12 mjeseci", price: "84", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "5000" },
  };
}

function basePage({ title, description, canonical, body, schema = [] }) {
  return `<!DOCTYPE html><html lang="bs"><head><meta charset="UTF-8"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="shortcut icon" href="/favicon.ico"><title>${esc(title)}</title><meta name="title" content="${esc(title)}"><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"><link rel="canonical" href="${SITE}${canonical}"><meta property="og:type" content="article"><meta property="og:url" content="${SITE}${canonical}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${SITE}/images/hero-bg-compressed.webp"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/_astro/_slug_.CRSqJ9Es.css">${schema.map(jsonLd).join("")}</head><body class="min-h-screen bg-stone-950 text-white font-sans antialiased"><header class="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/95 backdrop-blur"><nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"><a href="/" class="text-2xl font-extrabold"><span class="text-blue-400">EXYU</span> IPTV</a><div class="hidden md:flex items-center gap-5 text-sm text-gray-300"><a href="/sve-drzave/" class="hover:text-white">Sve države</a><a href="/blog/" class="hover:text-white">Blog</a><a href="/tv-lista-kanala/" class="hover:text-white">Kanali</a><a href="/narudzba/" class="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500">Naruči</a></div></nav></header><main>${body}</main><footer class="border-t border-stone-800 bg-stone-950 py-10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 text-sm text-gray-400"><a href="/" class="hover:text-white">Početna</a><a href="/sve-drzave/" class="hover:text-white">Sve države</a><a href="/blog/" class="hover:text-white">Blog</a><a href="/narudzba/" class="hover:text-white">Narudžba</a><a href="/impressum/" class="hover:text-white">Impressum</a></div></footer></body></html>`;
}

const countries = [
  {
    slug: "exyuiptv-makedonija",
    land: "Makedonija",
    keyword: "iptv makedonija",
    intro: "IPTV za Makedoniju je praktično rješenje za ljude koji žive u Njemačkoj, Austriji, Švicarskoj ili širom dijaspore, a žele redovno gledati makedonske, balkanske i internacionalne kanale bez komplikovanog kablovskog ugovora.",
    channels: "U paketu su zastupljeni makedonski informativni, zabavni i muzički kanali, regionalni EXYU programi, sportski kanali, filmski kanali i VOD videoteka. Posebno je bitno što korisnici mogu imati makedonski sadržaj zajedno sa bosanskim, srpskim, hrvatskim i crnogorskim kanalima u jednoj listi.",
  },
  {
    slug: "exyuiptv-bosna",
    land: "Bosna i Hercegovina",
    keyword: "iptv bosna",
    intro: "IPTV Bosna je fokusiran na korisnike koji žele domaće bosanske kanale, regionalni sport i svakodnevne emisije iz Bosne i Hercegovine dok žive van domovine.",
    channels: "Lista uključuje bosanske javne i komercijalne kanale, informativne emisije, muzičke programe, filmove, serije, dječiji sadržaj i sportske kanale koje dijaspora najčešće traži.",
  },
  {
    slug: "exyuiptv-austrija",
    land: "Austrija",
    keyword: "iptv austrija",
    intro: "IPTV Austrija je namijenjen EXYU dijaspori u Beču, Grazu, Linzu, Salzburgu i drugim gradovima gdje kablovski paketi često nemaju dovoljno balkanskog sadržaja.",
    channels: "Korisnici u Austriji dobijaju bosanske, srpske, hrvatske, makedonske i crnogorske kanale, sport, filmove, serije i VOD sadržaj na jednom mjestu.",
  },
  {
    slug: "exyuiptv-crna-gora",
    land: "Crna Gora",
    keyword: "iptv crna gora",
    intro: "IPTV Crna Gora pokriva potrebe korisnika koji žele crnogorske i regionalne kanale u dijaspori, bez vezivanja za lokalnog kablovskog operatera.",
    channels: "U listi su crnogorski informativni programi, regionalni EXYU kanali, sportski prenosi, filmovi, serije, muzika i dječiji programi.",
  },
  {
    slug: "exyuiptv-njemacka",
    land: "Njemačka",
    keyword: "iptv njemacka",
    intro: "IPTV Njemačka je jedna od najvažnijih stranica za EXYU dijasporu jer veliki broj korisnika živi u Berlinu, Minhenu, Hamburgu, Dortmundu, Stuttgartu i Frankfurtu.",
    channels: "Paket objedinjuje balkanske kanale iz Bosne, Srbije, Hrvatske, Makedonije, Crne Gore i Slovenije, plus internacionalne filmske, sportske i dokumentarne kanale.",
  },
];

function countryPage(country) {
  const title = `EXYU IPTV ${country.land} | Premium Balkanska TV za Dijasporu - 25.000+ Kanala`;
  const description = `Najbolji IPTV za ${country.land}. Gledajte 25.000+ kanala u 4K. Standard (15k) i Premium (25k) paket. 24/7 podrška. Naručite odmah!`;
  const canonical = `/${country.slug}/`;
  const body = `<section class="bg-stone-950 py-16 md:py-24"><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><nav class="mb-8 text-sm text-gray-400"><a href="/" class="hover:text-white">Početna</a> <span class="mx-2">/</span> <a href="/sve-drzave/" class="hover:text-white">Sve države</a> <span class="mx-2">/</span> <span>${esc(country.land)}</span></nav><p class="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-300">${esc(country.keyword)}</p><h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight">IPTV za ${esc(country.land)} – Najbolja Balkanska TV</h1><p class="mt-6 text-xl text-gray-300">${esc(country.intro)}</p><div class="mt-8 flex flex-wrap gap-3"><a href="/narudzba/" class="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">Naručite odmah</a><a href="/tv-lista-kanala/" class="rounded-xl border border-stone-700 px-6 py-3 font-bold text-white hover:bg-stone-900">Pogledaj listu kanala</a></div></div></section><section class="bg-stone-900 py-16"><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert prose-stone max-w-none"><h2>Kanali i sadržaj za ${esc(country.land)}</h2><p>${esc(country.channels)}</p><p>Streaming kvalitet je podešen za stabilno gledanje u HD, Full HD i 4K rezoluciji. Ako imate stabilnu internet konekciju od 30 Mbps, većina kanala radi bez zamrzavanja. Za 4K sadržaj preporučujemo 50 Mbps ili više, pogotovo ako u kući radi više uređaja.</p><h2>Uređaji i instalacija</h2><p>EXYU IPTV radi na Smart TV uređajima, Fire TV Sticku, Android Boxu, Apple TV-u, iOS i Android telefonima, tabletima, Windows računarima, Mac laptopima, MAG i Enigma2 resiverima. Nakon narudžbe dobijate jasna uputstva i podršku za instalaciju.</p><h2>Standard vs Premium paket</h2><p>Standard paket je dobar izbor ako želite osnovnu listu sa oko 15.000 kanala i stabilno Full HD gledanje. Premium paket uključuje 25.000+ kanala, 4K sadržaj, širi sportski paket, VOD videoteku i prioritetnu WhatsApp podršku. Za većinu korisnika koji prate sport i više regionalnih kanala, Premium je bolji izbor.</p><h2>Podrška na jeziku koji razumijete</h2><p>Podrška je dostupna na njemačkom, bosanskom, hrvatskom i srpskom jeziku. To je bitno za korisnike u DACH regiji jer se problemi najčešće rješavaju brže kada ne morate objašnjavati uređaj, aplikaciju i listu kanala na stranom jeziku.</p><p>Vratite se na <a href="/sve-drzave/">pregled svih država</a>, pogledajte <a href="/blog/">IPTV vodiče</a> ili odmah otvorite <a href="/narudzba/">narudžbu</a>.</p></div></section>`;
  const schema = [
    breadcrumbJson([{ name: "Početna", url: "/" }, { name: "Sve države", url: "/sve-drzave/" }, { name: country.land, url: canonical }]),
    productJson(),
  ];
  return basePage({ title, description, canonical, body, schema });
}

const posts = [
  {
    slug: "sta-je-iptv",
    category: "Vodiči",
    title: "Šta je IPTV i kako radi?",
    description: "Saznajte šta je IPTV televizija, kako radi u poređenju sa kablom i satelitom, koliko košta i kako početi gledati EXYU kanale.",
    keywords: ["sta je iptv", "sta je iptv televizija"],
    minutes: 8,
    faq: [
      ["Šta je IPTV?", "IPTV je televizija koja se isporučuje preko internet konekcije umjesto preko klasičnog kabla, antene ili satelita."],
      ["Koliko interneta treba za IPTV?", "Za stabilno gledanje preporučujemo najmanje 30 Mbps, a za 4K sadržaj 50 Mbps ili više."],
      ["Da li IPTV radi na Smart TV-u?", "Da. IPTV radi na Smart TV-u, Fire TV Sticku, Android Boxu, telefonu, tabletu i računaru."],
    ],
    sections: [
      ["IPTV vs kablovska i satelitska TV", "Kod kablovske televizije zavisite od lokalnog operatera i njegove liste kanala. Satelit traži antenu, podešavanje i često dodatnu opremu. IPTV koristi vašu internet konekciju, pa je fleksibilniji za dijasporu koja želi balkanske kanale u Njemačkoj, Austriji, Švicarskoj, USA ili Australiji."],
      ["Prednosti IPTV-a", "Najveća prednost je izbor kanala. Jedna IPTV lista može imati domaće EXYU kanale, sport, filmove, serije, dokumentarce, muziku, dječiji program i VOD videoteku. Druga prednost je uređaj: možete gledati na Smart TV-u, Android Boxu, Fire TV Sticku, telefonu ili laptopu."],
      ["Kako početi", "Treba vam stabilan internet, kompatibilan uređaj i IPTV aplikacija. Nakon narudžbe dobijate pristupne podatke, playlistu ili portal, EPG ako je dostupan i uputstvo za aplikaciju. Ako niste sigurni, otvorite /narudzba/ i zatražite test."],
    ],
    links: [["TiviMate setup", "/blog/tivimate-setup/"], ["Lista kanala", "/blog/iptv-lista-kanala/"]],
  },
  {
    slug: "tivimate-setup",
    category: "Instalacija",
    title: "TiviMate IPTV Player Setup Guide 2026",
    description: "Korak po korak TiviMate setup za Android TV i Fire TV Stick: instalacija, dodavanje IPTV liste, EPG i najvažnije postavke.",
    keywords: ["tivimate", "iptv tivimate"],
    minutes: 9,
    faq: [
      ["Da li je TiviMate dobar za IPTV?", "Da. TiviMate je jedna od najboljih IPTV aplikacija za Android TV, Google TV, Fire TV Stick i Android Box."],
      ["Kako dodati IPTV listu u TiviMate?", "Otvorite Add playlist, unesite M3U link ili Xtream Codes podatke i sačekajte da aplikacija učita kanale."],
      ["Da li TiviMate ima EPG?", "Da. EPG se dodaje kao poseban link ili se povlači automatski preko Xtream Codes naloga."],
    ],
    sections: [
      ["Instalacija aplikacije", "Na Android TV i Google TV uređajima TiviMate se instalira iz Play Store-a. Na Fire TV Sticku se često koristi Downloader aplikacija. Nakon instalacije otvorite TiviMate i odaberite Add playlist."],
      ["Dodavanje liste i EPG-a", "Najčešće opcije su M3U playlist ili Xtream Codes. Ako dobijete server URL, username i password, odaberite Xtream Codes jer je stabilniji za EPG, kategorije i automatsko osvježavanje liste."],
      ["Preporučene postavke", "Uključite automatsko ažuriranje liste, podesite EPG refresh jednom dnevno i sortirajte omiljene kanale u Favorites. Za sport koristite žičani internet ili 5 GHz Wi-Fi kada je moguće."],
    ],
    links: [["Šta je IPTV?", "/blog/sta-je-iptv/"], ["GSE Smart IPTV Pro", "/blog/gse-smart-iptv-pro/"]],
  },
  {
    slug: "gse-smart-iptv-pro",
    category: "Instalacija",
    title: "GSE Smart IPTV Pro einrichten",
    description: "GSE Smart IPTV Pro vodič za iOS, Android i Apple TV: dodavanje M3U liste, Xtream Codes naloga i EPG podešavanje.",
    keywords: ["gse smart iptv pro", "gse pro iptv"],
    minutes: 7,
    faq: [
      ["Na kojim uređajima radi GSE Smart IPTV Pro?", "Radi na iPhone, iPad, Android telefonima, tabletima i nekim TV uređajima."],
      ["Da li GSE podržava M3U liste?", "Da. GSE podržava M3U liste, Xtream Codes API i EPG linkove."],
      ["Šta ako lista ne radi?", "Provjerite internet, unesene podatke i da li je nalog aktivan. Ako i dalje ne radi, javite se podršci."],
    ],
    sections: [
      ["Kada koristiti GSE", "GSE Smart IPTV Pro je koristan kada želite gledati IPTV na telefonu, tabletu ili Apple uređaju. Nije uvijek najljepša aplikacija za TV, ali je fleksibilna i podržava više načina unosa liste."],
      ["Dodavanje naloga", "U aplikaciji odaberite Remote Playlists za M3U link ili Xtream Codes API ako imate server, korisničko ime i lozinku. Nakon unosa sačuvajte profil i pokrenite učitavanje kanala."],
      ["EPG i favoriti", "Dodajte EPG URL ako ga imate, zatim označite najvažnije kanale kao Favorite. To posebno pomaže roditeljima i starijim korisnicima koji ne žele pretraživati veliku listu."],
    ],
    links: [["TiviMate setup", "/blog/tivimate-setup/"], ["Kako izabrati IPTV", "/blog/najbolji-iptv-2026/"]],
  },
  {
    slug: "iptv-lista-kanala",
    category: "Kanali",
    title: "EXYU IPTV Kanalliste – Alle Sender 2026",
    description: "Pregled EXYU IPTV liste kanala: sport, filmovi, serije, news, muzika, kids, regionalni kanali i države koje pokrivamo.",
    keywords: ["iptv lista kanala", "exyu iptv lista"],
    minutes: 8,
    faq: [
      ["Koliko kanala ima EXYU IPTV?", "Premium paket uključuje 25.000+ kanala, dok Standard paket pokriva osnovnu listu od oko 15.000 kanala."],
      ["Da li lista ima sportske kanale?", "Da. Lista uključuje sportske kategorije, premium sport, regionalne i internacionalne sportske kanale."],
      ["Gdje mogu vidjeti države?", "Pregled država je dostupan na /sve-drzave/."],
    ],
    sections: [
      ["Kategorije kanala", "Lista je organizovana po državama i temama: Bosna, Srbija, Hrvatska, Makedonija, Crna Gora, Slovenija, sport, filmovi, serije, dokumentarci, muzika, news i kids program."],
      ["Sport, film i VOD", "Sportski kanali su jedan od glavnih razloga za IPTV. Uz to, VOD videoteka donosi filmove i serije koje možete gledati kada vama odgovara, bez čekanja TV rasporeda."],
      ["Države i dijaspora", "EXYU IPTV se koristi u Njemačkoj, Austriji, Švicarskoj, USA, Australiji, Velikoj Britaniji, Belgiji, Švedskoj i drugim državama. Pogledajte /sve-drzave/ za lokalne stranice."],
    ],
    links: [["Sve države", "/sve-drzave/"], ["Premium paket", "/blog/najbolji-iptv-2026/"]],
  },
  {
    slug: "najbolji-iptv-2026",
    category: "Savjeti",
    title: "Najbolji IPTV Provider 2026 – Vergleich",
    description: "Kako izabrati najbolji IPTV provider 2026: kanali, kvalitet, cijena, podrška, uređaji i zašto je EXYU IPTV dobar izbor za dijasporu.",
    keywords: ["najbolji iptv", "iptv premium"],
    minutes: 9,
    faq: [
      ["Koji IPTV odabrati?", "Odaberite IPTV koji ima stabilne servere, jasnu listu kanala, podršku i test prije kupovine."],
      ["Šta znači Premium IPTV?", "Premium IPTV obično znači širu listu kanala, bolji sport, 4K/Full HD kvalitet, VOD i bolju podršku."],
      ["Da li je najjeftiniji IPTV najbolji?", "Ne uvijek. Jeftin IPTV često nema stabilnost, EPG, podršku ili kvalitetne sportske kanale."],
    ],
    sections: [
      ["Kriteriji za izbor", "Najvažniji kriteriji su stabilnost servera, izbor EXYU kanala, sportski paket, kvalitet slike, uređaji koje podržava, cijena i brzina podrške. Ako provider nema test, teško je znati šta kupujete."],
      ["Standard ili Premium", "Standard paket ima smisla za osnovno gledanje domaćih kanala. Premium je bolji za korisnike koji prate sport, žele 25.000+ kanala, 4K kvalitet, VOD i prioritetnu WhatsApp podršku."],
      ["Zašto EXYU IPTV", "EXYU IPTV je fokusiran na dijasporu: balkanski kanali, DACH podrška, instalacija na popularne uređaje i jasna narudžba bez dugoročnog ugovora. Za korisnike koji žele domaću televiziju u inostranstvu, to je praktičan izbor."],
    ],
    links: [["Lista kanala", "/blog/iptv-lista-kanala/"], ["Narudžba", "/narudzba/"]],
  },
];

function articlePage(post) {
  const canonical = `/blog/${post.slug}/`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: "EXYU IPTV" },
    publisher: { "@type": "Organization", name: "EXYU IPTV", logo: { "@type": "ImageObject", url: `${SITE}/logo.webp` } },
    datePublished: today,
    dateModified: today,
    mainEntityOfPage: `${SITE}${canonical}`,
  };
  const body = `<article class="bg-stone-950 py-14 md:py-20"><div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"><nav class="mb-8 text-sm text-gray-400"><a href="/" class="hover:text-white">Početna</a> <span class="mx-2">/</span> <a href="/blog/" class="hover:text-white">Blog</a> <span class="mx-2">/</span> <span>${esc(post.title)}</span></nav><p class="text-sm font-semibold uppercase tracking-wide text-blue-300">${esc(post.category)} · ${post.minutes} min čitanja</p><h1 class="mt-4 text-4xl sm:text-5xl font-bold text-white leading-tight">${esc(post.title)}</h1><p class="mt-6 text-xl text-gray-300">${esc(post.description)}</p><div class="mt-6 flex flex-wrap gap-2">${post.keywords.map((kw) => `<span class="rounded-full bg-stone-800 px-3 py-1 text-xs text-gray-300">${esc(kw)}</span>`).join("")}</div><div class="mt-10 aspect-video rounded-2xl border border-stone-800 bg-gradient-to-br from-blue-900 to-stone-900 flex items-center justify-center text-gray-400">Screenshot / vodič placeholder</div><div class="prose prose-invert prose-stone max-w-none mt-10">${post.sections.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join("")}<h2>Česta pitanja</h2>${post.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}<h2>Siehe auch</h2><ul>${post.links.map(([label, url]) => `<li><a href="${url}">${esc(label)}</a></li>`).join("")}</ul><p>Za test i narudžbu otvorite <a href="/narudzba/">narudžbu</a> ili pogledajte <a href="/sve-drzave/">IPTV po državama</a>.</p></div><div class="mt-10 flex flex-wrap gap-3"><a href="/narudzba/" class="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">Zatraži test</a><a href="/blog/" class="rounded-xl border border-stone-700 px-6 py-3 font-bold text-white hover:bg-stone-900">Nazad na blog</a></div></div></article>`;
  return basePage({ title: `${post.title} | EXYU IPTV`, description: post.description, canonical, body, schema: [breadcrumbJson([{ name: "Početna", url: "/" }, { name: "Blog", url: "/blog/" }, { name: post.title, url: canonical }]), articleSchema, faqSchema] });
}

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
}

function upsertHead(html, { title, description, canonical }) {
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*">/i, `<meta name="title" content="${esc(title)}">`);
  html = html.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${esc(description)}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${SITE}${canonical}">`);
  return html;
}

function updateBlogIndex() {
  const file = path.join(DIST, "blog", "index.html");
  let html = fs.readFileSync(file, "utf8");
  html = upsertHead(html, {
    title: "IPTV Blog | EXYU IPTV vodiči, aplikacije i lista kanala 2026",
    description: "IPTV vodiči za dijasporu: šta je IPTV, TiviMate, GSE Smart IPTV Pro, EXYU IPTV lista kanala i najbolji IPTV provider 2026.",
    canonical: "/blog/",
  });
  const cards = posts.map((post) => `<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div class="h-48 bg-gradient-to-br from-blue-700 to-stone-900 flex items-center justify-center text-gray-400">${esc(post.category)}</div><div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">${esc(post.category)}</span><time datetime="${today}" class="text-gray-500 text-sm">2.5.2026</time><span class="text-gray-600 text-sm">&middot; ${post.minutes} min</span></div><h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/${post.slug}/">${esc(post.title)}</a></h2><p class="text-gray-400 text-sm mb-4 line-clamp-3">${esc(post.description)}</p><a href="/blog/${post.slug}/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pročitaj više →</a></div></article>`).join("");
  if (!html.includes("/blog/sta-je-iptv/")) {
    const firstGrid = html.indexOf('<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">');
    if (firstGrid !== -1) {
      const insertAt = html.indexOf(">", firstGrid) + 1;
      html = `${html.slice(0, insertAt)}${cards}${html.slice(insertAt)}`;
    }
  }
  const schema = jsonLd(breadcrumbJson([{ name: "Početna", url: "/" }, { name: "Blog", url: "/blog/" }]));
  if (!html.includes('"@type":"BreadcrumbList"')) html = html.replace("</head>", `${schema}</head>`);
  fs.writeFileSync(file, html, "utf8");
}

function updateHomeLinks() {
  const file = path.join(DIST, "index.html");
  let html = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const section = `<section class="py-16 bg-stone-950 border-y border-stone-800"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center max-w-3xl mx-auto mb-10"><h2 class="text-3xl font-bold text-white">IPTV za dijasporu po državama</h2><p class="mt-3 text-gray-300">Najtraženije stranice za korisnike koji traže IPTV u DACH regiji i EXYU državama.</p></div><div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">${countries.map((c) => `<a class="rounded-xl border border-stone-700 bg-stone-900 p-4 text-center text-white hover:border-blue-500 hover:-translate-y-0.5 transition" href="/${c.slug}/">IPTV za ${esc(c.land)}</a>`).join("")}</div><div class="mt-6 text-center"><a class="text-blue-300 hover:text-blue-200 font-semibold" href="/sve-drzave/">Pogledaj sve države →</a></div></div></section>`;
  if (!html.includes("IPTV za dijasporu po državama")) {
    html = html.replace(/<section id="pricing"/, `${section}<section id="pricing"`);
  }
  fs.writeFileSync(file, html, "utf8");
}

function updateSitemap() {
  const file = path.join(DIST, "sitemap-0.xml");
  let xml = fs.readFileSync(file, "utf8");
  const removedAfterRedirect = [
    `${SITE}/exyu-iptv-deutschland/`,
    `${SITE}/blog/sta-je-iptv-i-kako-radi/`,
    `${SITE}/blog/tivimate-vs-iptv-smarters-pro-2026/`,
  ];
  for (const url of removedAfterRedirect) {
    xml = xml.replace(new RegExp(`<ns0:url><ns0:loc>${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</ns0:loc></ns0:url>`, "g"), "");
  }
  const urls = [
    ...countries.map((c) => `${SITE}/${c.slug}/`),
    ...posts.map((p) => `${SITE}/blog/${p.slug}/`),
  ];
  for (const url of urls) {
    if (!xml.includes(`<ns0:loc>${url}</ns0:loc>`)) {
      xml = xml.replace("</ns0:urlset>", `<ns0:url><ns0:loc>${url}</ns0:loc></ns0:url></ns0:urlset>`);
    }
  }
  fs.writeFileSync(file, xml, "utf8");
}

function updateOrderPageSchema() {
  const file = path.join(DIST, "narudzba", "index.html");
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes('"@type":"Product"')) {
    html = html.replace("</head>", `${jsonLd(productJson())}${jsonLd(breadcrumbJson([{ name: "Početna", url: "/" }, { name: "Narudžba", url: "/narudzba/" }]))}</head>`);
  }
  fs.writeFileSync(file, html, "utf8");
}

function updateWorkerRedirects() {
  const file = path.join(ROOT, "_worker.js");
  let js = fs.readFileSync(file, "utf8");
  const block = `\n    const seoRedirects = new Map([\n      ["/exyu-iptv-deutschland/", "/exyuiptv-njemacka/"],\n      ["/blog/sta-je-iptv-i-kako-radi/", "/blog/sta-je-iptv/"],\n      ["/blog/tivimate-vs-iptv-smarters-pro-2026/", "/blog/tivimate-setup/"],\n      ["/blog/iptv-lista-kanala-2026/", "/blog/iptv-lista-kanala/"],\n      ["/blog/najbolji-iptv-provider-2026/", "/blog/najbolji-iptv-2026/"]\n    ]);\n\n    if (seoRedirects.has(redirectPath)) {\n      redirectPath = seoRedirects.get(redirectPath);\n    }\n`;
  if (!js.includes("const seoRedirects = new Map")) {
    js = js.replace("    const hasExtension = /\\.[^/]+$/.test(redirectPath);", `${block}\n    const hasExtension = /\\.[^/]+$/.test(redirectPath);`);
  }
  fs.writeFileSync(file, js, "utf8");
}

function writeMarkdownSources() {
  const dir = path.join(ROOT, "content", "blog-seo-2026");
  fs.mkdirSync(dir, { recursive: true });
  for (const post of posts) {
    const md = `---\ntitle: "${post.title.replace(/"/g, '\\"')}"\ndescription: "${post.description.replace(/"/g, '\\"')}"\ndate: "${today}"\ncategory: "${post.category}"\nkeywords:\n${post.keywords.map((kw) => `  - "${kw}"`).join("\n")}\n---\n\n${post.sections.map(([h, p]) => `## ${h}\n\n${p}`).join("\n\n")}\n\n## Česta pitanja\n\n${post.faq.map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}\n`;
    fs.writeFileSync(path.join(dir, `${post.slug}.md`), md, "utf8");
  }
}

for (const country of countries) {
  write(path.join(DIST, country.slug, "index.html"), countryPage(country));
}
for (const post of posts) {
  write(path.join(DIST, "blog", post.slug, "index.html"), articlePage(post));
}
updateBlogIndex();
updateHomeLinks();
updateSitemap();
updateOrderPageSchema();
updateWorkerRedirects();
writeMarkdownSources();

console.log(`SEO fix generated ${countries.length} country pages and ${posts.length} blog posts.`);
