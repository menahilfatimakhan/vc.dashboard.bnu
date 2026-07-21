# error_handling/ — Error Types, Handlers & Logging

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

Centralized error taxonomy, custom error types, a shared handler pattern, and
logging conventions used across the app. Module code (API routes, data-access
layer) should throw/handle errors defined here rather than inventing ad hoc error
shapes per module.

## What belongs here / what does not

- **Belongs:** custom `Error` subclasses (e.g. a `NotFoundError`, `ValidationError`,
  `DataAccessError`), a central error-handler (e.g. Next.js API middleware that maps
  error types to HTTP responses), logging setup/conventions (log levels, structured
  log shape).
- **Does not belong:** module-specific business logic — this directory defines the
  *shape* of errors and how they're handled/logged, not what triggers them.

## Conventions

- Since this is a **read-only** dashboard, the dominant error classes are expected
  to be: data-access failures (DB unreachable, query error), not-found (bad
  module/ID reference), and validation failures on query params (e.g. malformed
  date-range filters). There is no write-path, so mutation-conflict error types are
  out of scope.
- Errors should carry enough context to trace back to a module (use the module ID
  prefix — `DC`, `SCH`, `ADM`, etc. — from the
  [root CLAUDE.md module index](../CLAUDE.md#module-index)) without leaking
  sensitive data into logs or client-facing messages.
- Logging conventions here are the single source of truth — don't set up ad hoc
  `console.log`/logger instances in module code.

## Status

No error types or handlers exist yet — this is currently an empty structural
placeholder (`.gitkeep`).

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Referenced from module code guidelines wherever they're written — all API routes
  and data-access code should route errors through this directory's patterns.
- Error scenarios should have corresponding coverage in [tests/](../tests/CLAUDE.md).
