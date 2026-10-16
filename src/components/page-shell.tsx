import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site-chrome";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome />
      <main className="mx-auto max-w-5xl px-5 pb-24">{children}</main>
    </>
  );
}
