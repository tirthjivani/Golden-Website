"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChatText, X } from "@phosphor-icons/react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

// Floating "Enquire Now" action + a Contact popup, shown on every project detail
// page. The form is client-only (mirrors the /contact page) — submit shows a
// short success state, no backend call.
export function EnquiryModal({ projectName }: { projectName?: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [buttonHidden, setButtonHidden] = useState(false);
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

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setAgree(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValid) return;
    setSubmitted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(close, 2500);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`pill-hover fixed bottom-4 right-4 z-[80] block h-12 overflow-hidden bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:bottom-5 md:right-5 ${
          buttonHidden ? "translate-x-[calc(100%+24px)]" : "translate-x-0"
        }`}
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
                      projectName ? `Interested in ${projectName}. ` : undefined
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

                  <button
                    type="submit"
                    disabled={!formValid}
                    className="mt-5 h-[52px] w-full bg-black text-[15px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
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
