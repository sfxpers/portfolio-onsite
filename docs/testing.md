# Testing

Seam-first: Vitest covers public module seams; Playwright covers pages after a real build.

## Vitest owns

- Catalog **product rules** (shape, bands, degree-only education, technical depth, body alternation) — not biography or URL literals
- Resume print-HTML smoke (headings, absolute project links, escapes, degree-only forbids)
- Committed Resume PDF byte-lock (`vp run resume:pdf` regenerates it; `vp test` fails on drift)

## Playwright owns

- Journeys, titles, 404s, primary chrome
- Home mobile fit; Home Profile must not surface Karachi
- axe on Home, Case Study, and Resume
- PDF HTTP serve + removal of `/resume/ats.html`
- The OS colour scheme and `prefers-reduced-motion`

## Do not add

- RTL tests that re-read Catalog strings from the DOM
- Intermediate Resume view-model tests that duplicate print-HTML or page e2e
- Hover/focus color idiom locks
- Exact copy locks that only fail on intentional Catalog edits
