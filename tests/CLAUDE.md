# tests/ — Unit, Integration & E2E Tests

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

All automated tests and their fixtures: unit tests for individual functions/
components, integration tests for API routes and data-access code, and end-to-end
tests for full user flows through the tabbed dashboard.

## What belongs here / what does not

- **Belongs:** test files, test fixtures/mock data, test-only helper utilities
  (test setup, custom matchers).
- **Does not belong:** dummy-data *seed* scripts used to populate a running dev/demo
  database — those live in [tools/](../tools/CLAUDE.md), even though both deal in
  fake data. Fixtures here are static/inline test inputs; seeders there populate a
  live DB.

## Conventions

- **Layout:**
  - `unit/` — pure functions, individual components, isolated logic
  - `integration/` — API routes + data-access layer, likely against a test DB
  - `e2e/` — full flows through the tabbed UI (e.g. "VC opens E-Portal Cases tab,
    sees escalated cases")
  - `fixtures/` — shared static test data, organized by module ID prefix where
    practical (e.g. `fixtures/ep/`, `fixtures/grt/`)
- **Requirement traceability:** where a test verifies a specific functional
  requirement, reference its ID in the test name or a comment, e.g.
  `it('escalates e-portal cases after 7 days unresolved (FR-EP-3)', ...)`. This
  keeps tests traceable back to the SRS in [docs/](../docs/CLAUDE.md).
- Since the dashboard is **read-only**, expect test coverage to skew toward query
  correctness, filtering/aggregation logic, and rendering — not mutation/write-path
  tests.

## Status

No tests exist yet — this is currently an empty structural placeholder (`.gitkeep`
in each of `unit/`, `integration/`, `e2e/`, `fixtures/`).

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Run via the test workflow in [workflows/](../workflows/CLAUDE.md) and via
  `npm test` (see [root CLAUDE.md](../CLAUDE.md#commands)).
- Error-handling scenarios should be exercised using patterns from
  [error_handling/](../error_handling/CLAUDE.md).
