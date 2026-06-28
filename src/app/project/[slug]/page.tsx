import { notFound } from "next/navigation";
import { getProjectBySlug, listProjects } from "@/lib/projects";
import { HERO_ASPECT } from "@/lib/heroAspect";
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

export default async function ProjectPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project || !project.detail) notFound();
  // Aspect ratios are precomputed (scripts/measure-hero-aspect.ts) so the
  // route bundle stays small — no sharp / fs / public images dragged into the
  // serverless function. The hero renders identically.
  const heroAspect = HERO_ASPECT[slug];
  return <ProjectDetailView project={project} heroAspect={heroAspect} />;
}
