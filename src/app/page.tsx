"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HomePreloader, { PRELOADER_DONE_EVENT } from "@/components/HomePreloader";


type Side = "left" | "right";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = "900ms";
const TRANSITION_MS = 850;

export default function Home() {
  const router = useRouter();
  const [hovered, setHovered] = useState<Side>("left");
  const [isDesktop, setIsDesktop] = useState(false);
  const [transitioning, setTransitioning] = useState<Side | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("golden-preloader-shown") === "1") {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener(PRELOADER_DONE_EVENT, onDone);
    return () => window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Prefetch destinations so the navigation feels instant after the expand.
  useEffect(() => {
    router.prefetch("/residential");
    router.prefetch("/commercial-industrial");
  }, [router]);

  const startTransition = (side: Side, href: string) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let modifier-clicks open in new tab normally.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (transitioning) return;
      sessionStorage.setItem("golden-from-home", "1");
      setTransitioning(side);
      window.setTimeout(() => router.push(href), TRANSITION_MS);
    };

  let leftWidth: string;
  let rightWidth: string;
  if (transitioning === "left") {
    leftWidth = "100%";
    rightWidth = "0%";
  } else if (transitioning === "right") {
    leftWidth = "0%";
    rightWidth = "100%";
  } else {
    leftWidth = hovered === "left" ? "60%" : "40%";
    rightWidth = hovered === "right" ? "60%" : "40%";
  }

  const sideTransition = transitioning
    ? `width ${TRANSITION_MS}ms ${EASE}, flex-basis ${TRANSITION_MS}ms ${EASE}`
    : `width ${DURATION} ${EASE}, flex-basis ${DURATION} ${EASE}`;
  const fadeTransition = `opacity ${DURATION} ${EASE}, transform ${DURATION} ${EASE}, object-position ${DURATION} linear`;

  const leftOpacity = transitioning
    ? transitioning === "left"
      ? 1
      : 0
    : isDesktop
    ? hovered === "right"
      ? 0
      : 1
    : 1;
  const rightOpacity = transitioning
    ? transitioning === "right"
      ? 1
      : 0
    : isDesktop
    ? hovered === "right"
      ? 1
      : 0
    : 1;
  const leftScale = transitioning
    ? "scale(1)"
    : isDesktop && hovered === "left"
    ? "scale(1.04)"
    : "scale(1)";
  const rightScale = transitioning
    ? "scale(1)"
    : isDesktop && hovered === "right"
    ? "scale(1.04)"
    : "scale(1)";

  const overlayTransition = `opacity 320ms ${EASE}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <HomePreloader />
      <main
        className="flex min-h-screen w-full flex-col lg:flex-row"
        style={{
          opacity: ready ? 1 : 0,
          transition: `opacity 600ms ${EASE}`,
        }}
      >
        <div
          onMouseEnter={() => !transitioning && setHovered("left")}
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
            onClick={startTransition("left", "/residential")}
            className="absolute inset-0 z-0"
          />
          <Image
            src="/residential-hero.jpg"
            alt="Residential"
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="pointer-events-none object-cover object-top"
            style={{
              opacity: leftOpacity,
              transform: leftScale,
              transition: fadeTransition,
              willChange: "opacity, transform",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />
          <div
            className="pointer-events-none relative z-10 flex w-full flex-col gap-6 px-8 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:px-14 lg:pb-14"
            style={{
              opacity: transitioning ? 0 : 1,
              transition: overlayTransition,
            }}
          >
            <h2 className="text-[40px] font-medium leading-none tracking-tight md:text-[56px]">
              Residential
            </h2>
            <ProjectsLinkMobile filter="residential" />
            <ProjectsPill filter="residential" />
          </div>
        </div>

        <div
          onMouseEnter={() => !transitioning && setHovered("right")}
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
            onClick={startTransition("right", "/commercial-industrial")}
            className="absolute inset-0 z-0"
          />
          <Image
            src="/commercial-hero.webp"
            alt="Commercial & Industrial"
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="pointer-events-none object-cover"
            style={{
              opacity: rightOpacity,
              transform: rightScale,
              transition: fadeTransition,
              willChange: "opacity, transform",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />
          <div
            className="pointer-events-none relative z-10 flex w-full flex-col gap-6 px-8 pb-10 sm:flex-row-reverse sm:items-end sm:justify-between sm:gap-8 lg:px-14 lg:pb-14"
            style={{
              opacity: transitioning ? 0 : 1,
              transition: overlayTransition,
            }}
          >
            <h2 className="text-[40px] font-medium leading-[1.05] tracking-tight sm:text-right md:text-[56px]">
              Commercial
              <br />
              &amp; Industrial
            </h2>
            <ProjectsLinkMobile filter="commercial-industrial" />
            <ProjectsPill filter="commercial-industrial" />
          </div>
        </div>
      </main>
    </div>
  );
}

type ProjectFilter = "residential" | "commercial-industrial";

function projectsHref(filter?: ProjectFilter) {
  return filter ? `/projects?type=${filter}` : "/projects";
}

function ProjectsLinkMobile({ filter }: { filter?: ProjectFilter }) {
  return (
    <Link
      href={projectsHref(filter)}
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

function ProjectsPill({ filter }: { filter?: ProjectFilter }) {
  return (
    <Link
      href={projectsHref(filter)}
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
