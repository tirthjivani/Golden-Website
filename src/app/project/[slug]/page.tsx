import { notFound } from "next/navigation";
import { getProjectBySlug, listProjects } from "@/lib/projects";
import { ProjectDetailView } from "./ProjectDetailView";

export function generateStaticParams() {
  return listProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project — Golden Group" };
  return {
    title: `${project.name} — Golden Group`,
    description: `${project.category} in ${project.location}. ${project.area}.`,
  };
}

export default async function ProjectPage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project || !project.detail) notFound();
  return <ProjectDetailView project={project} />;
}
