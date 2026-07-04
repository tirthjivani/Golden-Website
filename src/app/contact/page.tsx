"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CAREERS_EMAIL,
  INSTAGRAM_URL,
  OFFICE_ADDRESS,
  PHONE_DISPLAY,
  PHONE_TEL,
  SALES_EMAIL,
} from "@/lib/site";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ContactPage() {
  return (
    <main className="relative w-full bg-black text-white">
      <ContactSection />
      <SiteFooter />
    </main>
  );
}

const TABS = [
  { id: "inquire", label: "Inquire" },
  { id: "careers", label: "Careers" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ContactSection() {
  const [tab, setTab] = useState<TabId>("inquire");

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = tab === "inquire" ? "careers" : "inquire";
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <section className="relative w-full">
      <div className="flex items-start px-[30px] pb-12 pt-[120px] md:pt-[140px]">
        <h1 className="text-[40px] font-normal leading-[1.1] tracking-tight text-white md:text-[52px]">
          Contact
        </h1>
      </div>

      <div className="mx-auto w-full max-w-[760px] px-[30px]">
        <div
          role="tablist"
          aria-label="Contact forms"
          className="flex w-full border border-[#464646]"
        >
          {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={onTabKeyDown}
              className={`-ml-px h-[56px] flex-1 border-l border-[#464646] px-3 text-center text-[13px] uppercase tracking-[0.08em] transition-colors duration-300 first:ml-0 first:border-l-0 ${
                active
                  ? "z-10 bg-white text-black"
                  : "bg-transparent text-white/80 hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="border-b border-[#464646]"
      >
        <div className="mx-auto w-full max-w-[760px]">
          {tab === "inquire" ? <ContactForm /> : <CareersForm />}
        </div>
      </div>

      <InfoGrid tab={tab} />
    </section>
  );
}

function InfoGrid({ tab }: { tab: TabId }) {
  // The email card mirrors where the enquiry API routes the active form.
  const email = tab === "careers" ? CAREERS_EMAIL : SALES_EMAIL;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <InfoCard
        className="-mt-px border-x-0 md:-ml-px md:border-x"
        label="Phone"
        value={PHONE_DISPLAY}
        action={{ kind: "call", href: `tel:${PHONE_TEL}`, verb: "Phone" }}
      />
      <InfoCard
        className="-mt-px border-x-0 md:-ml-px md:border-x"
        label="Email"
        value={email}
        action={{ kind: "copy", text: email, verb: "Email" }}
      />
      <InfoCard
        className="-mt-px border-x-0 md:-ml-px md:border-x"
        label="Instagram"
        value="@goldengroupofficial"
        action={{
          kind: "open",
          href: INSTAGRAM_URL,
          verb: "Instagram",
        }}
      />
      <InfoCard
        className="-mt-px border-x-0 md:-ml-px md:border-x"
        label="Location"
        value={<span className="block">{OFFICE_ADDRESS}</span>}
        action={{
          kind: "copy",
          text: OFFICE_ADDRESS,
          verb: "Address",
        }}
      />
    </div>
  );
}

type CardAction =
  | { kind: "copy"; text: string; verb: string }
  | { kind: "open"; href: string; verb: string }
  | { kind: "call"; href: string; verb: string };

function InfoCard({
  label,
  value,
  action,
  className = "",
}: {
  label: string;
  value: ReactNode;
  action: CardAction;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onCopy = async () => {
    if (action.kind !== "copy") return;
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
      : action.kind === "call"
        ? `Call ${action.verb}`
        : copied
          ? `Copied ${action.verb}`
          : `Copy ${action.verb}`;

  const showTick = action.kind === "copy" && copied;

  const cardClass = `card-hover group/info relative flex w-full flex-col justify-between overflow-hidden border border-[#464646] bg-black p-[30px] text-left md:min-h-[198px] ${className}`;

  const inner = (
    <>
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
    </>
  );

  // Real anchors so the OS handles them natively: tel: starts a call, and the
  // Instagram URL is a universal link that opens the app when installed.
  if (action.kind === "open") {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {inner}
      </a>
    );
  }
  if (action.kind === "call") {
    return (
      <a href={action.href} className={cardClass}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onCopy} className={cardClass}>
      {inner}
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (submitted) return;
    const el = formRef.current;
    if (!el) return;
    const measure = () => setLockedHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [submitted]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    if (formRef.current) setLockedHeight(formRef.current.offsetHeight);
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          source: "contact",
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          message: fd.get("message"),
          website: fd.get("website"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 2500);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-[30px]">
      <h2 className="text-[28px] font-normal leading-[1.2] tracking-tight text-white md:text-[36px]">
        Get in touch
      </h2>

      <div style={{ minHeight: lockedHeight ?? undefined }}>
        {submitted ? (
          <SuccessState />
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6">
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
            <HoneypotField />
            <div className="mt-2">
              <PillButton label={sending ? "Sending..." : "Send"} disabled={sending} />
            </div>
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                Something went wrong and your message was not sent. Please try
                again, or reach us by phone or email.
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

// Off-screen text field real users never see; bots auto-fill it and the API
// silently discards those submissions.
function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px opacity-0"
    />
  );
}

function SuccessState() {
  const [data, setData] = useState<unknown>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/success-confetti.json")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="h-[180px] w-[180px]">
        {data ? (
          <Lottie animationData={data} loop={false} autoplay className="h-full w-full" />
        ) : null}
      </div>
      <p className="text-[18px] font-medium text-white md:text-[20px]">
        Your request has been submitted
      </p>
      <p className="max-w-[36ch] text-sm leading-[1.5] text-white/70">
        Thanks for reaching out. Our team will get back to you shortly.
      </p>
    </div>
  );
}

function PillButton({
  label,
  disabled = false,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`pill-hover relative block h-[50px] w-full min-w-0 overflow-hidden transition-all duration-300 sm:w-[245px] sm:shrink-0 ${
        disabled
          ? "bg-neutral-955 border border-neutral-800 text-neutral-500 cursor-not-allowed"
          : "bg-white text-black"
      }`}
      style={{
        transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}, background-color 300ms ${EASE}, color 300ms ${EASE}, border-color 300ms ${EASE}`,
      }}
    >
      {!disabled && (
        <span
          aria-hidden
          className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
        />
      )}
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      aria-label={label}
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-[#131313] px-3 py-4 text-[15px] text-white outline-none transition-colors duration-300 placeholder:text-[#a1a1a1] focus:bg-[#2a2114] md:text-base"
    />
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      aria-label={label}
      name={name}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={3}
      className="min-h-[120px] w-full resize-none bg-[#131313] px-3 py-4 text-[15px] text-white outline-none transition-colors duration-300 placeholder:text-[#a1a1a1] focus:bg-[#2a2114] md:min-h-[148px] md:text-base"
    />
  );
}

const MAX_RESUME_BYTES = 4 * 1024 * 1024;

function CareersForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (submitted) return;
    const el = formRef.current;
    if (!el) return;
    const measure = () => setLockedHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [submitted]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    if (resume && resume.size > MAX_RESUME_BYTES) {
      setError("Resume is too large — please keep it under 4MB.");
      return;
    }
    // Multipart so the resume travels as an attachment (too big for a JSON
    // keepalive body).
    const fd = new FormData();
    fd.set("name", name);
    fd.set("phone", phone);
    fd.set("email", email);
    fd.set("role", role);
    fd.set("experience", experience);
    fd.set("message", message);
    fd.set("website", String(new FormData(e.currentTarget).get("website") ?? ""));
    if (resume) fd.set("resume", resume);
    if (formRef.current) setLockedHeight(formRef.current.offsetHeight);
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
      window.setTimeout(() => {
        setSubmitted(false);
        setResume(null);
        setName("");
        setPhone("");
        setEmail("");
        setRole("");
        setExperience("");
        setMessage("");
      }, 2500);
    } catch {
      setError(
        "Something went wrong and your application was not sent. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const isFormValid =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "" &&
    role.trim() !== "" &&
    experience.trim() !== "" &&
    message.trim() !== "" &&
    resume !== null;

  return (
    <div className="flex flex-col gap-6 p-[30px]">
      <h2 className="text-[28px] font-normal leading-[1.2] tracking-tight text-white md:text-[36px]">
        Join Our Team
      </h2>

      <div style={{ minHeight: lockedHeight ?? undefined }}>
        {submitted ? (
          <CareersSuccessState />
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6">
            <Field
              label="Name"
              name="name"
              placeholder="Your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Field
                label="Your Email"
                name="email"
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Function / Role"
                name="function"
                placeholder="E.g., Site Engineer, Architect"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Field
                label="Years of Experience"
                name="experience"
                placeholder="E.g., 5 Years"
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <TextareaField
              label="Cover Note"
              name="message"
              placeholder="Tell us about yourself..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <HoneypotField />
            <div className="mt-2 flex items-center justify-start gap-4">
              <ResumeUploadButton file={resume} onChange={setResume} />
              <PillButton
                label={sending ? "Sending..." : "Send Application"}
                disabled={!isFormValid || sending}
              />
            </div>
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

function CareersSuccessState() {
  const [data, setData] = useState<unknown>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/success-confetti.json")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="h-[180px] w-[180px]">
        {data ? (
          <Lottie animationData={data} loop={false} autoplay className="h-full w-full" />
        ) : null}
      </div>
      <p className="text-[18px] font-medium text-white md:text-[20px]">
        Application Submitted
      </p>
      <p className="max-w-[36ch] text-sm leading-[1.5] text-white/70">
        Thanks for your interest in joining Golden Group. Our team will review your application and get back to you shortly.
      </p>
    </div>
  );
}

function ResumeUploadButton({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (file) {
      e.stopPropagation();
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onChange(selected);
  };

  const truncateFileName = (name: string, maxLen = 18) => {
    if (name.length <= maxLen) return name;
    return name.slice(0, 8) + "..." + name.slice(-7);
  };

  return (
    <div className="relative w-full min-w-0 sm:w-auto sm:shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={onFileChange}
      />
      <button
        type="button"
        onClick={onClick}
        className={`card-hover group/upload relative flex h-[50px] w-full shrink-0 items-end justify-between overflow-hidden border px-[12px] pb-[8px] pt-[4px] text-sm font-medium transition-colors duration-300 sm:w-[245px] ${
          file
            ? "border-transparent bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
            : "border-[#464646] bg-black text-white"
        }`}
      >
        {!file && (
          <span
            aria-hidden
            className="card-fill pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
          />
        )}
        <span
          className={`relative z-10 transition-colors duration-300 ${
            file ? "" : "group-hover/upload:text-black"
          }`}
        >
          {file ? truncateFileName(file.name) : "Upload Resume"}
        </span>
        <span
          className={`relative z-10 transition-colors duration-300 ${
            file ? "" : "group-hover/upload:text-black"
          }`}
        >
          {file ? <CrossIcon /> : <UploadIcon />}
        </span>
      </button>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors duration-300"
    >
      <path d="M12 10v3H4v-3M8 3v7M5 6l3-3 3 3" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-all duration-350 group-hover/upload:rotate-90"
    >
      <path d="M12 4L4 12M4 4l8 8" />
    </svg>
  );
}
