"use client";

import Image from "next/image";
import {
  Binoculars,
  Buildings,
  Handshake,
  Plant,
  ThumbsUp,
} from "@phosphor-icons/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { RecognitionSection } from "@/components/RecognitionSection";
import ScrollLottie from "@/components/ScrollLottie";
import { SiteFooter } from "@/components/SiteFooter";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const ACCENT_BLUE = { r: 78, g: 166, b: 228 }; // #4EA6E4
const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

export default function AboutPage() {
  return (
    <main className="relative w-full bg-black text-white">
      <IntroSection />
      <StorySection />
      <Statement
        label="Vision"
        body="To become a landmark real estate brand that shapes city skylines through iconic developments and earns lifelong trust through consistent quality and reliability."
        label2="Mission"
        body2="To design and deliver well-planned residential and commercial spaces by following ethical practices, maintaining precision in execution, and creating long-term value for customers, investors, and communities."
        imageAlign="left"
      />
      <WhyChooseUs />
      <Accreditations />
      <Milestones />
      <GroupOfCompanies />
      <RecognitionSection />
      <SiteFooter />
    </main>
  );
}

/* ---------- Intro: scroll-driven logo expand + sky reveal ---------- */

function IntroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [labelsShown, setLabelsShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLabelsShown(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / range));
      setProgress(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const meaningOpacity = clamp(1 - progress / 0.08, 0, 1); // fades by 8% scroll
  const colorP = clamp((progress - 0.08) / 0.22, 0, 1); // 0.08 → 0.30
  const scaleP = ease(clamp(progress / 0.55, 0, 1)); // 0 → 0.55
  const bgP = clamp((progress - 0.42) / 0.18, 0, 1); // 0.42 → 0.60
  // Once bg is fully blue, hide the logo entirely.
  const iconOpacity = clamp(1 - (progress - 0.55) / 0.08, 0, 1);
  const buildingP = ease(clamp((progress - 0.6) / 0.3, 0, 1)); // 0.6 → 0.9
  const cloudsP = ease(clamp((progress - 0.7) / 0.25, 0, 1)); // 0.7 → 0.95

  const scale = 1 + scaleP * 6.0;
  const iconColor = lerpColor(WHITE, ACCENT_BLUE, colorP);
  const bgColor = lerpColor(BLACK, ACCENT_BLUE, bgP);

  return (
    <div ref={wrapperRef} className="relative h-[400vh] w-full">
      <div
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: rgbCss(bgColor) }}
      >
        {/* Icon (scales up + color shifts; fades once bg is fully blue) */}
        <div
          className="relative h-[55%] max-h-[460px] min-h-[280px]"
          style={{
            aspectRatio: "43 / 109",
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            opacity: iconOpacity,
          }}
        >
          <LogoIconSvg
            color={rgbCss(iconColor)}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        {/* Meaning labels (overlay; fade with scroll) */}
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ opacity: meaningOpacity * (labelsShown ? 1 : 0) }}
        >
          <div className="relative mx-auto h-full w-full max-w-[1440px]">
            <Meanings shown={labelsShown} />
          </div>
        </div>

        {/* Clouds drifting in from various sides (behind the buildings) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: cloudsP }}
        >
          <RealCloud
            top="4%"
            left="-12%"
            width={560}
            from={-280}
            progress={cloudsP}
            opacity={0.95}
            flipY
          />
          <RealCloud
            top="-6%"
            left="52%"
            width={900}
            from={300}
            progress={cloudsP}
            opacity={0.9}
          />
        </div>

        {/* Buildings rising from bottom */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 origin-bottom"
          style={{
            transform: `translateY(${(1 - buildingP) * 100}%)`,
            opacity: buildingP > 0 ? 1 : 0,
            willChange: "transform, opacity",
          }}
        >
          <Image
            src="/about/building-mobile.webp"
            alt=""
            width={6506}
            height={6830}
            sizes="100vw"
            quality={90}
            className="block h-auto w-full min-[800px]:hidden"
            priority
            fetchPriority="high"
          />
          <div className="relative hidden h-[95vh] w-full overflow-hidden min-[800px]:block">
            <Image
              src="/about/building-wide.webp"
              alt=""
              fill
              sizes="100vw"
              quality={90}
              className="object-cover object-top"
              priority
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Gradient band sits above buildings — fades their base into black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[40dvh] bg-gradient-to-b from-transparent to-black"
          style={{ opacity: buildingP }}
        />

        {/* Scroll hint (visible at start, fades during scroll) */}
        <ScrollHint
          shown={labelsShown}
          fade={meaningOpacity}
        />
      </div>
    </div>
  );
}

/* ---------- Meanings (positioned around the centred icon) ---------- */

function Meanings({ shown }: { shown: boolean }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-[55%] max-h-[460px] min-h-[280px] -translate-x-1/2 -translate-y-1/2"
      style={{ aspectRatio: "43 / 109" }}
    >
      <Meaning
        shown={shown}
        delay={0}
        side="left"
        lineWidth={240}
        anchorX="calc(50% - 10px)"
        anchorY="-2%"
      >
        Central tallest line symbolizes
        <br />
        leadership and aspiration
      </Meaning>
      <Meaning
        shown={shown}
        delay={140}
        side="right"
        lineWidth={180}
        anchorX="78%"
        anchorY="38%"
      >
        Star element represents excellence,
        <br />
        achievement, and a guiding vision
      </Meaning>
      <Meaning
        shown={shown}
        delay={280}
        side="left"
        lineWidth={200}
        anchorX="-2%"
        anchorY="72%"
      >
        Vertical lines represent buildings,
        <br />
        growth, and upward momentum
      </Meaning>
      <Meaning
        shown={shown}
        delay={420}
        side="right"
        lineWidth={130}
        anchorX="50%"
        anchorY="102%"
      >
        Curved base line symbolizes a strong
        <br />
        foundation and stability
      </Meaning>
    </div>
  );
}

function Meaning({
  shown,
  delay,
  side,
  lineWidth,
  anchorX,
  anchorY,
  children,
}: {
  shown: boolean;
  delay: number;
  side: "left" | "right";
  lineWidth: number;
  anchorX: string;
  anchorY: string;
  children: ReactNode;
}) {
  const isLeft = side === "left";

  const wrapperStyle: CSSProperties = {
    left: anchorX,
    top: anchorY,
    transform: isLeft ? "translate(-100%, -50%)" : "translate(0, -50%)",
  };

  const animStyle: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown
      ? "translate(0,0)"
      : isLeft
      ? "translateX(8px)"
      : "translateX(-8px)",
    transition: `opacity 700ms ${EASE} ${delay}ms, transform 700ms ${EASE} ${delay}ms`,
  };

  return (
    <div className="pointer-events-none absolute z-10" style={wrapperStyle}>
      <div className="flex items-center" style={animStyle}>
        {isLeft ? (
          <>
            <p className="whitespace-nowrap pr-3 text-right text-[20px] capitalize leading-[1.2] text-white">
              {children}
            </p>
            <div className="h-px bg-white" style={{ width: `${lineWidth}px` }} />
            <div className="size-[10px] shrink-0 border border-white" />
          </>
        ) : (
          <>
            <div className="size-[10px] shrink-0 border border-white" />
            <div className="h-px bg-white" style={{ width: `${lineWidth}px` }} />
            <p className="whitespace-nowrap pl-3 text-[20px] capitalize leading-[1.2] text-white">
              {children}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function RealCloud({
  top,
  left,
  width,
  from,
  progress,
  opacity = 1,
  delayedBy = 0,
  desktopOnly = false,
  flipY = false,
}: {
  top: string;
  left: string;
  width: number;
  from: number;
  progress: number;
  opacity?: number;
  delayedBy?: number;
  desktopOnly?: boolean;
  flipY?: boolean;
}) {
  const p = clamp((progress - delayedBy) / (1 - delayedBy), 0, 1);
  const e = ease(p);
  return (
    <div
      className={`pointer-events-none absolute ${desktopOnly ? "hidden md:block" : ""}`}
      style={{
        top,
        left,
        width,
        aspectRatio: "2000 / 1517",
        opacity: e * opacity,
        transform: `translateX(${(1 - e) * from}px)${flipY ? " scaleY(-1)" : ""}`,
        willChange: "transform, opacity",
      }}
    >
      <Image
        src="/about/cloud-v2.webp"
        alt=""
        fill
        sizes="(min-width:768px) 520px, 60vw"
        quality={90}
        className="object-contain"
        priority
        fetchPriority="high"
      />
    </div>
  );
}

function ScrollHint({ shown, fade }: { shown: boolean; fade: number }) {
  return (
    <div
      className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      style={{
        opacity: shown ? fade : 0,
        transition: `opacity 800ms ${EASE} 600ms`,
      }}
    >
      <p className="text-center text-sm text-white/70">
        Scroll to know about Golden Group
      </p>
      <ArrowDown />
    </div>
  );
}

function ArrowDown() {
  return <ScrollLottie />;
}

/* ---------- Story section (after intro) ---------- */

function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [year, setYear] = useState(2005);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // Desktop: pin the paragraph a constant 20px below the year's measured box
  // so the gap never drifts with viewport height or font scaling.
  const [paraTop, setParaTop] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setParaTop(null);
      return;
    }
    const y = yearRef.current;
    const s = stickyRef.current;
    if (!y || !s) return;
    const gap = 20;
    setParaTop(
      y.getBoundingClientRect().bottom - s.getBoundingClientRect().top + gap,
    );
  }, [progress, isMobile, year]);

  useEffect(() => {
    const HOLD_PX = 100;
    const apply = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Year is sticky at viewport center starting when section.top <= 0.
      // Add HOLD_PX as a small buffer past that point before counting begins.
      const passed = -rect.top - HOLD_PX;
      const total = rect.height - vh - HOLD_PX;
      const p = Math.max(0, Math.min(1, passed / Math.max(total, 1)));
      setProgress(p);
      const COUNT_END = 0.6;
      const countP = Math.min(1, p / COUNT_END);
      setYear(2005 + Math.round(countP * (currentYear - 2005)));
    };
    let raf = 0;
    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(() => {
        scheduled = false;
        apply();
      });
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [currentYear]);

  const digits = String(year).padStart(4, "0").split("");
  // Year stays centered + full size until counter reaches current year (progress 0..0.6),
  // then shrinks + lifts into final position during progress 0.6..1.
  const transformP = ease(clamp((progress - 0.6) / 0.4, 0, 1));
  // Mobile keeps the final year centered (with side padding) and only mildly
  // shrunk so it stays legible; desktop shrinks more and slides to the left.
  const yearScale = 1 - transformP * (isMobile ? 0.4 : 0.55);
  // During counting, year sits a bit above the absolute center.
  // After counting, lifts further up to make room for the story text below.
  const yearLiftPx = -40 + transformP * ((isMobile ? -250 : -117) - -40);
  const yearLeft = isMobile
    ? "50%"
    : `calc(${(1 - transformP) * 50}% + ${transformP * 40}px)`;
  const yearTranslateX = isMobile ? "-50%" : `${-(1 - transformP) * 50}%`;
  // Buildings + text fade in alongside the transform
  const buildingsP = ease(clamp((progress - 0.65) / 0.35, 0, 1));
  const textP = ease(clamp((progress - 0.75) / 0.25, 0, 1));

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-[260vh] min-h-[1600px] w-full border-b border-[#464646] bg-black"
      >
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {/* Building — single tower anchored at the bottom-right */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[30px] -right-[30px] -mb-5 h-[72%] w-full md:right-0 md:bottom-0 md:mb-0 md:h-full md:w-[74%]"
            style={{
              opacity: buildingsP,
              transform: `translateY(${(1 - buildingsP) * 60}px)`,
              willChange: "transform, opacity",
            }}
          >
            {/* Wide two-tower render on phones; tall single-tower on desktop. */}
            <Image
              src="/about/story/building-towers-mobile.webp"
              alt=""
              fill
              sizes="92vw"
              quality={90}
              className="object-contain object-right-bottom md:hidden"
            />
            <Image
              src="/about/story/building-towers-desktop-v2.webp"
              alt=""
              fill
              sizes="60vw"
              quality={90}
              className="hidden object-contain object-right-bottom md:block"
            />
          </div>

          {/* Year — starts huge at center, shrinks + slides up as scroll progresses */}
          <div
            ref={yearRef}
            className="pointer-events-none absolute top-1/2 z-10 inline-flex"
            style={{
              left: yearLeft,
              transform: `translate(${yearTranslateX}, calc(-50% + ${yearLiftPx}px)) scale(${yearScale})`,
              transformOrigin: isMobile ? "center center" : "left center",
              willChange: "transform, left",
            }}
          >
            <span className="flex text-[150px] font-medium leading-[0.9] tracking-tight tabular-nums md:text-[260px] lg:text-[360px] lg:tracking-[-8px]">
              {digits.map((ch, i) => (
                <span key={i} className="inline-block">
                  {ch}
                </span>
              ))}
            </span>
          </div>

          {/* Subtitle — visible during the year-count phase, fades out as scaling begins */}
          <div
            className="pointer-events-none absolute bottom-[18%] z-10 inline-flex text-center"
            style={{
              left: `calc(${(1 - transformP) * 50}% + ${transformP * 40}px)`,
              transform: `translateX(${-(1 - transformP) * 50}%)`,
              opacity: 1 - transformP,
            }}
          >
            <p className="max-w-[24ch] text-sm leading-[1.5] text-white/80 md:text-base">
              Two Decades of
              <br />
              Shaping Spaces That Last
            </p>
          </div>

          {/* Story text — absolute, sits at its final spot under year; word-by-word reveal */}
          <StoryParagraphs textStarted={textP > 0.01} topPx={paraTop} />
        </div>
      </section>
    </>
  );
}

function StoryParagraphs({
  textStarted,
  topPx,
}: {
  textStarted: boolean;
  topPx?: number | null;
}) {
  const paragraphs = [
    "Golden Group was founded on the belief that real estate should stand for confidence, stability, and long-term value, not just buildings. Its name reflects enduring quality and collective strength, built for today and valued for tomorrow.",
    "It bridges premium design with dependable delivery, grounded in transparency, consistency, and structural integrity. More than spaces, it builds trust, rising steadily like its skyline-inspired identity.",
  ];
  let cumulative = 0;
  return (
    <div
      className="absolute inset-x-0 top-[360px] z-10 flex justify-center px-[24px] md:top-[500px] md:justify-start md:px-[40px]"
      style={topPx != null ? { top: topPx } : undefined}
    >
      <div className="max-w-[560px] text-center text-sm leading-[1.5] text-white/80 md:text-left md:text-base">
        {paragraphs.map((para, pi) => {
          const words = para.split(/\s+/);
          const startIdx = cumulative;
          cumulative += words.length;
          return (
            <p key={pi} className={pi > 0 ? "mt-5" : ""}>
              {textStarted
                ? words.map((w, i) => (
                    <span
                      key={i}
                      className="hero-rise inline-block"
                      style={{ ["--hero-rise-delay" as string]: `${(startIdx + i) * 25}ms` }}
                    >
                      {w}
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  ))
                : null}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Statement (Vision / Mission) ---------- */

function Statement({
  label,
  body,
  label2,
  body2,
  imageAlign,
  imageSrc,
  imageAlt,
}: {
  label: string;
  body: string;
  label2?: string;
  body2?: string;
  imageAlign: "left" | "right";
  imageSrc?: string;
  imageAlt?: string;
}) {
  const text = (
    <div className="flex flex-col gap-8 px-[30px] py-16 md:gap-12 md:px-12 md:py-20">
      <div className="flex flex-col gap-8">
        <Reveal>
          <h3 className="max-w-[14ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
            {label}
          </h3>
        </Reveal>
        <Reveal delay={150}>
          <p className="max-w-[52ch] text-sm leading-[1.5] text-white/80 md:text-base">
            {body}
          </p>
        </Reveal>
      </div>
      {label2 && body2 ? (
        <>
          <Reveal delay={200}>
            <hr className="-mx-[30px] border-t border-[#464646] md:-mx-12" />
          </Reveal>
          <div className="flex flex-col gap-8">
            <Reveal delay={250}>
              <h3 className="max-w-[14ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
                {label2}
              </h3>
            </Reveal>
            <Reveal delay={300}>
              <p className="max-w-[52ch] text-sm leading-[1.5] text-white/80 md:text-base">
                {body2}
              </p>
            </Reveal>
          </div>
        </>
      ) : null}
    </div>
  );

  const imageSlot = (
    <Reveal
      delay={120}
      className="relative aspect-[4/3] w-full overflow-hidden bg-white/[0.04] md:aspect-auto md:h-full md:min-h-[720px]"
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? label}
          fill
          quality={90}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[12px] uppercase tracking-[0.2em] text-white/30">
          Image
        </div>
      )}
    </Reveal>
  );

  if (!imageSrc) {
    return (
      <section className="border-t border-[#464646] bg-black">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] md:[&>*:first-child]:border-r md:[&>*:first-child]:border-[#464646]">
          <div aria-hidden className="hidden md:block" />
          {text}
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#464646] bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 md:[&>*:first-child]:border-r md:[&>*:first-child]:border-[#464646]">
        {imageAlign === "left" ? (
          <>
            {imageSlot}
            {text}
          </>
        ) : (
          <>
            {text}
            {imageSlot}
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- Why Choose Us ---------- */

function WhyChooseUs() {
  const items = [
    {
      title: "Integrity & Transparency",
      Icon: Handshake,
      body: "Honest dealings and clear communication at every step, from first visit to final handover.",
    },
    {
      title: "Structural Strength & Quality",
      Icon: Buildings,
      body: "Engineered to last, with rigorous material standards and precise execution on every project.",
    },
    {
      title: "Long-Term Vision",
      Icon: Binoculars,
      body: "We build for decades, not deadlines, shaping spaces that hold their value over time.",
    },
    {
      title: "Customer Confidence",
      Icon: ThumbsUp,
      body: "Thousands of families and businesses trust us to deliver exactly what we promise.",
    },
    {
      title: "Responsible Growth",
      Icon: Plant,
      body: "Scaling thoughtfully, balancing ambition with the communities and standards we uphold.",
    },
  ];
  return (
    <section className="border-t border-[#464646] bg-black">
      <Reveal className="flex flex-col gap-4 px-[30px] py-16 md:px-8 md:py-20">
        <h3 className="text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
          What we stand for
        </h3>
      </Reveal>

      <div className="grid grid-cols-1 border-t border-[#464646] sm:grid-cols-2 lg:grid-cols-5">
        {items.map(({ title, Icon, body }, i) => {
          const mobileBorder =
            i < items.length - 1
              ? "border-b border-[#464646] lg:border-b-0"
              : "";
          const smRight =
            i % 2 === 0 ? "sm:border-r sm:border-[#464646]" : "sm:border-r-0";
          const lgRight =
            i < items.length - 1
              ? "lg:border-r lg:border-[#464646]"
              : "lg:border-r-0";
          return (
            <Reveal
              key={title}
              delay={120 + i * 120}
              className={`flex flex-col gap-6 px-[30px] py-10 md:px-8 md:py-12 ${mobileBorder} ${smRight} ${lgRight}`}
            >
              <Icon
                size={48}
                weight="light"
                className="shrink-0 text-[#c19b4d]"
                aria-hidden
              />
              <div className="flex flex-col gap-3">
                <h4 className="text-[20px] font-normal leading-[1.4] text-white md:text-[22px]">
                  {title}
                </h4>
                <p className="text-[13px] leading-[1.6] text-white/55 md:text-sm">
                  {body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Accreditations (RERA + CREDAI) ---------- */

function Accreditations() {
  return (
    <section className="border-t border-[#464646] bg-black py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-[30px]">
        <Reveal>
          <div className="relative aspect-[2576/926] w-full">
            <Image
              src="/rera-credai.webp"
              alt="RERA Approved and CREDAI Member"
              fill
              quality={90}
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Milestones (2x2 stat grid) ---------- */

function Milestones() {
  const stats = [
    { value: "+10M", label: "sq. ft. built since 2005" },
    { value: "+6.3K", label: "Residential Units" },
    { value: "+10K", label: "Happy Customers" },
    { value: "+2.7K", label: "Commercial Units" },
  ];
  return (
    <section className="border-t border-[#464646] bg-black">
      <div className="mx-auto grid w-full grid-cols-1 md:grid-cols-[30%_1fr]">
        <Reveal className="flex flex-col gap-4 px-[30px] py-16 md:px-8 md:py-20">
          <h3 className="text-[32px] font-medium leading-[1.05] tracking-tight md:text-[42px]">
            Our Milestones
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 border-l border-[#464646] sm:grid-cols-2">
          {stats.map((s, i) => {
            const mobileBorder =
              i < stats.length - 1 ? "border-b border-[#464646]" : "";
            const desktopRight =
              i % 2 === 0 ? "sm:border-r sm:border-[#464646]" : "sm:border-r-0";
            const desktopBottom =
              i < 2 ? "sm:border-b sm:border-[#464646]" : "sm:border-b-0";
            return (
              <Reveal
                key={s.label}
                delay={120 + i * 120}
                className={`flex aspect-[458/240] flex-col items-center justify-center gap-2 sm:aspect-[458/220] sm:gap-3 ${mobileBorder} ${desktopRight} ${desktopBottom}`}
              >
                <CountUp
                  value={s.value}
                  className="text-[56px] font-medium leading-[0.9] tracking-tight text-white sm:text-[64px] lg:text-[120px] lg:tracking-[-4px]"
                />
                <span className="text-sm leading-[1.4] text-white/60">
                  {s.label}
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Group of Companies ---------- */

function GroupOfCompanies() {
  const logos = [
    { src: "/about/group-shrungal.webp", alt: "Shrungal", sizeClass: "h-[60%] w-[60%]" },
    { src: "/about/group-golden.webp", alt: "Golden Group", sizeClass: "h-[90%] w-[90%]" },
    { src: "/about/group-keystar.webp", alt: "Keystar Gems LLP", sizeClass: "h-[60%] w-[60%]" },
  ];
  return (
    <section className="border-t border-[#464646] bg-black p-[30px] md:py-20">
      <div className="mx-auto flex w-full flex-col gap-10">
        <Reveal className="flex flex-col gap-4">
          <h3 className="text-[32px] font-medium leading-[1.05] tracking-tight md:text-[42px]">
            Group of Companies
          </h3>
          <p className="max-w-[1200px] text-[16px] leading-[1.5] text-white">
            Golden Group spans real estate, diamond manufacturing, and the
            textile industry - three sectors built on the same foundation. With
            over 2,500 people employed across Gujarat, ours is an organisation
            that has grown steadily since 2005 not by chasing scale, but by
            maintaining standards across everything we do.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {logos.map((l, i) => (
            <Reveal
              key={l.alt}
              delay={120 + i * 120}
              className="relative flex aspect-[180/120] w-full items-center justify-center"
            >
              <div className={`relative ${l.sizeClass}`}>
                <Image
                  src={l.src}
                  alt={l.alt}
                  fill
                  quality={90}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-contain"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Inline icon SVG (color-controllable) ---------- */

function LogoIconSvg({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 43 109"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M17.8629 0.00012207C18.1075 8.66038 18.2705 17.3238 18.3521 25.9903C18.4111 30.3236 18.4238 34.6568 18.4575 38.9854L18.4954 51.9806L18.4617 64.9757C18.4238 69.3089 18.4153 73.642 18.3563 77.9754C18.2719 86.6388 18.1075 95.3022 17.8629 103.966C17.6183 95.299 17.4539 86.6356 17.3695 77.9754C17.3105 73.642 17.2978 69.3089 17.2641 64.9757L17.2303 51.9806L17.2641 38.9854C17.2978 34.6568 17.3105 30.3236 17.3695 25.9903C17.4539 17.3301 17.6183 8.66667 17.8629 0.00012207Z"
        fill={color}
      />
      <path
        d="M22.4224 21.9196C22.667 28.7534 22.8315 35.5889 22.9158 42.426C22.9749 45.8445 22.9875 49.2631 23.0213 52.6816L23.055 62.937L23.0213 73.1881C22.9875 76.6066 22.9749 80.0249 22.9158 83.4434C22.8343 90.2805 22.6698 97.1176 22.4224 103.955C22.1779 97.1176 22.0134 90.2805 21.9291 83.4434C21.87 80.0249 21.8616 76.6066 21.8237 73.1881L21.7899 62.9418L21.8279 52.6862C21.8616 49.2676 21.8742 45.8493 21.9333 42.4308C22.0148 35.5999 22.1779 28.7628 22.4224 21.9196Z"
        fill={color}
      />
      <path
        d="M13.2967 31.426C13.5413 37.471 13.7057 43.516 13.7901 49.5606C13.8491 52.5831 13.8618 55.6056 13.8955 58.6281L13.9292 67.6955L13.9166 76.7627C13.8828 79.7852 13.8702 82.8077 13.8111 85.8302C13.7324 91.8749 13.568 97.9198 13.3178 103.965C13.0732 97.9198 12.9087 91.8749 12.8244 85.8302C12.7654 82.8077 12.7569 79.7852 12.719 76.7627L12.6515 67.6955L12.6852 58.6281C12.719 55.6056 12.7316 52.5831 12.7906 49.5606C12.8862 43.516 13.0549 37.471 13.2967 31.426Z"
        fill={color}
      />
      <path
        d="M26.9811 44.2271C27.2425 49.2015 27.3777 54.1808 27.4702 59.16C27.5293 61.6498 27.542 64.1393 27.5757 66.629L27.6137 74.0932L27.58 81.562C27.542 84.0515 27.5336 86.5413 27.4745 89.0262C27.3817 94.0055 27.2425 98.9847 26.9811 103.964C26.7154 98.9847 26.5595 94.0055 26.4877 89.0262C26.4286 86.5413 26.4162 84.0515 26.3822 81.562L26.3485 74.0932L26.3822 66.629C26.4162 64.1393 26.4286 61.6498 26.4877 59.16C26.5595 54.1808 26.7113 49.2015 26.9811 44.2271Z"
        fill={color}
      />
      <path
        d="M8.74083 49.2698C9.00227 53.8294 9.14144 58.3891 9.23421 62.944C9.28903 65.2259 9.30589 67.5033 9.33964 69.7808L9.37336 76.6179L9.33964 83.4549C9.30589 85.7372 9.29324 88.0146 9.23421 90.2968C9.14144 94.8517 9.00227 99.4111 8.74083 103.971C8.47937 99.4111 8.34022 94.8517 8.24745 90.2968C8.1884 88.0146 8.17577 85.7372 8.14202 83.4549L8.10828 76.6179L8.14202 69.7808C8.17998 67.5033 8.19263 65.2259 8.24745 62.944C8.34022 58.3891 8.47937 53.8294 8.74083 49.2698Z"
        fill={color}
      />
      <path
        d="M4.17928 69.0691C4.44074 71.9785 4.57568 74.8875 4.66846 77.7921C4.72748 79.2445 4.74014 80.7015 4.77388 82.1539L4.81181 86.5154L4.77809 90.8769C4.74014 92.3293 4.73169 93.7862 4.67267 95.2384C4.57989 98.1429 4.44074 101.052 4.17928 103.962C3.91361 101.052 3.77868 98.1429 3.6859 95.2384C3.62687 93.7862 3.61422 92.3293 3.58048 90.8769L3.54675 86.5154L3.58048 82.1539C3.61422 80.7015 3.62687 79.2445 3.6859 77.7921C3.79554 74.8924 3.91782 71.983 4.17928 69.0691Z"
        fill={color}
      />
      <path
        d="M31.5424 57.2831C31.804 61.1731 31.943 65.0631 32.0358 68.958C32.0908 70.9006 32.1076 72.848 32.1413 74.7954L32.175 80.6328L32.1413 86.4703C32.1076 88.4129 32.0949 90.3603 32.0358 92.3077C31.943 96.1977 31.804 100.088 31.5424 103.983C31.281 100.088 31.1207 96.1977 31.0492 92.3077C30.9902 90.3603 30.9775 88.4129 30.9438 86.4703L30.91 80.6328L30.9438 74.7954C30.9815 72.848 30.9942 70.9006 31.0492 68.958C31.1418 65.049 31.281 61.1589 31.5424 57.2831Z"
        fill={color}
      />
      <path
        d="M36.0988 74.181C36.3602 76.6614 36.4994 79.1416 36.5922 81.6265C36.651 82.8666 36.6637 84.1067 36.6974 85.3467L36.7311 89.0717L36.6974 92.7968C36.6637 94.0368 36.651 95.2769 36.5922 96.517C36.5034 99.0019 36.3642 101.482 36.0988 103.967C35.8373 101.482 35.6769 99.0019 35.6054 96.517C35.5463 95.2769 35.5379 94.0368 35.4999 92.7968L35.4705 89.0717L35.5042 85.3467C35.5379 84.1067 35.5506 82.8666 35.6094 81.6265C35.7022 79.1416 35.8457 76.6614 36.0988 74.181Z"
        fill={color}
      />
      <path
        d="M26.9785 40.1048C26.9959 40.1035 27.0129 40.1096 27.0263 40.1219C27.0395 40.1342 27.0481 40.1516 27.0502 40.1708C27.0926 40.331 27.1263 40.4915 27.1767 40.6423C27.2306 40.8306 27.3265 41.0001 27.4558 41.1347C27.585 41.2692 27.7431 41.3644 27.9148 41.4109L28.2647 41.524C28.3111 41.524 28.3322 41.5666 28.3322 41.6091C28.3322 41.6513 28.3111 41.6749 28.2647 41.689C28.1255 41.7364 27.9823 41.7741 27.8431 41.826C27.6749 41.8872 27.5235 41.995 27.4025 42.1391C27.2817 42.2835 27.1954 42.4595 27.1514 42.651L27.0502 43.047C27.0502 43.0941 27.0124 43.1225 26.9785 43.1225C26.9447 43.1225 26.9196 43.0941 26.907 43.047C26.8606 42.8772 26.8268 42.6981 26.7678 42.5331C26.7092 42.3552 26.613 42.1958 26.4875 42.0685C26.3619 41.9415 26.2107 41.85 26.0467 41.8022L25.6925 41.689C25.6461 41.689 25.625 41.6468 25.625 41.6091C25.6248 41.5888 25.631 41.569 25.6425 41.5535C25.6542 41.5379 25.6705 41.5275 25.6881 41.524C25.84 41.477 25.9919 41.4393 26.1395 41.378C26.3026 41.3138 26.4492 41.2053 26.5654 41.0619C26.6817 40.9188 26.7644 40.7453 26.8058 40.5576L26.907 40.166C26.9108 40.1481 26.9199 40.1323 26.933 40.1214C26.9462 40.1101 26.9622 40.1043 26.9785 40.1048Z"
        fill="url(#aboutLogoStar)"
      />
      <path
        d="M0 108.676C3.45336 107.373 7.0062 106.426 10.614 105.847C12.4104 105.522 14.2237 105.314 16.037 105.126C16.9437 105.022 17.8545 104.975 18.7654 104.932C19.6762 104.89 20.5829 104.81 21.4979 104.81H24.2348C25.1455 104.838 26.0606 104.866 26.9716 104.928C27.427 104.961 27.8824 104.98 28.3377 105.027L29.6998 105.173C30.6108 105.276 31.5215 105.357 32.4239 105.531C33.3266 105.706 34.2289 105.847 35.127 106.031C35.5783 106.116 36.0253 106.234 36.468 106.352L37.8048 106.705C38.6904 106.96 39.5761 107.177 40.4361 107.54L41.735 108.035L43 108.558L42.9622 108.719C39.4519 107.815 35.89 107.185 32.3017 106.833C28.7104 106.495 25.1054 106.369 21.5022 106.455C17.9009 106.515 14.3053 106.741 10.7152 107.134C7.13083 107.535 3.54645 108.078 0.0126503 108.827L0.0126503 108.676Z"
        fill={color}
      />
      <defs>
        <linearGradient
          id="aboutLogoStar"
          x1="26.9786"
          y1="40.1046"
          x2="26.9786"
          y2="43.1225"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C19B4D" />
          <stop offset="1" stopColor="#9C7013" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ---------- Tiny color helpers ---------- */

type RGB = { r: number; g: number; b: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

function rgbCss({ r, g, b }: RGB) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/* ---------- CountUp: animates 0 → target when scrolled into view ---------- */

function CountUp({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  const match = value.match(/^([^\d.-]*)([\d.]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numericStr = match?.[2] ?? "0";
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numericStr);
  const decimals = numericStr.includes(".")
    ? numericStr.split(".")[1].length
    : 0;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(target);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect();
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setN(target * eased);
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Reveal-on-scroll wrapper (matches residential/commercial) ---------- */

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
