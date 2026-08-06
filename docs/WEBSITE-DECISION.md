# Website architecture decision (DSRA-16)

## Decision: keep the company site static; do not migrate to the @dsrvm/web stack

The company website (`https://www.dsrvmltd.co.uk`) stays a hand-authored static
HTML/CSS/JS site, deployed as static assets to Vercel.

## Why

- **Different jobs.** The site is a marketing/portfolio surface — fast, crawlable,
  zero-app-ops. The `@dsrvm/web` line (DSRA-7 reference server, DSRA-12 WebStore,
  DSRA-13 SSO, DSRA-14 billing) is the *enterprise product* customers buy, for multi-tenant
  SaaS/enterprise tenants, Postgres-backed with services on Fly.io.
- **Migrating costs more than it returns.** Porting eight static pages onto the Fastify/React
  reference stack adds build, hosting, and runtime complexity with no marketing benefit.
- **The two stay aligned through seams, not code absorption** — the same approach taken for
  CareerForge in DSRA-15:
  1. **Offer/messaging alignment** — services, case studies, and structured data now reflect
     the real product lines: AI consulting, HR automation (CareerForge AI + employer HR
     pipeline), and enterprise web.
  2. **CareerForge** is reflected on the site as the HR Automation service
     (`services.html#hr-automation`) with a teaser on the homepage. When CareerForge deploys
     under the `dsrvmltd.co.uk` domain (either `/careerforge/` proxied by this site or a
     dedicated subdomain), the section's CTA should point at the live product URL.
  3. **Shared brand assets** (logo, tone, service names) stay in this repo; the web product
     line draws brand direction from here, not the reverse.

## When to revisit

- If the site needs interactive product surfaces (e.g. a client login, live billing demo),
  consider a dedicated subdomain running the `@dsrvm/web` stack behind the same domain —
  still without porting the marketing pages.
- If the site grows into a CMS-managed content hub, replace the static repo rather than
  bolting a CMS onto it.

## Related

- Deployment: `docs/DEPLOYMENT.md`
- HR line alignment: monorepo `docs/hr-m31-careerforge-alignment.md` (DSRA-15)
- Web reference architecture: monorepo `apps/web` / `@dsrvm/web` (DSRA-7)
