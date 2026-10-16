# Craft Logbook

Personal product-engineer portfolio for Shayan: Home (work index), Case Studies, and Resume.

## Setup

[Vite+](https://viteplus.dev) (`vp`) runs everything: it uses the Node in `.node-version` and the pnpm in `package.json`, and ships Vite, Vitest, Oxlint, and Oxfmt as one set, pinned in `pnpm-workspace.yaml`. `vp install` also sets up the pre-commit hook, which checks what is staged.

```sh
curl -fsSL https://vite.plus | bash   # once per machine
vp install
vp exec playwright install chromium webkit
vp dev                                # http://localhost:3000
```

## Commands

```sh
vp check              # format, lint, and type check (vp check --fix to fix)
vp run check:tokens   # UI colours and sizes come from src/styles.css
vp test               # Vitest: Catalog rules, the print adapter, and the committed PDF (bytes on Linux only)
vp run test:e2e       # builds, then Playwright and axe against the preview server
vp build              # Cloudflare Workers production build
vp preview            # the production build, locally
vp run resume:pdf     # print public/resume/download.pdf locally, to preview Catalog changes
vp run deploy         # build and deploy with Wrangler (vp exec wrangler login first)
```

The committed Resume PDF is a Linux print. Chromium prints different bytes on macOS, even with Geist embedded, so `vp test` compares bytes only on Linux and skips that comparison on a Mac. CI enforces it: Check fails when the committed PDF drifts from the Catalog.

CI ([`.github/workflows/check.yml`](.github/workflows/check.yml)) runs `vp check`, `vp run check:tokens`, `vp test run`, and `vp run test:e2e` on Ubuntu for every pull request and every push to `main`. [`.github/workflows/resume-pdf.yml`](.github/workflows/resume-pdf.yml), run by hand from the Actions tab on a branch, prints the PDF on Linux, commits it to that branch if it changed, and starts Check on the new commit. Testing policy (seam-first layers, what not to add): [`docs/testing.md`](docs/testing.md).

## Deploy

Production runs on Cloudflare Workers at [shayanameen.dev](https://shayanameen.dev) (see `docs/adr/0004-cloudflare-workers-hosting.md`).

GitHub Actions deploys: the `deploy` job in [`.github/workflows/check.yml`](.github/workflows/check.yml) runs `vp run deploy` on every push to `main`, and only after Check passes, so a change whose tests fail never reaches production. Pull requests are checked, not deployed. Cloudflare builds nothing itself: the Worker is not connected to Git.

The job reads these from the repository's **Settings → Secrets and variables → Actions**:

| Name                                  | Kind     | Purpose                                                                    |
| ------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`                | Secret   | User API token from the "Edit Cloudflare Workers" template, Work account   |
| `CLOUDFLARE_ACCOUNT_ID`               | Variable | The Work account                                                           |
| `VITE_SITE_ORIGIN`                    | Variable | Optional; overrides the Catalog's `siteOrigin` (`https://shayanameen.dev`) |
| `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Variable | Optional; Cloudflare Web Analytics beacon token                            |

`vp run deploy` also works from a laptop after `vp exec wrangler login`.

After changing `siteOrigin` or Catalog facts that appear in the PDF, push the branch and run the Resume PDF workflow on it (Actions → Resume PDF → Run workflow, or `gh workflow run resume-pdf.yml --ref <branch>`), then pull its commit. Don't commit a PDF printed on a Mac: Check on Linux would fail it.

## Stack

- TanStack Start with file-based routing on Cloudflare Workers (`@cloudflare/vite-plugin` + Wrangler)
- Tailwind CSS with locally defined semantic tokens
- Vite+ (Vite, Vitest, Oxlint, Oxfmt), Playwright, and axe

Domain language: `GLOSSARY.md`. Product contract: `docs/adr/0001-craft-logbook-visual-direction.md`. Copy voice: `docs/adr/0003-plain-concrete-copy-voice.md`.
