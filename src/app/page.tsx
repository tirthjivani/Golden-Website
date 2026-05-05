"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


type Side = "left" | "right";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = "900ms";

export default function Home() {
  const [hovered, setHovered] = useState<Side>("left");

  const leftWidth = hovered === "left" ? "60%" : "40%";
  const rightWidth = hovered === "right" ? "60%" : "40%";

  const sideTransition = `width ${DURATION} ${EASE}, flex-basis ${DURATION} ${EASE}`;
  const fadeTransition = `opacity ${DURATION} ${EASE}, transform ${DURATION} ${EASE}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <main className="flex min-h-screen w-full flex-col md:flex-row">
        <Link
          href="/residential"
          onMouseEnter={() => setHovered("left")}
          className="group relative flex h-[60vh] min-h-[480px] w-full items-end overflow-hidden md:h-screen md:min-h-screen md:w-[var(--side-width)] md:flex-none md:will-change-[width]"
          style={
            {
              "--side-width": leftWidth,
              transition: sideTransition,
            } as React.CSSProperties
          }
        >
          <Image
            src="/residential-hero.jpg"
            alt="Residential"
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            style={{
              opacity: hovered === "right" ? 0 : 1,
              transform: hovered === "left" ? "scale(1.04)" : "scale(1)",
              transition: fadeTransition,
              willChange: "opacity, transform",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 flex w-full flex-col gap-6 px-8 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:px-14 md:pb-14">
            <h2 className="text-[40px] font-medium leading-none tracking-tight md:text-[56px]">
              Residential
            </h2>
            <ProjectsPill />
          </div>
        </Link>

        <Link
          href="/commercial-industrial"
          onMouseEnter={() => setHovered("right")}
          className="group relative flex h-[60vh] min-h-[480px] w-full items-end overflow-hidden bg-black md:h-screen md:min-h-screen md:w-[var(--side-width)] md:flex-none md:will-change-[width]"
          style={
            {
              "--side-width": rightWidth,
              transition: sideTransition,
            } as React.CSSProperties
          }
        >
          <Image
            src="/commercial-hero.png"
            alt="Commercial & Industrial"
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            style={{
              opacity: hovered === "right" ? 1 : 0,
              transform: hovered === "right" ? "scale(1.04)" : "scale(1)",
              transition: fadeTransition,
              willChange: "opacity, transform",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 flex w-full flex-col gap-6 px-8 pb-10 sm:flex-row-reverse sm:items-end sm:justify-between sm:gap-8 md:px-14 md:pb-14">
            <h2 className="text-right text-[40px] font-medium leading-[1.05] tracking-tight md:text-[56px]">
              Commercial
              <br />
              &amp; Industrial
            </h2>
            <ProjectsPill />
          </div>
        </Link>
      </main>
    </div>
  );
}

function ProjectsPill() {
  return (
    <span
      className="pill-hover relative block h-[75px] w-[245px] shrink-0 self-start overflow-hidden bg-white text-black group-hover:translate-y-0 group-hover:opacity-100 sm:self-end md:translate-y-3 md:opacity-0"
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
    </span>
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
