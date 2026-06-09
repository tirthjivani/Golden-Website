"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import {
  getProjectTransition,
  subscribeProjectTransition,
} from "@/lib/projectTransition";

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
  if (!state) return null;
  const { rect, expanded, src, alt } = state;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[100] overflow-hidden"
      style={{
        left: expanded ? 0 : `${rect.left}px`,
        top: expanded ? 0 : `${rect.top}px`,
        width: expanded ? "100vw" : `${rect.width}px`,
        height: expanded ? "100vh" : `${rect.height}px`,
        transition: `width ${PROJECT_TRANSITION_MS}ms ${EASE}, height ${PROJECT_TRANSITION_MS}ms ${EASE}, left ${PROJECT_TRANSITION_MS}ms ${EASE}, top ${PROJECT_TRANSITION_MS}ms ${EASE}`,
      }}
    >
      <div
        className="relative w-full"
        style={{
          height: expanded ? "200vh" : "100%",
          transition: `height ${PROJECT_TRANSITION_MS}ms ${EASE}`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
