# src/components/ — Layout Chrome & UI Primitives

See [src/CLAUDE.md](../CLAUDE.md) and [root CLAUDE.md](../../CLAUDE.md) for context.

## Purpose

- `layout/` — the authenticated shell: `Sidebar`, `Topbar`, `UserBlock`, `NavGroup`,
  `AuthGate` (cosmetic session check — any credentials proceed, gate is client-side
  only, see [app/CLAUDE.md](../app/CLAUDE.md)).
- `ui/` — the reusable primitives every module page composes: `SummaryCard`,
  `ChartCard` (+ `charts/*ChartInner.tsx` variants: pie, donut, bar, line, funnel,
  gauge), `DataTable`, `FilterBar`/`FilterChip`, `Breadcrumb`, `Skeleton`,
  `EmptyState`, `PageHeader`.

## Conventions

- **Read the `dataviz` skill before touching any chart or color code** — `ChartCard`
  and its chart-inner variants are the single place chart color tokens are wired in;
  changing them without the skill's mark/palette rules risks breaking the "one
  system" look across all 13 modules.
- Components in `ui/` must stay data-shape-agnostic — they take typed props
  (`data`, `columns`, `filters`, `config`) and never import from `lib/data` or
  `lib/services` directly. Only page-level components (`app/**/page.tsx`) call the
  service layer and pass results down.
- `ChartCard.onSegmentClick` and `FilterBar.onChange` share the same signature
  (`(key: string, value: string | undefined) => void`) so both feed the same
  `useModuleFilters().setFilter` — this is what keeps chart-driven and
  filter-bar-driven drill-down from desyncing.
- Visual language: white surfaces, `rounded-2xl`, `border-black/5`, `shadow-sm`,
  generous padding — matches `assets/images/Dashboard_Inspiration.jpeg`'s structure,
  restyled with BNU's brand colors from `src/config/theme.ts`.

## Status

Being built bottom-up: `Skeleton`/`EmptyState` first, then `SummaryCard`/`Breadcrumb`/
`FilterBar`/`DataTable`, then `ChartCard` and its 5 chart variants, then the layout
shell — see the approved plan's build sequence.
