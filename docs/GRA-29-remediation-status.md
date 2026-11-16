# GRA-29 remediation status

Remediation of GRA-22 audit findings. Status per finding ID.

## Phase 1 - Privacy/compliance (High)
- S-01: Fixed - Statcounter gated behind consent; removed hard-coded snippets; initAnalytics() loads after acceptCookies(); decline removes loaded analytics.
- S-02: Fixed - EmailJS disclosed as processor in privacy-policy.html.

## Phase 2 - Headers & supply chain (Medium)
- S-03: Fixed - Content-Security-Policy added to _headers (enforced).
- S-04: Fixed - integrity + crossorigin added to Bootstrap CSS, Font Awesome, EmailJS SDK. Statcounter loaded dynamically (no SRI, host-trusted). Google Fonts CSS left without SRI (UA-dependent).
- S-05: Fixed - .assetsignore excludes .git from Cloudflare Pages output.
- S-08: Fixed - X-Frame-Options changed to DENY.
- S-09: Fixed - HSTS preload directive added.
- S-11: Fixed - inline onclick/onload handlers removed; cookie buttons bound in main.js.
- S-12: Fixed - Cross-Origin-Opener-Policy: same-origin added.

## Phase 3 - Anti-abuse & hygiene (Medium/Low)
- S-06: Partially fixed - honeypot field added to contact form; EmailJS CAPTCHA documented (enable in dashboard); rate limits documented.
- S-07: Documented - EmailJS template must use escaped {{var}} only; recipient set in dashboard (code already compliant).
- S-10: Fixed - location.hash validated before querySelector in smoothScrollTo().
- S-13: Fixed - stray CMSBgImg*.jpeg deleted; gitignored Copy.png duplicates removed.
- S-14: Fixed - unused vendor assets removed (bootstrap.js, bootstrap.min.js, FontAwesome_400.font.js, jquery-ui.css).
- S-15: Fixed - /css/ and /js/ disallows removed from robots.txt.
- S-16: Fixed - sitemap.xml lastmod refreshed.
- S-18: Deferred - image optimisation (WebP/AVIF/srcset) not performed. Rationale: requires asset pipeline and risks visual regressions; tracked as follow-up.

## Phase 4 - Nice to have
- S-17: Deferred - GitHub Actions not pinned to commit SHAs. Rationale: maintenance overhead for small static site.
- S-19: Deferred - no client-side error/abuse monitoring. Rationale: console logging acceptable for static site.
- S-20: Deferred - no skip link / cookie-banner focus management. Rationale: accessibility baseline (alt text, role=alert) retained.

## Follow-up
- S-01 follow-up: .well-known/security.txt added.