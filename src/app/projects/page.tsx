"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type ProjectType = "residential" | "commercial-industrial";
type Filter = "all" | ProjectType;

type Project = {
  id: string;
  name: string;
  type: ProjectType;
  category: string;
  status: "Completed" | "Ongoing";
  images: string[];
};

const PROJECTS: Project[] = [
  {
    id: "golden-residency",
    name: "Golden Residency",
    type: "residential",
    category: "1 & 2 BHK Flats",
    status: "Completed",
    images: [
      "/residential/gallery-1.jpg",
      "/residential/gallery-2.jpg",
      "/residential/gallery-3.jpg",
    ],
  },
  {
    id: "golden-luxuria",
    name: "Golden Luxuria",
    type: "residential",
    category: "2 & 3 BHK Flats",
    status: "Completed",
    images: [
      "/residential/gallery-4.jpg",
      "/residential/gallery-5.jpg",
      "/residential/gallery-6.jpg",
    ],
  },
  {
    id: "golden-nirvana",
    name: "Golden Nirvana",
    type: "residential",
    category: "3 BHK Bungalows or 2 BHK Flats",
    status: "Ongoing",
    images: [
      "/residential/gallery-3.jpg",
      "/residential/gallery-1.jpg",
      "/residential/gallery-5.jpg",
    ],
  },
  {
    id: "golden-villa",
    name: "Golden Villa",
    type: "residential",
    category: "Villas",
    status: "Completed",
    images: [
      "/residential/gallery-2.jpg",
      "/residential/gallery-4.jpg",
      "/residential/gallery-6.jpg",
    ],
  },
  {
    id: "golden-homes",
    name: "Golden Homes",
    type: "residential",
    category: "Residential Flats",
    status: "Completed",
    images: [
      "/residential/gallery-1.jpg",
      "/residential/gallery-3.jpg",
      "/residential/gallery-5.jpg",
    ],
  },
  {
    id: "golden-palm-villa",
    name: "Golden Palm Villa",
    type: "residential",
    category: "Villas",
    status: "Completed",
    images: [
      "/residential/gallery-2.jpg",
      "/residential/gallery-5.jpg",
      "/residential/gallery-4.jpg",
    ],
  },
  {
    id: "golden-heaven",
    name: "Golden Heaven",
    type: "residential",
    category: "3 & 4 BHK Flats",
    status: "Completed",
    images: [
      "/residential/gallery-6.jpg",
      "/residential/gallery-2.jpg",
      "/residential/gallery-1.jpg",
    ],
  },
  {
    id: "golden-palm-plaza",
    name: "Golden Palm Plaza",
    type: "commercial-industrial",
    category: "Shops & Offices",
    status: "Completed",
    images: [
      "/commercial-hero.png",
      "/residential/gallery-3.jpg",
      "/residential/gallery-1.jpg",
    ],
  },
  {
    id: "golden-square",
    name: "Golden Square",
    type: "commercial-industrial",
    category: "Commercial Spaces",
    status: "Completed",
    images: [
      "/commercial-hero.png",
      "/residential/gallery-4.jpg",
      "/residential/gallery-5.jpg",
    ],
  },
  {
    id: "golden-square-2",
    name: "Golden Square",
    type: "commercial-industrial",
    category: "Commercial Spaces",
    status: "Completed",
    images: [
      "/commercial-hero.png",
      "/residential/gallery-2.jpg",
      "/residential/gallery-6.jpg",
    ],
  },
  {
    id: "golden-industrial-estate",
    name: "Golden Industrial Estate",
    type: "commercial-industrial",
    category: "Industrial Plots",
    status: "Completed",
    images: [
      "/commercial-hero.png",
      "/residential/gallery-3.jpg",
      "/residential/gallery-5.jpg",
    ],
  },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial-industrial", label: "Commercial & Industrial" },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string>(PROJECTS[0].id);

  const filtered = PROJECTS.filter(
    (p) => filter === "all" || p.type === filter,
  );

  const effectiveOpenId =
    filtered.find((p) => p.id === openId)?.id ?? filtered[0]?.id ?? "";

  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <section className="px-[30px] pb-12 pt-[120px] md:pt-[140px]">
        <Reveal>
          <h1 className="text-[44px] font-medium leading-[1] tracking-tight md:text-[72px]">
            Our Projects
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 max-w-[640px] text-sm leading-[1.4] text-[#d7d7d7] md:text-base">
            Residential, Commercial &amp; Industrial spaces across Bharuch,
            Ankleshwar &amp; Surat.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-10 flex flex-col gap-3">
          <span className="text-sm text-white/60">Type</span>
          <div className="flex flex-wrap gap-0">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`relative -ml-px h-[36px] border border-[#464646] px-4 text-[12px] uppercase tracking-[0.04em] first:ml-0 ${
                    active
                      ? "z-10 bg-white text-black"
                      : "bg-transparent text-white hover:bg-white/5"
                  }`}
                  style={{ transition: `background-color 250ms ${EASE}, color 250ms ${EASE}` }}
                  aria-pressed={active}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="border-t border-[#464646]">
        {filtered.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            open={effectiveOpenId === p.id}
            onToggle={() => setOpenId((curr) => (curr === p.id ? "" : p.id))}
          />
        ))}
      </section>

      <div className="h-24 md:h-32" aria-hidden />
    </main>
  );
}

function ProjectRow({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#464646]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`project-${project.id}-images`}
        className="flex w-full flex-col gap-3 px-[30px] py-5 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <h3 className="text-[20px] font-normal leading-[1.2] text-white md:text-[24px]">
          {project.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <Chip label={project.category} />
          <Chip label={project.status} />
        </div>
      </button>

      <div
        id={`project-${project.id}-images`}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: `grid-template-rows 700ms ${EASE}`,
        }}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-2 px-[30px] pb-6 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
            {project.images.map((src, i) => (
              <div
                key={`${project.id}-${i}`}
                className="relative aspect-[4/3] overflow-hidden bg-[#111]"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(64px)",
                  transition: `opacity 650ms ${EASE} ${
                    open ? 200 + i * 120 : 0
                  }ms, transform 800ms ${EASE} ${open ? 200 + i * 120 : 0}ms`,
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  src={src}
                  alt={`${project.name} — image ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex h-[28px] items-center whitespace-nowrap border border-[#464646] px-3 text-[11px] uppercase leading-none tracking-[0.04em] text-[#d7d7d7] md:text-[12px]">
      {label}
    </span>
  );
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
