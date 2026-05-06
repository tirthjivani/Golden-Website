"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SEGMENTS = [
  { href: "/residential", label: "Residential" },
  { href: "/commercial-industrial", label: "Commercial" },
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

  if (variant === "sticky") {
    return (
      <header
        className="fixed inset-x-0 top-0 z-40 border-b border-[#464646] bg-black px-6 py-5 md:px-10 md:py-6"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: `transform 450ms ${EASE}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/" aria-label="Golden Group">
              <Image
                src="/logo.svg"
                alt="Golden"
                width={148}
                height={32}
                className="h-7 w-auto md:h-8"
              />
            </Link>
            {active ? <SegmentSwitcher current={active.href} /> : null}
          </div>
          <button
            type="button"
            onClick={onMenuClick}
            className="flex items-center gap-3 text-sm font-medium tracking-wide text-white"
            aria-label="Open menu"
          >
            <span>Menu</span>
            <span className="flex flex-col gap-[5px]">
              <span className="block h-[1.5px] w-5 bg-current" />
              <span className="block h-[1.5px] w-5 bg-current" />
            </span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-10 md:py-7">
      <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
        <Link href="/" aria-label="Golden Group">
          <Image
            src="/logo.svg"
            alt="Golden"
            width={148}
            height={32}
            priority
            className="h-7 w-auto md:h-8"
          />
        </Link>
        {active ? <SegmentSwitcher current={active.href} /> : null}
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className="pointer-events-auto flex items-center gap-3 text-sm font-medium tracking-wide text-white"
        aria-label="Open menu"
      >
        <span>Menu</span>
        <span className="flex flex-col gap-[5px]">
          <span className="block h-[1.5px] w-5 bg-current" />
          <span className="block h-[1.5px] w-5 bg-current" />
        </span>
      </button>
    </header>
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
        className="absolute left-0 top-full z-40 mt-2 min-w-[160px] overflow-hidden rounded-md border border-white/10 bg-black/90 p-1 backdrop-blur"
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
