"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const YOUTUBE_ID = "kzg2SO6HMUQ";
const YOUTUBE_SRC = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`;
const RIBBON_SRC = "/recognition-ribbon.webp";

export function RecognitionSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const next = !muted;
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: next ? "mute" : "unMute",
        args: [],
      }),
      "*",
    );
    setMuted(next);
  };

  return (
    <section className="border-t border-[#464646] bg-black text-white">
      <div className="px-[30px] py-16 md:py-20">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-7">
            <h3 className="max-w-[26ch] text-[32px] font-medium leading-[1.2] tracking-tight md:text-[42px]">
              Trusted by thousands. Recognized by the industry.
            </h3>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5">
            <p className="max-w-[508px] text-sm leading-[1.5] text-white md:text-base">
              With over 20 years of experience, Golden Group has been shaping
              spaces that have become home to thousands of families and
              businesses. Driven by a commitment to quality, comfort, and
              technical excellence, the company continues to create thoughtfully
              designed developments built for lasting value.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120} className="px-[30px] pb-16 md:pb-20">
        <div className="relative aspect-video w-full overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Golden Group Recognitions"
            src={YOUTUBE_SRC}
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <div className="pointer-events-none absolute left-0 top-1/2 z-10 -translate-y-1/2">
            <Image
              src={RIBBON_SRC}
              alt="Award winning legacy since 2005"
              width={132}
              height={198}
              quality={90}
              className="h-auto w-[80px] md:w-[110px] lg:w-[132px]"
            />
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 md:bottom-6 md:right-6 md:h-12 md:w-12"
          >
            {muted ? <MutedIcon /> : <UnmutedIcon />}
          </button>
        </div>
      </Reveal>

      <div className="border-t border-[#464646]" aria-hidden />
    </section>
  );
}

function MutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
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
