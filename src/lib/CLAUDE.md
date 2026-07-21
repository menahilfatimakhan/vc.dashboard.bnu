# src/lib/ — Dummy Data Layer & Services

See [src/CLAUDE.md](../CLAUDE.md) and [root CLAUDE.md](../../CLAUDE.md) for context.

## Important: this is application runtime code, not `tools/`

Everything under `data/` runs **in the browser** at import time to generate the
dashboard's dummy data — it is not a database seed script. [tools/](../../tools/CLAUDE.md)
is scoped to Phase 1b DB-seeding scripts and is intentionally unused right now; do not
move generators there.

## `data/`

- `prng.ts` — seeded PRNG (`seededRandom(seed)`, mulberry32-based). Fixed
  `DATA_SEED` constant, never `Date.now()`. Every generator gets its own PRNG
  instance at `DATA_SEED + <fixed offset>` so one generator's changes can't shift
  another's draws — offsets are listed in `store.ts`, keep them stable.
- `types.ts` — shared TypeScript types for every module's records.
- `catalog/` — static, hand-authored data: `schools.ts` (the 8 real BNU schools with
  their real confirmed programmes), `departments.ts`, `hostels.ts` (Bedian, Safari,
  BNU Hostel — see root CLAUDE.md's assumptions on this naming), `scholarshipTypes.ts`.
- `generators/` — one file per module. `students.ts`, `faculty.ts`, `staff.ts` are the
  **canonical rosters**, generated once; every other generator takes the relevant
  roster as an input and references real entries from it (never re-randomizes its own
  disconnected counts) — this is what keeps the same student reconciling across
  Overview/Enrolled Students/Performance/DC Cases/Hostel/Scholarships.
- `store.ts` — `getCanonicalData()`, a module-level singleton assembling every
  catalog + roster + derived generator exactly once per process/session.

## `services/`

One async-shaped file per module (e.g. `enrolledStudentsService.ts`), each function
`await simulateDelay()` then filters/aggregates `getCanonicalData()`. This is the
**only** layer components should import from — swapping in a real API later means
rewriting a service file's body, not touching any component.

- `businessRules.ts` — the single source of truth for all 3 live-computed rules:
  `getCgpaDivision`, `getDaysOpen`/`getEPortalStatus`, `isGrantEndingSoon`. Every
  other file must call into this rather than reimplementing the logic. Nothing here
  is ever stored as a precomputed field — always derived from the underlying date/
  number at call time.
- `simulateDelay.ts`, `paginate.ts`, `groupCount.ts` — small shared helpers.

## `utils/`

`date.ts` (hand-rolled `daysBetween`/`monthsBetween`, no date library dependency),
`format.ts` (number/currency/date display formatting), `color.ts`.

## Status

Being built bottom-up per the approved plan: PRNG → catalogs → rosters → `store.ts` →
derived generators → `businessRules.ts` → services, one module at a time.
