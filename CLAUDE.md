# VC Analytical Dashboard — Root Context

Read this file first in any session. It is the master context for the repo; every
subdirectory has its own `CLAUDE.md` with local detail — read that too before editing
files in that subtree.

## Project overview

A **read-only analytical dashboard** built for the **Vice Chancellor (VC) of Beaconhouse
National University (BNU)**. Single role, single user type — there is no multi-role
auth model to design for. The VC views aggregated/tabular data across university
operations; the dashboard never writes back to source systems.

**Phase 1 constraint:** all data is **dummy/seed data**, generated and stored locally.
There is **no live integration** with BNU's SIS, HR, or e-Portal systems yet. Every
module must be built against a schema that could plausibly later be pointed at those
real systems, but no such connection exists today.

## Scope guardrails

- **In scope:** the 13 data modules listed below, plus the Overview landing page.
- **Out of scope:** Finance, in its entirety. It stays in the sidebar for structural
  completeness only, rendering a clean "out of scope for this phase" state — do not
  add finance-adjacent fields, charts, or metrics anywhere, even as a placeholder.
  "Rankings, Quality & Compliance" and "Campus Operations & Sustainability" (named in
  the SRS's table of contents/category table but never specified in its body) are
  also out of scope — no stub pages for either.
- **No live integrations in Phase 1.** Anything that looks like a connector to SIS/HR/
  e-Portal is a future-phase concern — stub it only if explicitly asked.
- **Read-only.** No create/update/delete flows against module data, anywhere, ever.

## Architecture summary

This project is being built in two sub-phases; keep them distinct rather than
treating the eventual backend as already wired up:

- **Phase 1a — client-only prototype (current):** Next.js (App Router) + TypeScript,
  sidebar-grouped navigation with University → School/Department → Programme
  drill-down within each module (not a flat tabbed layout — see Conventions). No
  backend, no database, no auth beyond a cosmetic login screen. All dummy data lives
  as typed generator/fixture modules under `src/lib/data/`, served through an
  async-shaped mock service layer under `src/lib/services/` per module, so a real API
  can later replace a service file's body without touching any component. Styling:
  Tailwind CSS. Charts: Recharts only (funnel via its native `FunnelChart`; gauges
  custom-built from `RadialBarChart` — no second charting library). Icons:
  lucide-react. Package manager: npm.
- **Phase 1b — live integration (future, not started):** Node.js backend via Next.js
  API routes, Knex.js as the query builder — chosen over an ORM (e.g. Prisma)
  specifically for its solid **Oracle DB** driver support, since Oracle compatibility
  is a stated plus for this project. A local dev database (see
  [env/CLAUDE.md](env/CLAUDE.md)) seeded via scripts in [tools/](tools/CLAUDE.md)
  would replace the Phase 1a mock service layer module-by-module. **This phase has
  not started** — do not add API routes, a database connection, or Knex usage without
  an explicit decision to begin Phase 1b.

Application source for Phase 1a lives under `src/` — see [src/CLAUDE.md](src/CLAUDE.md).

## Repository map

| Directory | Purpose |
|---|---|
| [src/](src/CLAUDE.md) | Phase 1a application source — Next.js app, components, dummy-data layer, hooks |
| [workflows/](workflows/CLAUDE.md) | CI/CD pipelines and repeatable process/automation workflows |
| [tools/](tools/CLAUDE.md) | Dev utilities — Phase 1b DB seed scripts (not used in Phase 1a), chart-config helpers |
| [error_handling/](error_handling/CLAUDE.md) | Centralized error types, handler pattern, logging conventions |
| [tests/](tests/CLAUDE.md) | Unit / integration / e2e tests and fixtures |
| [assets/](assets/CLAUDE.md) | Static assets — images, icons, fonts, brand |
| [docs/](docs/CLAUDE.md) | SRS, per-module specs, ADRs, diagrams |
| [env/](env/CLAUDE.md) | Environment configuration and `.env.example` templates (no secrets) |
| `.tmp/` | Ephemeral scratch space, gitignored — see [.tmp/CLAUDE.md](.tmp/CLAUDE.md) |

## Module index

Sidebar structure, top to bottom: **Overview** (executive summary landing page) above
the grouped categories; **Settings** and **Help** below them (inert, cosmetic only).
13 data modules, each with a stable ID prefix used in requirement IDs (`FR-<MODULE>-<n>`)
and used consistently in code (route names, generator/service file names, test IDs):

| Prefix | Module | Category |
|---|---|---|
| `SCH` | Scholarships | Academics |
| `ADM` | Admissions / Applications | Academics |
| `ENR` | Enrolled Students | Academics |
| `CLS` | Classes | Academics |
| `PERF` | Student Performance | Academics |
| `STL` | Student Life | Academics |
| `DC` | DC Cases | Conduct & Support |
| `EP` | E-Portal Cases | Conduct & Support |
| `HST` | Hostel Accommodation | Operations |
| `FAC` | Faculty | Employees |
| `STF` | Staff | Employees |
| `GRT` | Grants | Research |
| `RES` | Research, Partnerships & ORIP | Research |

Finance is **not** a data module and must stay that way — see Scope guardrails above.

**`STL` (Student Life) and `RES` (Research, Partnerships & ORIP) are not specified in
the SRS** — full-document extraction confirmed both exist only as names in a category
table and table-of-contents entry, with an explicit authorial footnote admitting no
spec was written for them. Both are built anyway per direct product instruction (light
speculative content: societies/events/participation for Student Life; publications
trend, grants Applied vs Won, MoUs, and the three real flagship initiatives — UNESCO
Chair for Inclusion through Art, BCPR, Innovatrium — for Research/Partnerships/ORIP).
Both are marked as speculative/pending-specification in the README and in-page.

## Business rules to respect

These are cross-cutting rules referenced by more than one module — keep any
implementation consistent with them:

- **CGPA divisions** (Student Performance / `PERF`):
  - Division 1: 2.00–2.99
  - Division 2: 3.00–3.49
  - Division 3 / top: 3.50–4.00
- **E-Portal auto-escalation** (`EP`): a case auto-escalates after **7 days**
  unresolved.
- **Grants flagging** (`GRT`): a grant is flagged when its end date falls **within 6
  months** of the current date.

## Conventions

- **Requirement-ID references:** cite requirements as `FR-<MODULE>-<n>` (e.g.
  `FR-EP-3`), matching the SRS in `docs/`.
- **Sidebar + drill-down, not flat tabs:** each module is its own page, grouped under
  its category in the sidebar (see Module index). Within a module, the VC drills
  University-wide → School/Department → Programme **inside the same page** via a
  clickable breadcrumb and filter chips — never by switching pages. See
  [src/CLAUDE.md](src/CLAUDE.md) for the shared `useModuleFilters` mechanism every
  module page uses to implement this identically.
- **No default date range:** trend/date-filtered views must not pre-select a date
  range on load — this is a deliberate product decision, not an oversight.
- **Naming:** use each module's ID prefix consistently across routes, generator/
  service file names, and test names.

## Commands

```bash
npm install          # install dependencies
npm run dev           # run the Next.js dev server
npm run build         # production build
npm run lint           # lint
```

`npm test` is not yet wired up — no test suite exists (see [tests/CLAUDE.md](tests/CLAUDE.md));
writing one wasn't in scope for the Phase 1a build. `npm run seed` (Phase 1b only,
see Architecture summary) is similarly not wired up in Phase 1a —
dummy data is generated in-browser at runtime by `src/lib/data/`, not seeded into a
database.

## How to work in this repo

- Read the relevant directory's `CLAUDE.md` before editing files in that subtree.
- **Update the relevant context file whenever you change how a directory works** —
  context files must stay current, not describe a past state.
- Use [.tmp/](.tmp/CLAUDE.md) for scratch/throwaway files. Nothing in `.tmp/` is a
  source of truth and it is gitignored.
- Never commit secrets or real data. `env/` holds templates only — see
  [env/CLAUDE.md](env/CLAUDE.md).
- This session (repo init) is structure-and-context only — no application logic has
  been written yet. Don't assume implementation exists just because a directory does.

## Open items

Carried over from the SRS as unresolved — flag these rather than silently deciding:

- **Platform reach:** SRS explicitly lists this as unconfirmed. Phase 1a targets
  browser down to tablet width; mobile degrades gracefully but isn't a priority.
- **Refresh frequency:** how often should dashboard data refresh — TBD, deferred to
  Phase 1b per the SRS.
- **Data fields:** the exact fields per module are assumed (per the SRS's own
  wording, "assumed pending confirmation against the eventual source schema").
- **Scholarships total-disbursed view:** SRS FR-SCH-03 leaves summary-card vs
  map-based treatment unconfirmed — Phase 1a uses a summary card (assumption).

## Assumptions made (Phase 1a build)

- Stack pivot confirmed for Phase 1a: Next.js (App Router) client-only, no Knex/DB/API
  routes yet — see Architecture summary. Phase 1b keeps the original Knex/Oracle plan.
- Hostel names use the SRS's own data-model examples (Bedian, Safari, BNU Hostel) —
  BNU's real public site only shows generic "Boys Hostel"/"Girls Hostel," so the SRS's
  named examples are treated as the working internal data model.
- CGPA below 2.00 has no defined division in the SRS (Division 1 starts at 2.00) — an
  explicit `Unclassified` bucket is used for that range.
- Context-file convention: nested `CLAUDE.md` per directory (not `README.md`), per
  explicit choice.
- Environments: `dev` and `demo`, both dummy-data only; `.env.example` template only,
  no real `.env` committed. Unused in Phase 1a.
- SRS is now placed in `docs/` — see [docs/CLAUDE.md](docs/CLAUDE.md) Status section.
