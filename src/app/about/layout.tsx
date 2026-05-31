import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Golden Group",
  description:
    "Three generations building Gujarat. Golden Group has delivered residential townships, commercial hubs and industrial estates across Bharuch, Ankleshwar and Surat since 1997.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
