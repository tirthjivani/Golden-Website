"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProjectSectionNav } from "@/components/ProjectSectionNav";
import { getProjectBySlug, getProjectSections } from "@/lib/projects";

const SEGMENTS = [
  { href: "/residential", label: "Residential" },
  { href: "/commercial-industrial", label: "Commercial & Industrial" },
] as const;

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Variant = "transparent" | "sticky";

export default function Header({
  onMenuClick,
  variant = "transparent",
  visible = true,
}: {
  onMenuClick: () => void;
  variant?: Variant;
  visible?: boolean;
}) {
  const pathname = usePathname();
  const active = SEGMENTS.find((s) => pathname?.startsWith(s.href));
  const projectSlug = pathname?.startsWith("/project/")
    ? pathname.split("/")[2]
    : null;
  const project = projectSlug ? getProjectBySlug(projectSlug) : undefined;
  const sectionItems = project ? getProjectSections(project) : [];

  if (variant === "sticky") {
    return (
      <header
        className="fixed inset-x-0 top-0 z-40 border-b border-[#464646] bg-black px-6 py-5 md:px-10 md:py-6"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: `transform 450ms ${EASE}`,
        }}
        aria-hidden={!visible}
        // Off-screen duplicate header must not add tab stops.
        inert={!visible || undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <LogoLink />
            {sectionItems.length > 0 ? (
              <ProjectSectionNav sections={sectionItems} />
            ) : active ? (
              <SegmentSwitcher current={active.href} />
            ) : null}
          </div>
          <MenuButton onClick={onMenuClick} />
        </div>
      </header>
    );
  }

  return (
    <header
      key={pathname ?? ""}
      className="nav-enter pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-10 md:py-7"
    >
      <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
        <LogoLink priority />
        {projectSlug ? <BackToProjectsLink /> : null}
        {active ? <SegmentSwitcher current={active.href} /> : null}
      </div>
      <MenuButton onClick={onMenuClick} className="pointer-events-auto" />
    </header>
  );
}

function LogoLink({ priority = false }: { priority?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Golden Group"
      className="logo-link inline-flex"
    >
      <Image
        src="/logo.svg"
        alt="Golden"
        width={148}
        height={32}
        priority={priority}
        className="h-7 w-auto transition-[filter] duration-300 ease-out md:h-8"
      />
    </Link>
  );
}

function MenuButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/menu flex items-center gap-3 text-sm font-medium tracking-wide text-white ${className}`}
      aria-label="Open menu"
    >
      <span className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2]">
        <span className="block transition-transform duration-300 ease-out group-hover/menu:-translate-y-full">
          Menu
        </span>
        <span className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover/menu:translate-y-0">
          Menu
        </span>
      </span>
      <span className="flex flex-col gap-[5px] transition-transform duration-300 ease-out group-hover/menu:scale-110">
        <span className="block h-[1.5px] w-5 bg-current transition-[width] duration-300 ease-out group-hover/menu:w-6" />
        <span className="block h-[1.5px] w-5 bg-current transition-[width] duration-300 ease-out group-hover/menu:w-3" />
      </span>
    </button>
  );
}

function SegmentSwitcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const currentLabel = SEGMENTS.find((s) => s.href === current)?.label ?? "";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative hidden h-8 items-center sm:flex">
      <span aria-hidden className="mr-3 block h-5 w-px bg-white/25" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-sm font-medium tracking-wide text-white/80 hover:text-white"
      >
        <span>{currentLabel}</span>
        <Caret open={open} />
      </button>
      <div
        role="listbox"
        className="absolute left-0 top-full z-40 mt-2 w-[240px] overflow-hidden rounded-md border border-white/10 bg-black/90 p-1 backdrop-blur"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: open ? "auto" : "none",
          transition: `opacity 220ms ${EASE}, transform 220ms ${EASE}`,
        }}
      >
        {SEGMENTS.map((s) => {
          const isCurrent = s.href === current;
          return (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              role="option"
              aria-selected={isCurrent}
              className={`block rounded px-3 py-2 text-sm transition-colors ${
                isCurrent
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: `transform 200ms ${EASE}`,
      }}
    >
      <path
        d="M2 4l3 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackToProjectsLink() {
  return (
    <div className="relative hidden h-8 items-center sm:flex">
      <span aria-hidden className="mr-3 block h-5 w-px bg-white/25" />
      <Link
        href="/projects"
        className="cta-underline relative flex items-center gap-2 pb-0.5 text-sm font-medium tracking-wide text-white/80 hover:text-white"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path
            d="M12 7H2m0 0 4-4M2 7l4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Back to Our Projects</span>
        <span
          aria-hidden
          className="cta-underline-bar absolute bottom-0 left-0 h-px w-full bg-current"
        />
      </Link>
    </div>
  );
}
