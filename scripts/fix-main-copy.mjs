import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./encoding-utils.mjs";

const dist = path.join(process.cwd(), "dist");
const files = walkFiles(dist, new Set([".html", ".xml"]));

const replacements = [
  [/PayPal\s*[·•]?\s*Visa/gi, "Sigurna narud\u017eba"],
  [/PayPal/gi, "sigurna uplata"],
  [/Visa/gi, "kartica"],
  [/Mastercard/gi, "kartica"],
  [/\u00dcberweisung/gi, "bankovna uplata"],
  [/berweisung/gi, "bankovna uplata"],
  [/kartica, kartica i bankovna uplata/gi, "kartica i bankovna uplata"],
  [/kartica kartica/gi, "kartica"],
  [/IPTV Dostupan irom Dijaspore/g, "IPTV dostupan \u0161irom dijaspore"],
  [/Dostupan irom Dijaspore/g, "Dostupan \u0161irom dijaspore"],
  [/(?<!\u0161)\birom\b/g, "\u0161irom"],
  [/\bNai\b/g, "Na\u0161i"],
  [/\bnai\b/g, "na\u0161i"],
  [/\bnaom\b/g, "na\u0161om"],
  [/\bnaom\b/gi, "na\u0161om"],
  [/\bna\u0161om uslugom/g, "na\u0161om uslugom"],
  [/\bnaim\b/g, "na\u0161im"],
  [/\bnau\b/g, "na\u0161u"],
  [/\bnae\b/g, "na\u0161e"],
  [/\bNaa\b/g, "Na\u0161a"],
  [/\bnaa\b/g, "na\u0161a"],
  [/\bvau\b/g, "va\u0161u"],
  [/\bvaoj\b/g, "va\u0161oj"],
  [/\bVie\b/g, "Vi\u0161e"],
  [/\bvie\b/g, "vi\u0161e"],
  [/\bMoete\b/g, "Mo\u017eete"],
  [/\bmoete\b/g, "mo\u017eete"],
  [/\bUivajte\b/g, "U\u017eivajte"],
  [/\bauriranje\b/g, "a\u017euriranje"],
  [/\bbalkansim\b/g, "balkanskim"],
  [/\brjeavanje\b/g, "rje\u0161avanje"],
  [/\bvae\b/g, "va\u0161e"],
  [/(?<![\u0160\u0161])\bpanska Liga\b/g, "\u0160panska Liga"],
  [/\bsadraj\b/g, "sadr\u017eaj"],
  [/\bKvaliteta slike automatski se prilago\u0111ava/g, "Kvalitet slike automatski se prilago\u0111ava"],
  [/(?<!\u0160)\bta ako\b/g, "\u0160ta ako"],
  [/(?<!\u0160)\bta ka/g, "\u0160ta ka"],
  [/\u0160\u0160ta ka/g, "\u0160ta ka"],
  [/\u0160\u0160\u0160ta/g, "\u0160ta"],
  [/\u0160\u0160ta/g, "\u0160ta"],
  [/\u0160+ta/g, "\u0160ta"],
  [/\u0161+\u0161+/g, "\u0161"],
  [/\u0161\u0161to/g, "\u0161to"],
  [/\u0161\u0161irom/g, "\u0161irom"],
  [/(?<!\u0161)\bto garantuje/g, "\u0161to garantuje"],
  [/(?<!\u0161)\bto se pretplatite/g, "\u0161to se pretplatite"],
  [/(?<!\u0161)\bto <span/g, "\u0161to <span"],
  [/(?<!\u0161)\bto \u017eelite gledati/g, "\u0161to \u017eelite gledati"],
  [/Zato Odabrati Na IPTV\?/g, "Za\u0161to odabrati na\u0161 IPTV?"],
  [/Zato Odabrati <span([^>]*)>Na IPTV<\/span>\?/g, "Za\u0161to odabrati <span$1>na\u0161 IPTV</span>?"],
  [/Zato Odabrati <span([^>]*)>EXYU IPTV<\/span>\?/g, "Za\u0161to odabrati <span$1>EXYU IPTV</span>?"],
  [/\bpre nego to\b/g, "prije nego \u0161to"],
  [/\bprije nego to\b/g, "prije nego \u0161to"],
  [/\bna tim je dostupan/g, "na\u0161 tim je dostupan"],
  [/\bNa tim je dostupan/g, "Na\u0161 tim je dostupan"],
  [/\bpodrka\b/g, "podr\u0161ka"],
  [/\bPodrka\b/g, "Podr\u0161ka"],
  [/\bKoarka\b/g, "Ko\u0161arka"],
  [/(?<!\u0161)\bampiona\b/g, "\u0161ampiona"],
  [/\bSve \u0161to elite Gledati\b/g, "Sve \u0161to \u017eelite gledati"],
  [/\belite Gledati\b/g, "\u017eelite gledati"],
  [/\bOvisno o paketu/g, "Zavisno od paketa"],
  [/\bomogu\u0107uje\b/g, "omogu\u0107ava"],
  [/\btako\u0111er\b/g, "tako\u0111e"],
  [/\bpodr\u0161ku\b/g, "podr\u0161ku"],
  [/\btrokova\b/g, "tro\u0161kova"],
  [/Jasni paketi, bez skrivenih trokova/g, "Jasni paketi, bez skrivenih tro\u0161kova"],
  [/\u0160ta kau nai korisnici/g, "\u0160ta ka\u017eu korisnici"],
  [/\u0160ta kau na\u0161i korisnici/g, "\u0160ta ka\u017eu korisnici"],
  [/\u0160ta kau na\u0161i <span/g, "\u0160ta ka\u017eu <span"],
  [/\u0160ta ka\u017eu na\u0161i korisnici/g, "\u0160ta ka\u017eu korisnici"],
  [/\u0160ta ka\u017eu na\u0161i <span/g, "\u0160ta ka\u017eu <span"],
  [/Svaka recenzija je prikazana jednom, bez dupliranja i bez beskona\u010dnog ponavljanja\./g, "Iskustva korisnika iz dijaspore koji gledaju EXYU kanale svaki dan."],
  [/Prihva\u0107amo sigurna pla\u0107anja putem vi\u0161e metoda\./g, "Opcije pla\u0107anja dogovaramo direktno nakon narud\u017ebe."],
  [/Kontaktirajte nas putem WhatsApp-a za dostupne opcije pla\u0107anja\./g, "Kontaktirajte nas putem WhatsApp-a za detalje pla\u0107anja."],
  [/Sva pla\u0107anja su sigurna i enkriptirana\./g, "Podatke za narud\u017ebu ne dijelimo s tre\u0107im stranama."],
  [/Podr\u017eani su sigurna uplata, kartice, kartica, kartica i bankovni transfer gdje je dostupno\./g, "Opcije pla\u0107anja dogovaraju se direktno nakon potvrde narud\u017ebe."],
  [/Podr\u017eani su kartice, kartica, kartica i bankovni transfer gdje je dostupno\./g, "Opcije pla\u0107anja dogovaraju se direktno nakon potvrde narud\u017ebe."],
  [/Podr\u017eani su .*?bankovni transfer gdje je dostupno\./g, "Opcije pla\u0107anja dogovaraju se direktno nakon potvrde narud\u017ebe."],
  [/Mastercard, kartica i \u00dcberweisung/gi, "Detalji pla\u0107anja nakon narud\u017ebe"],
  [/kartica, kartica i bankovna uplata/gi, "Detalji pla\u0107anja nakon narud\u017ebe"],
  [/Cookies \/ Kola\u010di\u0107i/g, "Kola\u010di\u0107i"],
  [/Neophodni \/ Notwendig/g, "Neophodni"],
  [/Alle akzeptieren/g, "Prihvati sve"],
  [/Nur notwendige/g, "Samo neophodni"],
  [/Einstellungen/g, "Postavke"],
  [/Speichern/g, "Sa\u010duvaj"],
  [/Politika privatnosti \/ Datenschutzerkl\u00e4rung/g, "Politika privatnosti"],
  [/Politika kola\u010di\u0107a \/ Cookie-Richtlinie/g, "Politika kola\u010di\u0107a"],
  [/Uslovi kori\u0161tenja \/ AGB/g, "Uslovi kori\u0161tenja"],
  [/Widerruf und povrat/g, "Povrat novca"],
  [/Welche Daten\?/g, "Koje podatke obra\u0111ujemo?"],
  [/Kontaktdaten, Bestelldaten, Zahlungsstatus, technische Logdaten und freiwillige Support-Informationen\./g, "Kontakt podatke, podatke o narud\u017ebi, status pla\u0107anja, tehni\u010dke zapise i dobrovoljne informacije iz podr\u0161ke."],
  [/Zweck und Dauer/g, "Svrha i trajanje"],
  [/Daten werden f\u00fcr Vertragsabwicklung, Support, Sicherheit und gesetzliche Pflichten genutzt und nur so lange gespeichert, wie es daf\u00fcr n\u00f6tig ist\./g, "Podatke koristimo za obradu narud\u017ebe, podr\u0161ku, sigurnost i zakonske obaveze te ih \u010duvamo samo koliko je potrebno."],
  [/Ihre Einwilligung k\u00f6nnen Sie jederzeit im Browser-Speicher l\u00f6schen und neu setzen\. Banner podr\u017eava Google Consent Mode v2\./g, "Saglasnost mo\u017eete u svakom trenutku obrisati u postavkama preglednika i ponovo odabrati. Banner podr\u017eava Google Consent Mode v2."],
  [/Wir nutzen notwendige Cookies; Analytics und Marketing nur mit Zustimmung\./g, "Analytics i marketing kola\u010di\u0107e koristimo samo uz va\u0161u saglasnost."],
  [/Za digitalne usluge vrijedi zakonski okvir DACH tr\u017ei\u0161ta\. Dodatno nudimo 7 dana garancije povrata novca ako usluga tehni\u010dki ne radi nakon poku\u0161aja podr\u0161ke\./g, "Za digitalne usluge vrijede zakonski uslovi tr\u017ei\u0161ta na kojem se usluga koristi. Dodatno nudimo 7 dana garancije povrata novca ako usluga tehni\u010dki ne radi ni nakon podr\u0161ke."],
  [/IPTV Deutschland/g, "IPTV Njema\u010dka"],
  [/EXYU IPTV Deutschland/g, "EXYU IPTV Njema\u010dka"],
  [/\u0160\u0160\u0160ta/g, "\u0160ta"],
  [/\u0160\u0160ta/g, "\u0160ta"],
  [/\u0160+\u0160+/g, "\u0160"],
  [/\u0161+\u0161+/g, "\u0161"],
  [/\u0161\u0161to/g, "\u0161to"],
  [/\u0161\u0161irom/g, "\u0161irom"],
  [/garancija povrata novca/g, "garancija povrata novca"],
];

function removeDuplicateTrustSections(html) {
  const trustSectionPattern =
    /<section class="py-12 bg-stone-950 border-y border-stone-800">[\s\S]*?5\.000\+[\s\S]*?SSL[\s\S]*?garancija povrata novca[\s\S]*?<\/section>/g;
  let seen = false;

  return html.replace(trustSectionPattern, (section) => {
    if (seen) return "";
    seen = true;
    return section;
  });
}

function limitTestimonialCards(html) {
  const sectionPattern =
    /<section class="py-20 bg-stone-900">[\s\S]*?\u0160ta ka\u017eu[\s\S]*?<\/section>/;
  const articlePattern =
    /<article class="rounded-2xl border border-stone-700 bg-stone-800 p-5 hover:border-blue-500 hover:-translate-y-0\.5 transition">[\s\S]*?<\/article>/g;

  return html.replace(sectionPattern, (section) => {
    let index = 0;
    return section.replace(articlePattern, (article) => {
      index += 1;
      return index <= 6 ? article : "";
    });
  });
}

let changed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;

  for (const [pattern, replacement] of replacements) {
    after = after.replace(pattern, replacement);
  }

  after = removeDuplicateTrustSections(after);
  after = limitTestimonialCards(after);

  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

console.log(`Main copy fixed in ${changed} dist files.`);
