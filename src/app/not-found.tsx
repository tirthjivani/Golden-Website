import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Golden Group",
  description:
    "The page you are looking for does not exist. Explore Golden Group's residential and commercial projects across Gujarat.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-black px-[30px] text-center text-white">
      {/* Faint oversized 404 backdrop, echoing the GOLDEN footer strip */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[46vw] font-medium leading-none tracking-tight text-white/[0.04] md:text-[34vw]"
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="hero-rise inline-block text-[13px] uppercase tracking-[0.3em] text-white/55">
          Page not found
        </span>

        <h1
          className="hero-rise inline-block bg-gradient-to-b from-[#E8C87A] via-[#C19B4D] to-[#7A5F2A] bg-clip-text text-[120px] font-medium leading-[0.95] tracking-tight text-transparent md:text-[200px]"
          style={{ ["--hero-rise-delay" as string]: "120ms" }}
        >
          404
        </h1>

        <p
          className="hero-rise inline-block max-w-[34ch] text-[22px] font-medium leading-[1.25] tracking-tight md:text-[28px]"
          style={{ ["--hero-rise-delay" as string]: "240ms" }}
        >
          This plot hasn&apos;t been developed yet.
        </p>
        <p
          className="hero-rise inline-block max-w-[44ch] text-sm leading-[1.6] text-white/70 md:text-base"
          style={{ ["--hero-rise-delay" as string]: "340ms" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Everything we&apos;ve built is just a step away.
        </p>

        <div
          className="hero-rise mt-4 inline-flex flex-col items-center gap-4 sm:flex-row"
          style={{ ["--hero-rise-delay" as string]: "460ms" }}
        >
          <Link
            href="/"
            className="pill-hover relative block h-[52px] w-[220px] overflow-hidden bg-white text-black"
          >
            <span
              aria-hidden
              className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
            />
            <span className="relative z-10 flex h-full w-full items-end justify-between px-[12px] pb-[8px] pt-[4px] text-sm font-medium">
              Back to Home
              <span aria-hidden>→</span>
            </span>
          </Link>
          <Link
            href="/projects"
            className="cta-underline relative inline-flex items-center gap-2 pb-1 text-sm font-medium text-white/85 hover:text-white"
          >
            View Our Projects
            <span
              aria-hidden
              className="cta-underline-bar absolute bottom-0 left-0 h-px w-full bg-current"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
