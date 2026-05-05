"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { RevealImage } from "@/components/RevealImage";

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
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="hero-expand absolute inset-0">
        <Image
          src="/commercial-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      <div className="relative z-10 flex h-full w-full flex-col p-[30px]">
        <div className="mt-auto flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <h2
            className="reveal is-in max-w-[14ch] text-[44px] font-medium leading-[1.02] tracking-tight md:text-[88px]"
            style={{ "--reveal-delay": "350ms" } as CSSProperties}
          >
            Spaces Built for the Business of Tomorrow
          </h2>
          <div
            className="reveal is-in"
            style={{ "--reveal-delay": "700ms" } as CSSProperties}
          >
            <Pill href="#projects" label="See latest projects" />
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full border-b border-[#464646] bg-black">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block" aria-hidden />
        <div className="relative flex h-full flex-col p-[30px] md:border-l md:border-[#464646]">
          <Reveal as="div" delay={150}>
            <h3 className="max-w-[24ch] text-[28px] font-medium leading-[1.2] tracking-tight md:text-[36px]">
              Workspaces, retail and industrial estates engineered for
              productivity, growth and the long run
            </h3>
          </Reveal>

          <div className="mt-auto flex flex-col gap-6 pt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
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
  "/commercial-hero.png",
  "/residential/gallery-3.jpg",
  "/residential/gallery-1.jpg",
  "/residential/gallery-5.jpg",
  "/residential/gallery-2.jpg",
  "/residential/gallery-6.jpg",
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
      <div className="flex items-end justify-between gap-6 px-[30px] py-[40px] md:gap-12 md:py-[48px]">
        <Reveal as="div" delay={120}>
          <div className="flex items-end gap-4">
            <span className="text-[80px] font-medium leading-[0.9] tracking-tight md:text-[140px] md:tracking-[-4px]">
              +5M
            </span>
            <div className="flex max-w-[120px] flex-col pb-3 text-sm leading-[1.4] text-white/60 md:pb-5">
              <span>sq. ft. of</span>
              <span>commercial space</span>
            </div>
          </div>
        </Reveal>
        <Reveal as="div" delay={260}>
          <div className="flex items-end gap-4">
            <span className="text-[80px] font-medium leading-[0.9] tracking-tight md:text-[140px] md:tracking-[-4px]">
              +850
            </span>
            <div className="flex max-w-[120px] flex-col pb-3 text-sm leading-[1.4] text-white/60 md:pb-5">
              <span>Businesses</span>
              <span>Housed</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative h-[85vh] min-h-[480px] w-full overflow-hidden">
        {PROJECT_IMAGES.map((src, i) => (
          <RevealImage
            key={src}
            src={src}
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
            {PROJECT_IMAGES.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show project ${i + 1}`}
                className="relative aspect-square h-[70px] w-[70px] shrink-0 overflow-hidden md:h-[97px] md:w-[97px]"
                style={{
                  opacity: index === i ? 1 : 0.55,
                  transition: `opacity 350ms ${EASE}`,
                }}
              >
                <RevealImage
                  src={src}
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
};

const PROJECTS: Project[] = [
  {
    name: "Golden Square",
    category: "Commercial Spaces",
    location: "Surat",
    size: "350-2400 Sq. Ft.",
    image: "/commercial-hero.png",
  },
  {
    name: "Golden Palm Plaza",
    category: "Shops & Offices",
    location: "Bharuch",
    size: "200-1800 Sq. Ft.",
    image: "/residential/gallery-3.jpg",
  },
  {
    name: "Golden Industrial Estate",
    category: "Industrial Plots",
    location: "Ankleshwar",
    size: "5000-25000 Sq. Ft.",
    image: "/residential/gallery-1.jpg",
  },
  {
    name: "Golden Trade Centre",
    category: "Commercial Spaces",
    location: "Surat",
    size: "400-3200 Sq. Ft.",
    image: "/residential/gallery-5.jpg",
  },
  {
    name: "Golden Tech Park",
    category: "Office Floors",
    location: "Surat",
    size: "1200-9500 Sq. Ft.",
    image: "/residential/gallery-2.jpg",
  },
];

const CARD_W = 380;
const CARD_GAP = 14;

function ProjectsSection() {
  const [active, setActive] = useState(0);
  const total = PROJECTS.length;
  const next = () => setActive((i) => Math.min(total - 1, i + 1));
  const prev = () => setActive((i) => Math.max(0, i - 1));

  return (
    <section className="relative overflow-hidden bg-black py-12 md:py-16">
      <div className="flex flex-col gap-10 px-[30px] md:flex-row md:items-end md:justify-between">
        <Reveal>
          <div className="flex items-end gap-4">
            <span className="text-[80px] font-medium leading-[0.9] tracking-tight md:text-[140px] md:tracking-[-4px]">
              +18
            </span>
            <span className="max-w-[120px] pb-3 text-sm leading-[1.4] text-white/60 md:pb-5">
              Completed Projects
            </span>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="flex h-[60px] gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              disabled={active === 0}
              className="flex h-full w-[100px] items-center justify-center bg-[#313131] text-white transition-colors hover:bg-[#3f3f3f] disabled:opacity-40 md:w-[160px]"
            >
              <CarouselArrow dir="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              disabled={active === total - 1}
              className="flex h-full w-[100px] items-center justify-center bg-[#313131] text-white transition-colors hover:bg-[#3f3f3f] disabled:opacity-40 md:w-[160px]"
            >
              <CarouselArrow dir="right" />
            </button>
          </div>
        </Reveal>
      </div>

      <div className="mt-12 overflow-hidden md:mt-16">
        <div
          className="flex gap-[14px] will-change-transform"
          style={{
            transform: `translateX(calc(50vw - ${CARD_W / 2}px - ${active * (CARD_W + CARD_GAP)}px))`,
            transition: `transform 700ms ${EASE}`,
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} active={i === active} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6 px-[30px] sm:flex-row sm:items-end sm:justify-between md:mt-12">
        <Reveal>
          <p className="max-w-[150px] text-sm leading-[1.4] text-white">
            Our portfolio speaks for itself
          </p>
        </Reveal>
        <Reveal delay={150}>
          <Link
            href="/projects"
            className="pill-hover relative block h-[75px] w-[300px] shrink-0 overflow-hidden bg-white text-black"
          >
            <span
              aria-hidden
              className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
            />
            <span className="relative z-10 flex h-full w-full items-end justify-between p-[12px] text-base font-medium">
              View All Projects
              <StarIcon />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  active,
}: {
  project: Project;
  active: boolean;
}) {
  return (
    <article
      className="flex w-[380px] shrink-0 flex-col gap-2 pt-5"
      style={{
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
        sizes="380px"
        className="object-cover"
        containerClassName="relative aspect-[380/370] w-full"
      />
      <div className="mt-2 flex w-[334px] flex-col gap-3">
        <h4 className="text-[24px] font-normal leading-[1.4] text-white">
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
    </article>
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
      icon: "/icons/quality.svg",
    },
    {
      title: "Commitment",
      body:
        "We plan every project around our customers and deliver on time, every time.",
      icon: "/icons/commitment.svg",
    },
    {
      title: "Trust",
      body:
        "Transparency is at the core of everything we do, from development to sales.",
      icon: "/icons/trust.svg",
    },
  ];
  return (
    <section className="border-t border-[#464646] bg-black px-[30px] py-20 md:py-24">
      <Reveal>
        <h3 className="max-w-[12ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
          Why Choose Us?
        </h3>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={150 + i * 130}
            className="flex h-full flex-col justify-between gap-12 overflow-hidden bg-[#111] p-[30px]"
          >
            <div className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center">
              <Image
                src={item.icon}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[20px] font-normal leading-[1.6] text-white">
                {item.title}
              </h4>
              <p className="line-clamp-2 min-h-[2.8em] text-[14px] leading-[1.4] text-[#aaa]">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-t border-white/10 bg-black py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.05fr_1fr] md:gap-20">
          <Reveal className="flex flex-col">
            <div className="flex items-baseline gap-4">
              <span className="text-[64px] font-medium leading-[0.95] tracking-tight md:text-[112px]">
                850+
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-0.5 text-white/85">
              <span className="text-base font-medium md:text-lg">
                Businesses
              </span>
              <span className="text-sm text-white/55 md:text-base">
                Operating
              </span>
            </div>
          </Reveal>

          <Reveal delay={150} className="flex flex-col gap-10">
            <h3 className="text-[34px] font-medium leading-[1.05] tracking-tight md:text-[56px]">
              What our partners say?
            </h3>
            <div className="flex items-center gap-4">
              <span className="relative inline-block h-12 w-12 overflow-hidden rounded-full bg-white/10">
                <Image
                  src="/residential/testimonial-avatar.png"
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <div className="flex flex-col">
                <span className="text-base font-medium">Anand Patel</span>
                <span className="text-sm text-white/55">
                  Director, Ankleshwar
                </span>
              </div>
            </div>
            <p className="max-w-md text-[17px] leading-[1.5] text-white/75 md:text-lg">
              We moved our manufacturing into a Golden estate two years ago.
              Specs were exactly as promised, possession was on time, and the
              site team is still responsive when we need them.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Recognition() {
  const items = ["RERA Approved", "ISO 9001:2015", "CREDAI Member", "GBCI"];
  return (
    <section className="border-y border-white/10 bg-black py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="grid grid-cols-2 items-center gap-8 text-center md:grid-cols-4 md:gap-10">
            {items.map((label, i) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 text-white/55"
                style={{ opacity: 1 - i * 0.04 }}
              >
                <LaurelIcon />
                <span className="text-sm uppercase tracking-[0.2em] md:text-base">
                  {label}
                </span>
                <LaurelIcon flipped />
              </div>
            ))}
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
        <div className="flex min-h-[480px] flex-col md:min-h-[780px]">
          <Reveal>
            <h3 className="max-w-[12ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
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
            src="/commercial-hero.png"
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            containerClassName="relative aspect-[590/840] w-full md:aspect-auto md:h-full md:min-h-[780px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/commercial-industrial", label: "Commercial & Industrial" },
    { href: "/projects", label: "Projects" },
  ];
  const socials = [
    { href: "#", label: "Instagram" },
    { href: "#", label: "Linkedin" },
    { href: "#", label: "Twitter" },
  ];

  return (
    <footer className="relative grid h-[80vh] min-h-[640px] grid-cols-1 border-t border-[#464646] bg-black md:grid-cols-2">
      {/* LEFT */}
      <div className="relative flex flex-col p-[30px] md:border-r md:border-[#464646]">
        <div className="flex items-start justify-between gap-10">
          <Image
            src="/icon.svg"
            alt=""
            width={86}
            height={218}
            className="h-[180px] w-auto md:h-[200px]"
          />
          <p className="max-w-[420px] pt-2 text-base leading-[1.5] text-white/55">
            Building Better Lives since 2011. Residential, Commercial, and
            Industrial developments across Gujarat.
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-8">
          <Image
            src="/logo.svg"
            alt="Golden Group"
            width={300}
            height={70}
            className="h-12 w-auto md:h-[64px]"
          />
          <Pill href="/contact" label="Contact Us" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col">
        <div className="flex flex-1 flex-col items-start justify-between gap-10 p-[30px] md:flex-row md:items-start">
          <RevealImage
            src="/commercial-hero.png"
            alt=""
            width={300}
            height={169}
            sizes="300px"
            className="h-auto w-[300px]"
            containerClassName="relative w-[300px] h-[169px] shrink-0"
          />
          <div className="flex flex-col gap-9 md:items-end md:text-right">
            <ul className="flex flex-col gap-3 text-base text-white">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white/80">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-white/40">Contact</p>
              <a
                href="mailto:info@goldengroup.in"
                className="text-base text-white hover:text-white/80"
              >
                info@goldengroup.in
              </a>
              <a
                href="tel:+919876543210"
                className="text-base text-white hover:text-white/80"
              >
                +91 98765 43210
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-white/40">Socials</p>
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="text-base text-white hover:text-white/80"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#464646]" aria-hidden />
        <div className="flex flex-col gap-3 px-[30px] py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Golden Group. All rights reserved.</span>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
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

function LaurelIcon({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      width="20"
      height="28"
      viewBox="0 0 20 28"
      fill="none"
      aria-hidden
      style={{ transform: flipped ? "scaleX(-1)" : "none" }}
    >
      <path
        d="M14 1c-2 4-3 7-3 12s1 9 3 13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M14 5c-3 0-5 1-6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 11c-3 0-5 1-6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 17c-3 0-5 1-6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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
