# src/hooks/ — Shared Hooks

See [src/CLAUDE.md](../CLAUDE.md) and [root CLAUDE.md](../../CLAUDE.md) for context.

## `useModuleFilters`

The single mechanism every module page uses to implement University-wide →
School/Department → Programme drill-down, filter chips, and the breadcrumb.
Parameterized per module by an ordered `levels: DrillLevelConfig[]` array (e.g.
school→programme for most modules; department-only for Staff/Grants; hostel-only for
Hostel). Exposes `{ filters, breadcrumb, setFilter, jumpToBreadcrumb, resetAll }`.

**Do not add a second way to change a drill-defining filter.** Both `FilterBar`
dropdowns and `ChartCard` segment clicks must call the same `setFilter(key, value)` —
this is what guarantees drilling via a chart and drilling via the filter bar can never
produce different breadcrumb/filter states. `initialFilters` must never set
`dateFrom`/`dateTo` for any module — no default date range, ever (root CLAUDE.md
Conventions).

## `useAsync`

Generic `{ data, loading, error }` wrapper around a service-layer call. On
first mount, `data` is `undefined` and the caller should render a full skeleton; on
subsequent filter/drill changes, previous `data` stays rendered (at reduced opacity)
while `loading` flips true, rather than flashing a full skeleton on every click.

## Status

Both hooks are built once, alongside the Enrolled Students reference implementation,
and reused unchanged by every other module page.
