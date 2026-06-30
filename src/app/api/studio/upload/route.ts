import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { STUDIO_ENABLED, studioForbiddenResponse } from "@/lib/studio/devOnly";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");
const ALLOWED = /\.(jpe?g|png|webp|avif|gif|svg|mp4|webm|mov)$/i;

function safeSlug(slug: string): string | null {
  if (!slug || /[/\\]|\.\./.test(slug)) return null;
  return slug;
}

function safeName(name: string): string {
  // Strip any path, keep extension, slugify the stem.
  const base = name.split(/[/\\]/).pop() ?? name;
  const dot = base.lastIndexOf(".");
  const stem = (dot > 0 ? base.slice(0, dot) : base)
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 80);
  const ext = dot > 0 ? base.slice(dot).toLowerCase() : "";
  return `${stem || "file"}${ext}`;
}

// POST multipart/form-data: fields `slug` and `file`. Writes the binary into
// public/projects/<slug>/ and returns { src: "<slug>/<filename>" }.
export async function POST(request: Request) {
  if (!STUDIO_ENABLED) return studioForbiddenResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const slug = safeSlug(String(form.get("slug") ?? ""));
  const file = form.get("file");
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  let filename = safeName(file.name || "upload");
  if (!ALLOWED.test(filename)) {
    return NextResponse.json(
      { error: "Unsupported file type." },
      { status: 400 },
    );
  }

  const dir = path.join(PROJECTS_DIR, slug);
  await fs.mkdir(dir, { recursive: true });

  // Avoid clobbering: if a file with this name exists, suffix -1, -2, ...
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot) : "";
  let candidate = filename;
  let n = 1;
  while (true) {
    try {
      await fs.access(path.join(dir, candidate));
      candidate = `${stem}-${n}${ext}`;
      n += 1;
    } catch {
      break;
    }
  }
  filename = candidate;

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({
    src: `${slug}/${filename}`,
    name: filename,
  });
}
