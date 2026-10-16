import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    // The installed Chrome, so no browser download is needed.
    channel: "chrome",
  },
  webServer: {
    command: "vp preview --host 127.0.0.1",
    reuseExistingServer: !process.env.CI,
    stderr: "pipe",
    stdout: "pipe",
    timeout: 120_000,
    url: "http://127.0.0.1:4173",
  },
});
