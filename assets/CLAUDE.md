# assets/ — Static Assets

See [root CLAUDE.md](../CLAUDE.md) for full project context.

## Purpose

Static, non-code assets used by the frontend: images, icons, fonts, and BNU brand
items (logo, color/typography references if supplied as files).

## What belongs here / what does not

- **Belongs:** static images, icon sets, font files, brand assets (logo files,
  brand guideline PDFs if provided).
- **Does not belong:** any real BNU data, screenshots containing real student/staff
  records, or anything with PII. This directory holds **only** static UI assets —
  never data. Chart-config helpers (code, not static files) belong in
  [tools/](../tools/CLAUDE.md) instead.

## Conventions

- Subfolders by kind: `images/`, `icons/`, `fonts/`, `brand/`.
- Lowercase, hyphenated filenames (`bnu-logo.svg`, not `BNU Logo.svg`).
- Prefer vector formats (SVG) for icons/logos where available; keep raster assets
  reasonably sized — this is a dashboard, not a media-heavy site.
- **No PII, no real data, ever** — this directory is committed to the repo and
  potentially widely visible; treat it as public-safe by default.

## Status

No assets exist yet — this is currently an empty structural placeholder (`.gitkeep`
in each of `images/`, `icons/`, `fonts/`, `brand/`). Actual BNU brand assets (logo,
color palette, fonts) are pending from the user.

## How it connects

- Linked from [root CLAUDE.md](../CLAUDE.md) repository map.
- Referenced by frontend components once scaffolded.
