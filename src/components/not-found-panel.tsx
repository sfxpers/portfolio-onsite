import { Link } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";

export function NotFoundPanel({ title, description }: { title: string; description: string }) {
  return (
    <PageShell>
      <div className="max-w-xl py-16">
        <p className="figure">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
        <Link to="/" className="mt-8 button-primary">
          Go to the home page
        </Link>
      </div>
    </PageShell>
  );
}
