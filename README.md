# VC Analytical Dashboard

A read-only analytical dashboard built for the Vice Chancellor of Beaconhouse
National University (BNU). Covers 13 university-operations modules — Scholarships,
Admissions & Applications, Enrolled Students, Classes, Student Performance, Student
Life, DC Cases, E-Portal Cases, Hostel Accommodation, Faculty, Staff, Grants, and
Research/Partnerships/ORIP — grouped by category in a sidebar, plus an Overview
executive-summary landing page. Every module drills University-wide → School/
Department → Programme within the same page via a breadcrumb and filter bar. Finance
stays in the sidebar but renders an explicit "out of scope" placeholder.

**This build (Phase 1a) runs entirely on dummy data generated in the browser** —
no backend, no database, no live connection to BNU's SIS, HR, or e-Portal systems.
Login is a cosmetic single-VC screen; any credentials proceed.

> For agent/AI-assisted development context (architecture decisions, conventions,
> business rules), see [CLAUDE.md](CLAUDE.md) — this README is for humans getting the
> project running.

## Stack (Phase 1a)

- **Frontend:** Next.js 16 (App Router) + TypeScript, client-only
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config, no `tailwind.config.ts`)
- **Charts:** Recharts only — funnel via its native `FunnelChart`; gauges hand-built
  from `RadialBarChart`; no second charting library
- **Icons:** lucide-react
- **Package manager:** npm

No backend, database, or auth beyond the cosmetic login screen exists in this phase.
Phase 1b (Node/Next API routes + Knex.js + Oracle-compatible DB) is documented in
[CLAUDE.md](CLAUDE.md) as the future direction but has not been started.

## Prerequisites

- Node.js 20+ and npm

## Commands

```bash
npm install       # install dependencies
npm run dev        # dev server at http://localhost:3000
npm run build       # production build (verified clean — all 18 routes prerender static)
npm start           # serve the production build
npm run lint         # ESLint
```

There is no `npm test` — no test suite exists yet (`tests/` is still the scaffold
placeholder described in its own `CLAUDE.md`; writing one wasn't in scope for this
build).

Login: any username/password submits (cosmetic only — see `src/app/page.tsx`).

## Project structure

```
src/
  app/
    page.tsx                          # login screen
    (dashboard)/layout.tsx            # AuthGate + Sidebar + Topbar
    (dashboard)/overview/              # executive summary landing page
    (dashboard)/academics/            # scholarships, admissions, enrolled-students,
                                        # classes, student-performance, student-life
    (dashboard)/conduct/              # dc-cases, e-portal-cases
    (dashboard)/operations/hostel/
    (dashboard)/employees/            # faculty, staff
    (dashboard)/finance/              # out-of-scope placeholder
    (dashboard)/research/             # grants, partnerships
    (dashboard)/settings/, help/      # inert placeholders
  components/
    layout/                           # Sidebar, Topbar, UserBlock, NavGroup, AuthGate
    ui/                               # SummaryCard, ChartCard, DataTable, FilterBar,
                                        # Breadcrumb, Skeleton, EmptyState, PageHeader
    ui/charts/                        # Bar/Pie/Line/Funnel/Gauge/StackedBar chart-inner components
  lib/
    data/
      prng.ts                         # seeded PRNG (mulberry32) — DATA_SEED is fixed
      catalog/                        # static: schools+programmes, departments, hostels, scholarship types
      generators/                     # one file per module; students/faculty/staff are canonical rosters
      store.ts                        # getCanonicalData() singleton — assembles everything once
    services/                        # one async-shaped file per module (the "mock API" components call)
      businessRules.ts                # single source of truth for the 3 live-computed business rules
    utils/                            # date/format helpers
  hooks/
    useModuleFilters.ts               # the shared drill-down/filter/breadcrumb mechanism
    useAsync.ts                       # generic {data, loading, error} wrapper
  config/
    nav.ts                            # sidebar structure (single source of truth)
    theme.ts                          # BNU color tokens for charts (validated via the dataviz skill)
docs/                                 # SRS + per-directory CLAUDE.md context files
```

Every nested directory under `src/` has its own `CLAUDE.md` (matching this repo's
existing convention) with more detail than this README.

## What's complete

- All 13 data modules + Overview, each with: summary cards, charts (pie/donut/bar/
  stacked-bar/line/funnel/gauge as appropriate), a paginated read-only record table,
  and a filter bar with removable chips. No default date range is ever pre-applied.
- The University-wide → School/Department/Hostel → Programme drill-down, with a
  clickable breadcrumb, working identically whether triggered by a chart click or a
  filter-bar dropdown (**Enrolled Students** is the reference implementation every
  other module page copies).
- All three SRS business rules computed live from the underlying data, never stored:
  CGPA divisions (Student Performance), 7-day E-Portal auto-escalation, 6-month Grant
  end-date flagging.
- Cross-module data consistency: one canonical student/faculty/staff roster
  (`src/lib/data/store.ts`) that every derived module (DC Cases, Hostel, Scholarships,
  Admissions' "Enrolled" funnel stage, etc.) references rather than re-randomizing.
- Real BNU content: actual schools/programmes/departments from bnu.edu.pk, BNU's real
  brand colors (steel blue `#357694` / navy `#204b66`, pulled from the live site's
  CSS), and factual detail for the three flagship research initiatives (UNESCO Chair
  for Inclusion through Art, BCPR, Innovatrium).
- Login screen, loading skeletons, empty states, and a Finance placeholder — all
  verified in a real browser (Playwright) alongside a tablet-width (820px) responsive
  check.

## What's stubbed / out of scope

- **Finance** — renders only a static "out of scope for this phase" card, per the
  brief. No data, no charts.
- **Settings / Help** — inert sidebar entries (non-clickable in the sidebar itself,
  per "for visual completeness"); each has a placeholder page reachable by direct URL.
- **No test suite** — `tests/` remains the scaffold placeholder; writing tests wasn't
  requested for this build.
- **No backend/API/DB** — by design for Phase 1a; see CLAUDE.md for the Phase 1b plan.

## Assumptions and speculative content (flag these before treating as final)

- **Student Life** and **Research, Partnerships & ORIP** are built per direct product
  instruction, but full-document extraction of the SRS confirmed **neither is
  actually specified anywhere in its body** — both exist only as names in a
  category table and table-of-contents entry, with the SRS's own footnote admitting
  no spec was written. Treat their content (societies/events for Student Life;
  publications/grants/MoUs for Research) as illustrative, not requirements-derived.
  The three flagship research initiatives are the exception — those are real,
  confirmed facts from bnu.edu.pk, not invented.
- **Hostel names** (Bedian, Safari, BNU Hostel) come from the SRS's own data model.
  BNU's real public site only shows generic "Boys Hostel"/"Girls Hostel" — the SRS
  names are used as the working spec since the SRS is the internal requirements
  source. On/off-campus assignment and capacities are this build's own assumption
  (not stated in the SRS).
- **CGPA below 2.00** has no defined division in the SRS (Division 1 starts at
  2.00) — mapped to an explicit `Unclassified` bucket.
- **Scholarships "total disbursed"** renders as a summary card, not a map — the SRS
  (FR-SCH-03) leaves this open; a card was chosen as the simpler, more directly
  useful treatment.
- **Fall vs Spring intake**: BNU's live site currently advertises a Fall-only
  admissions cycle, but the SRS's own Enrolled Students data model requires a
  Fall/Spring split — Spring is generated as a smaller secondary intake (~18% of
  Fall) to satisfy that requirement plausibly.
- **"Rankings, Quality & Compliance"** and **"Campus Operations & Sustainability"**
  (also named in the SRS's table of contents but unspecified in its body, and not
  part of the requested sidebar) are excluded entirely — no stub pages.
- Full list, including every Phase 1a architecture decision, lives in root
  [CLAUDE.md](CLAUDE.md) under "Assumptions made (Phase 1a build)" and "Open items".

## Status

Phase 1a frontend prototype — feature-complete against the approved build plan,
`npm run build` verified clean (zero TypeScript/ESLint errors, all 18 routes
prerender as static content), and manually click-tested in a real browser.
