import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { voidPlugin } from "void";
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
  run: {
    tasks: {
      "check:tokens": "node scripts/check-tokens.mjs",
    },
  },
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  preview: { port: 4173 },
  // Lazy, so `vp check`, `vp lint`, and `vp fmt` read this file without
  // starting the plugins. voidPlugin must come before the framework plugin.
  plugins: lazyPlugins(() => [voidPlugin(), tailwindcss(), tanstackStart(), viteReact()]),
});
