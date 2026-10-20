import { defineConfig } from "void/config";

export default defineConfig({
  target: "cloudflare",
  routing: {
    isr: false,
  },
  worker: {
    compatibility_date: "2026-09-11",
    compatibility_flags: ["nodejs_compat", "nodejs_als"],
  },
  cloudflare: {
    name: "portfolio-onsite",
    account_id: "ab816378ce175deba8768e44d4c9478b",
    workers_dev: false,
    preview_urls: false,
    observability: {
      enabled: true,
    },
    routes: [
      {
        pattern: "shayanameen.dev",
        custom_domain: true,
      },
      {
        pattern: "www.shayanameen.dev",
        custom_domain: true,
      },
    ],
  },
});
