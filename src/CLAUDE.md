# src/ — Phase 1a Application Source

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

All Next.js application source for the Phase 1a client-only prototype: routes,
components, the dummy-data layer, and shared hooks/config. Nothing here talks to a
real backend — see root CLAUDE.md's Architecture summary for the Phase 1a/1b split.

## Subdirectories

| Directory | Purpose |
|---|---|
| [app/](app/CLAUDE.md) | Next.js App Router routes — one route per module, grouped under a `(dashboard)` layout |
| [components/](components/CLAUDE.md) | Shared layout chrome and reusable UI primitives (cards, charts, tables, filters) |
| [lib/](lib/CLAUDE.md) | Dummy-data generators/catalogs and the async-shaped mock service layer |
| [hooks/](hooks/CLAUDE.md) | Shared React hooks — the drill-down/filter mechanism and async data-fetch wrapper |
| `config/` | `nav.ts` (sidebar structure, single source of truth) and `theme.ts` (BNU color tokens for charts) |

## Conventions

- Every module's generator, service, and type is named/prefixed with its stable ID
  (`ENR`, `EP`, `GRT`, `STL`, `RES`, ...) per the root CLAUDE.md module index, even
  though routes themselves use readable kebab-case.
- Components never import from `lib/data/generators` or `lib/data/store` directly —
  always go through `lib/services/*`, so a real API can later replace a service
  file's body without touching any component.
- The **Enrolled Students** page (`app/(dashboard)/academics/enrolled-students/page.tsx`)
  is the reference implementation of the shared filter/drill-down/table pattern —
  copy its shape for new modules rather than reinventing it.

## Status

Scaffolded via `create-next-app` (App Router, TypeScript, Tailwind v4, `src/` dir).
Being built out module-by-module per the approved implementation plan.
