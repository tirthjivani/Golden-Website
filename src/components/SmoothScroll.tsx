"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/smooth-scroll";

export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
