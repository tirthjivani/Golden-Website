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
  const { rect, viewport, expanded, src, alt } = state;
  const deltaX = rect.left + rect.width / 2 - viewport.w / 2;
  const deltaY = rect.top + rect.height / 2 - viewport.h / 2;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-1/2 z-[100] overflow-hidden"
      style={{
        width: expanded ? "100vw" : `${rect.width}px`,
        height: expanded ? "100vh" : `${rect.height}px`,
        transform: expanded
          ? "translate(-50%, -50%)"
          : `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`,
        transition: `width ${PROJECT_TRANSITION_MS}ms ${EASE}, height ${PROJECT_TRANSITION_MS}ms ${EASE}, transform ${PROJECT_TRANSITION_MS}ms ${EASE}`,
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
  );
}
