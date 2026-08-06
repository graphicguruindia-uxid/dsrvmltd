# DSRVM Ltd site — Deployment (dsrvmltd.co.uk)

Static marketing site. Deploy target: **Cloudflare Pages** (per the board infra decision
on DSRA-4 — Cloudflare Pages for the marketing/web frontend; supersedes the earlier Vercel
call. See monorepo ADR-004).

## How it deploys

Cloudflare Pages serves the static files in this repo directly — there is no build step and
no framework. The `wrangler.toml` in the repo root configures the Pages project
(`pages_build_output_dir = "."`). Security headers and long-lived image caching are handled
by the `_headers` file in the repo root (Cloudflare Pages native format, same policy that
previously lived in `vercel.json`). Internal links use `.html` paths, so no clean-URL
rewrites are needed.

Two supported paths:

1. **CI (recommended)**: `.github/workflows/deploy-site.yml` deploys on push to `main`
   via `cloudflare/wrangler-action` (`wrangler pages deploy . --project-name dsrvm-site`).
   It skips cleanly until the repo secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
   exist (provisioned via the DSRA-4 credential prompt).
2. **Wrangler CLI**: `npx wrangler pages deploy . --project-name dsrvm-site --branch main`
   after `npx wrangler login`.

## DNS notes

- Domain: `dsrvmltd.co.uk` (canonical host in the repo `CNAME` file, which also serves as
  documentation of the canonical host; Cloudflare Pages ignores it).
- On a Cloudflare-hosted DNS zone, add a `CNAME` record `www` → `dsrvm-site.pages.dev` (or
  use a custom domain `dsrvmltd.co.uk` in the Pages project — Cloudflare handles the cert).
- If DNS is with another registrar, point the CNAME at `dsrvm-site.pages.dev` and set apex
  redirection in the Pages project settings.

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
4. **Deploy credentials**: DSRA-4 / DSRA-17 track the Cloudflare credential prompt;
   go-live of the deploy pipeline waits on that.

## CI

`.github/workflows/check-site.yml` runs `npm test` (`node scripts/check-site.mjs`) on PRs
and main — it validates links, sitemap, JSON-LD, and the CNAME file. No build is required
for a static deploy.
