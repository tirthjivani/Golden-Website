"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Reads the one-shot "came from home" flag set by the home page when a user
 * clicks a side panel. When set, the destination should skip its hero-expand
 * (the home page already did the expand) and play a tighter reveal sequence.
 */
export function useFromHome(): boolean {
  return useTransitionFlag("golden-from-home");
}

export function useFromProjects(): boolean {
  return useTransitionFlag("golden-from-projects");
}

function useTransitionFlag(key: string): boolean {
  const [flag] = useState(
    () =>
      typeof window !== "undefined" && sessionStorage.getItem(key) === "1",
  );

  useEffect(() => {
    if (flag && typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  }, [flag, key]);

  return flag;
}

export function WordReveal({
  text,
  startDelay = 0,
  stagger = 70,
  className = "",
  as: Tag = "span",
  mobileInline = false,
}: {
  text: string;
  startDelay?: number;
  stagger?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3";
  /** Below md, ignore \n breaks and let the lines wrap as one flow. */
  mobileInline?: boolean;
}) {
  const lines = text.split("\n").map((line) => line.split(/\s+/).filter(Boolean));
  let idx = 0;
  return (
    <Tag className={className}>
      {lines.map((words, li) => (
        <span key={`line-${li}`} className={mobileInline ? "inline md:block" : "block"}>
          {words.map((word, i) => {
            const current = idx++;
            const isLast = i === words.length - 1;
            return (
              <span
                key={`${word}-${current}`}
                className={`hero-rise inline-block ${
                  isLast ? (mobileInline ? "mr-[0.25em] md:mr-0" : "") : "mr-[0.25em]"
                }`}
                style={
                  {
                    "--hero-rise-delay": `${startDelay + current * stagger}ms`,
                  } as CSSProperties
                }
              >
                {word}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

export function HeroRise({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`hero-rise inline-block ${className}`}
      style={{ "--hero-rise-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}
