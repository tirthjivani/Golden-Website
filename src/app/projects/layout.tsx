import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Golden Group",
  description:
    "Browse all Golden Group projects - residential apartments, row villas, bungalow communities, retail plazas and industrial estates across Bharuch, Ankleshwar and Surat.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
