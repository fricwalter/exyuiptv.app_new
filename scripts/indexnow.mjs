import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOST = 'exyuiptv.app';
const KEY = '7750fb3a6ac840b8b47216584df9d1f2';

const sitemap = readFileSync(join(__dirname, '../dist/sitemap-0.xml'), 'utf-8');
const urls = [...sitemap.matchAll(/<ns0:loc>(https:\/\/[^<]+)<\/ns0:loc>/g)].map(m => m[1]);

console.log(`Sending ${urls.length} URLs to IndexNow...`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});

console.log(`IndexNow response: ${res.status} ${res.statusText}`);
