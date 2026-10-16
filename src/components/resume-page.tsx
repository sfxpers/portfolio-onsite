import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import type { ReactNode } from "react";

import { identity } from "@/catalog/portfolio";
import { RESUME_PDF_HREF, resumePdfDownloadName } from "@/catalog/resume-download";
import { getResumeView, type ResumeSection } from "@/catalog/resume-view";
import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";

export function ResumePage() {
  return (
    <PageShell>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Resume</h1>
          <p className="mt-1 text-muted-foreground">
            {identity.name}, {identity.role}
          </p>
        </div>
        <a href={RESUME_PDF_HREF} download={resumePdfDownloadName()} className={buttonVariants()}>
          Download PDF
        </a>
      </header>

      {getResumeView().map((section) => (
        <section
          key={section.kind}
          aria-labelledby={section.kind}
          className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8"
        >
          <h2 id={section.kind} className="text-sm font-semibold md:col-span-3">
            {section.heading}
          </h2>
          <div className="md:col-span-9">
            <SectionBody section={section} />
          </div>
        </section>
      ))}
    </PageShell>
  );
}

function SectionBody({ section }: { section: ResumeSection }) {
  switch (section.kind) {
    case "profile":
      return (
        <>
          <p className="leading-relaxed text-foreground/85">{section.bio}</p>
          <p className="mt-3 text-sm text-muted-foreground">{section.location}</p>
        </>
      );
    case "experience":
      return (
        <ul className="space-y-8">
          {section.items.map((item) => (
            <li key={`${item.title}-${item.dates}`}>
              <Entry title={item.title} aside={<span className="figure">{item.dates}</span>} />
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );
    case "projects":
      return (
        <ul className="space-y-5">
          {section.items.map((project) => (
            <li key={project.href}>
              <Entry
                title={project.title}
                aside={
                  <Link
                    to="/work/$slug"
                    params={{ slug: project.href.slice("/work/".length) }}
                    aria-label={`View case study for ${project.title}`}
                    className={cn(buttonVariants({ variant: "link" }), "h-auto px-0 text-sm")}
                  >
                    {project.linkLabel}
                  </Link>
                }
              />
              <p className="text-sm text-muted-foreground">{project.summary}</p>
            </li>
          ))}
        </ul>
      );
    case "skills":
      return (
        <dl className="divide-y divide-border text-sm">
          {section.groups.map((group) => (
            <div key={group.label} className="grid gap-1 py-2 first:pt-0 last:pb-0 sm:grid-cols-4">
              <dt className="font-medium">{group.label}</dt>
              <dd className="text-muted-foreground sm:col-span-3">{group.line}</dd>
            </div>
          ))}
        </dl>
      );
    case "languages":
      return <p className="text-sm text-foreground/85">{section.line}</p>;
    case "education":
      return (
        <ul className="space-y-4">
          {section.items.map((item) => (
            <li key={item.degreeLine}>
              <Entry title={item.degreeLine} aside={<span className="figure">{item.dates}</span>} />
              <p className="text-sm text-muted-foreground">{item.location}</p>
            </li>
          ))}
        </ul>
      );
  }
}

function Entry({ title, aside }: { title: string; aside: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <p className="font-semibold">{title}</p>
      {aside}
    </div>
  );
}
