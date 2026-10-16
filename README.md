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
vp test               # Vitest: Catalog rules, the print adapter, and the committed PDF
vp run test:e2e       # builds, then Playwright and axe against the preview server
vp build              # Cloudflare Workers production build
vp preview            # the production build, locally
vp run resume:pdf     # regenerate public/resume/download.pdf after Catalog changes
vp run deploy         # build and deploy with Wrangler (vp exec wrangler login first)
```

`vp test` fails when the committed Resume PDF drifts from the Catalog. Testing policy (seam-first layers, what not to add): [`docs/testing.md`](docs/testing.md).

## Deploy

Production runs on Cloudflare Workers at [shayanameen.dev](https://shayanameen.dev) (see `docs/adr/0004-cloudflare-workers-hosting.md`).

Git pushes to `main` deploy via Cloudflare **Workers Builds**; other branches upload preview versions. Workers Builds installs the committed `pnpm-lock.yaml` with the pnpm in `package.json`, then runs the package scripts, which call the `vp` that `vite-plus` installs. It is configured in the Cloudflare dashboard under the Worker's **Settings → Build**:

| Setting                              | Value                     |
| ------------------------------------ | ------------------------- |
| Production branch                    | `main`                    |
| Build command                        | _(empty)_                 |
| Deploy command                       | `pnpm run deploy`         |
| Non-production branch builds         | Enabled                   |
| Non-production branch deploy command | `pnpm run deploy:preview` |
| Root directory                       | _(repository root)_       |

Workers Builds should define:

| Variable                              | Purpose                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `VITE_SITE_ORIGIN`                    | Canonical origin (`https://shayanameen.dev`) — keep in sync with Catalog `siteOrigin` |
| `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Cloudflare Web Analytics beacon token                                                 |

After changing `siteOrigin` or Catalog facts that appear in the PDF, run `vp run resume:pdf` and commit the result.

## Stack

- TanStack Start with file-based routing on Cloudflare Workers (`@cloudflare/vite-plugin` + Wrangler)
- Tailwind CSS with locally defined semantic tokens
- Vite+ (Vite, Vitest, Oxlint, Oxfmt), Playwright, and axe

Domain language: `GLOSSARY.md`. Product contract: `docs/adr/0001-craft-logbook-visual-direction.md`. Copy voice: `docs/adr/0003-plain-concrete-copy-voice.md`.
