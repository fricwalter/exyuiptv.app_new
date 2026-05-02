// Ahrefs SEO fix script for exyuiptv.app
// - Title tags <= 60 chars
// - Meta descriptions 120-160 chars
// - Replace links to redirect targets with final URLs
// - Add reciprocal hreflang on country language pages
// - Fix /exyu-iptv-deutschland/ -> /exyuiptv-njemacka/ in hreflang

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

// Redirect map (keep in sync with _worker.js)
const REDIRECTS = {
  "/exyu-iptv-deutschland/": "/exyuiptv-njemacka/",
  "/blog/sta-je-iptv-i-kako-radi/": "/blog/sta-je-iptv/",
  "/blog/tivimate-vs-iptv-smarters-pro-2026/": "/blog/tivimate-setup/",
  "/blog/iptv-lista-kanala-2026/": "/blog/iptv-lista-kanala/",
  "/blog/najbolji-iptv-provider-2026/": "/blog/najbolji-iptv-2026/",
  "/blog/ex-yu-utakmice-uzivo-dijaspora-2026/": "/blog/ex-yu-iptv-utakmice-uzivo-dijaspora-2026/",
  "/blog/ex-yu-utakmice-uzivo-dijaspora-2026": "/blog/ex-yu-iptv-utakmice-uzivo-dijaspora-2026/",
  "/countries/": "/sve-drzave/",
  "/countries": "/sve-drzave/",
  "/exyuiptv-kanada/": "/exyuiptv-usa/",
  "/exyuiptv-kanada": "/exyuiptv-usa/",
};

// Title overrides (slug-or-path -> short title <=60 chars). Suffix " | EXYU IPTV Blog" or brand kept short.
const TITLE_OVERRIDES = {
  "/blog/balkanski-sportski-kanali-iptv-dijaspora-2026/": "Balkanski sportski kanali IPTV 2026 | EXYU IPTV",
  "/blog/apple-tv-ex-yu-iptv-2026-podesavanje/": "Apple TV EX YU IPTV 2026 podešavanje | EXYU IPTV",
  "/blog/samsung-lg-balkan-iptv-postavke-2026/": "Samsung LG balkan IPTV postavke 2026 | EXYU IPTV",
  "/blog/epg-catch-up-snimanje-ex-yu-iptv-2026/": "EPG i catch-up EX YU IPTV 2026 | EXYU IPTV",
  "/blog/android-box-iptv-instalacija/": "Android Box IPTV instalacija | EXYU IPTV",
  "/blog/arena-sport-premier-league-ex-yu-iptv-dijaspora-2026/": "Arena Sport Premier League IPTV 2026 | EXYU IPTV",
  "/blog/arena-sport-sport-klub-iptv-4k-2026/": "Arena Sport i Sport Klub IPTV 4K 2026 | EXYU IPTV",
  "/blog/besplatni-vs-placeni-ex-yu-iptv-2026/": "Besplatni vs plaćeni EX YU IPTV 2026 | EXYU IPTV",
  "/blog/bosna-sp-2026-gledanje-iz-europe/": "Bosna SP 2026 gledanje iz Europe | EXYU IPTV",
  "/blog/bosna-svjetsko-prvenstvo-2026-live-stream-iptv/": "Bosna SP 2026 live stream IPTV | EXYU IPTV",
  "/blog/bosna-utakmice-uzivo-iptv-dijaspora-2026/": "Bosna utakmice uživo IPTV dijaspora 2026 | EXYU IPTV",
  "/blog/djecji-exyu-program-iptv-dijaspora-setup/": "Dječji EXYU program IPTV setup | EXYU IPTV",
  "/blog/euroleague-aba-liga-iptv-dijaspora-2026/": "Euroleague i ABA liga IPTV 2026 | EXYU IPTV",
  "/blog/ex-yu-iptv-australija-2026-sydney-melbourne/": "EX YU IPTV Australija 2026 Sydney Melbourne | EXYU",
  "/blog/ex-yu-iptv-holandija-belgija-beneluks-dijaspora/": "EX YU IPTV Holandija Belgija Beneluks | EXYU IPTV",
  "/blog/ex-yu-iptv-kanada-2026-toronto-vancouver/": "EX YU IPTV Kanada 2026 Toronto Vancouver | EXYU",
  "/blog/ex-yu-iptv-njemacka-2026-bundesliga-balkan-kanali/": "EX YU IPTV Njemačka 2026 Bundesliga | EXYU IPTV",
  "/blog/ex-yu-iptv-sad-2026-new-york-chicago/": "EX YU IPTV SAD 2026 New York Chicago | EXYU IPTV",
  "/blog/ex-yu-iptv-skandinavija-2026-svedska-norveska-danska/": "EX YU IPTV Skandinavija 2026 | EXYU IPTV",
  "/blog/ex-yu-iptv-svicarska-2026-bosanski-hrvatski-srpski-kanali/": "EX YU IPTV Švicarska 2026 balkan kanali | EXYU IPTV",
  "/blog/ex-yu-iptv-utakmice-uzivo-dijaspora-2026/": "EX YU IPTV utakmice uživo dijaspora 2026 | EXYU IPTV",
  "/blog/ex-yu-iptv-velika-britanija-2026-balkanski-kanali/": "EX YU IPTV Velika Britanija 2026 | EXYU IPTV",
  "/blog/fire-tv-stick-iptv-instalacija/": "Fire TV Stick IPTV instalacija | EXYU IPTV",
  "/blog/formula-1-motogp-iptv-balkan-dijaspora-2026/": "Formula 1 i MotoGP IPTV balkan 2026 | EXYU IPTV",
  "/blog/google-tv-chromecast-iptv-balkanski-kanali-2026/": "Google TV Chromecast IPTV 2026 | EXYU IPTV",
  "/blog/hrvatska-nogomet-uzivo-iptv-dijaspora-2026/": "Hrvatska nogomet uživo IPTV 2026 | EXYU IPTV",
  "/blog/hrvatska-srbija-sp-2026-exyu-diaspora/": "Hrvatska Srbija SP 2026 EXYU dijaspora | EXYU IPTV",
  "/blog/internet-brzina-iptv-hd-4k-streaming-koliko-mbps/": "Internet brzina IPTV HD 4K streaming | EXYU IPTV",
  "/blog/iptv-besplatno-testirati-24h/": "IPTV besplatno testirati 24h | EXYU IPTV",
  "/blog/iptv-osterreich-bosanski-srpski-kanali/": "IPTV Österreich bosanski i srpski kanali | EXYU IPTV",
  "/blog/iptv-racunar-laptop-exyu-kanali-windows-mac/": "IPTV računar laptop EXYU Windows Mac | EXYU IPTV",
  "/blog/iptv-vikend-raspored-utakmica-dijaspora-2026/": "IPTV vikend raspored utakmica 2026 | EXYU IPTV",
  "/blog/iptv-vs-kabelska-televizija/": "IPTV vs kabelska televizija | EXYU IPTV",
  "/blog/iptv-za-kafice-utakmice-dijaspora-2026/": "IPTV za kafiće utakmice dijaspora 2026 | EXYU IPTV",
  "/blog/iptv-za-roditelje-starije-dijaspora-vodic/": "IPTV za roditelje i starije: vodič | EXYU IPTV",
  "/blog/kako-gledati-derbije-ex-yu-u-inostranstvu-iptv-2026/": "Kako gledati derbije EX YU u inostranstvu 2026 | EXYU",
  "/blog/kako-gledati-exyu-kanale-u-inostranstvu/": "Kako gledati EXYU kanale u inostranstvu | EXYU IPTV",
  "/blog/kako-instalirati-iptv-na-samsung-tv/": "Kako instalirati IPTV na Samsung TV | EXYU IPTV",
  "/blog/kako-poboljsati-kvalitetu-iptv-streama/": "Kako poboljšati kvalitet IPTV streama | EXYU IPTV",
  "/blog/legalnost-iptv-u-njemackoj/": "Legalnost IPTV u Njemačkoj | EXYU IPTV",
  "/blog/liga-prvaka-arena-sport-iptv-dijaspora-2026/": "Liga prvaka Arena Sport IPTV 2026 | EXYU IPTV",
  "/blog/najbolja-iptv-aplikacija-za-utakmice-smart-tv-2026/": "Najbolja IPTV aplikacija za Smart TV 2026 | EXYU",
  "/blog/najbolji-iptv-2026/": "Najbolji IPTV 2026 za dijasporu | EXYU IPTV",
  "/blog/najbolji-iptv-box-2026/": "Najbolji IPTV box 2026 za dijasporu | EXYU IPTV",
  "/blog/najbolji-sportski-kanali-exyu-iptv/": "Najbolji sportski kanali EXYU IPTV | EXYU IPTV",
  "/blog/porodicni-ex-yu-iptv-paket-dijaspora-2026/": "Porodični EX YU IPTV paket 2026 | EXYU IPTV",
  "/blog/srbija-utakmice-uzivo-iptv-nemacka-2026/": "Srbija utakmice uživo IPTV Njemačka 2026 | EXYU",
  "/blog/sta-je-iptv/": "Šta je IPTV i kako radi | EXYU IPTV Blog",
  "/blog/tivimate-setup/": "TiviMate setup za EX YU IPTV | EXYU IPTV",
  "/blog/iptv-lista-kanala/": "IPTV lista kanala 2026 | EXYU IPTV",
  "/blog/gse-smart-iptv-pro/": "GSE Smart IPTV Pro setup | EXYU IPTV",
  // Older redirect-target HTML files still in dist (canonical may differ but keep titles short):
  "/blog/sta-je-iptv-i-kako-radi/": "Šta je IPTV i kako radi | EXYU IPTV Blog",
  "/blog/tivimate-vs-iptv-smarters-pro-2026/": "TiviMate vs IPTV Smarters Pro 2026 | EXYU IPTV",
  "/blog/vpn-i-iptv-exyu-kanali-da-li-treba/": "VPN i IPTV za EX-YU kanale: trebam li VPN | EXYU IPTV",
  // Country landing pages
  "/": "EXYU IPTV | 25.000+ Kanala u 4K za Dijasporu",
  "/exyuiptv-bosna/": "EXYU IPTV Bosna | Balkanska TV za Dijasporu 4K",
  "/exyuiptv-njemacka/": "EXYU IPTV Njemačka | Balkanska TV za Dijasporu 4K",
  "/exyu-iptv-deutschland/": "EXYU IPTV Deutschland | Balkanska TV 4K",
  "/exyuiptv-austrija/": "EXYU IPTV Austrija | Balkanska TV za Dijasporu 4K",
  "/exyuiptv-svicarska/": "EXYU IPTV Švicarska | Balkanska TV za Dijasporu 4K",
  "/exyuiptv-hrvatska/": "EXYU IPTV Hrvatska | Balkanska TV za Dijasporu 4K",
  "/exyuiptv-srbija/": "EXYU IPTV Srbija | Balkanska TV za Dijasporu 4K",
  "/exyuiptv-crna-gora/": "EXYU IPTV Crna Gora | Balkanska TV za Dijasporu",
  "/exyuiptv-makedonija/": "EXYU IPTV Makedonija | Balkanska TV za Dijasporu",
  "/exyuiptv-slovenija/": "EXYU IPTV Slovenija | Balkanska TV za Dijasporu",
  "/exyuiptv-spanija/": "EXYU IPTV Španija | Balkanska TV za Dijasporu",
  "/exyuiptv-svedska/": "EXYU IPTV Švedska | Balkanska TV za Dijasporu",
  "/exyuiptv-belgija/": "EXYU IPTV Belgija | Balkanska TV za Dijasporu",
  "/exyuiptv-usa/": "EXYU IPTV USA | Balkanska TV za Dijasporu",
  "/exyuiptv-australija/": "EXYU IPTV Australija | Balkanska TV za Dijasporu",
  "/exyuiptv-velika-britanija/": "EXYU IPTV UK | Balkanska TV za Dijasporu 4K",
};

// Long meta descriptions (>160) get shortened, short ones (<120) get extended.
// Use page-specific descriptions where possible.
const DESC_OVERRIDES = {
  "/blog/android-box-iptv-instalacija/":
    "Naučite kako brzo instalirati IPTV aplikaciju na Android TV Box: preuzimanje, prijava, EPG i prvi stream za EXYU dijasporu.",
  "/blog/arena-sport-premier-league-ex-yu-iptv-dijaspora-2026/":
    "Arena Sport i Premier League EX YU IPTV 2026: kako složiti favorite, derbi vikende, EPG i premium live setup za dijasporu.",
  "/blog/arena-sport-sport-klub-iptv-4k-2026/":
    "Arena Sport i Sport Klub u 4K kvaliteti za EX YU IPTV 2026: stabilan vikend, derbiji, ABA liga i premium sportski raspored.",
  "/blog/balkanski-sportski-kanali-iptv-dijaspora-2026/":
    "Balkanski sportski kanali IPTV 2026 za dijasporu: kako organizovati sport, favorite, EPG i rezervne izvore za vikend i turnire.",
  "/blog/apple-tv-ex-yu-iptv-2026-podesavanje/":
    "Apple TV EX YU IPTV 2026 podešavanje: tvOS setup, izbor playera, EPG i stabilan stream za bosanske, hrvatske i srpske kanale.",
  "/blog/besplatni-vs-placeni-ex-yu-iptv-2026/":
    "Besplatni vs plaćeni EX YU IPTV 2026: rizici besplatnih lista, kvalitet streama, sigurnost i šta dijaspora zaista dobija.",
  "/blog/bosna-sp-2026-gledanje-iz-europe/":
    "Bosna SP 2026 gledanje iz Europe: kako bosanska dijaspora prati utakmice uživo preko IPTV-a uz EPG, EX YU kanale i rezervne izvore.",
  "/blog/bosna-svjetsko-prvenstvo-2026-live-stream-iptv/":
    "Bosna na SP 2026: live stream IPTV za dijasporu, raspored utakmica, balkanski kanali, EPG i kako složiti pouzdan vikend setup.",
  "/blog/bosna-utakmice-uzivo-iptv-dijaspora-2026/":
    "Bosna utakmice uživo IPTV 2026 za dijasporu: kako pratiti reprezentaciju, klubove i derbije sa stabilnim premium streamom.",
  "/blog/djecji-exyu-program-iptv-dijaspora-setup/":
    "Dječji EXYU IPTV program za dijasporu: kako složiti listu, parental kontrolu, jezičke favorite i siguran setup za djecu.",
  "/blog/epg-catch-up-snimanje-ex-yu-iptv-2026/":
    "EPG, catch-up i snimanje na EX YU IPTV 2026: kako koristiti vodič, propuštene emisije i lokalni snimak za bolji raspored.",
  "/blog/euroleague-aba-liga-iptv-dijaspora-2026/":
    "Euroleague i ABA liga IPTV 2026 za dijasporu: kako pratiti Partizan, Crvenu zvezdu, regionalnu košarku, Top16 vikende i playoff.",
  "/blog/ex-yu-iptv-australija-2026-sydney-melbourne/":
    "EX YU IPTV za Australiju 2026: Sydney i Melbourne dijaspora gleda balkanske kanale uz stabilan premium stream, EPG i 4K kvalitet.",
  "/blog/ex-yu-iptv-holandija-belgija-beneluks-dijaspora/":
    "EX YU IPTV za Holandiju, Belgiju i Beneluks: balkanski kanali za dijasporu, sport, filmovi, serije i pouzdan premium 4K stream.",
  "/blog/ex-yu-iptv-kanada-2026-toronto-vancouver/":
    "EX YU IPTV za Kanadu 2026: Toronto, Vancouver i Montreal dijaspora gleda balkanske kanale uz EPG, premium 4K stream i podršku.",
  "/blog/ex-yu-iptv-njemacka-2026-bundesliga-balkan-kanali/":
    "EX YU IPTV Njemačka 2026: Bundesliga, balkanski kanali, sport, vijesti i serije za dijasporu uz stabilan premium 4K stream.",
  "/blog/ex-yu-iptv-sad-2026-new-york-chicago/":
    "EX YU IPTV za SAD 2026: New York, Chicago i drugi gradovi dijaspora prati balkanske kanale uz EPG, premium stream i 4K kvalitet.",
  "/blog/ex-yu-iptv-skandinavija-2026-svedska-norveska-danska/":
    "EX YU IPTV Skandinavija 2026: Švedska, Norveška i Danska – balkanski kanali, sport i serije za dijasporu uz EPG i premium stream.",
  "/blog/ex-yu-iptv-svicarska-2026-bosanski-hrvatski-srpski-kanali/":
    "EX YU IPTV Švicarska 2026: bosanski, hrvatski i srpski kanali za dijasporu, sport, filmovi i premium stabilan 4K stream u 2026.",
  "/blog/ex-yu-iptv-utakmice-uzivo-dijaspora-2026/":
    "EX YU IPTV utakmice uživo 2026 za dijasporu: kako pratiti regionalne lige, derbije, reprezentacije i Premier ligu bez prekida.",
  "/blog/ex-yu-iptv-velika-britanija-2026-balkanski-kanali/":
    "EX YU IPTV Velika Britanija 2026: balkanski kanali, sport i serije za dijasporu u Londonu, Manchesteru i ostalim gradovima.",
  "/blog/fire-tv-stick-iptv-instalacija/":
    "Fire TV Stick IPTV instalacija: kako brzo instalirati aplikaciju, prijaviti listu, namjestiti EPG i pokrenuti prvi stream.",
  "/blog/formula-1-motogp-iptv-balkan-dijaspora-2026/":
    "Formula 1 i MotoGP IPTV za balkansku dijasporu 2026: kako pratiti trke uživo, kvalifikacije i sportski vikend bez prekida.",
  "/blog/google-tv-chromecast-iptv-balkanski-kanali-2026/":
    "Google TV i Chromecast IPTV 2026: kako instalirati aplikaciju, prijaviti listu i gledati balkanske kanale bez prekida i bafera.",
  "/blog/hrvatska-nogomet-uzivo-iptv-dijaspora-2026/":
    "Hrvatska nogomet uživo IPTV 2026 za dijasporu: kako pratiti reprezentaciju, HNL, derbije, evropska takmičenja i kvalifikacije.",
  "/blog/hrvatska-srbija-sp-2026-exyu-diaspora/":
    "Hrvatska i Srbija SP 2026 EXYU dijaspora: kako pratiti reprezentacije uživo na IPTV-u uz EPG, pouzdan stream i 4K kvalitet.",
  "/blog/internet-brzina-iptv-hd-4k-streaming-koliko-mbps/":
    "Internet brzina za IPTV HD i 4K streaming: koliko Mbps treba, kako testirati liniju i optimizovati setup za stabilan stream.",
  "/blog/iptv-besplatno-testirati-24h/":
    "IPTV besplatno testirati 24h: kako provjeriti stabilnost, kanale, EPG i 4K kvalitet prije plaćanja paketa za EXYU dijasporu.",
  "/blog/iptv-osterreich-bosanski-srpski-kanali/":
    "IPTV Österreich za EXYU dijasporu: bosanski, hrvatski i srpski kanali, sport, serije i pouzdan premium stream u Austriji.",
  "/blog/iptv-racunar-laptop-exyu-kanali-windows-mac/":
    "IPTV na računaru i laptopu za EXYU kanale: kako gledati uživo na Windows i Mac uz VLC, web player, mobilnu listu i podršku.",
  "/blog/iptv-vikend-raspored-utakmica-dijaspora-2026/":
    "IPTV vikend raspored utakmica 2026 za dijasporu: kako složiti termine, favorite, EPG i rezervne izvore za bitne sportske dane.",
  "/blog/iptv-vs-kabelska-televizija/":
    "IPTV vs kabelska televizija: cijena, kanali, EPG, dijaspora setup i zašto sve više korisnika prelazi na premium IPTV u 2026.",
  "/blog/iptv-za-kafice-utakmice-dijaspora-2026/":
    "IPTV za kafiće i utakmice 2026: kako vlasnici lokala u dijaspori prikazuju derbije, sport i balkanske kanale svojim gostima.",
  "/blog/iptv-za-roditelje-starije-dijaspora-vodic/":
    "IPTV za roditelje i starije osobe u dijaspori: jednostavan setup, veliki ekran, daljinski i jasna lista omiljenih kanala.",
  "/blog/kako-gledati-derbije-ex-yu-u-inostranstvu-iptv-2026/":
    "Kako gledati derbije EX YU u inostranstvu 2026: koji IPTV paket, koji kanali, EPG i stabilan stream za balkansku dijasporu.",
  "/blog/kako-gledati-exyu-kanale-u-inostranstvu/":
    "Kako gledati EXYU kanale u inostranstvu: kompletan vodič za balkanski IPTV, kvalitet streama, EPG i pouzdan setup za dijasporu.",
  "/blog/kako-instalirati-iptv-na-samsung-tv/":
    "Kako instalirati IPTV na Samsung TV: korak po korak vodič, izbor aplikacije, prijava M3U liste, EPG i prvi pokretani kanal.",
  "/blog/kako-poboljsati-kvalitetu-iptv-streama/":
    "Kako poboljšati kvalitet IPTV streama: brzina interneta, router, kabel, buffer, EPG i izbor pravog playera za 4K stream.",
  "/blog/legalnost-iptv-u-njemackoj/":
    "Legalnost IPTV u Njemačkoj: šta dijaspora treba znati o licencama, ugovoru, plaćanju i sigurnom premium IPTV setup za 2026.",
  "/blog/liga-prvaka-arena-sport-iptv-dijaspora-2026/":
    "Liga prvaka Arena Sport IPTV 2026 za dijasporu: kako pratiti UCL utakmice, derbi vikende, EPG i raspored sportskog vikenda.",
  "/blog/najbolja-iptv-aplikacija-za-utakmice-smart-tv-2026/":
    "Najbolja IPTV aplikacija za utakmice na Smart TV 2026: TiviMate, IPTV Smarters i top playeri za stabilan sportski stream.",
  "/blog/najbolji-iptv-2026/":
    "Najbolji IPTV 2026 za dijasporu: kako odabrati pouzdan paket, kvalitet streama, kanale, podršku, pravu cijenu i 4K stabilnost.",
  "/blog/najbolji-iptv-box-2026/":
    "Najbolji IPTV box 2026 za EXYU dijasporu: poređenje uređaja, performansi, daljinskih i koja je najbolja kombinacija za 4K stream.",
  "/blog/najbolji-sportski-kanali-exyu-iptv/":
    "Najbolji sportski kanali na EXYU IPTV: Arena Sport, Sport Klub i ostali kanali za vikend, derbije i evropska takmičenja.",
  "/blog/porodicni-ex-yu-iptv-paket-dijaspora-2026/":
    "Porodični EX YU IPTV paket 2026 za dijasporu: dječji, ženski i muški program, sport, filmovi i pouzdan multiscreen za sve uređaje.",
  "/blog/samsung-lg-balkan-iptv-postavke-2026/":
    "Samsung i LG balkan IPTV postavke 2026: izbor aplikacije, prijava liste, EPG, slika i zvuk za stabilan dnevni stream u dijaspori.",
  "/blog/srbija-utakmice-uzivo-iptv-nemacka-2026/":
    "Srbija utakmice uživo IPTV Njemačka 2026: kako srpska dijaspora prati reprezentaciju, Superligu i derbije bez prekida i bafera.",
  "/blog/sta-je-iptv/":
    "Šta je IPTV i kako radi: jednostavno objašnjenje za EXYU dijasporu, prednosti, mane i kako odabrati pouzdan paket sa podrškom.",
  "/blog/tivimate-setup/":
    "TiviMate setup za EX YU IPTV: kompletni vodič kroz instalaciju, prijavu liste, EPG, favorite i optimizaciju playera za 4K stream.",
  "/blog/iptv-lista-kanala/":
    "IPTV lista kanala 2026 za EXYU dijasporu: bosanski, hrvatski, srpski, makedonski i sportski kanali u jednom premium paketu.",
  "/blog/gse-smart-iptv-pro/":
    "GSE Smart IPTV Pro setup: kako prijaviti listu, namjestiti EPG, organizovati favorite i pokrenuti prvi stream na Apple i Android.",
  "/blog/sta-je-iptv-i-kako-radi/":
    "Šta je IPTV i kako radi: jednostavno objašnjenje za EXYU dijasporu, prednosti, mane i kako odabrati pouzdan paket sa podrškom.",
  "/blog/tivimate-vs-iptv-smarters-pro-2026/":
    "TiviMate vs IPTV Smarters Pro 2026: poređenje playera, EPG, brzine i stabilnosti, koja aplikacija je bolja za EXYU IPTV stream.",
  "/":
    "EXYU IPTV za dijasporu: 25.000+ balkanskih kanala u 4K, sport, filmovi, serije i besplatan test 24h. Stabilan stream uz EPG.",
  "/exyuiptv-bosna/":
    "EXYU IPTV Bosna: bosanski, hrvatski, srpski, makedonski i sportski kanali u 4K za dijasporu. Premium stream uz EPG i podršku.",
  "/exyuiptv-njemacka/":
    "EXYU IPTV Njemačka: balkanski kanali, sport, Bundesliga, filmovi i serije u 4K za EXYU dijasporu. Stabilan premium stream uz EPG.",
  "/exyu-iptv-deutschland/":
    "EXYU IPTV Deutschland: balkanski kanali, sport, Bundesliga, filmovi i serije u 4K za EXYU dijasporu. Premium stream uz EPG.",
  "/exyuiptv-austrija/":
    "EXYU IPTV Austrija: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Beču, Grazu i Linzu. Premium stream uz EPG.",
  "/exyuiptv-svicarska/":
    "EXYU IPTV Švicarska: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Cirihu, Bernu i Bazelu. Premium stream.",
  "/exyuiptv-hrvatska/":
    "EXYU IPTV Hrvatska: hrvatski, bosanski, srpski i sportski kanali u 4K za dijasporu. HNL, derbiji, filmovi i serije uz pouzdan stream.",
  "/exyuiptv-srbija/":
    "EXYU IPTV Srbija: srpski, bosanski, hrvatski i sportski kanali u 4K za dijasporu. Superliga, derbiji, filmovi i serije uz EPG.",
  "/exyuiptv-crna-gora/":
    "EXYU IPTV Crna Gora: crnogorski, bosanski, hrvatski i srpski kanali u 4K za dijasporu. Sport, filmovi i serije uz pouzdan stream.",
  "/exyuiptv-makedonija/":
    "EXYU IPTV Makedonija: makedonski, balkanski i sportski kanali u 4K za dijasporu. Filmovi, serije, vijesti i stabilan premium stream.",
  "/exyuiptv-slovenija/":
    "EXYU IPTV Slovenija: slovenski, balkanski i sportski kanali u 4K za dijasporu. Filmovi, serije i pouzdan premium stream uz EPG.",
  "/exyuiptv-spanija/":
    "EXYU IPTV Španija: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Madridu i Barceloni. Premium stream uz EPG.",
  "/exyuiptv-svedska/":
    "EXYU IPTV Švedska: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Stockholmu i Goteborgu. Premium stream uz EPG.",
  "/exyuiptv-belgija/":
    "EXYU IPTV Belgija: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Briselu i Antwerpenu. Premium stream uz EPG.",
  "/exyuiptv-usa/":
    "EXYU IPTV USA: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u SAD i Kanadi. Premium stream uz EPG i podršku 24/7.",
  "/exyuiptv-australija/":
    "EXYU IPTV Australija: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Sydneyu i Melbourneu. Premium stream uz EPG.",
  "/exyuiptv-velika-britanija/":
    "EXYU IPTV UK: balkanski kanali, sport, filmovi i serije u 4K za EXYU dijasporu u Londonu i Manchesteru. Premium stream uz EPG.",
  "/sve-drzave/":
    "EXYU IPTV za sve države dijaspore: balkanski kanali, sport, filmovi i serije u 4K. Pregledajte ponudu po zemlji i odaberite paket.",
  "/o-nama/":
    "O nama – EXYU IPTV: tim koji pravi premium IPTV za EXYU dijasporu. 25.000+ kanala u 4K, stabilan stream, EPG i podrška 24/7.",
  "/kontakt/":
    "Kontakt EXYU IPTV: podrška za dijasporu 24/7, e-mail, telefon i WhatsApp. Pomoć oko narudžbe, instalacije, EPG-a i streamova.",
  "/impressum/":
    "Impressum EXYU IPTV: pravne informacije, kontakt, sjedište firme i podaci o pružatelju usluge premium IPTV za EXYU dijasporu.",
  "/politika-privatnosti/":
    "Politika privatnosti EXYU IPTV: kako čuvamo vaše podatke, GDPR, kolačići i prava korisnika premium IPTV usluge za dijasporu.",
  "/politika-kolacica/":
    "Politika kolačića EXYU IPTV: koje kolačiće koristimo, zašto i kako možete upravljati postavkama privatnosti na našoj web stranici.",
  "/politika-povrata-novca/":
    "Politika povrata novca EXYU IPTV: uslovi, rokovi, postupak povrata i besplatan test 24h prije plaćanja premium paketa za dijasporu.",
  "/uslovi-koristenja/":
    "Uslovi korištenja EXYU IPTV: pravila, plaćanje, povrat, ograničenja i odgovornosti korisnika premium IPTV usluge za EXYU dijasporu.",
};

// Hreflang block to inject on language country pages.
const HREFLANG_BLOCK = [
  '<link rel="alternate" hreflang="bs" href="https://exyuiptv.app/exyuiptv-bosna/">',
  '<link rel="alternate" hreflang="hr" href="https://exyuiptv.app/exyuiptv-hrvatska/">',
  '<link rel="alternate" hreflang="sr" href="https://exyuiptv.app/exyuiptv-srbija/">',
  '<link rel="alternate" hreflang="de" href="https://exyuiptv.app/exyuiptv-njemacka/">',
  '<link rel="alternate" hreflang="de-at" href="https://exyuiptv.app/exyuiptv-austrija/">',
  '<link rel="alternate" hreflang="de-ch" href="https://exyuiptv.app/exyuiptv-svicarska/">',
  '<link rel="alternate" hreflang="x-default" href="https://exyuiptv.app/">',
].join("");

const HREFLANG_PAGES = [
  "exyuiptv-bosna",
  "exyuiptv-hrvatska",
  "exyuiptv-srbija",
  "exyuiptv-njemacka",
  "exyuiptv-austrija",
  "exyuiptv-svicarska",
];

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function htmlToCanonicalPath(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

function escAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const stats = {
  files: 0,
  titlesShortened: 0,
  descsFixed: 0,
  redirectLinksFixed: 0,
  hreflangAdded: 0,
  hreflangRetargeted: 0,
};

function fixRedirectLinks(html) {
  let count = 0;
  for (const [from, to] of Object.entries(REDIRECTS)) {
    // Match href="...from..." (absolute path or full https URL) with optional fragment/query
    const patterns = [
      new RegExp(`href="${escapeReg(from)}(?=["?#])`, "g"),
      new RegExp(`href="https://exyuiptv\\.app${escapeReg(from)}(?=["?#])`, "g"),
    ];
    for (const pat of patterns) {
      html = html.replace(pat, (m) => {
        count++;
        return m.includes("https://exyuiptv.app")
          ? `href="https://exyuiptv.app${to}`
          : `href="${to}`;
      });
    }
  }
  stats.redirectLinksFixed += count;
  return html;
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceTagContent(html, tagPattern, newContent) {
  return html.replace(tagPattern, (full, before, _content, after) => before + newContent + after);
}

function fixTitle(html, canonical) {
  const override = TITLE_OVERRIDES[canonical];
  if (!override) return html;
  if (override.length > 60) {
    console.warn(`Override too long (${override.length}) for ${canonical}: ${override}`);
  }
  let touched = false;

  const newHtml = html
    .replace(/<title>([^<]*)<\/title>/, () => {
      touched = true;
      return `<title>${escAttr(override)}</title>`;
    })
    .replace(/<meta name="title" content="[^"]*">/, () => {
      return `<meta name="title" content="${escAttr(override)}">`;
    })
    .replace(/<meta property="og:title" content="[^"]*">/, () => {
      return `<meta property="og:title" content="${escAttr(override)}">`;
    })
    .replace(/<meta property="twitter:title" content="[^"]*">/, () => {
      return `<meta property="twitter:title" content="${escAttr(override)}">`;
    });

  if (touched) stats.titlesShortened++;
  return newHtml;
}

function fixDescription(html, canonical) {
  const override = DESC_OVERRIDES[canonical];
  if (!override) return html;
  if (override.length < 120 || override.length > 160) {
    console.warn(`Override desc length ${override.length} for ${canonical}`);
  }
  let touched = false;

  const newHtml = html
    .replace(/<meta name="description" content="[^"]*">/, () => {
      touched = true;
      return `<meta name="description" content="${escAttr(override)}">`;
    })
    .replace(/<meta property="og:description" content="[^"]*">/, () => {
      return `<meta property="og:description" content="${escAttr(override)}">`;
    })
    .replace(/<meta property="twitter:description" content="[^"]*">/, () => {
      return `<meta property="twitter:description" content="${escAttr(override)}">`;
    });

  if (touched) stats.descsFixed++;
  return newHtml;
}

function fixHreflang(html, canonical) {
  // 1) On homepage, retarget /exyu-iptv-deutschland/ -> /exyuiptv-njemacka/ in hreflang
  if (canonical === "/") {
    html = html.replace(
      /<link rel="alternate" hreflang="de" href="https:\/\/exyuiptv\.app\/exyu-iptv-deutschland\/"\s*\/?>/g,
      () => {
        stats.hreflangRetargeted++;
        return '<link rel="alternate" hreflang="de" href="https://exyuiptv.app/exyuiptv-njemacka/">';
      }
    );
  }

  // 2) Inject hreflang block on language country pages if missing
  const seg = canonical.replace(/^\/|\/$/g, "");
  if (HREFLANG_PAGES.includes(seg) && !/hreflang=/.test(html)) {
    html = html.replace(/<link rel="canonical"[^>]*>/, (m) => {
      stats.hreflangAdded++;
      return m + HREFLANG_BLOCK;
    });
  }
  return html;
}

const files = walkHtml(DIST);
for (const file of files) {
  const canonical = htmlToCanonicalPath(file);
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  html = fixTitle(html, canonical);
  html = fixDescription(html, canonical);
  html = fixRedirectLinks(html);
  html = fixHreflang(html, canonical);

  if (html !== before) {
    fs.writeFileSync(file, html);
    stats.files++;
  }
}

console.log("Ahrefs SEO fix complete:");
console.log(JSON.stringify(stats, null, 2));
