# docs/ — SRS, Module Specs, ADRs, Diagrams

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

Home of the Software Requirements Specification (SRS), per-module specs,
architecture decision records (ADRs), and diagrams. This is the authoritative
source for *why* the system is shaped the way it is — the root
[CLAUDE.md](../CLAUDE.md) summarizes; this directory is where the detail lives.

## What belongs here / what does not

- **Belongs:** the SRS, per-module functional-requirement specs (`FR-<MODULE>-<n>`
  definitions), ADRs recording significant technical decisions and their rationale,
  architecture/data-flow diagrams.
- **Does not belong:** code of any kind, dummy data, or generated build output.

## Conventions

- `SRS.md` — the full Software Requirements Specification. **Not yet placed** — see
  Status below.
- `modules/` — one file per module, named after its ID prefix (e.g. `modules/ep.md`
  for E-Portal Cases), covering that module's specific requirements, fields, and
  business rules beyond what's summarized in the root
  [CLAUDE.md](../CLAUDE.md#business-rules-to-respect).
- `adr/` — one file per decision, e.g. `adr/0001-nextjs-knex-stack.md`, recording
  the decision, context, and consequences. Number sequentially.
- `diagrams/` — architecture/data-flow diagrams (source files and/or exported
  images).

## Status — SRS in place

The SRS is in this repo at `docs/VC_Analytical_Dashboard_SRS_V4.docx` (not `docs/SRS.md`
as originally planned — kept as the source .docx rather than converted, since it's
versioned by the authoring team; note its filename says "V4" but its own title page
and footer say "v2.0," an inconsistency in the source document itself, not this repo).

Cross-check against the root [CLAUDE.md](../CLAUDE.md) is done: the three business
rules (CGPA divisions, E-Portal 7-day escalation, Grant 6-month flagging) matched the
brief exactly. One material gap found: the SRS's table of contents and category table
name **15** modules, but only **11** have an actual data model/requirements section in
the document body — Research/Partnerships/ORIP, Student Life, Rankings/Quality/
Compliance, and Campus Operations exist only as names, with an authorial footnote
admitting no spec was written for them. Student Life and Research/Partnerships/ORIP
are built anyway per direct product instruction and flagged as speculative in the
README; the other two are out of scope for this build (see root CLAUDE.md Scope
guardrails). The SRS also references an "FR-NAV" requirement series (shared filter
panel/drill-down mechanics) and Sections 3.16/3.17 that are cited throughout but never
actually defined in the document — this gap is filled by the product's own drill-down
requirements as given directly, not by the SRS text.

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Test requirement-ID references in [tests/](../tests/CLAUDE.md) trace back to specs
  defined here.
- ADRs here should be consulted before changing anything documented in the
  [root CLAUDE.md architecture summary](../CLAUDE.md#architecture-summary).
