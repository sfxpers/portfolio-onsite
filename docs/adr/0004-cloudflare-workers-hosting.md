# Cloudflare Workers is the production host

The portfolio deploys to **Cloudflare Workers** via TanStack Start + Void (`voidPlugin()` + `void deploy`), not Nitro and not Vercel. Production serves the custom domain `https://shayanameen.dev`; GitHub Actions deploys `main` to production once its checks pass (amended below). Visitor metrics use Cloudflare Web Analytics (build env `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN`); Workers Observability covers runtime logs/metrics. Vercel Analytics/Speed Insights and the Node/`nitro()` server output are removed with this host choice.

**Why Workers over keeping Nitro:** TanStack and Cloudflare document the Vite plugin path for Start; this app was not using Nitro as a multi-host layer. **Why Void over raw Wrangler:** Void keeps the same Worker and domains while owning binding inference, codegen, and deploy. **Why not stay on the free `workers.dev` subdomain:** the custom domain presents a personal hostname while hosting cost and architecture are unchanged.

**Amended (2026-10): GitHub Actions deploys, not Workers Builds.** Workers Builds deployed `main` whether or not the tests in GitHub passed, and its branch previews moved to a beta (Worker Previews) this site does not use. One pipeline now tests every pull request and deploys `main` only after the tests pass; the Worker is no longer connected to Git.

**Amended (2026-10): Void replaces Wrangler-first deploy.** Config lives in `void.config.ts` / `void.lock.json` (TanStack Start + `voidPlugin()`, `env.ts` for `VITE_*`); CI runs `void deploy --platform cloudflare` with `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`.
