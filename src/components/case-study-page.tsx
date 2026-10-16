import { Link } from "@tanstack/react-router";

import { caseStudies, type CaseStudy } from "@/catalog/portfolio";
import { PageShell } from "@/components/page-shell";

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length] ?? study;

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted-foreground">
        <ol className="flex gap-2">
          <li>
            <Link to="/" className="hover:text-foreground">
              Selected work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {study.title}
          </li>
        </ol>
      </nav>

      <div className="mt-6 md:grid md:grid-cols-12 md:gap-12">
        <aside aria-label="Summary" className="md:sticky md:top-8 md:col-span-4 md:self-start">
          <h1 className="text-3xl font-semibold tracking-tight">{study.title}</h1>
          <p className="mt-2 figure">{study.year}</p>
          <dl className="mt-6 border-b border-border text-sm">
            {(
              [
                ["Problem", study.capsule.problem],
                ["Role", study.capsule.role],
                ["Outcome", study.capsule.outcome],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="border-t border-border py-4">
                <dt className="font-medium">{label}</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="mt-12 space-y-12 md:col-span-8 md:mt-0">
          {study.body.map((block, index) =>
            block.type === "text" ? (
              <section key={index} className="max-w-prose">
                <h2 className="text-lg font-semibold">{block.heading}</h2>
                <p className="mt-2 leading-relaxed text-foreground/85">{block.body}</p>
              </section>
            ) : (
              <figure key={index}>
                <a
                  href={block.showcase.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open full-size ${block.showcase.label} image`}
                  className="block overflow-hidden rounded-md border border-border bg-muted"
                >
                  <img
                    src={block.showcase.src}
                    alt={block.showcase.alt}
                    width={block.showcase.width}
                    height={block.showcase.height}
                    sizes="(min-width: 768px) 40rem, 100vw"
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full"
                  />
                </a>
                <figcaption className="mt-3 text-sm">
                  <span className="font-medium">{block.showcase.label}.</span>{" "}
                  <span className="text-muted-foreground">{block.showcase.caption}</span>
                </figcaption>
              </figure>
            ),
          )}

          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group block rounded-md border border-border p-5 transition-colors hover:bg-muted"
          >
            <span className="block text-sm text-muted-foreground">Next case study</span>
            <span className="mt-1 block font-semibold group-hover:text-primary">
              {next.title} →
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">{next.indexSummary}</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
