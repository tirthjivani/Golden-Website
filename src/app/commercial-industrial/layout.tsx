import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial & Industrial Projects | Golden Group",
  description:
    "Retail plazas, office spaces and industrial estates by Golden Group - strategically located commercial property in Bharuch, Ankleshwar and Surat with full infrastructure.",
};

export default function CommercialIndustrialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
