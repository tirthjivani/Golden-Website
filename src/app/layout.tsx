import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import SiteShell from "@/components/SiteShell";
import SmoothScroll from "@/components/SmoothScroll";
import ProjectTransitionOverlay from "@/components/ProjectTransitionOverlay";
import Agentation from "@/components/Agentation";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      style: "normal",
      weight: "300 900",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
      weight: "300 900",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Golden Group | Residential & Commercial Real Estate in Gujarat",
  description:
    "Golden Group develops trusted residential apartments, row villas, commercial plazas and industrial estates across Bharuch, Ankleshwar and Surat. Two decades of building communities in Gujarat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <SmoothScroll />
        <SiteShell>{children}</SiteShell>
        <ProjectTransitionOverlay />
        {process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_ENABLE_AGENTATION !== "false" && <Agentation />}
        <Analytics />
      </body>
    </html>
  );
}
