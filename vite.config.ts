import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: [".agents/**", "src/routeTree.gen.ts", "public/resume/download.pdf"],
  },
  lint: {
    plugins: ["typescript", "react", "unicorn", "oxc", "import", "vitest", "jsx-a11y"],
    // A correctness finding fails the check; a warning would not.
    categories: {
      correctness: "error",
    },
    ignorePatterns: [".agents/**", "src/routeTree.gen.ts"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  preview: { port: 4173 },
  // Lazy, so `vp check`, `vp lint`, and `vp fmt` read this file without
  // starting the plugins.
  plugins: lazyPlugins(() => [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ]),
});
