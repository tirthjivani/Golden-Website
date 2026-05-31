import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Golden Group",
  description:
    "Talk to the Golden Group team about residential homes, commercial spaces or industrial plots in Bharuch, Ankleshwar and Surat. Site visits, brochures and pricing on request.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
