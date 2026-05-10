"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { RecognitionSection } from "@/components/RecognitionSection";
import ScrollLottie from "@/components/ScrollLottie";
import { SiteFooter } from "@/components/SiteFooter";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const ACCENT_BLUE = { r: 100, g: 184, b: 240 }; // #64B8F0
const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 255, g: 255, b: 255 };

export default function AboutPage() {
  return (
    <main className="relative w-full bg-black text-white">
      <IntroSection />
      <StorySection />
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

  // Phase mapping
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
            willChange: "transform, opacity",
          }}
        >
          <LogoIconSvg color={rgbCss(iconColor)} className="absolute inset-0 h-full w-full" />
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

        {/* Clouds drifting in from the left (behind the buildings) */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-[14%] mx-auto h-[26%] max-w-[820px] px-[30px]"
          style={{
            opacity: cloudsP,
            transform: `translateX(${(1 - cloudsP) * -120}px)`,
            willChange: "transform, opacity",
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src="/about/clouds.png"
              alt=""
              fill
              sizes="(min-width:768px) 760px, 100vw"
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>
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
            className="block h-auto w-full min-[800px]:hidden"
            priority
            fetchPriority="high"
          />
          <Image
            src="/about/building-wide.webp"
            alt=""
            width={9656}
            height={5754}
            sizes="100vw"
            className="hidden h-auto w-full min-[800px]:block"
            priority
            fetchPriority="high"
          />
        </div>

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
        lineWidth={223}
        anchorX="50%"
        anchorY="0%"
      >
        Central tallest line symbolizes
        <br />
        leadership and aspiration
      </Meaning>
      <Meaning
        shown={shown}
        delay={140}
        side="right"
        lineWidth={162}
        anchorX="62%"
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
        lineWidth={181}
        anchorX="22%"
        anchorY="58%"
      >
        Vertical golden lines represent buildings,
        <br />
        growth, and upward momentum
      </Meaning>
      <Meaning
        shown={shown}
        delay={420}
        side="right"
        lineWidth={101}
        anchorX="50%"
        anchorY="99%"
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
  return (
    <>
      <section className="relative h-[80vh] min-h-[640px] w-full border-b border-[#464646] bg-black">
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          <div className="relative flex h-full flex-col p-[30px]">
            <Reveal className="flex items-start gap-3">
              <span className="text-[80px] font-medium leading-[0.9] tracking-tight lg:text-[140px] lg:tracking-[-4px]">
                2005
              </span>
              <span className="pt-2 text-[12px] uppercase tracking-[0.08em] text-white/60 md:pt-4 md:text-[14px]">
                Since
              </span>
            </Reveal>
            <Reveal as="div" delay={120} className="mt-auto">
              <h2 className="max-w-[18ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
                Two Decades of Shaping Spaces That Last
              </h2>
            </Reveal>
          </div>

          <div className="relative flex h-full flex-col gap-8 p-[30px] md:border-l md:border-[#464646]">
            <Reveal delay={120}>
              <h3 className="text-[36px] font-medium leading-[1.05] tracking-tight lg:text-[50px]">
                Golden Group Story
              </h3>
            </Reveal>
            <Reveal delay={240} className="flex flex-col gap-5 text-[18px] leading-[1.4] text-white/85 md:max-w-[560px] md:text-[24px] md:leading-[1.2]">
              <p>
                Golden Group was founded on the belief that real estate should
                stand for confidence, stability, and long-term value, not just
                buildings. Its name reflects enduring quality and collective
                strength, built for today and valued for tomorrow.
              </p>
              <p>
                It bridges premium design with dependable delivery, grounded in
                transparency, consistency, and structural integrity. More than
                spaces, it builds trust, rising steadily like its
                skyline-inspired identity.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <StoryGallery />
    </>
  );
}

const STORY_GALLERY_IMAGES = [
  "/residential/gallery-1.jpg",
  "/residential/gallery-2.jpg",
  "/residential/gallery-3.jpg",
  "/residential/gallery-4.jpg",
  "/residential/gallery-5.jpg",
  "/residential/gallery-6.jpg",
];

function StoryGallery() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % STORY_GALLERY_IMAGES.length);
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
    <section className="relative w-full border-b border-[#464646] bg-black">
      <div className="relative h-[85vh] min-h-[480px] w-full overflow-hidden">
        {STORY_GALLERY_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity 800ms ${EASE}`,
            }}
          />
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[45%] bg-gradient-to-t from-black via-black/70 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end p-[20px] md:p-[30px]">
          <div className="flex gap-2 md:gap-3">
            {STORY_GALLERY_IMAGES.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show image ${i + 1}`}
                className="relative aspect-square h-[48px] w-[48px] shrink-0 overflow-hidden sm:h-[70px] sm:w-[70px] md:h-[97px] md:w-[97px]"
                style={{
                  opacity: index === i ? 1 : 0.55,
                  transition: `opacity 350ms ${EASE}`,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
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

/* ---------- Why Choose Us ---------- */

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
    <section className="border-t border-[#464646] bg-black px-[30px] py-16 md:py-20">
      <Reveal>
        <h3 className="max-w-[12ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
          Why Choose Us?
        </h3>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={120 + i * 120}
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
              <p className="text-[14px] leading-[1.4] text-[#aaa]">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
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
              src="/rera-credai.png"
              alt="RERA Approved and CREDAI Member"
              fill
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
    { value: "+10M", label: "sq. ft. built since 2005", filled: false },
    { value: "+6.3k", label: "Residential Units", filled: true },
    { value: "+10k", label: "Happy Customers", filled: true },
    { value: "+2.7k", label: "Commercial Units", filled: false },
  ];
  return (
    <section className="border-t border-[#464646] bg-black px-[30px] py-16 md:py-20">
      <div className="mx-auto grid w-full grid-cols-1 gap-10 md:grid-cols-[260px_1fr] md:gap-12 lg:grid-cols-[320px_1fr]">
        <Reveal className="flex flex-col gap-4">
          <p className="text-[32px] font-medium leading-[1.05] tracking-tight md:text-[42px]">
            Our Milestones
          </p>
          <p className="max-w-[420px] text-[16px] leading-[1.5] text-white">
            22 completed projects. 55 lakh square feet constructed. 9,000+
            families and businesses served across Gujarat.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={120 + i * 120}
              className={`flex aspect-[458/360] flex-col items-center justify-center gap-3 sm:aspect-[458/220] ${
                s.filled
                  ? "bg-[#111]"
                  : "border border-[#464646]"
              }`}
            >
              <CountUp
                value={s.value}
                className="text-[56px] font-medium leading-[0.9] tracking-tight text-white sm:text-[64px] lg:text-[120px] lg:tracking-[-4px]"
              />
              <span className="text-sm leading-[1.4] text-white/60">
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Group of Companies ---------- */

function GroupOfCompanies() {
  const logos = [
    { src: "/about/group-shrungal.png", alt: "Shrungal", sizeClass: "h-[60%] w-[60%]" },
    { src: "/about/group-golden.png", alt: "Golden Group", sizeClass: "h-[90%] w-[90%]" },
    { src: "/about/group-keystar.png", alt: "Keystar Gems LLP", sizeClass: "h-[60%] w-[60%]" },
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
            textile industry — three sectors built on the same foundation. With
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
