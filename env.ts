import { defineEnv, string } from "void/env";

// Client build values (VITE_*). Optional — same as today when unset.
export default defineEnv({
  VITE_SITE_ORIGIN: string().optional(),
  VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN: string().optional(),
});
