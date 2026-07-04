"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChatText, Phone, X } from "@phosphor-icons/react";
import { PHONE_TEL } from "@/lib/site";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

// Floating "Enquire Now" action + a Contact popup, shown on every project detail
// page. Submit posts to /api/enquiry, which emails the sales inbox with the
// project's details in the subject and body.
export function EnquiryModal({
  project,
}: {
  project?: { name: string; slug?: string; location?: string; rera?: string };
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [agree, setAgree] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [buttonHidden, setButtonHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = email.length > 0 && !emailValid;
  const phoneValid = /^\d{10}$/.test(phone);
  const formValid = name.trim().length > 0 && emailValid && phoneValid && agree;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Portal to <body> so `position: fixed` escapes SiteShell's transformed
  // wrapper (a transform ancestor makes fixed resolve against it, not the
  // viewport — which pushed the button off-screen).
  useEffect(() => setMounted(true), []);

  // Follow SiteShell's menu slide: when the menu opens the content shifts left
  // by --panel-w, so shift this body-portaled button by the same amount to
  // keep it pinned to the visible content area.
  useEffect(() => {
    const onMenu = (e: Event) =>
      setMenuOpen(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("golden-menu", onMenu);
    return () => window.removeEventListener("golden-menu", onMenu);
  }, []);

  // Slide the button off-screen once the walkthrough section is half-reached
  // (i.e. the section before it has ended); bring it back on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("walkthrough");
      if (!el) return setButtonHidden(false);
      setButtonHidden(el.getBoundingClientRect().top <= window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mounted]);

  // Lock page scroll while the modal is open, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Focus management: move focus into the dialog on open, keep Tab cycling
  // inside it, and restore focus to the trigger on close.
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const focusables = () =>
      dialogRef.current
        ? [
            ...dialogRef.current.querySelectorAll<HTMLElement>(
              "button, [href], input, textarea, select",
            ),
          ].filter((el) => el.tabIndex !== -1 && !el.hasAttribute("disabled"))
        : [];
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lastFocusedRef.current?.focus();
    };
  }, [open]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setSending(false);
    setError(false);
    setAgree(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid || sending) return;
    const fd = new FormData(e.currentTarget);
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          source: "project",
          name,
          email,
          phone: `+91 ${phone}`,
          message: fd.get("query"),
          website: fd.get("website"),
          project: {
            ...project,
            url: window.location.href,
          },
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(close, 2500);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed bottom-4 right-4 z-[80] flex items-center gap-3 transition-transform ease-[cubic-bezier(0.32,0.72,0,1)] md:bottom-5 md:right-5"
        style={{
          transform: buttonHidden
            ? "translateX(calc(100% + 24px))"
            : menuOpen
            ? "translateX(calc(-1 * var(--panel-w)))"
            : "translateX(0)",
          transitionDuration: "700ms",
        }}
      >
        <a
          href={`tel:${PHONE_TEL}`}
          aria-label="Call us"
          className="pill-hover relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        >
          <span
            aria-hidden
            className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
          />
          <Phone size={20} weight="fill" aria-hidden className="relative z-10" />
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pill-hover relative block h-12 overflow-hidden bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        >
          <span
            aria-hidden
            className="pill-wipe pointer-events-none absolute inset-0 z-0 bg-[#C19B4D]"
          />
          <span className="relative z-10 inline-flex h-full items-center gap-2 px-5 text-sm font-medium">
            <ChatText size={18} weight="fill" aria-hidden />
            Enquire Now
          </span>
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry form"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
          <div
            ref={dialogRef}
            className="relative w-full max-w-[620px] bg-[#FBF7EA] p-7 text-[#1c1c1c] shadow-2xl md:p-10"
            style={{ animation: `enquiry-pop 320ms ${EASE} both` }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 text-black/60 transition-colors hover:text-black"
            >
              <X size={22} weight="bold" />
            </button>

            {submitted ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
                <h2 className="text-[24px] font-bold tracking-tight">Thank you</h2>
                <p className="max-w-[36ch] text-[15px] leading-[1.5] text-black/65">
                  Your enquiry has been submitted. Our team will get back to you
                  shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-7 text-center text-[26px] font-bold tracking-tight">
                  Enquire
                </h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  <input
                    aria-label="Name"
                    name="name"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/[0.04] px-3 py-4 text-[15px] text-[#1c1c1c] outline-none transition-colors placeholder:text-black/45 focus:bg-black/[0.07]"
                  />
                  <div>
                    <input
                      aria-label="Email ID"
                      name="email"
                      type="email"
                      inputMode="email"
                      placeholder="Email ID"
                      required
                      aria-invalid={showEmailError}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-black/[0.04] px-3 py-4 text-[15px] text-[#1c1c1c] outline-none transition-colors placeholder:text-black/45 focus:bg-black/[0.07] ${
                        showEmailError ? "ring-1 ring-red-500/70" : ""
                      }`}
                    />
                    {showEmailError ? (
                      <p className="mt-1.5 text-[12px] text-red-600">
                        Enter a valid email address.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center bg-black/[0.04] transition-colors focus-within:bg-black/[0.07]">
                    <span className="select-none pl-3 text-[15px] text-[#1c1c1c]">
                      +91
                    </span>
                    <input
                      aria-label="Contact Number"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      placeholder="Contact Number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="w-full bg-transparent px-2 py-4 text-[15px] text-[#1c1c1c] outline-none placeholder:text-black/45"
                    />
                  </div>
                  <textarea
                    aria-label="Query"
                    name="query"
                    rows={3}
                    placeholder="Query"
                    defaultValue={
                      project ? `Interested in ${project.name}. ` : undefined
                    }
                    className="resize-none bg-black/[0.04] px-3 py-4 text-[15px] text-[#1c1c1c] outline-none transition-colors placeholder:text-black/45 focus:bg-black/[0.07]"
                  />

                  <label className="mt-2 flex items-center gap-2.5 text-[15px] text-[#1c1c1c]">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="h-4 w-4 accent-[#c19b4d]"
                    />
                    <span>
                      I Agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="underline underline-offset-2 hover:text-black"
                      >
                        Terms &amp; Conditions
                      </Link>
                    </span>
                  </label>

                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px opacity-0"
                  />
                  <button
                    type="submit"
                    disabled={!formValid || sending}
                    className="mt-5 h-[52px] w-full bg-black text-[15px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                  {error ? (
                    <p className="text-sm text-red-600" role="alert">
                      Something went wrong and your enquiry was not sent.
                      Please try again or call us directly.
                    </p>
                  ) : null}
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}

      <style>{`@keyframes enquiry-pop {0%{opacity:0;transform:translateY(12px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </>,
    document.body,
  );
}
