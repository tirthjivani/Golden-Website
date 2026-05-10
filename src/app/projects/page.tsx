"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { RevealImage } from "@/components/RevealImage";
import { SiteFooter } from "@/components/SiteFooter";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const REVEAL_STAGGER = 140;

type ProjectType = "residential" | "commercial-industrial";
type Filter = "all" | ProjectType;

type Project = {
  id: string;
  name: string;
  type: ProjectType;
  category: string;
  location: string;
  area: string;
  status: "Completed" | "Ongoing";
  images: string[];
};

const PROJECTS: Project[] = [
  {
    id: "golden-residency",
    name: "Golden Residency",
    type: "residential",
    category: "1 & 2 BHK Flats",
    location: "Bharuch",
    area: "650-1100 Sq. Ft.",
    status: "Completed",
    images: [
      "/projects/golden-residency/01.jpg",
      "/projects/golden-residency/02.jpg",
      "/projects/golden-residency/03.jpg",
    ],
  },
  {
    id: "golden-luxuria",
    name: "Golden Luxuria",
    type: "residential",
    category: "2 & 3 BHK Flats",
    location: "Surat",
    area: "1200-1750 Sq. Ft.",
    status: "Completed",
    images: [
      "/projects/golden-luxuria/01.jpg",
      "/projects/golden-luxuria/02.jpg",
      "/projects/golden-luxuria/03.jpg",
      "/projects/golden-luxuria/04.jpg",
    ],
  },
  {
    id: "golden-nirvana",
    name: "Golden Nirvana",
    type: "residential",
    category: "3 BHK Bungalows or 2 BHK Flats",
    location: "Surat",
    area: "1900-2500 Sq. Ft.",
    status: "Ongoing",
    images: [
      "/projects/golden-nirvana/01.jpg",
      "/projects/golden-nirvana/02.jpg",
      "/projects/golden-nirvana/03.jpg",
      "/projects/golden-nirvana/04.jpg",
    ],
  },
  {
    id: "golden-villa",
    name: "Golden Villa",
    type: "residential",
    category: "Villas",
    location: "Ankleshwar",
    area: "2500-3200 Sq. Ft.",
    status: "Completed",
    images: [
      "/projects/golden-villa/01.jpg",
      "/projects/golden-villa/02.jpg",
      "/projects/golden-villa/03.jpg",
      "/projects/golden-villa/04.jpg",
    ],
  },
  {
    id: "golden-homes",
    name: "Golden Homes",
    type: "residential",
    category: "Residential Flats",
    location: "Bharuch",
    area: "1100-1500 Sq. Ft.",
    status: "Completed",
    images: [
      "/projects/golden-homes/01.jpg",
      "/projects/golden-homes/02.jpg",
      "/projects/golden-homes/03.jpg",
      "/projects/golden-homes/04.jpg",
    ],
  },
  {
    id: "golden-palm-villa",
    name: "Golden Palm Villa",
    type: "residential",
    category: "Villas",
    location: "Ankleshwar",
    area: "2700-3500 Sq. Ft.",
    status: "Completed",
    images: [
      "/projects/golden-palm-villa/01.jpg",
      "/projects/golden-palm-villa/02.jpg",
      "/projects/golden-palm-villa/03.jpg",
      "/projects/golden-palm-villa/04.jpg",
    ],
  },
  {
    id: "golden-heaven",
    name: "Golden Heaven",
    type: "residential",
    category: "3 & 4 BHK Flats",
    location: "Surat",
    area: "1901-2479 Sq. Ft.",
    status: "Completed",
    images: [
      "/projects/golden-heaven/01.jpg",
      "/projects/golden-heaven/02.jpg",
      "/projects/golden-heaven/03.jpg",
      "/projects/golden-heaven/04.jpg",
    ],
  },
  {
    id: "golden-palm-plaza",
    name: "Golden Palm Plaza",
    type: "commercial-industrial",
    category: "Shops & Offices",
    location: "Bharuch",
    area: "300-1200 Sq. Ft.",
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
    location: "Ankleshwar",
    area: "450-1500 Sq. Ft.",
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
    location: "Surat",
    area: "500-1600 Sq. Ft.",
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
    location: "Ankleshwar",
    area: "5000-12000 Sq. Ft.",
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
          <h1 className="text-[44px] font-medium leading-[1] tracking-tight lg:text-[72px]">
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

      <SiteFooter />
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
        <ul className="mt-6 flex flex-col gap-2 text-[16px] text-[#737373]">
          <li className="flex items-center gap-1.5">
            <BedIcon />
            <span>{project.category}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <MapPinIcon />
            <span>{project.location}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <AreaIcon />
            <span>{project.area}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <StatusIcon />
            <span>{project.status}</span>
          </li>
        </ul>
      </div>

      <div className="md:col-span-8 lg:col-span-9">
        <div
          className={`grid grid-cols-2 gap-2 md:gap-3 ${
            project.images.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
          }`}
        >
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

function BedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M14.1875 5.0625H1.25V3.375C1.25 3.22582 1.19074 3.08274 1.08525 2.97725C0.979758 2.87176 0.836684 2.8125 0.6875 2.8125C0.538316 2.8125 0.395242 2.87176 0.289752 2.97725C0.184263 3.08274 0.125 3.22582 0.125 3.375V14.625C0.125 14.7742 0.184263 14.9173 0.289752 15.0227C0.395242 15.1282 0.538316 15.1875 0.6875 15.1875C0.836684 15.1875 0.979758 15.1282 1.08525 15.0227C1.19074 14.9173 1.25 14.7742 1.25 14.625V12.375H15.875V14.625C15.875 14.7742 15.9343 14.9173 16.0398 15.0227C16.1452 15.1282 16.2883 15.1875 16.4375 15.1875C16.5867 15.1875 16.7298 15.1282 16.8352 15.0227C16.9407 14.9173 17 14.7742 17 14.625V7.875C17 7.12908 16.7037 6.41371 16.1762 5.88626C15.6488 5.35882 14.9334 5.0625 14.1875 5.0625ZM1.25 6.1875H6.3125V11.25H1.25V6.1875ZM7.4375 11.25V6.1875H14.1875C14.6351 6.1875 15.0643 6.36529 15.3807 6.68176C15.6972 6.99822 15.875 7.42745 15.875 7.875V11.25H7.4375Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M12.9375 5.0629C12.9376 4.30814 12.7207 3.56926 12.3128 2.93425C11.9048 2.29924 11.3229 1.79486 10.6365 1.48117C9.94997 1.16749 9.18779 1.05772 8.44068 1.16493C7.69357 1.27214 6.99302 1.59182 6.42245 2.0859C5.85188 2.57998 5.43533 3.22764 5.22242 3.95174C5.0095 4.67585 5.00919 5.4459 5.22151 6.17018C5.43384 6.89446 5.84986 7.54245 6.42002 8.037C6.99019 8.53154 7.69048 8.85179 8.4375 8.95962V16.3129C8.4375 16.4621 8.49676 16.6052 8.60225 16.7106C8.70774 16.8161 8.85082 16.8754 9 16.8754C9.14918 16.8754 9.29226 16.8161 9.39775 16.7106C9.50324 16.6052 9.5625 16.4621 9.5625 16.3129V8.95962C10.499 8.82312 11.3552 8.3544 11.9748 7.63902C12.5944 6.92364 12.9361 6.0093 12.9375 5.0629ZM9 7.8754C8.44374 7.8754 7.89997 7.71045 7.43746 7.40141C6.97495 7.09236 6.61446 6.65311 6.40159 6.1392C6.18872 5.62528 6.13302 5.05978 6.24154 4.51421C6.35006 3.96864 6.61793 3.4675 7.01126 3.07416C7.4046 2.68082 7.90574 2.41296 8.45131 2.30444C8.99688 2.19592 9.56238 2.25162 10.0763 2.46449C10.5902 2.67736 11.0295 3.03784 11.3385 3.50036C11.6476 3.96287 11.8125 4.50664 11.8125 5.0629C11.8125 5.43224 11.7398 5.79797 11.5984 6.1392C11.4571 6.48042 11.2499 6.79047 10.9887 7.05164C10.7276 7.3128 10.4175 7.51997 10.0763 7.66131C9.73507 7.80265 9.36934 7.8754 9 7.8754Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M8 6L12.5 3.75L8 1.5V9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.9974 8.99219L0.872399 11.3472C0.756975 11.4126 0.660969 11.5075 0.594175 11.6221C0.52738 11.7367 0.492187 11.867 0.492188 11.9997C0.492188 12.1324 0.52738 12.2627 0.594175 12.3773C0.660969 12.4919 0.756975 12.5868 0.872399 12.6522L7.2474 16.2972C7.47543 16.4288 7.73409 16.4981 7.9974 16.4981C8.2607 16.4981 8.51937 16.4288 8.7474 16.2972L15.1224 12.6522C15.2378 12.5868 15.3338 12.4919 15.4006 12.3773C15.4674 12.2627 15.5026 12.1324 15.5026 11.9997C15.5026 11.867 15.4674 11.7367 15.4006 11.6221C15.3338 11.5075 15.2378 11.4126 15.1224 11.3472L10.9974 8.99969"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.86719 9.63672L12.1322 14.3617"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.1325 9.63672L3.875 14.3617"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m7 10 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
