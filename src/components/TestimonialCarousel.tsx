"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type Testimonial = {
  id: string;
  // video src is optional for now; falls back to poster image only
  video?: string;
  poster: string;
  name?: string;
  role?: string;
};

const TESTIMONIALS: Testimonial[] = [
  { id: "t1", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-1.mp4" },
  { id: "t2", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-2.mp4" },
  { id: "t3", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-3.mp4" },
  { id: "t4", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-4.mp4" },
  { id: "t5", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-5.mp4" },
  { id: "t6", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-6.mp4" },
  { id: "t7", poster: "/testimonials/poster-1.jpg", video: "/testimonials/testimonial-7.mp4" },
];

export function TestimonialCarousel({
  count = "+10K",
  labelLines = ["Happy", "Customers"],
}: {
  count?: string;
  labelLines?: [string, string];
}) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const total = TESTIMONIALS.length;

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);
  const toggleMute = () => setMuted((m) => !m);

  return (
    <section className="border-y border-[#464646] bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%]">
        <div className="relative flex min-h-[269px] items-end p-[30px] md:min-h-[665px] md:justify-end md:border-r md:border-[#464646]">
          <Reveal>
            <div className="flex items-end gap-4 md:flex-col md:items-end md:gap-3">
              <span className="text-[80px] font-medium leading-[0.9] tracking-tight lg:text-[140px] lg:tracking-[-4px]">
                {count}
              </span>
              <span className="flex max-w-[180px] flex-col pb-3 text-sm leading-[1.4] text-white/60 md:pb-0 md:text-right">
                <span>{labelLines[0]}</span>
                <span>{labelLines[1]}</span>
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative flex flex-col gap-[17px] p-[30px] md:py-[60px]">
          <div className="relative aspect-[852/483] w-full overflow-hidden bg-black">
            {TESTIMONIALS.map((t, i) => (
              <Slide
                key={t.id}
                testimonial={t}
                active={i === active}
                muted={muted}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-[6px]">
              <NavButton onClick={prev} aria-label="Previous testimonial">
                <Arrow dir="left" />
              </NavButton>
              <NavButton onClick={next} aria-label="Next testimonial">
                <Arrow dir="right" />
              </NavButton>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                aria-pressed={!muted}
                className="flex h-[45px] w-[45px] items-center justify-center transition-colors"
                style={{
                  backgroundColor: muted ? "#8e3a3a" : "#ffffff",
                  color: muted ? "#ffffff" : "#000000",
                }}
              >
                {muted ? <MutedIcon /> : <UnmutedIcon />}
              </button>
            </div>
            <div className="flex items-center gap-[3px]">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="h-[11px] w-[11px]"
                  style={{
                    backgroundColor:
                      i === active ? "#fff" : "rgba(255,255,255,0.2)",
                    backdropFilter: i === active ? "none" : "blur(1.7px)",
                    transition: `background-color 250ms ${EASE}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slide({
  testimonial,
  active,
  muted,
}: {
  testimonial: Testimonial;
  active: boolean;
  muted: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (active && !muted) {
      v.play().catch(() => {});
    }
  }, [muted, active]);

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: active ? 1 : 0,
        transition: `opacity 600ms ${EASE}`,
      }}
      aria-hidden={!active}
    >
      <Image
        src={testimonial.poster}
        alt=""
        fill
        quality={90}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        priority={false}
      />
      {testimonial.video && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={testimonial.video}
          poster={testimonial.poster}
          muted={muted}
          playsInline
          loop
          preload="metadata"
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

function NavButton({
  onClick,
  children,
  ...rest
}: {
  onClick: () => void;
  children: ReactNode;
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[45px] w-[60px] items-center justify-center bg-[#313131] text-white transition-colors hover:bg-[#3f3f3f] sm:w-[100px] md:w-[140px]"
      {...rest}
    >
      {children}
    </button>
  );
}

function MutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      style={{ transform: dir === "left" ? "rotate(180deg)" : "none" }}
    >
      <path
        d="M2 7h10m0 0-4-4m4 4-4 4"
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
