# workflows/ — CI/CD & Process Automation

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

CI/CD pipeline definitions and repeatable process/automation workflows: build, test,
lint, dummy-data seeding, and deployment. This is where "run X on every push" and
"run Y before every release" live.

## What belongs here / what does not

- **Belongs:** CI pipeline configs (e.g. GitHub Actions YAML once a CI provider is
  chosen), scripted release/deploy processes, scheduled automation (e.g. periodic
  dummy-data refresh for the demo environment).
- **Does not belong:** one-off dev scripts a person runs manually and interactively —
  those go in [tools/](../tools/CLAUDE.md). If it's triggered by an event (push, PR,
  schedule) rather than run by hand, it belongs here.

## Conventions

- One file (or one clearly-scoped subfolder) per workflow — a build workflow, a test
  workflow, a lint workflow, a seed workflow, a deploy workflow. Don't collapse
  unrelated concerns into a single monolithic pipeline file.
- Name files after what they do, not when they run (`test.yml`, not `on-push.yml`).
- Stub placeholders are fine until the CI provider is chosen — note the assumption
  in the file rather than guessing silently.

## Status

No CI provider has been chosen yet — this is currently an empty structural
placeholder (`.gitkeep`). Expected eventual contents, one workflow each:

- **build** — install deps, type-check, build the Next.js app
- **test** — run unit/integration/e2e suites (see [tests/](../tests/CLAUDE.md))
- **lint** — run linting/formatting checks
- **seed** — populate dummy data into dev/demo databases (see [tools/](../tools/CLAUDE.md))
- **deploy** — deploy to the demo environment (see [env/](../env/CLAUDE.md))

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Seed workflow wraps scripts defined in [tools/](../tools/CLAUDE.md).
- Test workflow runs suites defined in [tests/](../tests/CLAUDE.md).
- Deploy workflow targets environments defined in [env/](../env/CLAUDE.md).
