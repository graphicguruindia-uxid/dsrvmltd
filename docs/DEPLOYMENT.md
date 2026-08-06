# DSRVM Ltd site — Deployment (dsrvmltd.co.uk)

Static marketing site. Deploy target: **Vercel** (per the CEO stack decision on DSRA-4 —
Vercel for the web/marketing frontend, Fly.io for services/Postgres).

## How it deploys

Vercel serves the static files in this repo directly — there is no build step and no
framework. The `vercel.json` config in the repo root applies security headers and
long-lived image caching. Internal links use `.html` paths, so `cleanUrls` stays off
(no redirect churn).

Two supported paths:

1. **Vercel dashboard** (recommended): import this repo (`graphicguruindia-uxid/dsrvmltd`)
   → Framework Preset: *Other* → Root Directory: `/` → Deploy. Then add the domain
   `www.dsrvmltd.co.uk` (and apex `dsrvmltd.co.uk`) in Project → Domains. Vercel issues
   the TLS cert automatically and sets the CNAME at the DNS provider.
2. **Vercel CLI**: `npx vercel --prod` after linking the project (`npx vercel link`).

## DNS notes

- Current DNS registrar/host holds the domain record. For Vercel: set a `CNAME` record
  `www → cname.vercel-dns.com` and either a root redirect record or A records for the apex
  (see Vercel's add-domain wizard for exact values).
- The repo's `CNAME` file (containing `dsrvmltd.co.uk`) is retained for GitHub Pages
  compatibility and as documentation of the canonical host; Vercel ignores it.

## SEO / verification files (kept working)

- `robots.txt` — references `https://www.dsrvmltd.co.uk/sitemap.xml`.
- `sitemap.xml` — lists every page plus the `services.html#*` service anchors.
- `BingSiteAuth.xml` — Bing Webmaster Tools verification.
- Google verification (`msvalidate.01`) is inline in `index.html` head.

## Post-deploy checklist

1. Confirm `https://www.dsrvmltd.co.uk/robots.txt` and `/sitemap.xml` return 200.
2. Submit the sitemap to Google Search Console and Bing Webmaster Tools.
3. **Contact form recipient**: `js/contact.js` uses EmailJS. The EmailJS *template*
   recipient (set in the EmailJS dashboard, not in code) should be
   `info@dsrvmltd.co.uk` (the setup notes in `js/contact.js` now instruct this) so
   enquiries land in the DSRVM inbox — confirm the live template's `To Email` field.
4. **Deploy credentials**: DSRA-4 tracks the hosting/DNS credentials; go-live of the new
   deploy pipeline waits on that.

## CI

Add a GitHub Action later if a build/test gate is wanted: run `npm test`
(`node scripts/check-site.mjs`) on PRs — it validates links, sitemap, JSON-LD, and the
CNAME file. No build is required for a static deploy.
