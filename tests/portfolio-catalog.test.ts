import { describe, expect, it } from "vite-plus/test";

import { caseStudies, getResume, identity } from "@/catalog/portfolio";

describe("portfolio catalog", () => {
  it("puts Email, Threads, and X in the chrome contact", () => {
    expect(identity.contact.map((link) => link.kind)).toEqual(["email", "threads", "x"]);
  });

  it("keeps Skills to a few bands, not a laundry list", () => {
    const { skills } = getResume();
    expect(skills.length).toBeLessThanOrEqual(6);
    expect(skills.flatMap((group) => group.items).length).toBeLessThanOrEqual(24);
  });

  it("lists degrees only under Education", () => {
    for (const item of getResume().education) {
      expect(`${item.degree} ${item.institution}`).not.toMatch(/Intermediate|Matriculation/i);
    }
  });

  it("projects Resume Projects from the Case Studies", () => {
    expect(getResume().projects).toEqual(
      caseStudies.map((study) => ({
        title: study.title,
        summary: study.indexSummary,
        slug: study.slug,
      })),
    );
  });

  it("publishes two to three Case Studies", () => {
    expect(caseStudies.length).toBeGreaterThanOrEqual(2);
    expect(caseStudies.length).toBeLessThanOrEqual(3);
  });

  it.each(caseStudies.map((study) => [study.slug, study] as const))(
    "%s alternates text and Showcase, from text to Showcase, with peer depth",
    (_slug, study) => {
      const types = study.body.map((block) => block.type);
      expect(types[0]).toBe("text");
      expect(types.at(-1)).toBe("showcase");
      types.slice(1).forEach((type, index) => expect(type).not.toBe(types[index]));

      // Depth is not assertable; this floor only rules out a one-line
      // restatement of the heading.
      const technical = study.body.flatMap((block) =>
        block.type === "text" && block.depth === "technical" ? [block.body] : [],
      );
      expect(technical.length).toBeGreaterThan(0);
      for (const body of technical) expect(body.length).toBeGreaterThan(200);

      const showcases = study.body.flatMap((block) =>
        block.type === "showcase" ? [block.showcase] : [],
      );
      for (const showcase of showcases) {
        expect(showcase.src).toMatch(/^\/evidence\//);
        expect(showcase.alt).not.toBe("");
      }
    },
  );
});
