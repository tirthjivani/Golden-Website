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
  // Lazy initializer locks the value on first render. The only flow that sets
  // the flag is a client-side click followed by client-side navigation, so
  // there's no SSR/hydration mismatch in practice — the destination renders
  // fresh on the client when arriving from the trigger page.
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

/**
 * Renders `text` with each whitespace-separated word wrapped in a span that
 * runs the `hero-rise` keyframe animation with a staggered delay. Each word is
 * an inline-block so it can translate independently while still wrapping
 * naturally.
 */
export function WordReveal({
  text,
  startDelay = 0,
  stagger = 70,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  startDelay?: number;
  stagger?: number;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3";
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="hero-rise inline-block"
          style={
            {
              "--hero-rise-delay": `${startDelay + i * stagger}ms`,
            } as CSSProperties
          }
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Wraps a child in a hero-rise span with a configurable delay. Useful when a
 * non-text element (button, fact card) should join the staggered hero reveal.
 */
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
