import { notFound } from "next/navigation";
import path from "node:path";
import sharp from "sharp";
import { getProjectBySlug, listProjects } from "@/lib/projects";
import { getProjectMedia } from "@/lib/projectMedia";
import { ProjectDetailView } from "./ProjectDetailView";

export function generateStaticParams() {
  return listProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project - Golden Group" };
  const tagline = project.detail?.hero?.tagline;
  const baseDesc = `${project.name} by Golden Group - ${project.category} in ${project.location}. ${project.area}. Status: ${project.status}.`;
  return {
    title: `${project.name} - Golden Group`,
    description: tagline ? `${baseDesc} ${tagline}` : baseDesc,
  };
}

// Measure the hero image at build time so the landing section can use the
// image's natural aspect ratio (full-width, uncropped, height varies per
// project) instead of a fixed viewport-height box that upscales and blurs it.
async function getHeroAspect(slug: string, heroRelFromDetail?: string) {
  const media = getProjectMedia(slug);
  const rel = media?.hero ? `${slug}/${media.hero}` : heroRelFromDetail;
  if (!rel) return undefined;
  const base = process.env.NEXT_PUBLIC_PROJECT_IMAGE_BASE ?? "/projects";
  // Only local (public-served) images can be measured from disk at build.
  if (!base.startsWith("/")) return undefined;
  try {
    const filePath = path.join(process.cwd(), "public", base, rel);
    const { width, height } = await sharp(filePath).metadata();
    if (!width || !height) return undefined;
    return width / height;
  } catch {
    return undefined;
  }
}

export default async function ProjectPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project || !project.detail) notFound();
  const heroAspect = await getHeroAspect(slug, project.detail.hero?.image?.src);
  return <ProjectDetailView project={project} heroAspect={heroAspect} />;
}
