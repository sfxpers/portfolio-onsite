import { Link } from "@tanstack/react-router";

import { identity } from "@/catalog/portfolio";

export function SiteChrome() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4">
        <Link to="/" className="leading-tight">
          <span className="block text-sm font-semibold">{identity.name}</span>
          <span className="block text-xs text-muted-foreground">{identity.role}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <nav aria-label="Primary">
            <Link
              to="/resume"
              className="hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              Resume
            </Link>
          </nav>
          <nav aria-label="Contact" className="flex flex-wrap gap-x-5 gap-y-1">
            {identity.contact.map((link) => (
              <a
                key={link.kind}
                href={link.href}
                className="hover:text-foreground"
                {...(link.kind === "email" ? {} : { target: "_blank", rel: "noreferrer" })}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
