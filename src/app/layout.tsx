import type { Metadata } from "next";
import localFont from "next/font/local";
import { Lancelot } from "next/font/google";
import SiteShell from "@/components/SiteShell";
import SmoothScroll from "@/components/SmoothScroll";
import ProjectTransitionOverlay from "@/components/ProjectTransitionOverlay";
import Agentation from "@/components/Agentation";
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

const lancelot = Lancelot({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-lancelot",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Group | Residential & Commercial Real Estate in Gujarat",
  description:
    "Golden Group develops trusted residential apartments, row villas, commercial plazas and industrial estates across Bharuch, Ankleshwar and Surat. Three generations of building communities in Gujarat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${lancelot.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <SmoothScroll />
        <SiteShell>{children}</SiteShell>
        <ProjectTransitionOverlay />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
