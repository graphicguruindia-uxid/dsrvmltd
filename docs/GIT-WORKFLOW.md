# Git workflow (GRA-5)

Standard branching, merge and approval process for the DSRVM Limited site repo.
This is the company default: it applies to every task in this repository unless a
board decision says otherwise.

Repo: `graphicguruindia-uxid/dsrvmltd` (remote `origin`). Default/protected branch: `main`.

## Rules

1. **`main` is protected.** Nobody commits or pushes directly to `main`. Every change
   reaches `main` through a task branch and an approved merge.
2. **One branch per task.** Each Paperclip issue gets its own branch, cut from an
   up-to-date `main`. Never mix two tasks in one branch.
3. **Changes stay off `main` until approved.** Work lives on the branch; `main` only
   receives it after the board approves (see Approval gate below).
4. **`main` is always deployable.** Pushing to `main` triggers the Cloudflare Pages
   deploy (`.github/workflows/deploy-site.yml`). Never let WIP or a red `npm test`
   land on `main`.
5. **No force-push and no history rewrite on `main`.** Force-push is allowed only on
   your own unmerged task branch.

## Branch naming

```
gra/<issue-number>-<short-slug>
```

Examples: `gra/1-home-page`, `gra/2-services-page`, `gra/5-git-workflow`.

## Agent workflow (per task)

```bash
# 0. Start from an up-to-date main
git checkout main
git pull --ff-only

# 1. Create the task branch
git checkout -b gra/<n>-<slug>

# 2. Do the work, then verify locally
npm test                     # node scripts/check-site.mjs (links, sitemap, JSON-LD, CNAME)

# 3. Commit on the branch (reference the issue)
git add -A
git commit -m "GRA-<n>: <what changed>"

# 4. Push the branch (never main)
git push -u origin gra/<n>-<slug>
```

Then:

5. **Open a pull request** from `gra/<n>-<slug>` into `main`. The PR body must state
   the issue (`GRA-<n>`), what changed, and the local check result. CI
   (`.github/workflows/check-site.yml`) runs `npm test` on the PR.
6. **Request board approval** in Paperclip (see below). The PR is not merged until
   the approval is granted.
7. After approval, merge to `main` (see Merge below) and delete the branch.

## Merge instructions

Merge only after the approval is granted and CI is green. Preferred: squash-merge
the PR through GitHub. If merging locally:

```bash
git checkout main
git pull --ff-only
git merge --no-ff gra/<n>-<slug>     # or: git merge --squash gra/<n>-<slug>
git push origin main
git branch -d gra/<n>-<slug>
git push origin --delete gra/<n>-<slug>
```

If `main` moved while you worked, rebase the branch first and re-run `npm test`:

```bash
git checkout gra/<n>-<slug>
git rebase main
npm test
git push --force-with-lease origin gra/<n>-<slug>
```

## Approval gate (push-to-main requests)

Every set of changes that will reach `main` needs an explicit board approval first.
Create one approval request per change set, linked to the task issue:

- **Type:** `request_board_approval`
- **Linked issue:** the task issue id (e.g. GRA-5)
- **Payload:** title, summary, the branch name, the commit SHA, the files changed,
  the PR URL (if any), and the local test result.
- **Requested by:** the agent doing the work.

CLI equivalent:

```bash
paperclipai approval create \
  -C <companyId> \
  --type request_board_approval \
  --requested-by-agent-id <agentId> \
  --issue-ids <issueId> \
  --payload '{"title":"...","branch":"gra/<n>-<slug>","commit":"<sha>","summary":"...","recommendedAction":"Merge branch into main","risks":["..."]}'
```

The board approves, rejects or asks for a revision in Paperclip. Only an approved
request is merged. If a reviewer asks for changes, fix them on the same branch,
push, and resubmit the approval (`paperclipai approval resubmit <approvalId>`).

## Current state (2026-10-31)

- `main` is at the last shipped site version; the tree is clean.
- Page-update tasks follow this process: GRA-1 home, GRA-2 services, GRA-3 about,
  GRA-4 contact — one branch each, merged in order.
- This document itself ships on `gra/5-git-workflow` behind a board approval, which
  is the first worked example of the process.

## Related

- Deployment: `docs/DEPLOYMENT.md`
- Site checks: `scripts/check-site.mjs` (`npm test`)
- CI: `.github/workflows/check-site.yml` (PRs/main), `.github/workflows/deploy-site.yml` (deploy on `main`)
