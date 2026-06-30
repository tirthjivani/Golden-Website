import { promises as fs } from "node:fs";
import path from "node:path";
import { getProjectMedia } from "@/lib/projectMedia";

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, "public", "projects");
const APPLY = process.argv.includes("--apply");

const IMG_RE = /\.(webp|png|jpe?g|avif)$/i;

// USED set holds "slug/filename" keys that must be kept.
const used = new Set<string>();
const keep = (slugRel: string) => used.add(slugRel.replace(/^\/+/, ""));

// Add a data reference: keep the exact file AND its .webp twin (data stores
// .jpg paths whose on-disk asset is the .webp produced by the build pipeline).
function keepRef(ref: string) {
  if (!ref || !IMG_RE.test(ref)) return;
  const clean = ref.replace(/^\/+/, "").replace(/^projects\//, "");
  keep(clean);
  const stem = clean.replace(IMG_RE, "");
  keep(`${stem}.webp`);
}

// 1) Live data: walk projects.json, collect every image-looking string.
const data = JSON.parse(
  await fs.readFile(path.join(ROOT, "src", "data", "projects.json"), "utf8"),
) as { projects: { slug: string }[] };

function walk(node: unknown) {
  if (typeof node === "string") {
    if (IMG_RE.test(node)) keepRef(node);
    return;
  }
  if (Array.isArray(node)) return node.forEach(walk);
  if (node && typeof node === "object")
    return Object.values(node).forEach(walk);
}
walk(data);

// 2) projectMedia SLOTS (the actual project-page image set, webp).
for (const p of data.projects) {
  const media = getProjectMedia(p.slug);
  if (!media) continue;
  const names = [
    media.hero,
    ...media.overview,
    media.amenities,
    ...media.gallery,
  ].filter(Boolean) as string[];
  for (const n of names) keep(`${p.slug}/${n}`);
}

// 3) Literal "projects/<slug>/<file>" references in app + components.
async function scanDir(dir: string) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) await scanDir(fp);
    else if (/\.(tsx?|jsx?|css|mdx?)$/.test(e.name)) {
      const txt = await fs.readFile(fp, "utf8");
      const re = /projects\/([a-z0-9-]+)\/([^"'`)\s]+?\.(?:webp|png|jpe?g|avif))/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(txt))) keepRef(`${m[1]}/${m[2]}`);
    }
  }
}
await scanDir(path.join(ROOT, "src", "app"));
await scanDir(path.join(ROOT, "src", "components"));

// Enumerate disk files and classify.
const del: string[] = [];
const kept: string[] = [];
for (const slug of await fs.readdir(PROJECTS_DIR)) {
  const dir = path.join(PROJECTS_DIR, slug);
  const st = await fs.stat(dir);
  if (!st.isDirectory()) continue;
  for (const name of await fs.readdir(dir)) {
    if (!IMG_RE.test(name)) continue;
    const key = `${slug}/${name}`;
    if (used.has(key)) kept.push(key);
    else del.push(key);
  }
}

del.sort();
const byExt = (arr: string[]) =>
  arr.reduce<Record<string, number>>((a, f) => {
    const e = f.split(".").pop()!.toLowerCase();
    a[e] = (a[e] ?? 0) + 1;
    return a;
  }, {});

console.log(`KEEP: ${kept.length}  ${JSON.stringify(byExt(kept))}`);
console.log(`DELETE: ${del.length}  ${JSON.stringify(byExt(del))}`);
console.log("--- delete list ---");
for (const f of del) console.log(f);

if (APPLY) {
  for (const f of del) await fs.rm(path.join(PROJECTS_DIR, f));
  console.log(`\nDeleted ${del.length} files.`);
} else {
  console.log("\n(dry run — pass --apply to delete)");
}
