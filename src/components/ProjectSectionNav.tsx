"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToId } from "@/lib/smooth-scroll";
import type { SectionItem } from "@/lib/projects";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const ROW_HEIGHT = 28; // px - matches each row in the rolling list
const SCROLL_OFFSET = -90; // px - how far above the section header to land

export function ProjectSectionNav({ sections }: { sections: SectionItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const suspendSpyRef = useRef(false);

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

  useEffect(() => {
    if (sections.length === 0) return;

    let raf = 0;
    const detect = () => {
      if (suspendSpyRef.current) {
        raf = requestAnimationFrame(detect);
        return;
      }
      const offset = 120; // pixels below the viewport top to anchor
      let next = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].key);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) next = i;
      }
      setActiveIdx((curr) => (curr === next ? curr : next));
      raf = requestAnimationFrame(detect);
    };

    raf = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(raf);
  }, [sections]);

  if (sections.length === 0) return null;

  const activeLabel = sections[activeIdx]?.label ?? sections[0]?.label ?? "";

  const onSelect = (idx: number, key: string) => {
    setActiveIdx(idx);
    setOpen(false);
    // Pause scroll-spy during the smooth-scroll animation so the dropdown
    // doesn't flicker through the sections we pass over.
    suspendSpyRef.current = true;
    window.setTimeout(() => {
      suspendSpyRef.current = false;
    }, 900);
    scrollToId(key, SCROLL_OFFSET);
  };

  return (
    <div
      ref={wrapRef}
      className="relative hidden h-8 items-center sm:flex"
      data-active-section={sections[activeIdx]?.key}
    >
      <span aria-hidden className="mr-3 block h-5 w-px bg-white/25" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Jump to section. Currently on ${activeLabel}`}
        className="flex items-center gap-1.5 text-sm font-medium tracking-wide text-white/80 hover:text-white"
      >
        <RollingLabel
          sections={sections}
          activeIdx={activeIdx}
          rowHeight={ROW_HEIGHT}
        />
        <Caret open={open} />
      </button>

      <div
        role="listbox"
        className="absolute left-0 top-full z-40 mt-2 w-[220px] overflow-hidden rounded-md border border-white/10 bg-black/90 p-1 backdrop-blur"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: open ? "auto" : "none",
          transition: `opacity 220ms ${EASE}, transform 220ms ${EASE}`,
        }}
      >
        {sections.map((s, i) => {
          const isCurrent = i === activeIdx;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(i, s.key)}
              role="option"
              aria-selected={isCurrent}
              className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                isCurrent
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RollingLabel({
  sections,
  activeIdx,
  rowHeight,
}: {
  sections: SectionItem[];
  activeIdx: number;
  rowHeight: number;
}) {
  return (
    <span
      aria-live="polite"
      className="block overflow-hidden"
      style={{ height: rowHeight, width: 130 }}
    >
      <span
        className="block"
        style={{
          transform: `translateY(${-activeIdx * rowHeight}px)`,
          transition: `transform 420ms ${EASE}`,
          willChange: "transform",
        }}
      >
        {sections.map((s) => (
          <span
            key={s.key}
            className="flex items-center"
            style={{ height: rowHeight }}
          >
            {s.label}
          </span>
        ))}
      </span>
    </span>
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
