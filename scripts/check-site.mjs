#!/usr/bin/env node
/**
 * DSRVM Ltd site static checks (zero dependencies).
 * Run: node scripts/check-site.mjs  (or npm test)
 *
 * Verifies:
 *   - CNAME is exactly the canonical domain (no embedded credentials)
 *   - no plaintext "password" in committed site files
 *   - robots.txt points at sitemap.xml
 *   - sitemap.xml parses; every <loc> maps to an existing file and, for anchors,
 *     to a real element id in that page
 *   - every local href/src in every page resolves to an existing file
 *   - every inline JSON-LD block parses as JSON
 *   - the HR Automation / CareerForge offer is present on the site
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOMAIN = 'dsrvmltd.co.uk';
const CANONICAL = `www.${DOMAIN}`;

const read = (p) => readFileSync(p, 'utf8');
const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const assets = readdirSync(ROOT).filter((f) => !f.endsWith('.html'));

const failures = [];
const check = (label, fn) => {
  try {
    fn();
    console.log(`  ok  ${label}`);
  } catch (err) {
    failures.push(`${label}: ${err.message}`);
    console.error(`FAIL  ${label}: ${err.message}`);
  }
};

console.log('DSRVM site static checks');

// 1. CNAME
check('CNAME is canonical domain only', () => {
  const cname = read(join(ROOT, 'CNAME')).trim();
  assert.strictEqual(cname, DOMAIN, `expected "${DOMAIN}", got "${cname}"`);
});

// 2. no embedded credentials
check('no plaintext password in tracked site files', () => {
  const scanned = ['CNAME', 'robots.txt', 'sitemap.xml', 'BingSiteAuth.xml', ...htmlFiles];
  for (const f of scanned) {
    const t = read(join(ROOT, f));
    assert.ok(!/password/i.test(t), `${f} contains "password"`);
  }
});

// 3. robots.txt -> sitemap
check('robots.txt references sitemap.xml', () => {
  const robots = read(join(ROOT, 'robots.txt'));
  assert.ok(/Sitemap:\s*https:\/\/www\.dsrvmltd\.co\.uk\/sitemap\.xml/.test(robots), 'missing Sitemap line');
});

// 4. sitemap
const sitemapLocs = (() => {
  const sm = read(join(ROOT, 'sitemap.xml'));
  assert.ok(sm.trim().startsWith('<?xml'), 'sitemap.xml is not XML');
  return [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
})();
check(`sitemap.xml parses and lists ${sitemapLocs.length} URLs`, () => {
  assert.ok(sitemapLocs.length >= 10, 'sitemap has too few URLs');
  for (const loc of sitemapLocs) {
    assert.ok(loc.startsWith(`https://${CANONICAL}/`), `unexpected host: ${loc}`);
    const rel = loc.replace(`https://${CANONICAL}/`, '');
    const [file, anchor] = rel.split('#');
    const target = file === '' ? 'index.html' : file;
    assert.ok(existsSync(join(ROOT, target)), `sitemap target missing: ${rel}`);
    if (anchor) {
      const pageHtml = read(join(ROOT, target));
      assert.ok(new RegExp(`id=["']${anchor}["']`).test(pageHtml), `anchor #${anchor} not found in ${target}`);
    }
  }
});

// 5. local links and assets
const pageAnchors = new Map(htmlFiles.map((f) => [f, [...read(join(ROOT, f)).matchAll(/id=["']([^"']+)["']/g)].map((m) => m[1])]));
check('every local href/src resolves to an existing file', () => {
  for (const f of htmlFiles) {
    const html = read(join(ROOT, f));
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/.test(ref)) continue;
      const [pathPart, anchor] = ref.split('#');
      if (!pathPart) {
        assert.ok(pageAnchors.get(f).includes(anchor), `${f}: unresolved anchor #${anchor}`);
        continue;
      }
      const file = pathPart.replace(/^\//, '');
      assert.ok(existsSync(join(ROOT, file)), `${f}: missing target "${ref}"`);
    }
  }
});

// 6. JSON-LD parses
check('inline JSON-LD blocks parse', () => {
  for (const f of htmlFiles) {
    const html = read(join(ROOT, f));
    const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
    for (const [, body] of blocks) {
      if (!body.trim()) continue;
      assert.ok(JSON.parse(body), `${f}: invalid JSON-LD`);
    }
    assert.ok(blocks.length >= 1, `${f}: no JSON-LD found`);
  }
});

// 7. HR Automation / CareerForge offer present
check('HR Automation / CareerForge offer is present', () => {
  const services = read(join(ROOT, 'services.html'));
  assert.ok(/id="hr-automation"/.test(services), 'services.html missing #hr-automation section');
  assert.ok(/CareerForge/.test(services), 'services.html missing CareerForge mention');
  const index = read(join(ROOT, 'index.html'));
  assert.ok(/CareerForge/.test(index), 'index.html missing CareerForge mention');
  assert.ok(sitemapLocs.some((l) => l.includes('#hr-automation')), 'sitemap missing #hr-automation');
});

// 8. expected files present
check('expected deploy files present', () => {
  for (const f of ['robots.txt', 'sitemap.xml', 'CNAME', 'BingSiteAuth.xml', 'vercel.json']) {
    assert.ok(existsSync(join(ROOT, f)), `missing ${f}`);
  }
});

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log(`\nAll checks passed (${htmlFiles.length} pages, ${assets.length} static files, ${sitemapLocs.length} sitemap URLs).`);
