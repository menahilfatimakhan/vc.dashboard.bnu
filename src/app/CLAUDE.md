# src/app/ — Next.js App Router Routes

See [src/CLAUDE.md](../CLAUDE.md) and [root CLAUDE.md](../../CLAUDE.md) for context.

## Purpose

Route definitions only. `page.tsx` at the app root is the cosmetic login screen; every
dashboard route lives under the `(dashboard)/` route group, which applies the
authenticated shell (sidebar + topbar) via its own `layout.tsx` without adding a URL
segment.

## Structure

- `(dashboard)/overview/` — executive summary landing page.
- `(dashboard)/academics/{scholarships,admissions,enrolled-students,classes,student-performance,student-life}/`
- `(dashboard)/conduct/{dc-cases,e-portal-cases}/`
- `(dashboard)/operations/hostel/`
- `(dashboard)/employees/{faculty,staff}/`
- `(dashboard)/finance/` — placeholder only, no charts, no data.
- `(dashboard)/research/{grants,partnerships}/`
- `(dashboard)/settings/`, `(dashboard)/help/` — inert, cosmetic only.

## Conventions

- Every module `page.tsx` is a client component (`'use client'`) that composes
  `useModuleFilters` + `useAsync` + the shared UI primitives from
  [components/ui](../components/CLAUDE.md) — see the Enrolled Students page for the
  reference shape.
- No API routes exist or should be added in Phase 1a (see root CLAUDE.md Architecture
  summary) — all data comes from `src/lib/services/*`.
- Route segment names are readable kebab-case; they map to module ID prefixes via
  `src/config/nav.ts`, not by name-matching.

## Status

`layout.tsx`, `globals.css`, and the login `page.tsx` are scaffolded. Dashboard routes
are being added module-by-module per the build sequence in the approved plan.
