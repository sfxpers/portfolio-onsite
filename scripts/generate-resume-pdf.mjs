// Through Vite, so the Catalog's `@/` imports resolve as they do in the app.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { runnerImport } from "vite";

const { module } = await runnerImport("./scripts/resume-pdf.ts", {
  configFile: false,
  resolve: { tsconfigPaths: true },
});
const target = resolve(module.RESUME_PDF_RELATIVE_PATH);
const bytes = await module.buildResumePdf();
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, bytes);
console.log(`Wrote ${target} (${bytes.length} bytes)`);
