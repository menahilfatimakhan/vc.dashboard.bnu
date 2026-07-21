# env/ — Environment Configuration

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

Environment configuration and templates for the two Phase 1 environments: **dev**
(local development) and **demo** (stakeholder-facing, still dummy data). Provides
the `.env.example` template that documents every configuration variable the app
needs — never real values.

## What belongs here / what does not

- **Belongs:** `.env.example` (committed, placeholder values only), documentation of
  what each environment variable means and which environments need it.
- **Does not belong:** an actual `.env` file with real values, database credentials,
  API keys, or any secret — **never commit these**. Root [.gitignore](../.gitignore)
  blocks `.env` and `env/.env*` (except `.env.example`) for this reason, but don't
  rely on gitignore alone — never stage a real env file.

## Environments

Two environments for Phase 1, both running against dummy data only:

- **dev** — local development, run on a developer's machine.
- **demo** — stakeholder-facing demo instance, still Phase 1 dummy data, no live
  BNU system integration.

There is no `staging` or `prod` environment yet — Phase 1 has no live-data target.

## Conventions

- `.env.example` lists every variable the app reads, with a placeholder value and an
  inline comment explaining its purpose — treat it as living documentation, not just
  a template.
- Real per-environment files (`.env`, or a future `.env.dev` / `.env.demo`) are
  created locally/in CI secrets storage and are never committed.
- Database config should be shaped to work against the dev/demo dummy-data database
  described in the [root CLAUDE.md architecture summary](../CLAUDE.md#architecture-summary)
  — keep variable names generic enough to later point at Oracle without renaming
  (e.g. `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, not
  Postgres-specific names), since Oracle compatibility is a stated project goal.

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Consumed by Knex database config, seed scripts in [tools/](../tools/CLAUDE.md),
  and the deploy workflow in [workflows/](../workflows/CLAUDE.md).
