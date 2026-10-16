import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { PageShell } from "@/components/page-shell";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundPanel({ title, description }: { title: string; description: string }) {
  return (
    <PageShell>
      <div className="max-w-xl py-16">
        <p className="figure">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
        <Link to="/" className={cn(buttonVariants(), "mt-8")}>
          Go to the home page
        </Link>
      </div>
    </PageShell>
  );
}
