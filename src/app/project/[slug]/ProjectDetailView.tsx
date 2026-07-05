"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { EnquiryModal } from "@/components/EnquiryModal";
import { MinimalMap } from "@/components/MinimalMap";
import { RevealImage } from "@/components/RevealImage";
import { setProjectTransition } from "@/lib/projectTransition";
import { SiteFooter } from "@/components/SiteFooter";
import {
  ArrowUpRight,
  Armchair,
  Barbell,
  BabyCarriage,
  Books,
  Car,
  Check,
  Copy,
  Elevator,
  FirstAid,
  GraduationCap,
  type Icon,
  MapTrifold,
  NavigationArrow,
  PersonSimpleWalk,
  SecurityCamera,
  SolarPanel,
  SwimmingPool,
  Train,
  Tree,
  X,
} from "@phosphor-icons/react";
import { WordReveal, useFromProjects } from "@/components/HeroIntro";
import {
  getOrderedSections,
  projectImage,
  type AmenityKey,
  type CustomSection,
  type Landmark,
  type LandmarkCategory,
  type Pillar,
  type Project,
} from "@/lib/projects";
import { LANDMARK_COORDS } from "@/lib/landmarkCoords";

export function ProjectDetailView({
  project,
  heroAspect,
}: {
  project: Project;
  heroAspect?: number;
}) {
  const detail = project.detail;
  if (!detail) return null;

  // Single source of truth: everything renders from the project's `detail`
  // (src/data/projects.json). Section visibility is controlled by
  // disabledSections via getOrderedSections.
  const renderers: Record<string, () => ReactNode> = {
    hero: () => <Hero project={project} heroAspect={heroAspect} />,
    overview: () => <Overview project={project} />,
    facts: () => <ProjectFacts project={project} />,
    amenities: () => <Amenities project={project} />,
    "master-plan": () => <MasterPlan project={project} />,
    "floor-plans": () => <FloorPlans project={project} />,
    gallery: () => <Gallery project={project} />,
    specifications: () => <Specifications project={project} />,
    location: () => <LocationSection project={project} />,
    pillars: () => <Pillars project={project} />,
    walkthrough: () => <Walkthrough project={project} />,
  };

  const sections = getOrderedSections(project);

  return (
    <main className="relative min-h-screen w-full bg-black pt-[80px] text-white md:pt-0">
      {sections.map((s) => {
        if (s.kind === "custom") {
          return <CustomSectionView key={s.key} section={s.custom} />;
        }
        const node = renderers[s.key]?.();
        return node ? <Fragment key={s.key}>{node}</Fragment> : null;
      })}
      <SiteFooter />
      <EnquiryModal
        project={{
          name: project.name,
          slug: project.slug,
          location: project.location,
          rera: project.rera,
        }}
      />
    </main>
  );
}

// -------------------- Hero --------------------

function Hero({
  project,
  heroAspect,
}: {
  project: Project;
  heroAspect?: number;
}) {
  const detail = project.detail!;
  const heroSrc = projectImage(detail.hero.image.src);
  const fromProjects = useFromProjects();

  const titleStart = fromProjects ? 250 : 450;
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Hold the zoom overlay until this hero has actually painted (cleared on the
  // image's onLoad below); the timer is only a safety fallback so the overlay
  // can never get stuck if onLoad never fires (e.g. instant cache hit).
  useEffect(() => {
    if (!fromProjects) return;
    const id = window.setTimeout(() => setProjectTransition(null), 700);
    return () => window.clearTimeout(id);
  }, [fromProjects]);

  return (
    <>
    <section
      ref={sectionRef}
      className={`relative w-full ${
        !heroSrc
          ? "min-h-[60svh] md:min-h-[40svh]"
          : heroAspect
          ? "min-h-[50svh] md:min-h-[100svh]"
          : "h-[80svh] md:h-[200vh] md:min-h-[1280px]"
      }`}
      style={heroSrc && heroAspect ? { aspectRatio: String(heroAspect) } : undefined}
    >
      {heroSrc ? (
        <div className={`absolute inset-0 ${fromProjects ? "" : "hero-expand"}`}>
          <Image
            src={heroSrc}
            alt={detail.hero.image.alt ?? project.name}
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="100vw"
            onLoad={fromProjects ? () => setProjectTransition(null) : undefined}
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}
      {/* Mobile shows the plain image at its natural ratio with the title
          below it; the gradients + overlaid title are a md+ treatment. */}
      <div className="hidden bg-gradient-to-b from-black/40 via-transparent to-black/65 absolute inset-0 md:block" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[150px] bg-gradient-to-b from-transparent to-black md:block"
      />

      <div className="absolute inset-0 z-10 hidden flex-col justify-end md:flex">
        <div className="sticky bottom-0 left-0 flex h-[350px] w-full flex-col justify-end pb-[90px] pl-[30px]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 bottom-0"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)"
            }}
          />
          <div
            ref={titleRef}
            className="relative z-10 flex flex-col gap-3"
          >
            <WordReveal
              as="h1"
              text={project.name}
              startDelay={titleStart}
              className="text-[44px] font-medium leading-[1] tracking-tight md:text-[88px]"
            />
          </div>
        </div>
      </div>
    </section>

    <div className="flex flex-col gap-3 px-[30px] pb-10 pt-6 md:hidden">
      <Reveal delay={titleStart - 100}>
        <Link
          href="/projects"
          className="cta-underline relative inline-flex w-fit items-center gap-2 pb-1 text-sm font-medium text-white/85 hover:text-white"
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
          Back to Our Projects
          <span
            aria-hidden
            className="cta-underline-bar absolute bottom-0 left-0 h-px w-full bg-current"
          />
        </Link>
      </Reveal>
      <WordReveal
        as="span"
        text={project.name}
        startDelay={titleStart}
        className="text-[44px] font-medium leading-[1] tracking-tight"
      />
    </div>
    </>
  );
}

const GUJRERA_URL = "https://gujrera.gujarat.gov.in/#/project-preview";

// A real GujRERA registration number (e.g. "RAA11279"); excludes free text like
// "Pre-RERA project" so only genuine numbers become clickable.
function isReraNumber(rera: string | undefined): rera is string {
  return !!rera && /^[A-Za-z]{2,}\d{3,}$/.test(rera.trim());
}

// Copy synchronously so the write completes before focus leaves the document
// (async navigator.clipboard.writeText rejects once a new tab steals focus).
function copyTextSync(text: string) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    // best-effort async fallback
    try {
      void navigator.clipboard?.writeText(text);
    } catch {
      /* ignore */
    }
  }
}

// The RERA registration number, linked to the GujRERA portal. Clicking copies
// the number and opens the project-preview page (the portal has no deep-link to
// prefill its search, so the user pastes it into the search bar there).
function ReraLink({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  const copy = () => {
    copyTextSync(number);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  };
  return (
    <dd className="flex items-center gap-2.5">
      <span className="group inline-flex items-center gap-2.5">
        <button
          type="button"
          onClick={copy}
          title="Click to copy RERA number"
          className="text-[20px] font-medium leading-[1.2] tracking-tight text-white transition-colors group-hover:text-[#c19b4d] md:text-[24px]"
        >
          {number}
        </button>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy RERA number"
          title="Copy RERA number"
          className="text-white/45 transition-colors group-hover:text-[#c19b4d]"
        >
          {copied ? (
            <Check size={18} weight="bold" className="text-[#c19b4d]" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </span>
      <a
        href={GUJRERA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open GujRERA portal"
        title="Open GujRERA portal"
        className="text-white/45 transition-colors hover:text-[#c19b4d]"
      >
        <ArrowUpRight size={18} weight="bold" />
      </a>
    </dd>
  );
}

function ProjectFacts({ project }: { project: Project }) {
  const facts: { label: string; value: string; sub?: string; link?: boolean }[] = [
    { label: "Location", value: project.location },
    { label: "Type", value: project.category },
  ];
  if (project.rera) {
    facts.push({
      label: "RERA",
      value: project.rera,
      sub: project.reraIssuedOn ? `Issued ${project.reraIssuedOn}` : undefined,
      link: isReraNumber(project.rera),
    });
  }
  const total = facts.length + 1; // + Carpet Area cell
  const mdColsClass = total === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  // Rows separate via each lower cell's border-t; a border-b would double it.
  // Only the cell sitting above an empty slot (odd count) needs its own line.
  const cellClass = (i: number) =>
    `flex flex-col gap-3 border-t border-[#464646] px-[30px] py-10 md:py-14 ${
      i < total - 1 ? "md:border-r md:border-[#464646]" : ""
    } ${
      total % 2 === 1 && i === total - 2 ? "border-b border-[#464646] md:border-b-0" : ""
    } ${i % 2 === 0 && i + 1 < total ? "border-r border-[#464646]" : ""}`;
  return (
    <section className="border-t border-[#464646] bg-black">
      <dl className={`grid grid-cols-2 ${mdColsClass}`}>
        {facts.map((f, i) => (
          <Reveal
            key={f.label}
            delay={120 + i * 100}
            className={cellClass(i)}
          >
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[13px] tracking-normal text-white/55">
                {f.label}
              </dt>
              {f.sub && (
                <span className="hidden text-[13px] tracking-normal text-white/55 md:block">
                  {f.sub}
                </span>
              )}
            </div>
            {f.link ? (
              <ReraLink number={f.value} />
            ) : (
              <dd className="text-[20px] font-medium leading-[1.2] tracking-tight text-white md:text-[24px]">
                {f.value}
              </dd>
            )}
            {f.sub && (
              <span className="text-[13px] tracking-normal text-white/55 md:hidden">
                {f.sub}
              </span>
            )}
          </Reveal>
        ))}
        <CarpetAreaCell
          project={project}
          delay={120 + facts.length * 100}
          className={cellClass(facts.length)}
        />
      </dl>
    </section>
  );
}

function extractAreaRange(project: Project, key: string): string | null {
  const plans = project.detail?.floorPlans.groups.flatMap((g) => g.plans) ?? [];
  const nums: number[] = [];
  for (const p of plans) {
    for (const m of p.metrics) {
      if (m.label.toUpperCase().includes(key)) {
        const n = parseFloat(m.value.replace(/,/g, "").replace(/[^\d.]/g, ""));
        if (Number.isFinite(n) && n > 0) nums.push(n);
      }
    }
  }
  if (nums.length === 0) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
  if (min === max) return `${fmt(min)} Sq. Ft.`;
  return `${fmt(min)} - ${fmt(max)} Sq. Ft.`;
}

function CarpetAreaCell({
  project,
  delay,
  className,
}: {
  project: Project;
  delay: number;
  className: string;
}) {
  const sbua = useMemo(() => extractAreaRange(project, "SBUA"), [project]);
  const tca = useMemo(() => extractAreaRange(project, "TCA"), [project]);
  const hasBoth = Boolean(sbua && tca);
  const [mode, setMode] = useState<"SBUA" | "TCA">("SBUA");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const value = hasBoth ? (mode === "SBUA" ? sbua! : tca!) : project.area;

  return (
    <Reveal delay={delay} className={`relative ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <dt className="text-[13px] tracking-tight text-white/55">{project.areaLabel ?? "Carpet Area"}</dt>
        {hasBoth ? (
          <div ref={wrapRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {mode}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms ease",
                }}
              >
                <path
                  d="M2 3.5 5 6.5l3-3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {open ? (
              <div
                role="listbox"
                className="absolute right-0 top-full z-20 mt-1 flex flex-col border border-white/15 bg-black"
              >
                {(["SBUA", "TCA"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="option"
                    aria-selected={m === mode}
                    onClick={() => {
                      setMode(m);
                      setOpen(false);
                    }}
                    className="px-3 py-1.5 text-left text-[11px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {m}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <dd className="text-[20px] font-medium leading-[1.2] tracking-tight text-white md:text-[24px]">
        {value}
      </dd>
    </Reveal>
  );
}

// -------------------- Overview --------------------

type OverviewCardData = {
  src: string;
  alt?: string;
  metric: string;
  label: string;
};

function Overview({
  project,
}: {
  project: Project;
}) {
  const detail = project.detail!;
  const rawCards = detail.summary?.cards ?? [];
  const cards: OverviewCardData[] = rawCards.slice(0, 4);

  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (cards.length === 0) return;
    let raf = 0;
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      const sec = sectionRef.current;
      if (!sec) return;
      // Parallax only on md+; on the stacked mobile grid the per-card speeds
      // push images out of their rows and into the headline.
      if (!window.matchMedia("(min-width: 768px)").matches) {
        if (textRef.current) textRef.current.style.transform = "";
        cardRefs.current.forEach((el) => {
          if (el) el.style.transform = "";
        });
        return;
      }
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));
      const centered = progress - 0.5;

      if (textRef.current) {
        textRef.current.style.transform = `translate3d(0, ${centered * -40}px, 0)`;
      }
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const speed = 130 + (i % 2) * 40 + Math.floor(i / 2) * 20;
        el.style.transform = `translate3d(0, ${centered * -speed}px, 0)`;
      });
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [cards.length]);

  // Corner assignment: 4 images fill all corners; fewer than 4 sit on opposite
  // diagonal corners (top-left + bottom-right) so the layout stays balanced; a
  // lone image sits top-left.
  const n = cards.length;
  const tl = cards[0];
  const tr = n >= 4 ? cards[1] : undefined;
  const bl = n >= 4 ? cards[2] : undefined;
  const br = n >= 4 ? cards[3] : n >= 2 ? cards[1] : undefined;

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-black px-[30px] py-20 md:flex md:h-[100vh] md:min-h-[720px] md:items-center md:py-0"
    >
      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-6 md:h-full md:grid-cols-12 md:grid-rows-[1fr_auto_1fr] md:gap-x-10 md:gap-y-10 md:py-20">
        {tl ? (
          <OverviewCard
            card={tl}
            cardRef={(el) => { cardRefs.current[0] = el; }}
            className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-1 md:self-start"
          />
        ) : null}
        {tr ? (
          <OverviewCard
            card={tr}
            cardRef={(el) => { cardRefs.current[1] = el; }}
            className="col-span-1 md:col-span-3 md:col-start-10 md:row-start-1 md:self-start"
          />
        ) : null}

        <div
          ref={textRef}
          className="col-span-full flex flex-col items-center justify-center py-4 text-center will-change-transform md:col-span-6 md:col-start-4 md:row-start-2 md:py-0"
        >
          <Reveal>
            <h2 className="max-w-[24ch] whitespace-pre-line text-[28px] font-normal leading-[1.15] tracking-tight md:text-[44px]">
              {detail.intro.headline}
            </h2>
          </Reveal>
          {project.type === "residential" && detail.intro.brochureUrl ? (
            <Reveal delay={150} className="mt-8">
              <a
                href={detail.intro.brochureUrl}
                download
                className="cta-underline relative inline-flex w-fit items-center gap-2 pb-1 text-sm font-medium text-white hover:text-white/85"
              >
                Download Brochure
                <span aria-hidden className="text-base leading-none">&rarr;</span>
                <span
                  aria-hidden
                  className="cta-underline-bar absolute bottom-0 left-0 h-px w-full bg-current"
                />
              </a>
            </Reveal>
          ) : null}
        </div>

        {bl ? (
          <OverviewCard
            card={bl}
            cardRef={(el) => { cardRefs.current[2] = el; }}
            className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-3 md:self-end"
          />
        ) : null}
        {br ? (
          <OverviewCard
            card={br}
            cardRef={(el) => { cardRefs.current[3] = el; }}
            className="col-span-1 md:col-span-3 md:col-start-10 md:row-start-3 md:self-end"
          />
        ) : null}
      </div>
    </section>
  );
}

function OverviewCard({
  card,
  cardRef,
  className = "",
}: {
  card: OverviewCardData;
  cardRef: (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  return (
    <div ref={cardRef} className={`relative will-change-transform ${className}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={projectImage(card.src)}
          alt={card.alt ?? `${card.metric} ${card.label}`}
          fill
          quality={90}
          sizes="(min-width: 768px) 22vw, 50vw"
          className="object-cover"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}

// -------------------- Amenities --------------------

function Amenities({
  project,
}: {
  project: Project;
}) {
  const detail = project.detail!;
  const featureSrc = detail.amenities.feature?.src
    ? projectImage(detail.amenities.feature.src)
    : null;
  return (
    <section
      id="amenities"
      className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:flex md:h-[90vh] md:min-h-[640px] md:flex-col md:py-24"
    >
      <Reveal>
        <h2 className="max-w-[16ch] text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
          {detail.amenities.headline}
        </h2>
      </Reveal>
      {detail.amenities.body ? (
        <Reveal delay={150}>
          <p className="mt-4 max-w-[60ch] text-sm leading-[1.6] text-white/70 md:text-base">
            {detail.amenities.body}
          </p>
        </Reveal>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-10 md:min-h-0 md:flex-1 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7 md:h-full">
          {featureSrc ? (
            <RevealImage
              src={featureSrc}
              alt={detail.amenities.feature?.alt ?? `${project.name} amenities`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              containerClassName="relative aspect-[4/3] w-full md:aspect-auto md:h-full"
            />
          ) : (
            <div className="aspect-[4/3] w-full bg-[#111] md:aspect-auto md:h-full" />
          )}
        </div>

        <div className="md:col-span-5 md:h-full">
          <ul className="grid h-full grid-cols-2 gap-2 md:grid-cols-2 md:gap-3">
            {detail.amenities.items.map((item) => (
              <li
                key={item.key}
                className="flex flex-col items-start gap-3 p-5 md:p-6"
              >
                <AmenityIcon iconKey={item.key} />
                <span className="text-[14px] leading-[1.3] text-white/85">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// -------------------- Master Plan --------------------

// Floor-plan & master-plan images are re-exported in place (same filename)
// when updated, so a browser/CDN holding an older copy would serve it stale.
// Bump this version whenever those plan assets change to force a refetch.
const PLAN_ASSET_VERSION = "20260703";
function planImage(src: string): string {
  const url = projectImage(src);
  if (!src) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${PLAN_ASSET_VERSION}`;
}

function MasterPlan({ project }: { project: Project }) {
  const block = project.detail?.masterPlan;
  // Mobile shows the plan full-bleed at its own aspect ratio (measured on
  // load) so portrait plans aren't letterboxed; md: keeps the 16/10 stage.
  const [planRatio, setPlanRatio] = useState<number | null>(null);
  if (!block || !block.image.src) return null;
  return (
    <section id="master-plan" className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="flex flex-col gap-2">
        <Reveal>
          <h2 className="text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
            {block.headline}
          </h2>
        </Reveal>
        {block.body ? (
          <Reveal delay={150}>
            <p className="max-w-[60ch] text-sm leading-[1.6] text-white/70 md:text-base">
              {block.body}
            </p>
          </Reveal>
        ) : null}
      </div>

      <div className="-mx-[30px] mt-10 md:mx-0 md:mt-14">
        <RevealImage
          src={planImage(block.image.src)}
          alt={block.image.alt ?? `${project.name} master plan`}
          fill
          unoptimized
          sizes="100vw"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setPlanRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
          className="object-contain md:p-12"
          containerClassName="relative w-full aspect-[var(--plan-aspect)] md:aspect-[16/10]"
          containerStyle={{
            ["--plan-aspect" as string]: String(planRatio ?? 16 / 10),
          }}
        />
      </div>
    </section>
  );
}

// -------------------- Floor Plans --------------------

function FloorPlans({ project }: { project: Project }) {
  const detail = project.detail!;
  const groups = detail.floorPlans.groups;
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const activeGroup = groups.find((g) => g.id === groupId) ?? groups[0];
  const [planId, setPlanId] = useState(activeGroup?.plans[0]?.id ?? "");
  const activePlan =
    activeGroup?.plans.find((p) => p.id === planId) ?? activeGroup?.plans[0];

  // Hide the whole section when no tab has an actual plan image (otherwise it
  // would render "Floor plan coming soon" for every tab).
  const hasAnyImage = groups.some((g) =>
    g.plans.some((p) => p.image?.src?.trim()),
  );

  if (!activeGroup || !activePlan || !hasAnyImage) return null;

  // Tabs show only the config ("2 BHK"); any "(Block …)" detail in the group
  // label is surfaced in the details list below instead.
  const tabLabel = (label: string) => label.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const blocksOf = (label: string) => label.match(/\(([^)]*)\)\s*$/)?.[1]?.trim() ?? "";
  const activeBlocks = blocksOf(activeGroup.label);

  return (
    <section id="floor-plans" className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
              {detail.floorPlans.headline}
            </h2>
          </Reveal>
          {detail.floorPlans.body ? (
            <Reveal delay={150}>
              <p className="mt-4 max-w-[44ch] text-sm leading-[1.6] text-white/70 md:text-base">
                {detail.floorPlans.body}
              </p>
            </Reveal>
          ) : null}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10 md:items-start">
        <div className="md:col-span-6">
          {groups.length > 1 ? (
            <div className="grid w-full grid-cols-2 border border-[#2a2a2a] md:flex">
              {groups.map((g) => {
                const active = g.id === activeGroup.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setGroupId(g.id);
                      const firstPlan = g.plans[0]?.id ?? "";
                      setPlanId(firstPlan);
                    }}
                    className={`-ml-px -mt-px h-[56px] flex-1 border-l border-t border-[#2a2a2a] px-3 text-center text-[12px] uppercase tracking-[0.08em] last:odd:col-span-2 ${
                      active ? "z-10 bg-white text-black" : "bg-transparent text-white/80 hover:bg-white/5"
                    }`}
                    aria-pressed={active}
                  >
                    {tabLabel(g.label)}
                  </button>
                );
              })}
            </div>
          ) : null}

          {activeGroup.plans.length > 1 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {activeGroup.plans.map((p) => {
                const active = p.id === activePlan.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    className={`h-[36px] border border-[#2a2a2a] px-4 text-[12px] uppercase tracking-[0.06em] ${
                      active ? "bg-white text-black" : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[#2a2a2a] py-5">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-white/55">Plan type</dt>
              <dd className="mt-2 text-[18px] text-white">{activePlan.label}</dd>
            </div>
            {activeBlocks ? (
              <div>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-white/55">Blocks</dt>
                <dd className="mt-2 text-[18px] text-white">{activeBlocks}</dd>
              </div>
            ) : null}
            {activePlan.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-white/55">{m.label}</dt>
                <dd className="mt-2 text-[18px] text-white">{m.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 flex flex-col gap-2 text-sm text-white/75">
            {activePlan.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span aria-hidden className="mt-2 inline-block h-px w-3 bg-white/40" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {activePlan.note ? (
            <p className="mt-6 text-[11px] text-white/40">{activePlan.note}</p>
          ) : null}
        </div>

        <div className="md:col-span-6">
          {activePlan.image.src ? (
            <RevealImage
              key={activePlan.id}
              src={planImage(activePlan.image.src)}
              alt={activePlan.image.alt ?? `${project.name} ${activePlan.label} floor plan`}
              fill
              unoptimized
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-contain"
              containerClassName="relative aspect-[4/3] w-full"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-white/[0.03] text-sm text-white/35">
              Floor plan coming soon
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// -------------------- Specifications --------------------

function Specifications({ project }: { project: Project }) {
  const detail = project.detail!;
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <section id="specifications" className="scroll-mt-24 border-t border-[#464646] bg-black">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
        <div className="px-[30px] pt-12 md:pr-16 md:pt-16">
          <Reveal>
            <h2 className="max-w-[16ch] text-[34px] font-normal leading-[1.1] tracking-tight md:text-[52px]">
              {detail.specifications.headline}
            </h2>
          </Reveal>
        </div>

        <div className="md:border-l md:border-[#464646]">
          <ul>
            {detail.specifications.items.map((item, i) => {
              const open = item.id === openId;
              const isLast = i === detail.specifications.items.length - 1;
              return (
                <li
                  key={item.id}
                  className={isLast ? "" : "border-b border-[#464646]"}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 px-[30px] py-7 text-left md:px-8 md:py-8"
                    aria-expanded={open}
                  >
                    <span className="text-[18px] font-normal text-white md:text-[20px]">
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className="text-[28px] font-light leading-none text-white/70 transition-transform"
                      style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid overflow-hidden transition-[grid-template-rows] duration-300"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-[30px] pb-7 text-[15px] leading-[1.6] text-white/65 md:px-8 md:text-base">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// -------------------- Gallery --------------------

function Gallery({
  project,
}: {
  project: Project;
}) {
  const detail = project.detail!;
  const images = detail.gallery.images;
  if (images.length === 0) return null;
  return (
    <section id="gallery" className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="flex flex-col gap-2">
        <Reveal>
          <h2 className="text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
            {detail.gallery.headline}
          </h2>
        </Reveal>
        {detail.gallery.body ? (
          <Reveal delay={150}>
            <p className="max-w-[60ch] text-sm leading-[1.6] text-white/70 md:text-base">
              {detail.gallery.body}
            </p>
          </Reveal>
        ) : null}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-2 md:mt-14 md:grid-cols-4 md:gap-3">
        {images.map((img, i) => (
          <RevealImage
            key={`gallery-${i}`}
            src={projectImage(img.src)}
            alt={img.alt ?? `${project.name} gallery ${i + 1}`}
            fill
            sizes={i === 0 ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 768px) 22vw, 50vw"}
            quality={90}
            className="object-cover"
            containerClassName={`relative w-full ${i === 0 ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-square" : "aspect-[4/3] md:aspect-square"}`}
            delay={(i % 4) * 120}
          />
        ))}
      </div>
    </section>
  );
}

// -------------------- Location --------------------

const LANDMARK_CATEGORIES: { key: LandmarkCategory; label: string }[] = [
  { key: "education", label: "Education" },
  { key: "healthcare", label: "Healthcare" },
  { key: "recreation", label: "Leisure" },
  { key: "transit", label: "Connectivity" },
];

const LANDMARK_ICONS: Record<LandmarkCategory, typeof GraduationCap> = {
  education: GraduationCap,
  healthcare: FirstAid,
  recreation: Tree,
  transit: Train,
};

function LocationSection({ project }: { project: Project }) {
  const location = project.detail?.location;
  // Attach real geocoded positions (Mappls) and keep only landmarks we could
  // place — pins are never synthesised, so an un-geocoded landmark is omitted
  // rather than dropped onto a fake spot.
  const mappedLandmarks = useMemo<Landmark[]>(() => {
    if (!location) return [];
    return location.landmarks.flatMap((l) => {
      const coords = LANDMARK_COORDS[`${project.slug}::${l.name}`];
      return coords ? [{ ...l, coords }] : [];
    });
  }, [location, project.slug]);

  const availableCategories = useMemo(
    () =>
      LANDMARK_CATEGORIES.filter((c) =>
        mappedLandmarks.some((l) => l.category === c.key),
      ).map((c) => c.key),
    [mappedLandmarks],
  );

  // No category selected by default → the map shows every kind of pin at once
  // ("all the things nearby" at a glance). Selecting a tab filters to it.
  const [active, setActive] = useState<LandmarkCategory | null>(null);
  const [selected, setSelected] = useState<Landmark | null>(null);

  if (!location || mappedLandmarks.length === 0) return null;

  return (
    <section
      id="location"
      className="scroll-mt-24 border-t border-[#464646] bg-black pt-16 md:pt-24"
    >
      <div className="flex flex-col gap-2 px-[30px]">
        <Reveal>
          <h2 className="text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
            {location.headline}
          </h2>
        </Reveal>
        {location.body ? (
          <Reveal delay={150}>
            <p className="max-w-[60ch] text-sm leading-[1.6] text-white/70 md:text-base">
              {location.body}
            </p>
          </Reveal>
        ) : null}
      </div>

      <div className="relative mt-10 md:mt-14">
        <MinimalMap
          coords={location.coords}
          landmarks={mappedLandmarks}
          activeCategory={active ?? undefined}
          className="aspect-[3/4] md:aspect-auto md:h-[80vh] md:min-h-[640px]"
          projectName={project.name}
          onSelectLandmark={setSelected}
          selectedName={selected?.name ?? null}
        />
        <div className="golden-map-tabs absolute left-[19px] top-[22px] z-10 sm:left-[30px] sm:top-[30px]">
          <button
            type="button"
            onClick={() => {
              setActive(null);
              setSelected(null);
            }}
            className="golden-map-tab"
            data-active={active === null}
            aria-pressed={active === null}
          >
            <span className="golden-map-tab__icon">
              <MapTrifold size={24} weight="regular" color="currentColor" />
            </span>
            All Landmarks
          </button>
          {availableCategories.map((key) => {
            const Icon = LANDMARK_ICONS[key];
            const label = LANDMARK_CATEGORIES.find((c) => c.key === key)!.label;
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  // Toggle: tapping the active tab again clears the filter and
                  // returns to showing every category.
                  setActive((prev) => (prev === key ? null : key));
                  setSelected(null);
                }}
                className="golden-map-tab"
                data-active={isActive}
                aria-pressed={isActive}
              >
                <span className="golden-map-tab__icon">
                  <Icon size={24} weight="regular" color="currentColor" />
                </span>
                {label}
              </button>
            );
          })}
        </div>

        <LandmarkPanel
          landmark={selected}
          area={location.address ?? project.location}
          projectName={project.name}
          projectCoords={location.coords}
          onClose={() => setSelected(null)}
        />
      </div>
    </section>
  );
}

function LandmarkPanel({
  landmark,
  area,
  projectName,
  projectCoords,
  onClose,
}: {
  landmark: Landmark | null;
  area: string;
  projectName: string;
  projectCoords: [number, number];
  onClose: () => void;
}) {
  if (!landmark) return null;

  const Icon = LANDMARK_ICONS[landmark.category];
  const categoryLabel =
    LANDMARK_CATEGORIES.find((c) => c.key === landmark.category)?.label ??
    "Nearby";
  const [lng, lat] = projectCoords;
  const query = encodeURIComponent(`${landmark.name}, ${area}`);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${query}`;
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const distance =
    landmark.distanceKm < 1
      ? `${Math.round(landmark.distanceKm * 1000)} m`
      : `${landmark.distanceKm} km`;

  return (
    <div className="pointer-events-auto absolute bottom-3 left-3 z-20 w-[250px] max-w-[calc(100%-24px)] sm:bottom-auto sm:left-auto sm:right-[30px] sm:top-[30px] sm:w-[330px] sm:max-w-none">
      <div className="relative rounded-xl border border-[#464646] bg-black/85 p-5 shadow-2xl backdrop-blur-md sm:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} weight="bold" />
        </button>

        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#d6b25e]">
          <Icon size={16} weight="regular" />
          <span>{categoryLabel}</span>
        </div>

        <h3 className="mt-3 max-w-[22ch] text-[22px] font-normal leading-[1.2] tracking-tight text-white">
          {landmark.name}
        </h3>

        <p className="mt-3 text-[13px] leading-[1.5] text-white/60">
          <span className="text-white/85">{landmark.minutes} min</span> drive ·{" "}
          {distance} from {projectName}
        </p>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#c19b4d] px-5 py-3 text-[13px] font-medium tracking-wide text-black transition hover:bg-[#d6b25e]"
        >
          <NavigationArrow size={16} weight="fill" />
          Directions
        </a>

        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-[12px] text-white/45 underline-offset-4 transition hover:text-white/70 hover:underline"
        >
          View address, hours &amp; photos on Google Maps
        </a>
      </div>
    </div>
  );
}

// -------------------- Pillars --------------------

function Pillars({ project }: { project: Project }) {
  const detail = project.detail!;
  if (detail.pillars.items.length === 0) return null;
  return (
    <section className="border-t border-[#464646] bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {detail.pillars.items.map((p, i) => (
          <Reveal
            key={p.id}
            delay={i * 100}
            className="border-b border-[#464646] [&:nth-last-child(-n+1)]:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(2n)]:border-r md:[&:nth-child(4n)]:border-r-0 md:[&:nth-last-child(-n+4)]:border-b-0"
          >
            <div className="flex h-full flex-col gap-6 p-10 md:p-14">
              <PillarIcon pillar={p} />
              <h3 className="text-[20px] font-normal leading-[1.4] text-white">
                {p.title}
              </h3>
              <p className="text-[13px] leading-[1.5] text-white/65">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// -------------------- Walkthrough --------------------

function youTubeEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.endsWith("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    return null;
  }
  return null;
}

function Walkthrough({ project }: { project: Project }) {
  const walkthrough = project.detail?.walkthrough;
  if (!walkthrough?.videoUrl) return null;
  const embed = youTubeEmbedSrc(walkthrough.videoUrl);

  return (
    <section
      id="walkthrough"
      className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24"
    >
      <div className="flex flex-col gap-2">
        <Reveal>
          <h2 className="text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
            {walkthrough.headline}
          </h2>
        </Reveal>
        {walkthrough.body ? (
          <Reveal delay={150}>
            <p className="max-w-[60ch] text-sm leading-[1.6] text-white/70 md:text-base">
              {walkthrough.body}
            </p>
          </Reveal>
        ) : null}
      </div>

      <div className="mt-10 md:mt-14">
        {embed ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
            <iframe
              src={embed}
              title={`${project.name} walkthrough`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <a
            href={walkthrough.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex aspect-[16/9] w-full items-center justify-center bg-white/[0.03] text-sm text-white/60 underline"
          >
            Watch walkthrough
          </a>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-[200px] text-sm leading-[1.4] text-white">
          Want to discuss this project?
        </p>
        <BrochurePill href="/contact" label="Contact Us" />
      </div>
    </section>
  );
}

// -------------------- Custom (studio-authored) section --------------------

function CustomSectionView({ section }: { section: CustomSection }) {
  const media = (section.media ?? []).filter((m) => m && m.src);
  const embed = section.videoUrl ? youTubeEmbedSrc(section.videoUrl) : null;
  const hasContent =
    section.headline || section.body || media.length > 0 || section.videoUrl;
  if (!hasContent) return null;

  const cols = section.columns ?? 3;
  const colClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id={`custom:${section.id}`}
      className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24"
    >
      {section.headline || section.body ? (
        <div className="flex flex-col gap-2">
          {section.headline ? (
            <Reveal>
              <h2 className="text-[32px] font-normal leading-[1.2] tracking-tight md:text-[42px]">
                {section.headline}
              </h2>
            </Reveal>
          ) : null}
          {section.body ? (
            <Reveal delay={150}>
              <p className="max-w-[70ch] whitespace-pre-line text-sm leading-[1.6] text-white/70 md:text-base">
                {section.body}
              </p>
            </Reveal>
          ) : null}
        </div>
      ) : null}

      {media.length > 0 ? (
        <div className={`mt-10 grid grid-cols-1 gap-3 md:mt-14 ${colClass}`}>
          {media.map((img, i) => (
            <figure key={`${img.src}-${i}`} className="flex flex-col gap-2">
              <RevealImage
                src={projectImage(img.src)}
                alt={img.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={90}
                className="object-cover"
                containerClassName="relative aspect-[4/3] w-full bg-white/[0.03]"
                delay={(i % 4) * 120}
              />
              {img.caption ? (
                <figcaption className="text-xs leading-[1.4] text-white/50">
                  {img.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      {embed ? (
        <div className="mt-10 md:mt-14">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
            <iframe
              src={embed}
              title={section.headline || "Video"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      ) : section.videoUrl ? (
        <div className="mt-10 md:mt-14">
          <a
            href={section.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex aspect-[16/9] w-full items-center justify-center bg-white/[0.03] text-sm text-white/60 underline"
          >
            Watch video
          </a>
        </div>
      ) : null}
    </section>
  );
}

// -------------------- Shared bits --------------------

function BrochurePill({ href, label = "Download Brochure" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="pill-hover relative block h-[60px] w-full shrink-0 overflow-hidden bg-white text-black sm:w-[260px]"
    >
      <span aria-hidden className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]" />
      <span className="relative z-10 flex h-full w-full items-end justify-between px-3 pb-2 text-sm font-medium">
        {label}
        <StarIcon />
      </span>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M9 0c.24-.02.45.16.48.4.28.95.5 1.91.84 2.81.36 1.12 1 2.13 1.85 2.94.86.8 1.91 1.37 3.05 1.65l2.33.67c.31 0 .45.25.45.51 0 .25-.14.39-.45.48-.93.28-1.88.5-2.8.81-2.28.74-4.01 2.6-4.6 4.92l-.67 2.36c0 .28-.25.45-.48.45-.22 0-.39-.17-.48-.45-.31-1.01-.53-2.08-.92-3.06-.79-2.15-2.58-3.78-4.79-4.36L.45 9.45c-.31 0-.45-.25-.45-.48 0-.12.04-.24.12-.33.08-.09.18-.15.3-.17 1.01-.28 2.02-.5 3-.87 1.09-.38 2.06-1.03 2.83-1.89.78-.85 1.32-1.89 1.6-3.01l.67-2.34A.5.5 0 0 1 9 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

// -------------------- Icons --------------------

const AMENITY_ICONS: Record<AmenityKey, Icon> = {
  "walking-track": PersonSimpleWalk,
  security: SecurityCamera,
  "solar-power": SolarPanel,
  garden: Tree,
  "play-area": BabyCarriage,
  elevators: Elevator,
  parking: Car,
  gym: Barbell,
  pool: SwimmingPool,
  clubhouse: Armchair,
  library: Books,
};

function AmenityIcon({ iconKey }: { iconKey: AmenityKey }) {
  const Icon = AMENITY_ICONS[iconKey];
  if (!Icon) return null;
  return <Icon size={28} weight="light" className="text-white" aria-hidden />;
}

const PILLAR_ICON_SRC: Record<Pillar["iconKey"], string> = {
  "zero-out": "/icons/zero-out.svg",
  "smart-power": "/icons/smart-power.svg",
  "climate-capsule": "/icons/climate.svg",
  "zero-waste": "/icons/zero-waste.svg",
};

function PillarIcon({ pillar }: { pillar: Pillar }) {
  const src = PILLAR_ICON_SRC[pillar.iconKey];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" aria-hidden width={48} height={48} className="h-12 w-12" />
  );
}

// -------------------- Reveal --------------------

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

