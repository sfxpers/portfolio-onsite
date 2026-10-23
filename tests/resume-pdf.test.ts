import { describe, expect, it } from "vite-plus/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { RESUME_PDF_RELATIVE_PATH } from "@/catalog/resume-download";
import { buildResumePdf, stabilizePdf } from "../scripts/resume-pdf";

const committedPath = resolve(RESUME_PDF_RELATIVE_PATH);

function pdfPageCount(bytes: Uint8Array): number {
  const text = Buffer.from(bytes).toString("latin1");
  const matches = text.match(/\/Type\s*\/Page\b/g);
  return matches?.length ?? 0;
}

/**
 * The classic Chromium xref table: `startxref` names the byte offset of the
 * `xref` section, and every in-use entry names the byte offset of its
 * `{id} {generation} obj`. A stale table breaks random-access readers.
 * Returns each violation found, so callers assert the list is empty.
 */
function xrefViolations(bytes: Uint8Array): string[] {
  const text = Buffer.from(bytes).toString("latin1");
  const trailer = /startxref\s+(\d+)\s+%%EOF\s*$/.exec(text);
  if (!trailer) return ["no startxref trailer"];
  const declared = Number(trailer[1]);
  if (!text.startsWith("xref", declared)) return [`startxref ${declared} is not the xref section`];
  const lines = text.slice(declared + 4, text.indexOf("trailer", declared)).split(/\r?\n/);
  const violations: string[] = [];
  let objId = 0;
  let remaining = 0;
  for (const line of lines) {
    if (!line) continue;
    const header = /^(\d+) (\d+)$/.exec(line);
    if (header) {
      [objId, remaining] = [Number(header[1]), Number(header[2])];
      continue;
    }
    const entry = /^(\d{10}) (\d{5}) ([nf])\s*$/.exec(line);
    if (!entry) {
      violations.push(`unparsed xref line for object ${objId}: ${JSON.stringify(line)}`);
      continue;
    }
    const offset = Number(entry[1]);
    if (
      entry[3] === "n" &&
      !new RegExp(`^${objId} ${Number(entry[2])} obj\\b`).test(text.slice(offset, offset + 32))
    )
      violations.push(`xref entry ${objId} ${entry[2]} -> ${offset} is not an object`);
    objId += 1;
    remaining -= 1;
  }
  if (remaining !== 0) violations.push(`xref subsection count off by ${remaining}`);
  return violations;
}

describe("Resume PDF", () => {
  it("keeps the committed public PDF aligned with buildResumePdf", async (context) => {
    // Chromium measures fonts through CoreText on macOS and FreeType on Linux,
    // so only a Linux print can match the committed bytes.
    context.skip(
      process.platform !== "linux",
      "The committed PDF is a Linux print: Check on Linux enforces this (.github/workflows/resume-pdf.yml regenerates it)",
    );
    const generated = await buildResumePdf();
    const committed = stabilizePdf(readFileSync(committedPath));
    expect(Buffer.compare(committed, generated)).toBe(0);
  }, 60_000);

  it("is a single-page PDF document at the public path", () => {
    const committed = readFileSync(committedPath);
    expect(committed.subarray(0, 5).toString("utf8")).toBe("%PDF-");
    expect(pdfPageCount(committed)).toBe(1);
  });

  it("keeps every xref entry of the committed PDF pointing at its object", () => {
    expect(xrefViolations(readFileSync(committedPath))).toEqual([]);
  });

  it("produces a structurally valid xref table on a local print", async () => {
    // Local bytes differ from the Linux commit but must still be a valid PDF.
    const generated = await buildResumePdf();
    expect(generated.subarray(0, 5).toString("utf8")).toBe("%PDF-");
    expect(pdfPageCount(generated)).toBe(1);
    expect(xrefViolations(generated)).toEqual([]);
  }, 60_000);

  it("zeroes volatile metadata without changing byte length or layout", () => {
    const cases = [
      {
        input:
          "/CreationDate (D:20261005081233+02'00')\n" +
          "/ModDate (D:20251231235959+00'00')\n" +
          "/ID [<aB12cD34> <deadBEEF001122334455>]",
        output:
          "/CreationDate (D:19700101000000+02'00')\n" +
          "/ModDate (D:19700101000000+00'00')\n" +
          "/ID [<00000000> <00000000000000000000>]",
      },
      {
        input: "/CreationDate \t(D:19990102112233Z)\r\n/ModDate  (D:20200607080910Z)",
        output: "/CreationDate \t(D:19700101000000Z)\r\n/ModDate  (D:19700101000000Z)",
      },
    ];
    for (const { input, output } of cases) {
      const stabilized = stabilizePdf(Buffer.from(input, "latin1"));
      expect(stabilized.length).toBe(Buffer.byteLength(input, "latin1"));
      expect(stabilized.toString("latin1")).toBe(output);
      // Stabilizing a stabilized file changes nothing.
      expect(stabilizePdf(stabilized).toString("latin1")).toBe(output);
    }
  });
});
