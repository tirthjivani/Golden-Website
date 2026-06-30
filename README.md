<div align="center">

# ✨ Golden Group

**A cinematic real-estate experience for one of Gujarat's leading developers.**

Residential homes, commercial towers and industrial estates — presented through
scroll-driven storytelling, buttery page transitions and interactive maps.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)

<sub>`#000000` canvas · `#c19b4d` gold accents · Satoshi type</sub>

</div>

---

## 🏛️ What it is

Golden Group is a marketing site that treats every project like a story. Land on
the home page and a hero zoom hands you off to the project you tapped; scroll and
sections rise into view; open a project and explore its **overview, amenities,
master plan, floor plans, gallery, location map and walkthrough** — all driven by
a single typed data model.

## 🎬 Highlights

- **Scroll-native motion** — Lenis smooth scrolling, reveal-on-view animations, a marquee, and Lottie accents, all honoring `prefers-reduced-motion`.
- **Seamless project transitions** — a shared zoom overlay carries you from the listing into a project hero with no flash or jump.
- **Interactive location maps** — MapLibre GL with custom Golden pins and tappable, filterable nearby-landmark chips.
- **Configurable project pages** — each project composes from ordered, toggleable sections (hero → facts → overview → amenities → master plan → floor plans → gallery → location → walkthrough), plus arbitrary custom sections.
- **Floor-plan explorer** — grouped, tabbed plans with metrics, features and crisp WebP plan art.
- **Performance-minded** — WebP assets, precomputed hero aspect ratios (no `sharp`/`fs` in the route bundle), and `next/image` throughout.

## 🧱 Tech stack

| Layer | Choice |
|------|--------|
| Framework | **Next.js 16** (App Router, React 19) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS v4** + CSS custom properties |
| Motion | **Lenis** (smooth scroll), **lottie-react**, CSS keyframes |
| Maps | **MapLibre GL** |
| Icons | **Phosphor Icons** |
| Hosting | **Vercel** |

## 🚀 Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | Does |
|--------|------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## 🗂️ Project structure

```
src/
├── app/                      # App Router routes
│   ├── page.tsx              # Home
│   ├── residential/          # Residential landing
│   ├── commercial-industrial/# Commercial & industrial landing
│   ├── projects/             # Filterable project listing
│   ├── project/[slug]/       # Project detail (sectioned, data-driven)
│   ├── about/ contact/       # Story + enquiry
│   └── terms/ privacy/ disclaimer/
├── components/               # Header, MenuPanel, MinimalMap, RevealImage, …
└── lib/
    ├── projects.ts           # Typed project catalogue (source of truth) + section helpers
    ├── projectMedia.ts       # Per-project image slot/visibility map
    ├── heroAspect.ts         # Precomputed hero aspect ratios
    ├── landmarkCoords.ts     # Map landmark coordinates
    └── projectTransition.ts  # Shared hero zoom state

public/projects/<slug>/       # Per-project imagery (WebP)
scripts/                      # measure-hero-aspect, geocode-mappls
```

## 🧩 Data model

Projects live in `src/lib/projects.ts` as a typed catalogue — the shape mirrors a
CMS schema, so it can be backed by a real datastore later without touching pages.
Each `Project` carries a `detail` with ordered sections; `sectionOrder` and
`disabledSections` control what renders, while `projectMedia.ts` maps image slots
(hero, overview, amenities, gallery) to files in `public/projects/<slug>/`.

> 🛠️ **Content Studio** — a local, dev-only visual editor (`/studio`) for editing
> projects, reordering and toggling sections, uploading imagery and authoring
> floor plans is landing via [PR&nbsp;#6](https://github.com/tirthjivani/Golden-Website/pull/6).
> It persists to `src/data/projects.json`, which overrides the seed when present.

## ☁️ Deployment

Optimized for **Vercel** — push to a branch for a preview deployment, merge to
`main` to promote to production. Hero aspect ratios are precomputed at author time
to keep serverless functions lean.

---

<div align="center">
<sub>Built with Next.js · Crafted for Golden Group</sub>
</div>
