"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { RevealImage } from "@/components/RevealImage";
import { SiteFooter } from "@/components/SiteFooter";
import { PROJECT_TRANSITION_MS } from "@/components/ProjectTransitionOverlay";
import { HERO_ASPECT } from "@/lib/heroAspect";
import {
  getProjectTransition,
  setProjectTransition,
} from "@/lib/projectTransition";
import {
  listProjects,
  projectImage,
  type Project,
  type ProjectStatus,
  type ProjectType,
} from "@/lib/projects";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const REVEAL_STAGGER = 140;

type Filter = "all" | ProjectType;
type CityFilter = "all" | string;
type Layout = "row" | "gallery";

function parseFilter(value: string | null): Filter {
  if (value === "residential" || value === "commercial-industrial") return value;
  return "all";
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial-industrial", label: "Commercial & Industrial" },
];

const LAYOUT_FILTERS: { id: Layout; label: string }[] = [
  { id: "row", label: "List" },
  { id: "gallery", label: "Gallery" },
];

const STATUS_DISPLAY: Record<ProjectStatus, string> = {
  Ongoing: "Under Construction",
  Upcoming: "New",
  Completed: "Completed",
};

function statusLabel(status: ProjectStatus): string {
  return STATUS_DISPLAY[status] ?? status;
}

function projectHeroImage(project: Project) {
  return project.detail?.hero.image ?? project.images[0];
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsBody initialFilter="all" />}>
      <ProjectsBodyWithSearchParams />
    </Suspense>
  );
}

function ProjectsBodyWithSearchParams() {
  const searchParams = useSearchParams();
  const initialFilter = parseFilter(searchParams.get("type"));
  return <ProjectsBody initialFilter={initialFilter} />;
}

function ProjectsBody({ initialFilter }: { initialFilter: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [city, setCity] = useState<CityFilter>("all");
  const [layout, setLayout] = useState<Layout>("row");
  const [cols, setCols] = useState(3);
  const [navigating, setNavigating] = useState(false);
  const projects = listProjects();
  const router = useRouter();

  const cityFilters = useMemo<{ id: CityFilter; label: string }[]>(() => {
    const seen = new Set<string>();
    const cities: string[] = [];
    for (const p of projects) {
      if (!seen.has(p.location)) {
        seen.add(p.location);
        cities.push(p.location);
      }
    }
    cities.sort();
    return [
      { id: "all", label: "All" },
      ...cities.map((c) => ({ id: c, label: c })),
    ];
  }, [projects]);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setCols(w >= 1280 ? 3 : w >= 768 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("golden-projects-scroll");
    if (raw == null) return;
    const y = Number(raw);
    sessionStorage.removeItem("golden-projects-scroll");
    if (!Number.isFinite(y)) return;
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
  }, []);

  const filtered = projects
    .filter((p) => filter === "all" || p.type === filter)
    .filter((p) => city === "all" || p.location === city);

  const remainder = filtered.length % cols;
  const fillerCount = remainder === 0 ? 0 : cols - remainder;

  const startTransition = (project: Project, imgEl: HTMLElement) => {
    if (getProjectTransition()) return;
    const heroRef = projectHeroImage(project);
    if (!heroRef?.src) return;
    const rect = imgEl.getBoundingClientRect();
    // The card already rendered this image — reuse its exact loaded source so
    // the zoom shows it immediately instead of fading up from black.
    const cardImg = imgEl.querySelector("img");
    const previewSrc = cardImg?.currentSrc || cardImg?.src || undefined;
    sessionStorage.setItem("golden-from-projects", "1");
    sessionStorage.setItem("golden-projects-scroll", String(window.scrollY));
    setNavigating(true);
    setProjectTransition({
      slug: project.slug,
      src: projectImage(heroRef.src),
      previewSrc,
      alt: heroRef.alt ?? project.name,
      heroAspect: HERO_ASPECT[project.slug],
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      viewport: { w: window.innerWidth, h: window.innerHeight },
      expanded: false,
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setProjectTransition((t) => (t ? { ...t, expanded: true } : null));
      });
    });
    window.setTimeout(() => {
      router.push(`/project/${project.slug}`);
    }, PROJECT_TRANSITION_MS);
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <section className="px-[30px] pb-12 pt-[120px] md:pt-[140px]">
        <Reveal>
          <h1 className="text-[44px] font-normal leading-[1] tracking-tight lg:text-[72px]">
            Our Projects
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 max-w-[640px] text-sm leading-[1.4] text-[#d7d7d7] md:text-base">
            Residential, Commercial &amp; Industrial spaces across Bharuch,
            Ankleshwar &amp; Surat.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-10">
          <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:items-start md:gap-x-12 md:gap-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm text-white/60">Type</span>
              <FilterRow items={FILTERS} value={filter} onChange={setFilter} />
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-white/60">City</span>
              <FilterRow items={cityFilters} value={city} onChange={setCity} />
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-white/60">Layout</span>
              <FilterRow items={LAYOUT_FILTERS} value={layout} onChange={setLayout} />
            </div>
          </div>
        </Reveal>
      </section>

      {layout === "row" ? (
        <section className="border-t border-[#464646]">
          {filtered.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              disabled={navigating}
              priority={i < 2}
              onSelect={(imgEl) => startTransition(p, imgEl)}
            />
          ))}
        </section>
      ) : (
        <section className="border-t border-[#464646]">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectGalleryCard
                key={p.id}
                project={p}
                disabled={navigating}
                priority={i < 3}
                onSelect={(imgEl) => startTransition(p, imgEl)}
              />
            ))}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <div
                key={`filler-${i}`}
                aria-hidden
                className="bg-black border-[#464646] [&:not(:first-child)]:border-t md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2n)]:border-l xl:[&:nth-child(3)]:border-t-0 xl:[&:nth-child(3n+1)]:!border-l-0 xl:[&:nth-child(3n+2)]:border-l xl:[&:nth-child(3n)]:border-l"
              />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}

function FilterRow<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-0">
      {items.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`relative -ml-px h-[36px] border border-[#464646] px-4 text-[13px] tracking-[0.01em] first:ml-0 ${
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
  );
}

function ProjectRow({
  project,
  disabled,
  onSelect,
  priority = false,
}: {
  project: Project;
  disabled: boolean;
  onSelect: (heroImgEl: HTMLElement) => void;
  priority?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
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

  const displayImages = (() => {
    const d = project.detail;
    const candidates: { src: string; alt?: string }[] = [];
    const push = (src?: string, alt?: string) => {
      if (src && !candidates.some((c) => c.src === src)) {
        candidates.push({ src, alt: alt ?? project.name });
      }
    };
    if (d) {
      push(d.hero?.image?.src);
      d.summary?.cards?.forEach((c) => push(c.src, c.alt));
      push(d.amenities?.feature?.src);
      d.gallery?.images?.forEach((img) => push(img.src, img.alt));
    }
    if (candidates.length > 0) return candidates.slice(0, 4);
    return project.images.slice(0, 4);
  })();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (disabled) {
      e.preventDefault();
      return;
    }
    const heroEl = e.currentTarget.querySelector(
      "[data-row-hero]",
    ) as HTMLElement | null;
    if (!heroEl) return;
    e.preventDefault();
    onSelect(heroEl);
  };

  return (
    <Link
      ref={ref}
      href={`/project/${project.slug}`}
      aria-label={`Open ${project.name} details`}
      onClick={handleClick}
      className="card-hover relative block overflow-hidden border-b border-[#464646] bg-black"
    >
      <span
        aria-hidden
        className="card-fill pointer-events-none absolute inset-0 z-0 bg-[#1a1a1a]"
      />
      <div className="relative z-10 grid grid-cols-1 gap-8 px-[30px] py-10 md:grid-cols-12 md:gap-10 md:py-14">
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
              <span>{statusLabel(project.status)}</span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <div
            className={`grid grid-cols-2 gap-2 md:gap-3 ${
              displayImages.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
            }`}
          >
            {displayImages.map((img, i) => (
              <div key={`${project.id}-${i}`} {...(i === 0 ? { "data-row-hero": "" } : {})}>
                <RevealImage
                  src={projectImage(img.src)}
                  alt={img.alt ?? `${project.name} - image ${i + 1}`}
                  fill
                  priority={priority && i === 0}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 24vw, 50vw"
                  className={`object-cover ${i === 0 ? "object-top" : ""}`}
                  containerClassName="relative aspect-[4/3] w-full"
                  shown={shown}
                  delay={i * REVEAL_STAGGER}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProjectGalleryCard({
  project,
  disabled,
  onSelect,
  priority = false,
}: {
  project: Project;
  disabled: boolean;
  onSelect: (heroImgEl: HTMLElement) => void;
  priority?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
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

  const heroRef = projectHeroImage(project);
  const heroSrc = heroRef?.src ? projectImage(heroRef.src) : null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (disabled) {
      e.preventDefault();
      return;
    }
    const el = e.currentTarget.querySelector(
      "[data-row-hero]",
    ) as HTMLElement | null;
    if (!el) return;
    e.preventDefault();
    onSelect(el);
  };

  const detail = (delay: number) =>
    ({
      className: `reveal ${shown ? "is-in" : ""} flex items-center gap-1.5`,
      style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
    });

  return (
    <Link
      ref={ref}
      href={`/project/${project.slug}`}
      aria-label={`Open ${project.name} details`}
      onClick={handleClick}
      className="card-hover relative block overflow-hidden bg-black border-[#464646] [&:not(:first-child)]:border-t md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2n)]:border-l xl:[&:nth-child(3)]:border-t-0 xl:[&:nth-child(3n+1)]:!border-l-0 xl:[&:nth-child(3n+2)]:border-l xl:[&:nth-child(3n)]:border-l"
    >
      <span
        aria-hidden
        className="card-fill pointer-events-none absolute inset-0 z-0 bg-[#1a1a1a]"
      />
      <div className="relative z-10 p-[30px]">
        <div data-row-hero className="relative aspect-[4/3] w-full bg-[#0f0f0f]">
          {heroSrc ? (
            <RevealImage
              src={heroSrc}
              alt={heroRef?.alt ?? project.name}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top"
              containerClassName="absolute inset-0"
              shown={shown}
            />
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-5">
          <h3
            className={`reveal ${shown ? "is-in" : ""} text-[24px] font-medium leading-[1.15] tracking-tight md:text-[28px]`}
            style={{ "--reveal-delay": "500ms" } as CSSProperties}
          >
            {project.name}
          </h3>
          <ul className="flex flex-col gap-2 text-[15px] text-[#737373] md:text-[16px]">
            <li {...detail(620)}>
              <BedIcon />
              <span>{project.category}</span>
            </li>
            <li {...detail(720)}>
              <MapPinIcon />
              <span>{project.location}</span>
            </li>
            <li {...detail(820)}>
              <AreaIcon />
              <span>{project.area}</span>
            </li>
            <li {...detail(920)}>
              <StatusIcon />
              <span>{statusLabel(project.status)}</span>
            </li>
          </ul>
        </div>
      </div>
    </Link>
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
