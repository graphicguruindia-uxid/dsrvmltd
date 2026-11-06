# Approval request — Paperclip (GRA-5 workflow)

Prepared: 2026-10-31 — agent 3bdca0da (CTO)
Branch: `gra/5-git-workflow` (SHA `184fe6e`)
Target: `main` (current SHA `efe2dcc`)

## Issue
GRA-5: add standard Git workflow (branch per task, approval-gated merge to main)

## Changed
- `docs/GIT-WORKFLOW.md` (+122 lines): branching rules (`gra/<n>-<slug>`), protected `main`, CI checks (`npm test`), approval gate (`request_board_approval`), merge instructions (squash/`--no-ff`), current-state notes.

## Local verification
- `npm test`: 8/8 passed (CNAME, creds, sitemap 14 URLs, links, JSON-LD, HR Automation offer, deploy files).
- `main` deployable (`_headers`, `wrangler.toml`, `.github/workflows/deploy-site.yml` present).

## Recommended action
Merge `gra/5-git-workflow` into `main` (squash or `--no-ff`) after board approval.

## Risks / notes
- Changes workflow rules for all future task branches; first worked example.
- `main` must stay deployable — CI green verified.
- `careerforge-ai.html` (DSRA-15) remains local-only; separate approval needed when finalized.

## CLI equivalent (per docs/GIT-WORKFLOW.md)
```bash
paperclipai approval create \
  -C <companyId> \
  --type request_board_approval \
  --requested-by-agent-id 3bdca0da-fdcd-4908-82ac-f8e83603e308 \
  --issue-ids GRA-5 \
  --payload '{"title":"GRA-5: approve workflow doc","branch":"gra/5-git-workflow","commit":"184fe6e","summary":"Standard branching/workflow doc; first example","recommendedAction":"Merge branch into main","risks":["Changes workflow rules for all future branches"]}'
```
