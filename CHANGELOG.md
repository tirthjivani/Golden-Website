# Changelog

All notable changes to the Golden Group website are recorded here, newest first.
One entry per PR. Bug-fix entries link to the detailed daily issue logs (e.g.
`2026-06-24.md`) where a Symptom / Root Cause / Resolution / Validation
breakdown is kept.

## [Unreleased] — location map: real pins (2026-06-27)

Replaces the location map's synthetic landmark positions (which dropped pins
into rivers and other wrong spots) with real geocoded coordinates, on a more
detailed dark basemap. Validated against a green production build (all routes).

### Added
- `src/lib/landmarkCoords.ts` — 92 verified landmark coordinates keyed
  `${slug}::${name}` -> `[lng, lat]`.
- `scripts/geocode-mappls.ts` — geocoder that derives coordinates via Mappls
  trilateration (free tier returns straight-line distance but withholds lat/lng,
  so each place is queried from 3 reference points and trilaterated). Reads
  credentials from env only; nothing secret is committed.

### Changed
- `MinimalMap`: render pins at their real coordinates and `fitBounds` to frame
  each view; removed the synthetic offset/compress placement. Zoom pulled back
  so streets and labels show instead of bare building footprints.
- Basemap switched to MapTiler `basic-v2-dark` (detailed dark vector style;
  publishable, domain-restricted key) in place of CARTO Dark Matter.
- `LocationSection`: shows every landmark category by default ("all nearby at a
  glance"); category tabs now toggle as filters. Un-geocoded landmarks are
  omitted rather than shown at a fake position.

### Notes
- Coverage is 92 of 136 landmarks (~68%). The rest are either absent from the
  Mappls dataset (mostly smaller hospitals/schools), too generic to geocode
  ("Local Bus Stop", "Golden Bridge Road"), or were dropped because they matched
  the wrong entity. Missing pins can be hand-added in `landmarkCoords.ts`.

## [Unreleased] — perf + bug-fixes (2026-06-25)

Combines the image-loading performance work with the June 24 bug-fix batch into
a single branch validated against a green production build (all 24 routes).

### Performance
- Right-sized 9 oversized source images to max 2048px (e.g. `cta-dream.jpg`
  12.3 MB → 0.56 MB; sources were 4000–9656px wide). Originals kept locally.
- Converted remaining referenced PNGs to WebP and repointed all 86 references
  across pages/components/lib — nothing still loads multi-MB PNGs.
- `RevealImage`: only set `fetchPriority="high"` when `priority` is set (was
  hardcoded high on every image, causing a request stampede on first load).
- `next.config`: dropped the 3840 device tier (sources cap at 2048px); serve
  WebP-only in dev while keeping AVIF for production builds.
- Result: cold first-load image cost down ~2–3x (`/residential` ~11s → ~3.8s).
  Fixes the black-screen / "infinite reload" preloader hang reported on slower
  machines and uncached first loads.

### Changed
- Location map redesign polish: vector basemap, named pins, detail cards, and
  the active-landmark hover/gold-fill behaviour (`MinimalMap.tsx`, `globals.css`).

### Fixed (June 24 batch — full detail in `2026-06-24.md`)
- Commercial CTA broken image (`.jpg` → `.webp` path correction).
- Stat counts: consistent uppercase `K` on residential / commercial / about.
- Carousel project cards now clickable links with premium hover transitions.
- Carousel drag-to-scroll and Shift + wheel navigation.
- Project detail hero heading/subheading adjustments.
- Header back-navigation on project detail pages.
- Hero section height & eased-mask parity on residential and commercial.
- Contact page column layout restructure.
- Careers section added to the contact page.
- Contact & careers layout cohesiveness, divider connection, and border alignment.
- Contact divider thickness and location-card stretching.
- Careers form state validation & resume-upload highlight.
- Commercial page hero image & button-squishing fix.
