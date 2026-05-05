import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteShell from "@/components/SiteShell";
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
  title: "Golden Group",
  description:
    "Golden Group creates warm, thoughtfully designed residential, commercial and industrial spaces across India.",
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
