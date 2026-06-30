import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { STUDIO_ENABLED, studioForbiddenResponse } from "@/lib/studio/devOnly";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const VIDEO_RE = /\.(mp4|webm|mov)$/i;

function safeSlug(slug: string): string | null {
  if (!slug || /[/\\]|\.\./.test(slug)) return null;
  return slug;
}

// GET ?slug=<slug> -> list media files already present in
// public/projects/<slug>/, returned as "<slug>/<file>" refs ready to drop into
// an ImageRef.src.
export async function GET(request: Request) {
  if (!STUDIO_ENABLED) return studioForbiddenResponse();
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  const safe = safeSlug(slug);
  if (!safe) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }
  const dir = path.join(PROJECTS_DIR, safe);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => IMAGE_RE.test(n) || VIDEO_RE.test(n))
      .sort()
      .map((n) => ({
        name: n,
        ref: `${safe}/${n}`,
        kind: VIDEO_RE.test(n) ? "video" : "image",
      }));
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
