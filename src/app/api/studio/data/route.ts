import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { PROJECTS, type Project } from "@/lib/projects";
import { STUDIO_ENABLED, studioForbiddenResponse } from "@/lib/studio/devOnly";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "src", "data", "projects.json");

// GET: return the current dataset. Read straight from disk so freshly-saved
// edits are reflected without relying on the module import cache. When the
// JSON has no projects yet, fall back to the compiled seed dataset.
export async function GET() {
  if (!STUDIO_ENABLED) return studioForbiddenResponse();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as { projects?: Project[] };
    if (parsed.projects && parsed.projects.length > 0) {
      return NextResponse.json({ projects: parsed.projects, source: "studio" });
    }
  } catch {
    // file missing / unreadable -> fall through to seed
  }
  return NextResponse.json({ projects: PROJECTS, source: "seed" });
}

// PUT: persist the full dataset. The body must be { projects: Project[] }.
export async function PUT(request: Request) {
  if (!STUDIO_ENABLED) return studioForbiddenResponse();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const projects = (body as { projects?: unknown }).projects;
  if (!Array.isArray(projects)) {
    return NextResponse.json(
      { error: "Body must be { projects: [...] }." },
      { status: 400 },
    );
  }
  // Minimal shape guard: every project needs a non-empty unique slug.
  const slugs = new Set<string>();
  for (const p of projects as Project[]) {
    if (!p || typeof p.slug !== "string" || !p.slug.trim()) {
      return NextResponse.json(
        { error: "Every project needs a non-empty slug." },
        { status: 400 },
      );
    }
    if (slugs.has(p.slug)) {
      return NextResponse.json(
        { error: `Duplicate slug: ${p.slug}` },
        { status: 400 },
      );
    }
    slugs.add(p.slug);
  }

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify({ projects }, null, 2) + "\n",
    "utf8",
  );
  return NextResponse.json({ ok: true, count: projects.length });
}
