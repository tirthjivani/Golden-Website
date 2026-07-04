"use client";

import Image from "next/image";
import Link from "next/link";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

type NavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/residential", label: "Residential" },
  { href: "/commercial-industrial", label: "Commercial" },
  { href: "/projects", label: "Projects" },
];

export default function MenuPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 flex h-full w-[var(--panel-w)] flex-col border-l border-[#464646] bg-black text-white"
      style={{
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: `transform 700ms ${EASE}`,
      }}
      aria-hidden={!open}
      // Keep the off-screen panel out of the tab order entirely.
      inert={!open || undefined}
    >
      <Image
        src="/icon.svg"
        alt=""
        width={43}
        height={109}
        className="pointer-events-none absolute left-8 top-8 h-[125px] w-auto md:left-10 md:top-10 md:h-[150px]"
      />
      <div className="flex h-full flex-col p-8 md:p-10">
        <div className="flex items-start justify-end">
          <button
            type="button"
            onClick={onClose}
            className="group/close flex items-center gap-3 text-base font-medium"
            aria-label="Close menu"
          >
            <span className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2]">
              <span className="block transition-transform duration-300 ease-out group-hover/close:-translate-y-full">
                Close
              </span>
              <span className="absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover/close:translate-y-0">
                Close
              </span>
            </span>
            <span className="inline-flex transition-transform duration-300 ease-out group-hover/close:rotate-90 group-hover/close:scale-110">
              <CloseIcon />
            </span>
          </button>
        </div>

        <nav className="my-auto flex flex-col gap-3 py-12">
          {NAV_LINKS.map((link, i) => {
            const entryDelay = open ? 250 + i * 70 : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="group/nav relative inline-flex w-fit items-center text-[40px] font-medium leading-[1.1] tracking-tight text-white/40 hover:pl-[52px] hover:text-white md:text-[52px] md:hover:pl-[60px]"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 600ms ${EASE} ${entryDelay}ms, transform 600ms ${EASE} ${entryDelay}ms, padding 500ms ${EASE}, color 500ms ${EASE}`,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 -translate-x-3 items-center justify-center text-[#C19B4D] opacity-0 group-hover/nav:translate-x-0 group-hover/nav:opacity-100"
                  style={{
                    transition: `opacity 400ms ${EASE}, transform 500ms ${EASE}`,
                    willChange: "opacity, transform",
                  }}
                >
                  <NavStarIcon />
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="flex items-end justify-between gap-6"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 600ms ${EASE}, transform 600ms ${EASE}`,
            transitionDelay: open ? `${250 + NAV_LINKS.length * 70}ms` : "0ms",
          }}
        >
          <Image
            src="/logo.svg"
            alt="Golden Group"
            width={148}
            height={32}
            className="h-5 w-auto md:h-6"
          />
          <Link
            href="/contact"
            onClick={onClose}
            className="pill-hover relative block h-[75px] w-[245px] shrink-0 overflow-hidden bg-white text-black"
          >
            <span
              aria-hidden
              className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
            />
            <span className="relative z-10 flex h-full w-full items-end justify-between p-[10px] text-sm font-medium">
              Contact Us
              <NavStarIcon />
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function NavStarIcon() {
  return (
    <svg
      width="22"
      height="22"
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

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" />
      <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
