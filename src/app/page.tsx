"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


type Side = "left" | "right";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = "900ms";

export default function Home() {
  const [hovered, setHovered] = useState<Side>("left");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const leftWidth = hovered === "left" ? "60%" : "40%";
  const rightWidth = hovered === "right" ? "60%" : "40%";

  const sideTransition = `width ${DURATION} ${EASE}, flex-basis ${DURATION} ${EASE}`;
  const fadeTransition = `opacity ${DURATION} ${EASE}, transform ${DURATION} ${EASE}`;

  // Below the lg breakpoint (mobile + tablet), both images stay at full
  // opacity and natural scale so the user can clearly distinguish each side.
  const leftOpacity = isDesktop ? (hovered === "right" ? 0 : 1) : 1;
  const rightOpacity = isDesktop ? (hovered === "right" ? 1 : 0) : 1;
  const leftScale =
    isDesktop && hovered === "left" ? "scale(1.04)" : "scale(1)";
  const rightScale =
    isDesktop && hovered === "right" ? "scale(1.04)" : "scale(1)";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <main className="flex min-h-screen w-full flex-col lg:flex-row">
        <div
          onMouseEnter={() => setHovered("left")}
          className="group relative flex h-[50vh] w-full items-end overflow-hidden lg:h-screen lg:min-h-screen lg:w-[var(--side-width)] lg:flex-none lg:will-change-[width]"
          style={
            {
              "--side-width": leftWidth,
              transition: sideTransition,
            } as React.CSSProperties
          }
        >
          <Link
            href="/residential"
            aria-label="Residential"
            className="absolute inset-0 z-0"
          />
          <Image
            src="/residential-hero.jpg"
            alt="Residential"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="pointer-events-none object-cover"
            style={{
              opacity: leftOpacity,
              transform: leftScale,
              transition: fadeTransition,
              willChange: "opacity, transform",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="pointer-events-none relative z-10 flex w-full flex-col gap-6 px-8 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:px-14 lg:pb-14">
            <h2 className="text-[40px] font-medium leading-none tracking-tight md:text-[56px]">
              Residential
            </h2>
            <ProjectsLinkMobile />
            <ProjectsPill />
          </div>
        </div>

        <div
          onMouseEnter={() => setHovered("right")}
          className="group relative flex h-[50vh] w-full items-end overflow-hidden bg-black lg:h-screen lg:min-h-screen lg:w-[var(--side-width)] lg:flex-none lg:will-change-[width]"
          style={
            {
              "--side-width": rightWidth,
              transition: sideTransition,
            } as React.CSSProperties
          }
        >
          <Link
            href="/commercial-industrial"
            aria-label="Commercial & Industrial"
            className="absolute inset-0 z-0"
          />
          <Image
            src="/commercial-hero.png"
            alt="Commercial & Industrial"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="pointer-events-none object-cover"
            style={{
              opacity: rightOpacity,
              transform: rightScale,
              transition: fadeTransition,
              willChange: "opacity, transform",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="pointer-events-none relative z-10 flex w-full flex-col gap-6 px-8 pb-10 sm:flex-row-reverse sm:items-end sm:justify-between sm:gap-8 lg:px-14 lg:pb-14">
            <h2 className="text-[40px] font-medium leading-[1.05] tracking-tight sm:text-right md:text-[56px]">
              Commercial
              <br />
              &amp; Industrial
            </h2>
            <ProjectsLinkMobile />
            <ProjectsPill />
          </div>
        </div>
      </main>
    </div>
  );
}

function ProjectsLinkMobile() {
  return (
    <Link
      href="/projects"
      className="cta-underline pointer-events-auto relative z-10 inline-flex w-fit items-center self-start pb-1 text-base font-medium text-white sm:hidden"
    >
      See latest projects
      <span
        aria-hidden
        className="cta-underline-bar absolute bottom-0 left-0 h-px w-full bg-current"
      />
    </Link>
  );
}

function ProjectsPill() {
  return (
    <Link
      href="/projects"
      className="pill-hover pointer-events-auto relative z-10 hidden h-[75px] w-[245px] shrink-0 self-start overflow-hidden bg-white text-black group-hover:translate-y-0 group-hover:opacity-100 sm:block sm:self-end lg:translate-y-3 lg:opacity-0"
      style={{
        transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}`,
      }}
    >
      <span
        aria-hidden
        className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
      />
      <span className="relative z-10 flex h-full w-full items-end justify-between p-[10px] text-sm font-medium">
        See latest projects
        <StarIcon />
      </span>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 0c.24-.02.45.16.48.4.28.95.5 1.91.84 2.81.36 1.12 1 2.13 1.85 2.94.86.8 1.91 1.37 3.05 1.65l2.33.67c.31 0 .45.25.45.51 0 .25-.14.39-.45.48-.93.28-1.88.5-2.8.81-2.28.74-4.01 2.6-4.6 4.92l-.67 2.36c0 .28-.25.45-.48.45-.22 0-.39-.17-.48-.45-.31-1.01-.53-2.08-.92-3.06-.79-2.15-2.58-3.78-4.79-4.36L.45 9.45c-.31 0-.45-.25-.45-.48 0-.12.04-.24.12-.33.08-.09.18-.15.3-.17 1.01-.28 2.02-.5 3-.87 1.09-.38 2.06-1.03 2.83-1.89.78-.85 1.32-1.89 1.6-3.01l.67-2.34A.5.5 0 0 1 9 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
