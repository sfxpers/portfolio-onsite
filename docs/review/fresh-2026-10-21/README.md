# Evidence for fresh-2026-10-21 review

Baseline `636e4566c50877b94d6086793fb5724248516450`, branch `review/fresh-2026-10-21`. Captured 2026-10-21. All commands ran in a disposable `git archive` checkout (`git init` + `git add -A`, `node_modules` linked to installed dependencies, `void prepare` local codegen). No `.env` copied; no remote or production resource touched. Raw unabridged collection: `/Users/sfx/phase1-evidence/` (not part of this repository).

## Command logs (ANSI-stripped; exit code in `.exit`)

- `check.log` — `vp check`, exit 0
- `check-tokens.log` — `vp run check:tokens`, exit 0
- `test.log` — `vp test run`, exit 0 (12 passed, 1 skipped: Linux-only PDF byte-lock test)
- `test-smoke.log` — canonical `vp run test:smoke`, exit 1: `vp build` succeeded, all 8 Playwright cases failed to launch because `channel: "chrome"` cannot find Google Chrome on this machine (environment blocker, no product assertion ran)
- `e2e-chromium.log` — supplemental `vp exec playwright test --config playwright.review.config.ts` on the same already-built output with bundled Chromium, exit 0 (8/8 passed); scratch config preserved in `playwright.review.config.ts.src`, canonical config unchanged

## Frozen inputs

- `dependency-snapshot.json`, `dependency-table.md` — generated frozen dependency metadata (27 package/tool rows)
- `github-maintenance.json` — GitHub repo maintenance fields per package (raw `gh api repos/...` fields)
- `pdf-structure-evidence.json` — declared vs actual startxref in the committed `public/resume/download.pdf`
- `skills-symlinks-and-inventory.txt`, `skills-diff-summary.txt`, `skills-upstream-head.txt` — agent-skills capture vs upstream `mattpocock/skills@5beb35b`
