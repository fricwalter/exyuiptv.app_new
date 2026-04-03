# exyuiptv.app_new

Fresh repository containing a clean static snapshot of the currently correct `exyuiptv.app` site as deployed on Cloudflare.

## Structure

- `dist/`: mirrored production HTML and assets
- `_worker.js`: small Cloudflare Worker for redirects and cache headers
- `wrangler.jsonc`: deployment config

## Deploy

```bash
npm install
npm run deploy
```
