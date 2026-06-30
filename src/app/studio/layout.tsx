import { notFound } from "next/navigation";
import { STUDIO_ENABLED } from "@/lib/studio/devOnly";

export const metadata = {
  title: "Studio — Golden Group",
  robots: { index: false, follow: false },
};

// Hard gate: the studio only exists in local development. On any production
// build (incl. Vercel) this renders a 404.
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!STUDIO_ENABLED) notFound();
  return <div className="min-h-screen bg-black text-white">{children}</div>;
}
