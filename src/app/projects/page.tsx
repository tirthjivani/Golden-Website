"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { RevealImage } from "@/components/RevealImage";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const REVEAL_STAGGER = 140;

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
      "/residential/project-1.png",
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
      "/residential/project-2.png",
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
      "/residential/nirvana-tile.png",
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
      "/residential/project-3.png",
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
      "/residential/project-4.png",
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
      "/residential/project-5.png",
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
      "/residential/why-image.png",
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
      "/residential/gallery-5.jpg",
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
      "/residential/gallery-6.jpg",
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
      "/residential/gallery-3.jpg",
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
      "/residential/gallery-4.jpg",
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

  const filtered = PROJECTS.filter(
    (p) => filter === "all" || p.type === filter,
  );

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
          <ProjectRow key={p.id} project={p} />
        ))}
      </section>

      <div className="h-24 md:h-32" aria-hidden />
    </main>
  );
}

function ProjectRow({ project }: { project: Project }) {
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
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-8 border-b border-[#464646] px-[30px] py-10 md:grid-cols-12 md:gap-10 md:py-14"
    >
      <div className="md:col-span-4 lg:col-span-3">
        <h3 className="text-[28px] font-medium leading-[1.05] tracking-tight md:text-[36px]">
          {project.name}
        </h3>
        <div className="mt-6 flex flex-col gap-3">
          <Detail icon={<BedIcon />} label={project.category} />
          <Detail icon={<StatusIcon />} label={project.status} />
        </div>
      </div>

      <div className="md:col-span-8 lg:col-span-9">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
          {project.images.map((src, i) => (
            <RevealImage
              key={`${project.id}-${i}`}
              src={src}
              alt={`${project.name} — image ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 24vw, 50vw"
              className="object-cover"
              containerClassName="relative aspect-[4/3] w-full"
              shown={shown}
              delay={i * REVEAL_STAGGER}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[14px] text-[#d7d7d7]">
      <span className="inline-flex h-5 w-5 items-center justify-center text-white/70">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function BedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
      <path d="M2 14V7m0 7h16m0 0V7m-16 0h16M5 11h4a1 1 0 0 1 1 1v2H4v-2a1 1 0 0 1 1-1Zm6-1h6v4h-6" />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
      <circle cx="10" cy="10" r="7" />
      <path d="m7 10 2 2 4-4" />
    </svg>
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
