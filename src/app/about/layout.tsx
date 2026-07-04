import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Golden Group",
  description:
    "Two decades building Gujarat. Golden Group has delivered residential townships, commercial hubs and industrial estates across Bharuch, Ankleshwar and Surat since 2005.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
