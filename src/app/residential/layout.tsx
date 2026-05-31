import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Residential Projects | Golden Group",
  description:
    "Premium 1, 2, 3 & 4 BHK apartments, row villas and bungalow communities by Golden Group across Bharuch, Ankleshwar and Surat. Find your next home.",
};

export default function ResidentialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
