"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ChatCircleText, X } from "@phosphor-icons/react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

// Floating "Enquire Now" action + a Contact popup, shown on every project detail
// page. The form is client-only (mirrors the /contact page) — submit shows a
// short success state, no backend call.
export function EnquiryModal({ projectName }: { projectName?: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agree) return;
    setSubmitted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(close, 2500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[80] inline-flex items-center gap-2 rounded-full bg-[#c19b4d] px-5 py-3.5 text-sm font-medium text-black shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-colors hover:bg-[#d6b25e] md:bottom-8 md:right-8"
      >
        <ChatCircleText size={18} weight="fill" aria-hidden />
        Enquire Now
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
            className="relative w-full max-w-[620px] rounded-2xl bg-[#FBF7EA] p-7 text-[#1c1c1c] shadow-2xl md:p-10"
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
                  Contact
                </h2>
                <form onSubmit={onSubmit} className="flex flex-col">
                  <ModalInput name="name" placeholder="Name" required />
                  <ModalInput
                    name="email"
                    type="email"
                    placeholder="Email ID"
                    required
                  />
                  <ModalInput
                    name="phone"
                    type="tel"
                    placeholder="Contact Number"
                    required
                  />
                  <textarea
                    name="query"
                    rows={2}
                    placeholder="Query"
                    defaultValue={
                      projectName ? `Interested in ${projectName}. ` : undefined
                    }
                    className="resize-none border-b border-black/15 bg-transparent py-3.5 text-[15px] text-[#1c1c1c] outline-none transition-colors placeholder:text-black/45 focus:border-black/60"
                  />

                  <label className="mt-5 flex items-center gap-2.5 text-[15px] text-[#1c1c1c]">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="h-4 w-4 accent-blue-600"
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
                    disabled={!agree}
                    className="mt-5 h-[52px] w-full rounded-full bg-[#241c19] text-[15px] font-medium text-white transition-colors hover:bg-[#3a2f29] disabled:cursor-not-allowed disabled:opacity-40"
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
    </>
  );
}

function ModalInput({
  name,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="border-b border-black/15 bg-transparent py-3.5 text-[15px] text-[#1c1c1c] outline-none transition-colors placeholder:text-black/45 focus:border-black/60"
    />
  );
}
