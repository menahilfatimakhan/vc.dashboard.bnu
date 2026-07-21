# tools/ — Dev Utilities & Scripts

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

Internal developer utilities and helper scripts — things a person or a workflow runs
by hand or via `npm run <script>`, as opposed to app runtime code. Primary use case
for this project: **dummy-data generators/seeders** for the 11 modules, and
chart-config helpers.

## What belongs here / what does not

- **Belongs:** dummy-data seed scripts (one per module or one orchestrator that
  seeds all 11), chart-config/color-scale helper scripts, any local dev convenience
  script (e.g. reset-dev-db).
- **Does not belong:** application/API route code, CI pipeline definitions (those go
  in [workflows/](../workflows/CLAUDE.md) even if a workflow *calls* a script from
  here), test code (goes in [tests/](../tests/CLAUDE.md)).

## Conventions

- Name seed scripts after the module ID prefix they seed, e.g. `seed-dc.ts`,
  `seed-sch.ts`, `seed-ep.ts` — matching the prefixes in the
  [root CLAUDE.md module index](../CLAUDE.md#module-index).
- An orchestrator script (`seed-all.ts` or similar) should call the per-module
  seeders rather than duplicating logic.
- Seed data must respect the business rules in the
  [root CLAUDE.md](../CLAUDE.md#business-rules-to-respect) (CGPA divisions, e-Portal
  7-day escalation, grants 6-month flagging) so the dummy data exercises those rules
  realistically.
- Seed scripts write to the dev/demo database configured via [env/](../env/CLAUDE.md)
  — never to a production-like target, since none exists in Phase 1.

## Status

No scripts exist yet — this is currently an empty structural placeholder
(`.gitkeep`). Expected entry point once implemented: `npm run seed` (see
[root CLAUDE.md](../CLAUDE.md#commands)).

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Seed scripts are invoked by the seed workflow in [workflows/](../workflows/CLAUDE.md).
- Seed scripts use connection config from [env/](../env/CLAUDE.md).
