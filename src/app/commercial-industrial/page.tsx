"use client";

import Image from "next/image";
import { Handshake, SealCheck, ShieldCheck } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { HeroRise, WordReveal, useFromHome } from "@/components/HeroIntro";
import { RecognitionSection } from "@/components/RecognitionSection";
import { RevealImage } from "@/components/RevealImage";
import { SiteFooter } from "@/components/SiteFooter";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export default function CommercialIndustrialPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white">
      <Hero />
      <IntroSection />
      <StatsGallery />
      <ProjectsSection />
      <WhyChooseUs />
      <Testimonials />
      <Recognition />
      <RecognitionSection />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  const fromHome = useFromHome();
  const headlineText = "Spaces Built for the\nBusiness of Tomorrow";
  const headlineStart = fromHome ? 250 : 450;
  const titleWords = headlineText.split(/\s+/).length;
  const ctaDelay = headlineStart + titleWords * 70 + 200;

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className={`absolute inset-0 ${fromHome ? "" : "hero-expand"}`}>
        <Image
          src="/commercial-hero.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={90}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover max-md:object-[43%_50%]"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-b from-transparent to-black" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="relative flex w-full flex-col justify-end pb-[30px] px-[30px]">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[-40px]"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)"
            }}
          />
          <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <WordReveal
              as="h2"
              text={headlineText}
              startDelay={headlineStart}
              className="max-w-[22ch] text-[44px] font-normal leading-[1.02] tracking-tight lg:text-[88px]"
            />
            <HeroRise delay={ctaDelay} className="shrink-0">
              <Pill href="/projects" label="See latest projects" />
            </HeroRise>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="relative w-full border-b border-[#464646] bg-black py-20 md:h-[70vh] md:min-h-[480px] md:py-0">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block" aria-hidden />
        <div className="relative flex h-full flex-col p-[30px] md:border-l md:border-[#464646]">
          <Reveal as="div" delay={150}>
            <h3 className="max-w-[24ch] text-[28px] font-medium leading-[1.2] tracking-tight md:text-[36px]">
              Workspaces, retail and industrial estates engineered for
              productivity, growth and the long run
            </h3>
          </Reveal>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10 md:mt-auto md:pt-12">
            <Reveal delay={350}>
              <p className="max-w-sm text-sm leading-snug text-white/75 md:text-base">
                Future-ready infrastructure backed by two decades of delivery
                across Bharuch, Ankleshwar and Surat
              </p>
            </Reveal>
            <Reveal delay={520}>
              <Pill href="/about" label="About Us" size="small" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROJECT_IMAGES = [
  { src: "/projects/golden-square-bharuch/Building_Front_Daylight_Full_Elevation.webp" },
  { src: "/projects/golden-square-bharuch/Interior_Atrium_Mall_View.webp" },
  { src: "/projects/golden-square-bharuch/Cinemas entry-01.webp" },
  { src: "/projects/golden-square/Building_Street_Perspective_View.webp" },
  { src: "/projects/golden-square/Interior_Mall_Retail_Floor.webp" },
  { src: "/projects/golden-palm-plaza/Commercial_Plaza_Main_Front_Elevation_Day.webp" },
];

function StatsGallery() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % PROJECT_IMAGES.length);
    }, 4500);
  };

  useEffect(() => {
    startAuto();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const select = (i: number) => {
    setIndex(i);
    startAuto();
  };

  return (
    <section
      id="projects"
      className="relative w-full border-b border-[#464646] bg-black"
    >
      <div className="flex flex-col gap-8 px-[30px] py-[40px] sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:gap-12 md:py-[48px]">
        <Reveal as="div" delay={120}>
          <div className="flex items-end gap-4">
            <span className="text-[80px] font-medium leading-[0.9] tracking-tight lg:text-[140px] lg:tracking-[-4px]">
              +2.7k
            </span>
            <div className="flex max-w-[120px] flex-col pb-3 text-sm leading-[1.4] text-white/60 md:pb-5">
              <span>commercial</span>
              <span>units</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Mobile: fixed-height swipeable carousel (native scroll-snap) */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-[10px] overflow-x-auto px-[7.5vw] pb-[40px] md:hidden">
        {PROJECT_IMAGES.map((img, i) => (
          <RevealImage
            key={img.src}
            src={img.src}
            alt=""
            fill
            priority={i === 0}
            sizes="85vw"
            className="object-cover"
            containerClassName="relative h-[420px] w-[85vw] shrink-0 snap-center snap-always"
          />
        ))}
      </div>

      {/* Desktop: full-height crossfade slideshow */}
      <div className="relative hidden h-[100vh] min-h-[480px] w-full overflow-hidden md:block">
        {PROJECT_IMAGES.map((img, i) => (
          <RevealImage
            key={img.src}
            src={img.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity 800ms ${EASE}`,
            }}
            containerClassName="absolute inset-0"
          />
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[45%] bg-gradient-to-t from-black via-black/70 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end p-[20px] md:p-[30px]">
          <div className="flex gap-2 md:gap-3">
            {PROJECT_IMAGES.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show project ${i + 1}`}
                className="relative aspect-square h-[48px] w-[48px] shrink-0 overflow-hidden sm:h-[70px] sm:w-[70px] md:h-[97px] md:w-[97px]"
                style={{
                  opacity: index === i ? 1 : 0.55,
                  transition: `opacity 350ms ${EASE}`,
                }}
              >
                <RevealImage
                  src={img.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  containerClassName="absolute inset-0"
                  delay={i * 110}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 z-10"
                  style={{
                    boxShadow: index === i ? "inset 0 0 0 2px #fff" : "none",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Project = {
  name: string;
  category: string;
  location: string;
  size: string;
  image: string;
  slug: string;
};

const PROJECTS: Project[] = [
  {
    name: "Golden Square - Bharuch",
    category: "150 Shops & 102 Offices",
    location: "Bharuch",
    size: "Multi-level commercial",
    image: "/projects/golden-square-bharuch/Building_Street_Perspective_View.webp",
    slug: "golden-square-bharuch",
  },
  {
    name: "Golden Square - Ankleshwar",
    category: "Commercial Shops & Offices",
    location: "Ankleshwar",
    size: "Multi-level commercial",
    image: "/projects/golden-square/Building_Main_Front_Elevation_Day.webp",
    slug: "golden-square",
  },
  {
    name: "Golden Palm Plaza",
    category: "Shops & Offices",
    location: "Ankleshwar",
    size: "100 units across 5 floors",
    image: "/projects/golden-palm-plaza/Commercial_Plaza_Gate_Side_Night_Perspective.webp",
    slug: "golden-palm-plaza",
  },
];

const CARD_GAP = 14;

function useResponsiveCardWidth() {
  const [cardW, setCardW] = useState(380);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCardW(Math.min(w - 60, 320));
      else if (w < 1024) setCardW(300);
      else setCardW(380);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cardW;
}

function ProjectsSection() {
  const [active, setActive] = useState(0);
  const total = PROJECTS.length + 1;
  const cardW = useResponsiveCardWidth();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const router = useRouter();
  const next = () => setActive((i) => Math.min(total - 1, i + 1));
  const prev = () => setActive((i) => Math.max(0, i - 1));
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) next();
    else prev();
  };

  // Trackpad / horizontal wheel: advance one project per gesture, locked
  // until the slide eases into place so a single swipe never skips cards.
  // Native non-passive listener so preventDefault stops the browser
  // back/forward swipe gesture.
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.deltaY) || Math.abs(dx) < 12) return;
      e.preventDefault();
      if (locked) return;
      locked = true;
      setActive((i) =>
        dx > 0 ? Math.min(total - 1, i + 1) : Math.max(0, i - 1),
      );
      window.setTimeout(() => {
        locked = false;
      }, 650);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [total]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActive((i) => Math.min(total - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        if (active === PROJECTS.length) {
          e.preventDefault();
          router.push("/projects?type=commercial-industrial");
        } else {
          const p = PROJECTS[active];
          if (p) {
            e.preventDefault();
            router.push(`/project/${p.slug}`);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, total, active, router]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-12 md:py-16">
      <div className="flex flex-col gap-10 px-[30px] min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between">
        <Reveal>
          <div className="flex items-end gap-4">
            <span className="text-[80px] font-medium leading-[0.9] tracking-tight lg:text-[140px] lg:tracking-[-4px]">
              +25
            </span>
            <span className="max-w-[120px] pb-3 text-sm leading-[1.4] text-white/60 md:pb-5">
              Completed Projects
            </span>
          </div>
        </Reveal>
        <Reveal delay={150} className="w-full min-[560px]:w-auto">
          <div className="flex h-[60px] w-full gap-2 min-[560px]:w-auto">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              disabled={active === 0}
              className="flex h-full flex-1 items-center justify-center bg-[#313131] text-white transition-colors hover:bg-[#3f3f3f] disabled:opacity-40 min-[560px]:w-[100px] min-[560px]:flex-none md:w-[160px]"
            >
              <CarouselArrow dir="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              disabled={active === total - 1}
              className="flex h-full flex-1 items-center justify-center bg-[#313131] text-white transition-colors hover:bg-[#3f3f3f] disabled:opacity-40 min-[560px]:w-[100px] min-[560px]:flex-none md:w-[160px]"
            >
              <CarouselArrow dir="right" />
            </button>
          </div>
        </Reveal>
      </div>

      <div
        ref={carouselRef}
        className="mt-12 overflow-hidden md:mt-16"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex gap-[14px] will-change-transform"
          style={{
            transform: `translateX(calc(50vw - ${cardW / 2}px - ${active * (cardW + CARD_GAP)}px))`,
            transition: `transform 700ms ${EASE}`,
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.name}
              project={p}
              active={i === active}
              cardW={cardW}
              priority={i < 3}
            />
          ))}
          <ViewAllCard active={active === PROJECTS.length} cardW={cardW} />
        </div>
      </div>
    </section>
  );
}

function ViewAllCard({ active, cardW }: { active: boolean; cardW: number }) {
  return (
    <Link
      href="/projects?type=commercial-industrial"
      className="group flex shrink-0 flex-col gap-2 pt-5"
      style={{
        width: cardW,
        borderTop: "2px solid",
        borderTopColor: active ? "#fff" : "transparent",
        transition: `border-color 350ms ${EASE}, opacity 500ms ${EASE}`,
        opacity: active ? 1 : 0.55,
      }}
    >
      <div className="card-hover relative aspect-[380/370] w-full overflow-hidden bg-[#1a1a1a]">
        <span
          aria-hidden
          className="card-fill pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
        />
        <span className="relative z-10 flex h-full w-full items-end justify-between p-[16px] text-[22px] font-medium leading-[1.2] text-white transition-colors group-hover:text-black">
          View All Projects
          <StarIcon />
        </span>
      </div>
      <div className="mt-2 flex w-full flex-col gap-3 pr-4">
        <p className="text-[16px] leading-[1.4] text-[#737373]">
          Our portfolio speaks for itself
        </p>
      </div>
    </Link>
  );
}

function ProjectCard({
  project,
  active,
  cardW,
  priority = false,
}: {
  project: Project;
  active: boolean;
  cardW: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group flex shrink-0 flex-col gap-2 pt-5"
      style={{
        width: cardW,
        borderTop: "2px solid",
        borderTopColor: active ? "#fff" : "transparent",
        transition: `border-color 350ms ${EASE}, opacity 500ms ${EASE}`,
        opacity: active ? 1 : 0.55,
      }}
    >
      <RevealImage
        src={project.image}
        alt={project.name}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 300px, 80vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        containerClassName="relative aspect-[380/370] w-full"
      />
      <div className="mt-2 flex w-full flex-col gap-3 pr-4">
        <h4 className="text-[24px] font-normal leading-[1.4] text-white transition-colors duration-300 group-hover:text-[#C19B4D]">
          {project.name}
        </h4>
        <ul className="flex flex-col gap-2 text-[16px] text-[#737373]">
          <li className="flex items-center gap-1.5">
            <BriefcaseIcon />
            <span>{project.category}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <MapPinIcon />
            <span>{project.location}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <AreaIcon />
            <span>{project.size}</span>
          </li>
        </ul>
      </div>
    </Link>
  );
}

function CarouselArrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden
      style={{ transform: dir === "left" ? "rotate(180deg)" : "none" }}
    >
      <path
        d="M3 11h16m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2 6h14v9H2zM6 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M2 10h14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 14.5c3.5-4 5-6.5 5-9a5 5 0 0 0-10 0c0 2.5 1.5 5 5 9Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2 2h14v14H2z M2 6h14 M6 2v14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhyChooseUs() {
  const items = [
    {
      title: "Quality",
      body:
        "Every project reflects our standards from material selection to construction to final handover.",
      Icon: SealCheck,
    },
    {
      title: "Commitment",
      body:
        "We plan every project around our customers and deliver on time, every time.",
      Icon: Handshake,
    },
    {
      title: "Trust",
      body:
        "Transparency is at the core of everything we do, from development to sales.",
      Icon: ShieldCheck,
    },
  ];
  return (
    <section className="border-t border-[#464646] bg-black">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
        <div className="px-[30px] pt-16 md:pr-16 md:pt-20">
          <Reveal>
            <h3 className="max-w-[12ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
              Why Choose Us?
            </h3>
          </Reveal>
        </div>

        <div className="md:border-l md:border-[#464646]">
          <ul>
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              return (
                <li
                  key={item.title}
                  className={isLast ? "" : "border-b border-[#464646]"}
                >
                  <Reveal delay={120 + i * 120}>
                    <div className="flex items-start gap-8 px-[30px] py-10 md:px-8 md:py-12">
                      <item.Icon
                        weight="light"
                        className="h-[48px] w-[48px] shrink-0 text-[#C19B4D] md:h-[56px] md:w-[56px]"
                        aria-hidden
                      />
                      <div className="flex flex-col gap-2">
                        <h4 className="text-[20px] font-normal leading-[1.4] text-white">
                          {item.title}
                        </h4>
                        <p className="text-[14px] leading-[1.5] text-white/65 md:text-[15px]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <TestimonialCarousel
      count="+10k"
      labelLines={["Happy", "Customers"]}
    />
  );
}

function Recognition() {
  return (
    <section className="border-y border-[#464646] bg-black py-28 md:py-36">
      <div className="mx-auto w-full max-w-[440px] px-[30px] sm:max-w-[500px] lg:max-w-[560px]">
        <Reveal>
          <div className="relative aspect-[2576/926] w-full">
            <Image
              src="/rera-credai.webp"
              alt="RERA Approved and CREDAI Member"
              fill
              quality={90}
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 500px, 80vw"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-[#464646] bg-black">
      <div className="grid grid-cols-1 gap-10 p-[30px] md:grid-cols-2 md:gap-[30px]">
        <div className="flex min-h-[336px] flex-col md:min-h-[780px]">
          <Reveal>
            <h3 className="max-w-[20ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
              If you can dream it, we can build it!
            </h3>
          </Reveal>

          <Reveal
            delay={150}
            className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mt-auto md:pt-12"
          >
            <p className="max-w-[200px] text-sm leading-[1.4] text-white md:text-base">
              Want to discuss how we can create value for your business?
            </p>
            <Pill href="/contact" label="Contact Us" size="small" />
          </Reveal>
        </div>

        <Reveal delay={120} className="relative">
          <RevealImage
            src="/projects/golden-square-bharuch/Entrance Foyer-Final.webp"
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-right"
            containerClassName="relative aspect-[590/840] w-full md:aspect-auto md:h-full md:min-h-[780px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function Pill({
  href,
  label,
  size = "default",
}: {
  href: string;
  label: string;
  size?: "default" | "small";
}) {
  const isSmall = size === "small";
  return (
    <Link
      href={href}
      className={`pill-hover relative block w-[245px] shrink-0 overflow-hidden bg-white text-black ${
        isSmall ? "h-[50px]" : "h-[75px]"
      }`}
      style={{ transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}` }}
    >
      <span
        aria-hidden
        className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
      />
      <span
        className={`relative z-10 flex h-full w-full items-end justify-between text-sm font-medium ${
          isSmall ? "px-[12px] pb-[8px] pt-[4px]" : "p-[10px]"
        }`}
      >
        {label}
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

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article";
};

function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
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

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
