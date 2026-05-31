"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MinimalMap } from "@/components/MinimalMap";
import { RevealImage } from "@/components/RevealImage";
import { SiteFooter } from "@/components/SiteFooter";
import {
  GraduationCap,
  FirstAid,
  Tree,
  Train,
} from "@phosphor-icons/react";
import { HeroRise, WordReveal, useFromProjects } from "@/components/HeroIntro";
import {
  projectImage,
  type AmenityKey,
  type LandmarkCategory,
  type Pillar,
  type Project,
} from "@/lib/projects";

export function ProjectDetailView({ project }: { project: Project }) {
  const detail = project.detail;
  if (!detail) return null;

  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <Hero project={project} />
      <Overview project={project} />
      <Amenities project={project} />
      <MasterPlan project={project} />
      <FloorPlans project={project} />
      <Gallery project={project} />
      <Specifications project={project} />
      <LocationSection project={project} />
      <Pillars project={project} />
      <Walkthrough project={project} />
      <SiteFooter />
    </main>
  );
}

// -------------------- Hero --------------------

function Hero({ project }: { project: Project }) {
  const detail = project.detail!;
  const heroSrc = projectImage(detail.hero.image.src);
  const fromProjects = useFromProjects();

  const titleStart = fromProjects ? 250 : 450;
  const titleWords = project.name.split(/\s+/).filter(Boolean).length;
  const factsDelay = titleStart + titleWords * 70 + 80;

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {heroSrc ? (
        <div className={`absolute inset-0 ${fromProjects ? "" : "hero-expand"}`}>
          <Image
            src={heroSrc}
            alt={detail.hero.image.alt ?? project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#1a1a1a]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/65" />

      <div className="relative z-10 flex h-full w-full flex-col p-[30px] pt-[110px] md:pt-[140px]">
        <div className="mt-auto grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <WordReveal
            as="h1"
            text={project.name}
            startDelay={titleStart}
            className="text-[44px] font-medium leading-[1] tracking-tight md:text-[88px]"
          />

          <HeroRise delay={factsDelay}>
            <dl className="flex w-full max-w-[420px] flex-col divide-y divide-white/10 border border-white/10 bg-black/40 backdrop-blur-sm sm:w-[420px]">
              <HeroFact label="Location" value={project.location} />
              <HeroFact label="Type" value={project.category} />
              <HeroFact label="RERA" value={project.rera ?? "Pending"} />
              <HeroFact label="Carpet Area" value={project.area} />
              <HeroFact label="Status" value={project.status} />
            </dl>
          </HeroRise>
        </div>
      </div>
    </section>
  );
}

function HeroFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-white/55">
        {label}
      </dt>
      <dd className="text-right text-[13px] text-white/95">{value}</dd>
    </div>
  );
}

// -------------------- Overview --------------------

type OverviewCardData = {
  src: string;
  alt?: string;
  metric: string;
  label: string;
};

function Overview({ project }: { project: Project }) {
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

  if (cards.length === 0) return null;

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-black px-[30px] py-20 md:flex md:h-[100vh] md:min-h-[720px] md:items-center md:py-0"
    >
      <div className="relative mx-auto grid w-full max-w-[1500px] grid-cols-2 gap-6 md:h-full md:grid-cols-12 md:grid-rows-[1fr_auto_1fr] md:gap-x-10 md:gap-y-10 md:py-20">
        <OverviewCard
          card={cards[0]}
          align="left"
          cardRef={(el) => { cardRefs.current[0] = el; }}
          className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-1 md:self-start"
        />
        {cards[1] ? (
          <OverviewCard
            card={cards[1]}
            align="right"
            cardRef={(el) => { cardRefs.current[1] = el; }}
            className="col-span-1 md:col-span-3 md:col-start-10 md:row-start-1 md:self-start"
          />
        ) : null}

        <div
          ref={textRef}
          className="col-span-2 flex flex-col items-center justify-center text-center will-change-transform md:col-span-6 md:col-start-4 md:row-start-2"
        >
          <Reveal>
            <h2 className="max-w-[24ch] whitespace-pre-line text-[28px] font-medium leading-[1.15] tracking-tight md:text-[44px]">
              {detail.intro.headline}
            </h2>
          </Reveal>
        </div>

        {cards[2] ? (
          <OverviewCard
            card={cards[2]}
            align="left"
            cardRef={(el) => { cardRefs.current[2] = el; }}
            className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-3 md:self-end"
          />
        ) : null}
        {cards[3] ? (
          <OverviewCard
            card={cards[3]}
            align="right"
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
  align,
  cardRef,
  className = "",
}: {
  card: OverviewCardData;
  align: "left" | "right";
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
          sizes="(min-width: 768px) 22vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
        <div
          className={`absolute bottom-3 ${align === "right" ? "right-3 text-right" : "left-3 text-left"} text-white drop-shadow`}
        >
          <div className="text-[16px] font-medium leading-[1.05] tracking-tight md:text-[20px]">
            {card.metric}
          </div>
          <div className="mt-1 text-[12px] leading-[1.3] text-white/85 md:text-[13px]">
            {card.label}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Highlights --------------------

function Highlights({ project }: { project: Project }) {
  const detail = project.detail!;
  const block = detail.highlights;
  const [active, setActive] = useState(0);
  if (!block || block.items.length === 0) return null;
  const items = block.items.slice(0, 3);
  const activeItem = items[active] ?? items[0];
  return (
    <section
      id="highlights"
      className="relative scroll-mt-24 border-t border-[#464646] bg-black"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col px-[30px] py-16 md:py-24">
          <Reveal>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {items.map((img, i) => {
                const isActive = i === active;
                const label = img.caption ?? `Highlight ${i + 1}`;
                return (
                  <button
                    key={`tab-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`pb-2 text-[14px] tracking-tight transition-colors ${
                      isActive
                        ? "border-b border-white font-medium text-white"
                        : "border-b border-transparent text-white/55 hover:text-white/80"
                    }`}
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <div className="mt-auto pt-16 md:pt-24">
            <Reveal delay={120}>
              <h2 className="max-w-[18ch] text-[32px] font-medium leading-[1.1] tracking-tight md:text-[44px]">
                {block.headline}
              </h2>
            </Reveal>
            {block.body ? (
              <Reveal delay={200}>
                <p className="mt-6 max-w-[52ch] text-sm leading-[1.6] text-white/70 md:text-base">
                  {block.body}
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>

        <div className="relative md:border-l md:border-[#464646]">
          <RevealImage
            key={`highlight-image-${active}`}
            src={projectImage(activeItem.src)}
            alt={activeItem.alt ?? activeItem.caption ?? `${project.name} highlight`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            containerClassName="relative aspect-[4/5] w-full md:aspect-auto md:h-full md:min-h-[640px]"
          />
        </div>
      </div>
    </section>
  );
}

// -------------------- Amenities --------------------

function Amenities({ project }: { project: Project }) {
  const detail = project.detail!;
  const featureSrc = detail.amenities.feature?.src ? projectImage(detail.amenities.feature.src) : null;
  return (
    <section
      id="amenities"
      className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:flex md:h-[90vh] md:min-h-[640px] md:flex-col md:py-24"
    >
      <Reveal>
        <h2 className="max-w-[16ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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
              alt={detail.amenities.feature.alt ?? `${project.name} amenities`}
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

function MasterPlan({ project }: { project: Project }) {
  const block = project.detail?.masterPlan;
  if (!block || !block.image.src) return null;
  return (
    <section id="master-plan" className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="flex flex-col gap-2">
        <Reveal>
          <h2 className="text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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

      <div className="mt-10 md:mt-14">
        <RevealImage
          src={projectImage(block.image.src)}
          alt={block.image.alt ?? `${project.name} master plan`}
          fill
          sizes="100vw"
          className="object-contain"
          containerClassName="relative aspect-[16/10] w-full bg-white/[0.03]"
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

  if (!activeGroup || !activePlan) return null;

  return (
    <section id="floor-plans" className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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

      <div className="mt-10 flex flex-wrap border border-[#2a2a2a]">
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
              className={`-ml-px h-[56px] flex-1 border-l border-[#2a2a2a] px-5 text-[12px] uppercase tracking-[0.08em] first:ml-0 ${
                active ? "z-10 bg-white text-black" : "bg-transparent text-white/80 hover:bg-white/5"
              }`}
              aria-pressed={active}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          {activeGroup.plans.length > 1 ? (
            <div className="mb-6 flex flex-wrap gap-2">
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

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[#2a2a2a] py-5">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-white/55">Plan type</dt>
              <dd className="mt-2 text-[18px] text-white">{activePlan.label}</dd>
            </div>
            {activePlan.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-white/55">{m.label}</dt>
                <dd className="mt-2 text-[18px] text-white">{m.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-white/75 sm:grid-cols-2">
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

        <div className="md:col-span-7">
          {activePlan.image.src ? (
            <RevealImage
              key={activePlan.id}
              src={projectImage(activePlan.image.src)}
              alt={activePlan.image.alt ?? `${project.name} ${activePlan.label} floor plan`}
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-contain"
              containerClassName="relative aspect-[4/3] w-full bg-white/[0.03]"
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
  const [openId, setOpenId] = useState<string | null>(detail.specifications.items[0]?.id ?? null);
  return (
    <section id="specifications" className="scroll-mt-24 border-t border-[#464646] bg-black">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
        <div className="px-[30px] pt-12 md:pr-16 md:pt-16">
          <Reveal>
            <h2 className="max-w-[16ch] text-[34px] font-medium leading-[1.1] tracking-tight md:text-[52px]">
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

function Gallery({ project }: { project: Project }) {
  const detail = project.detail!;
  const images = detail.gallery.images;
  if (images.length === 0) return null;
  return (
    <section id="gallery" className="scroll-mt-24 border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="flex flex-col gap-2">
        <Reveal>
          <h2 className="text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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
            sizes="(min-width: 768px) 22vw, 50vw"
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
  const availableCategories = useMemo(() => {
    if (!location) return [] as LandmarkCategory[];
    return LANDMARK_CATEGORIES.filter((c) =>
      location.landmarks.some((l) => l.category === c.key),
    ).map((c) => c.key);
  }, [location]);

  const [active, setActive] = useState<LandmarkCategory | null>(
    () => availableCategories[0] ?? null,
  );

  if (!location || location.landmarks.length === 0) return null;

  return (
    <section
      id="location"
      className="scroll-mt-24 border-t border-[#464646] bg-black py-16 md:py-24"
    >
      <div className="flex flex-col gap-2 px-[30px]">
        <Reveal>
          <h2 className="text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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
          landmarks={location.landmarks}
          activeCategory={active ?? undefined}
          className="aspect-[3/4] md:aspect-auto md:h-[80vh] md:min-h-[640px]"
          projectName={project.name}
        />
        <div className="golden-map-tabs absolute left-[19px] top-[22px] z-10 sm:left-[30px] sm:top-[30px]">
          {availableCategories.map((key) => {
            const Icon = LANDMARK_ICONS[key];
            const label = LANDMARK_CATEGORIES.find((c) => c.key === key)!.label;
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
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
      </div>
    </section>
  );
}

// -------------------- Pillars --------------------

function Pillars({ project }: { project: Project }) {
  const detail = project.detail!;
  if (detail.pillars.items.length === 0) return null;
  return (
    <section className="border-t border-[#464646] bg-black px-[30px] py-16 md:py-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        {detail.pillars.items.map((p, i) => (
          <Reveal key={p.id} delay={i * 100}>
            <div className="flex h-full flex-col gap-4 bg-[#111] p-6 md:p-8">
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
          <h2 className="text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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

function AmenityIcon({ iconKey }: { iconKey: AmenityKey }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "text-white/85",
  };

  switch (iconKey) {
    case "walking-track":
      return (
        <svg {...common}>
          <circle cx="12" cy="6" r="2" />
          <path d="M9 14l3-4 3 4-1 6h-4l-1-6z" />
          <path d="M5 22c2-2 5-3 7-3s5 1 7 3" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "solar-power":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="11" rx="1" />
          <path d="M7 6v11M12 6v11M17 6v11M3 11h18" />
        </svg>
      );
    case "garden":
      return (
        <svg {...common}>
          <path d="M12 21V11" />
          <path d="M12 11c-4 0-6-3-6-6 4 0 6 2 6 6z" />
          <path d="M12 11c4 0 6-2 6-5-4 0-6 2-6 5z" />
        </svg>
      );
    case "play-area":
      return (
        <svg {...common}>
          <path d="M5 21l3-9h8l3 9" />
          <path d="M9 12V8M15 12V8" />
          <path d="M5 8h14" />
          <circle cx="9" cy="5" r="1.2" />
          <circle cx="15" cy="5" r="1.2" />
        </svg>
      );
    case "elevators":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <path d="M9 9l3-3 3 3M9 15l3 3 3-3" />
        </svg>
      );
    case "parking":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </svg>
      );
    case "gym":
      return (
        <svg {...common}>
          <path d="M3 12h18M5 9v6M19 9v6M8 6v12M16 6v12" />
        </svg>
      );
    case "pool":
      return (
        <svg {...common}>
          <path d="M3 17c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1" />
          <path d="M3 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1" />
          <path d="M7 13V5a2 2 0 0 1 2-2M17 13V5a2 2 0 0 0-2-2" />
        </svg>
      );
    case "clubhouse":
      return (
        <svg {...common}>
          <path d="M3 11l9-7 9 7v9H3z" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "library":
      return (
        <svg {...common}>
          <path d="M5 4h6v16H5zM13 4h6v16h-6z" />
          <path d="M5 8h6M13 8h6" />
        </svg>
      );
    default:
      return null;
  }
}

function PillarIcon({ pillar }: { pillar: Pillar }) {
  const common = {
    width: 36,
    height: 36,
    viewBox: "0 0 36 36",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    "aria-hidden": true,
    className: "text-[#C19B4D]",
  };

  switch (pillar.iconKey) {
    case "zero-out":
      return (
        <svg {...common}>
          <circle cx="18" cy="18" r="11" />
          <path d="M14 14l8 8M22 14l-8 8" />
        </svg>
      );
    case "smart-power":
      return (
        <svg {...common}>
          <path d="M19 6l-9 14h7l-1 10 9-14h-7z" />
        </svg>
      );
    case "climate-capsule":
      return (
        <svg {...common}>
          <path d="M18 5c5 0 9 4 9 9 0 6-9 17-9 17S9 20 9 14c0-5 4-9 9-9z" />
          <circle cx="18" cy="14" r="3.5" />
        </svg>
      );
  }
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

