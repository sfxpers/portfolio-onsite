import { Link } from "@tanstack/react-router";

import { caseStudies, identity, profileHeading } from "@/catalog/portfolio";
import { RESUME_PDF_HREF, resumePdfDownloadName } from "@/catalog/resume-download";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";

const email = identity.contact.find((link) => link.kind === "email");

export function HomePage() {
  return (
    <PageShell>
      <section aria-label={profileHeading} className="max-w-2xl py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight">{identity.name}</h1>
        <p className="mt-1 text-muted-foreground">{identity.role}</p>
        <p className="mt-6 text-base leading-relaxed text-foreground/85">{identity.bio}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {email ? (
            <a href={email.href} className={buttonVariants()}>
              Email me
            </a>
          ) : null}
          <a
            href={RESUME_PDF_HREF}
            download={resumePdfDownloadName()}
            className={buttonVariants({ variant: "link" })}
          >
            Download resume (PDF)
          </a>
        </div>
      </section>

      <section aria-labelledby="selected-work">
        <h2 id="selected-work" className="border-b border-border pb-3 text-sm font-semibold">
          Selected work
        </h2>
        <ol className="divide-y divide-border border-b border-border">
          {caseStudies.map((study, index) => (
            <li key={study.slug}>
              <Link
                to="/work/$slug"
                params={{ slug: study.slug }}
                className="group grid grid-cols-12 gap-x-4 gap-y-1 py-5 transition-colors hover:bg-muted sm:px-3"
              >
                <span className="col-span-2 figure pt-1 sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="col-span-8 font-semibold group-hover:text-primary sm:col-span-3">
                  {study.title}
                </span>
                <span className="col-span-2 figure pt-1 text-right sm:order-last sm:col-span-1">
                  {study.year}
                </span>
                <span className="col-span-10 col-start-3 text-sm text-muted-foreground sm:col-span-7 sm:col-start-auto">
                  {study.indexSummary}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
