"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  OFFICE_ADDRESS,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const GOLDEN_CHARS = ["G", "O", "L", "D", "E", "N"];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/residential", label: "Residential" },
  { href: "/commercial-industrial", label: "Commercial & Industrial" },
  { href: "/projects", label: "Projects" },
];

const socials = [
  { href: INSTAGRAM_URL, label: "Instagram" },
  { href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
];

export function SiteFooter() {
  return (
    <div className="flex flex-col md:h-[100dvh] md:min-h-[640px]">
      <footer className="relative grid grid-cols-1 border-t border-[#464646] bg-black md:flex-1 md:min-h-0 md:grid-cols-2">
      {/* LEFT */}
      <div className="relative flex flex-col gap-10 p-[30px] lg:flex-row lg:gap-12">
        {/* Mobile: icon + logo, vertically aligned, anchored to the left */}
        <div className="flex items-center gap-4 md:hidden">
          <Image
            src="/icon.svg"
            alt=""
            width={86}
            height={218}
            className="h-[60px] w-auto"
          />
          <Image
            src="/logo.svg"
            alt="Golden Group"
            width={300}
            height={70}
            className="h-[34px] w-auto"
          />
        </div>
        {/* Desktop: logo only */}
        <Image
          src="/logo.svg"
          alt="Golden Group"
          width={300}
          height={70}
          className="hidden h-[34px] w-auto md:block md:h-[45px]"
        />
        <div className="flex w-full flex-col justify-between gap-12 lg:ml-auto lg:w-[230px]">
          <ul className="flex flex-col gap-2 text-[24px] leading-[1.2] text-white">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-white/80">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2 text-[24px] leading-[1.2] text-white">
            {socials.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="hover:text-white/80">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col border-t border-[#464646] md:border-l md:border-t-0 md:border-[#464646]">
        <div className="flex flex-1 flex-col items-stretch justify-between gap-10 p-[30px]">
          <div className="flex flex-row items-start justify-between gap-9">
            <Image
              src="/icon.svg"
              alt=""
              width={86}
              height={218}
              className="hidden h-[180px] w-auto md:block md:h-[200px]"
            />
            <div className="flex w-full flex-col gap-6 md:w-1/2 md:max-w-none">
              <div className="flex flex-col gap-2 pb-6 md:pb-0">
                <p className="hidden text-base leading-[1.5] text-white md:block">
                  {OFFICE_ADDRESS}
                </p>
                <div className="flex flex-col text-base leading-[1.5] text-white/55">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="hover:text-white"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <a href={`tel:${PHONE_TEL}`} className="hover:text-white">
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex w-full items-center justify-between sm:block sm:w-auto">
              <span>© {new Date().getFullYear()} Golden Group.</span>
              <span className="sm:block">All rights reserved.</span>
            </span>
            <FooterPill href="/contact" label="Contact Us" />
          </div>
        </div>
        <div className="border-t border-[#464646]" aria-hidden />
        <div className="flex flex-col gap-4 px-[30px] py-6 text-sm text-white/55 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex flex-wrap gap-6 md:gap-8">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/disclaimer" className="hover:text-white">
              Disclaimer
            </Link>
          </div>
          <a
            href="https://thesummerdesign.com"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden hover:text-white lg:block"
          >
            By The Summer Design
          </a>
        </div>
      </div>
      </footer>
      <GoldenCharsStrip />
    </div>
  );
}

function GoldenCharsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="border-t border-[#464646] bg-black overflow-hidden"
    >
      <div className="flex items-center justify-between gap-[2vw] px-[30px] py-8 md:py-12">
        {GOLDEN_CHARS.map((ch, i) => (
          <span
            key={ch}
            className={shown ? "hero-rise inline-block" : "inline-block opacity-0"}
            style={{ ["--hero-rise-delay" as string]: `${i * 110}ms` } as CSSProperties}
          >
            <Image
              src={`/footer-chars/${ch}.svg`}
              alt={ch}
              width={214}
              height={134}
              className="h-[60px] w-auto md:h-[100px] lg:h-[140px]"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

function FooterPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="pill-hover relative block h-[75px] w-full shrink-0 overflow-hidden bg-white text-black sm:w-1/2"
      style={{ transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}` }}
    >
      <span
        aria-hidden
        className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
      />
      <span className="relative z-10 flex h-full w-full items-end justify-between p-[10px] text-sm font-medium">
        {label}
        <FooterStarIcon />
      </span>
    </Link>
  );
}

function FooterStarIcon() {
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
