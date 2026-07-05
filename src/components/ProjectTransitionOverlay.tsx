"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";
import {
  getProjectTransition,
  subscribeProjectTransition,
} from "@/lib/projectTransition";
import { FULL_BLEED_HERO_SLUGS } from "@/lib/heroStyle";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
export const PROJECT_TRANSITION_MS = 750;

function noopSnapshot() {
  return null;
}

export default function ProjectTransitionOverlay() {
  const state = useSyncExternalStore(
    subscribeProjectTransition,
    getProjectTransition,
    noopSnapshot,
  );
  const [hiResLoaded, setHiResLoaded] = useState(false);

  // Reset the high-res flag whenever a new transition starts.
  const slug = state?.slug;
  useEffect(() => {
    setHiResLoaded(false);
  }, [slug]);

  if (!state) return null;
  const { rect, expanded, src, previewSrc, alt, heroAspect } = state;

  // Expand to the detail hero's actual box so the overlay hands off without
  // a jump. md+ is always full screen from the top; on mobile, full-bleed
  // pages end at 80svh from the top while the rest sit below the 80px navbar
  // at max(50svh, natural image height).
  const isMd =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches;
  const fullBleed = FULL_BLEED_HERO_SLUGS.has(state.slug);
  const heroTop = isMd || fullBleed ? 0 : 80;
  const heroHeight = isMd
    ? "100vh"
    : fullBleed
      ? "80svh"
      : heroAspect
        ? `max(50svh, calc(100vw / ${heroAspect}))`
        : "80svh";

  return (
    <>
      {/* Mobile: the hero only fills 80svh, so fade the page out behind the
          zoom — otherwise the list stays visible around the expanding image. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[99] bg-black md:hidden"
        style={{
          opacity: expanded ? 1 : 0,
          transition: `opacity ${PROJECT_TRANSITION_MS}ms ${EASE}`,
        }}
      />
    <div
      aria-hidden
      className="pointer-events-none fixed z-[100] overflow-hidden bg-black"
      style={{
        left: expanded ? 0 : `${rect.left}px`,
        top: expanded ? `${heroTop}px` : `${rect.top}px`,
        width: expanded ? "100vw" : `${rect.width}px`,
        height: expanded ? heroHeight : `${rect.height}px`,
        transition: `width ${PROJECT_TRANSITION_MS}ms ${EASE}, height ${PROJECT_TRANSITION_MS}ms ${EASE}, left ${PROJECT_TRANSITION_MS}ms ${EASE}, top ${PROJECT_TRANSITION_MS}ms ${EASE}`,
      }}
    >
      {/* Preview: the exact image the card already loaded — paints instantly so
          the zoom never shows black. */}
      {previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : null}

      {/* Full-resolution hero — fades in over the preview once decoded. */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        quality={90}
        sizes="100vw"
        onLoad={() => setHiResLoaded(true)}
        className="object-cover object-top"
        style={{
          opacity: hiResLoaded ? 1 : 0,
          transition: `opacity 400ms ${EASE}`,
        }}
      />

      {/* Dark gradient eases in as the image expands, matching the detail
          hero so the handoff at the end of the zoom is seamless. Mobile
          natural-ratio heroes have no gradients, so skip the fade there. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/65"
        style={{
          opacity: expanded && (isMd || fullBleed) ? 1 : 0,
          transition: `opacity ${PROJECT_TRANSITION_MS}ms ${EASE}`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-b from-transparent to-black"
        style={{
          opacity: expanded && (isMd || fullBleed) ? 1 : 0,
          transition: `opacity ${PROJECT_TRANSITION_MS}ms ${EASE}`,
        }}
      />
    </div>
    </>
  );
}
