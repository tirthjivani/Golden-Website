// Central project catalogue. Treat this file as the database snapshot - the
// shape here mirrors the CMS schema we'll back it with later. Image paths are
// stored as keys under `projects/<slug>/...` so they can resolve to the local
// `public/` tree today and a Cloudflare CDN tomorrow without touching pages.

import projectData from "@/data/projects.json";

const RAW_CDN_BASE = process.env.NEXT_PUBLIC_PROJECT_IMAGE_BASE ?? "/projects";

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function projectImage(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  return `${trimSlash(RAW_CDN_BASE)}/${path}`;
}

export type ProjectType = "residential" | "commercial-industrial";
export type ProjectStatus = "Completed" | "Ongoing" | "Upcoming";

export type ImageRef = {
  src: string;
  alt?: string;
  caption?: string;
  metric?: string;
  label?: string;
  // Set for plan images whose source file has a dark-grey baked background.
  // Renders with a contrast/brightness filter that crushes that grey to black
  // so the image merges into the black page instead of showing as a grey box.
  dimFill?: boolean;
};

export type SummaryCard = {
  src: string;
  alt?: string;
  metric: string;
  label: string;
};

export type AmenityKey =
  | "walking-track"
  | "security"
  | "solar-power"
  | "garden"
  | "play-area"
  | "elevators"
  | "parking"
  | "gym"
  | "pool"
  | "clubhouse"
  | "library";

export type FloorPlan = {
  id: string;
  label: string;
  metrics: { label: string; value: string }[];
  features: string[];
  image: ImageRef;
  note?: string;
};

export type FloorPlanGroup = {
  id: string;
  label: string;
  plans: FloorPlan[];
};

export type SpecificationItem = {
  id: string;
  title: string;
  body: string;
};

export type LocationPin = {
  label: string;
  minutes: number;
  category?: "Park" | "School" | "Hospital" | "Transit" | "Market" | "Other";
};

export type LandmarkCategory =
  | "education"
  | "healthcare"
  | "recreation"
  | "transit";

export type Landmark = {
  name: string;
  category: LandmarkCategory;
  distanceKm: number;
  minutes: number;
  bearing?: number;
  // Real geographic position [lng, lat], when known. Falls back to a synthetic
  // position around the project when absent. See src/lib/landmarkCoords.ts.
  coords?: [number, number];
};

export type Pillar = {
  id: string;
  title: string;
  body: string;
  iconKey: "zero-out" | "smart-power" | "climate-capsule" | "zero-waste";
};

// ---------- Custom (studio-authored) sections ----------
// A generic, themed content block the studio can add to any project and place
// anywhere in the section order. Kept deliberately simple: a heading, body
// copy, an optional media grid, and an optional video embed.
export type CustomSection = {
  id: string;
  label?: string; // shown in the section nav
  headline?: string;
  body?: string;
  media?: ImageRef[];
  columns?: 2 | 3 | 4;
  videoUrl?: string;
};

export type ProjectDetail = {
  hero: {
    image: ImageRef;
    eyebrow?: string;
    tagline?: string;
  };
  firstLook?: {
    headline?: string;
    items: ImageRef[];
  };
  intro: {
    headline: string;
    body?: string;
    brochureUrl?: string;
  };
  summary?: {
    headline?: string;
    cards: SummaryCard[];
  };
  highlights?: {
    headline: string;
    body?: string;
    items: ImageRef[];
  };
  amenities: {
    headline: string;
    body?: string;
    feature?: ImageRef;
    items: { key: AmenityKey; label: string }[];
  };
  masterPlan?: {
    headline: string;
    body?: string;
    image: ImageRef;
  };
  floorPlans: {
    headline: string;
    body?: string;
    groups: FloorPlanGroup[];
  };
  specifications: {
    headline: string;
    body?: string;
    items: SpecificationItem[];
  };
  gallery: {
    headline: string;
    body?: string;
    images: ImageRef[];
  };
  location?: {
    headline: string;
    body?: string;
    coords: [number, number];
    address?: string;
    landmarks: Landmark[];
  };
  pillars: {
    items: Pillar[];
  };
  walkthrough?: {
    headline: string;
    body?: string;
    image?: ImageRef;
    videoUrl: string;
  };
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  type: ProjectType;
  category: string;
  location: string;
  area: string;
  areaLabel?: string;
  status: ProjectStatus;
  rera?: string;
  reraIssuedOn?: string;
  images: ImageRef[];
  detail?: ProjectDetail;
  // ---- Studio-managed layout controls (all optional, back-compatible) ----
  // Section keys turned off for this project. Keys are the canonical section
  // ids (see SECTION_DEFS) or `custom:<id>` for custom sections.
  disabledSections?: string[];
  // Explicit render order of section keys. When absent, the default order is
  // used and any customSections are appended at the end.
  sectionOrder?: string[];
  // Studio-authored generic sections, placed via sectionOrder when present.
  customSections?: CustomSection[];
};

const JSON_PROJECTS = (projectData as unknown as { projects?: Project[] })
  .projects;

// src/data/projects.json is the single source of truth the whole site renders
// from. Fail fast at module load rather than serving an empty site.
if (!JSON_PROJECTS || JSON_PROJECTS.length === 0) {
  throw new Error(
    "src/data/projects.json contains no projects - it is the single source of truth.",
  );
}

export const PROJECTS: Project[] = JSON_PROJECTS;

export function listProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

// ---------- Section layout ----------

export type SectionKey = string;

export type SectionItem = { key: SectionKey; label: string };

// Canonical section catalogue. `navable` controls whether the section gets an
// anchor entry in the on-page section nav. Order here is the default render
// order when a project has no explicit sectionOrder.
export const SECTION_DEFS: {
  key: string;
  label: string;
  navable: boolean;
}[] = [
  { key: "hero", label: "Hero", navable: false },
  { key: "overview", label: "Overview", navable: true },
  { key: "facts", label: "Facts", navable: false },
  { key: "amenities", label: "Amenities", navable: true },
  { key: "master-plan", label: "Master Plan", navable: true },
  { key: "floor-plans", label: "Floor Plans", navable: true },
  { key: "gallery", label: "Gallery", navable: true },
  { key: "specifications", label: "Specifications", navable: true },
  { key: "location", label: "Location", navable: true },
  { key: "pillars", label: "Pillars", navable: false },
  { key: "walkthrough", label: "Walkthrough", navable: true },
];

export const DEFAULT_SECTION_ORDER = SECTION_DEFS.map((s) => s.key);

export type OrderedSection =
  | { kind: "known"; key: string; label: string; navable: boolean }
  | { kind: "custom"; key: string; label: string; custom: CustomSection };

// Resolve the final, ordered, enabled list of sections for a project. Honours
// disabledSections and sectionOrder; appends any custom sections not already
// placed by sectionOrder.
export function getOrderedSections(project: Project): OrderedSection[] {
  const disabled = new Set(project.disabledSections ?? []);
  const custom = project.customSections ?? [];
  const customById = new Map(custom.map((c) => [`custom:${c.id}`, c]));

  const order =
    project.sectionOrder && project.sectionOrder.length > 0
      ? project.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const seen = new Set<string>();
  const result: OrderedSection[] = [];

  const pushKey = (key: string) => {
    if (seen.has(key) || disabled.has(key)) return;
    seen.add(key);
    if (key.startsWith("custom:")) {
      const c = customById.get(key);
      if (c) {
        result.push({
          kind: "custom",
          key,
          label: c.label || c.headline || "Section",
          custom: c,
        });
      }
      return;
    }
    const def = SECTION_DEFS.find((s) => s.key === key);
    if (def) {
      result.push({
        kind: "known",
        key,
        label: def.label,
        navable: def.navable,
      });
    }
  };

  order.forEach(pushKey);
  // Append any custom sections not referenced by sectionOrder.
  custom.forEach((c) => pushKey(`custom:${c.id}`));

  return result;
}

// Nav entries (anchored sections) for the on-page section nav and header.
// Keeps the original data-presence checks so empty stock sections don't get a
// nav link, while always surfacing enabled custom sections.
export function getProjectSections(project: Project): SectionItem[] {
  const d = project.detail;
  if (!d) return [];

  const hasData: Record<string, boolean> = {
    overview: (d.summary?.cards.length ?? 0) > 0,
    amenities: d.amenities.items.length > 0,
    "master-plan": Boolean(d.masterPlan && d.masterPlan.image.src),
    "floor-plans": d.floorPlans.groups.some((g) =>
      g.plans.some((p) => p.image?.src?.trim()),
    ),
    gallery: d.gallery.images.length > 0,
    specifications: d.specifications.items.length > 0,
    location: Boolean(d.location && d.location.landmarks.length > 0),
    walkthrough: Boolean(d.walkthrough && d.walkthrough.videoUrl),
  };

  const sections: SectionItem[] = [];
  for (const s of getOrderedSections(project)) {
    if (s.kind === "custom") {
      sections.push({ key: s.key, label: s.label });
      continue;
    }
    if (!s.navable) continue;
    // overview always shown for nav even if cards empty (keeps prior behaviour)
    if (s.key !== "overview" && hasData[s.key] === false) continue;
    sections.push({ key: s.key, label: s.label });
  }
  return sections;
}
