# Coding standards

The judgement calls a reviewer checks. Anything mechanical is a check instead: `vp check`, which formats, lints, and type checks; `scripts/check-tokens.mjs` (no colour or arbitrary value outside `src/styles.css`, and spacing on the 4px grid); the tests; and CI (`.github/workflows/check.yml`). The Resume PDF workflow prints the committed PDF on Linux.

## Sources of truth

GitHub Issues, then `docs/adr/`, then `GLOSSARY.md`, for decisions and words. The Catalog is the record of facts. Name things with the glossary's terms and none of its _Avoid_ words. A change that contradicts an ADR waits for approval. ADR-0001 is the visual direction. ADR-0002 is the PDF. ADR-0003 is the voice.

## Stack first

Use Cloudflare Workers, TanStack Start, and shadcn before writing code or adding a library. This site has no database and no accounts. Custom code that stays carries one line saying why the stack cannot do it.

## Design

- shadcn first: a component shadcn has is added with its CLI and used as written; it changes only through the tokens in `src/styles.css` and its variants.
- Light neutrals are the authored default. The same tokens follow `prefers-color-scheme`. There is no theme toggle and no `.dark` class.
- Geist only. Teal is for links, focus, and actions, not for identity.
- A link that goes to a page is a link. A button is the one action on the screen. A row of buttons that only navigate is a list of links.
- Copy uses the glossary's words and ADR-0003's voice.

## Shape

- A fact about Identity, a Case Study, or the Resume lives in the Catalog. The on-site page and the PDF both read it.
- An abstraction earns its place by removing duplication in three or more places.
- Config states only what differs from a default.

## Tests

- Unit tests assert Catalog rules and that the print adapter renders the Resume view.
- The committed PDF's bytes are compared on Linux. A Mac skips that comparison, because Chromium prints different bytes there (ADR-0002).
- Smoke tests cover the journeys, the preferences, and axe in light and dark, in the installed Chrome, against the preview server.

## Commits

One concern per commit, and every check passes after each.
