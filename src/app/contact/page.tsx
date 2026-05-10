"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export default function ContactPage() {
  return (
    <main className="relative w-full bg-black text-white">
      <ContactSection />
      <SiteFooter />
    </main>
  );
}

function ContactSection() {
  return (
    <section className="relative w-full pt-[120px] md:pt-[140px]">
      {/* Vertical center divider — desktop only; aligns with footer's central border */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-[#464646] md:block"
      />

      <div className="relative grid grid-cols-1 md:grid-cols-2">
        {/* LEFT — Contact title */}
        <div className="flex items-start px-[30px] pb-12 pt-6 md:pt-12">
          <h1 className="text-[40px] font-medium leading-[1.1] tracking-tight text-white md:text-[52px]">
            Contact
          </h1>
        </div>

        {/* RIGHT — info cards + form */}
        <div className="flex flex-col">
          <InfoGrid />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function InfoGrid() {
  return (
    <div className="flex flex-col">
      <InfoCard
        label="Email"
        value="info@goldengroup.in"
        action={{ kind: "copy", text: "info@goldengroup.in", verb: "Email" }}
      />
      <div className="-mt-px grid grid-cols-1 lg:grid-cols-2">
        <InfoCard
          label="Instagram"
          value="@goldengroupofficial"
          action={{
            kind: "open",
            href: "https://www.instagram.com/goldengroupofficial",
            verb: "Instagram",
          }}
        />
        <div className="-mt-px lg:ml-[-1px] lg:mt-0">
          <InfoCard
            label="Phone"
            value="+91 98765 43210"
            action={{ kind: "copy", text: "+919876543210", verb: "Phone" }}
          />
        </div>
      </div>
      <div className="-mt-px">
        <InfoCard
          label="Location"
          value={
            <span className="block max-w-[640px]">
              3rd Floor, Part-B, Plot No-5, Kohinoor Industrial Estate, Varachha
              Road, Surat, Gujarat – 395006
            </span>
          }
          action={{
            kind: "copy",
            text: "3rd Floor, Part-B, Plot No-5, Kohinoor Industrial Estate, Varachha Road, Surat, Gujarat – 395006",
            verb: "Address",
          }}
        />
      </div>
    </div>
  );
}

type CardAction =
  | { kind: "copy"; text: string; verb: string }
  | { kind: "open"; href: string; verb: string };

function InfoCard({
  label,
  value,
  action,
}: {
  label: string;
  value: ReactNode;
  action: CardAction;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onClick = async () => {
    if (action.kind === "open") {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      await navigator.clipboard.writeText(action.text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const hint =
    action.kind === "open"
      ? `Open ${action.verb}`
      : copied
        ? `Copied ${action.verb}`
        : `Copy ${action.verb}`;

  const showTick = action.kind === "copy" && copied;

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-hover group/info relative flex min-h-[180px] w-full flex-col justify-between overflow-hidden border border-[#464646] bg-black p-[30px] text-left md:min-h-[198px]"
    >
      <span
        aria-hidden
        className="card-fill pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
      />
      <span className="relative z-10 flex flex-1 flex-col justify-between gap-6">
        <span className="text-[22px] font-medium leading-[1.2] text-white transition-colors duration-300 group-hover/info:text-black md:text-[24px]">
          {label}
        </span>
        <span className="flex items-end justify-between gap-6">
          <span className="text-[15px] leading-[1.5] text-white/70 transition-colors duration-300 group-hover/info:text-black md:text-base">
            {value}
          </span>
          <span
            className="flex shrink-0 items-center gap-2 text-[15px] leading-[1.5] text-black opacity-0 transition-opacity duration-300 group-hover/info:opacity-100 md:text-base"
            aria-hidden
          >
            {showTick ? <TickIcon /> : null}
            {hint}
          </span>
        </span>
      </span>
    </button>
  );
}

function TickIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 18 18"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5l3.5 3.5L15 5" />
    </svg>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-6 border-t border-[#464646] p-[30px] md:border-l md:border-t-0">
      <h2 className="text-[28px] font-medium leading-[1.2] tracking-tight text-white md:text-[36px]">
        Get in touch
      </h2>

      {submitted ? (
        <div className="flex min-h-[480px] items-center justify-center text-center text-white/70">
          <p>
            Thanks — we&apos;ve received your message and will be in touch
            shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <Field label="Name" name="name" placeholder="Your full name" required />
          <Field
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Your phone number"
            required
          />
          <Field
            label="Your Email"
            name="email"
            type="email"
            placeholder="Your email address"
            required
          />
          <TextareaField
            label="I'm interested in"
            name="message"
            placeholder="Your message here"
            required
          />
          <div className="mt-2">
            <PillButton label="Send" />
          </div>
        </form>
      )}
    </div>
  );
}

function PillButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="pill-hover relative block h-[50px] w-[245px] shrink-0 overflow-hidden bg-white text-black"
      style={{ transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}` }}
    >
      <span
        aria-hidden
        className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
      />
      <span className="relative z-10 flex h-full w-full items-end justify-between px-[12px] pb-[8px] pt-[4px] text-sm font-medium">
        {label}
        <PillStarIcon />
      </span>
    </button>
  );
}

function PillStarIcon() {
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      aria-label={label}
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      className="w-full bg-[#131313] px-3 py-4 text-[15px] text-white outline-none transition-colors duration-300 placeholder:text-[#a1a1a1] focus:bg-[#2a2114] md:text-base"
    />
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      aria-label={label}
      name={name}
      required={required}
      placeholder={placeholder}
      rows={6}
      className="min-h-[180px] w-full resize-none bg-[#131313] px-3 py-4 text-[15px] text-white outline-none transition-colors duration-300 placeholder:text-[#a1a1a1] focus:bg-[#2a2114] md:min-h-[234px] md:text-base"
    />
  );
}
