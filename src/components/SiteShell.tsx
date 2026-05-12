"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import MenuPanel from "./MenuPanel";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = "700ms";
const SCROLL_THRESHOLD = 100;

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= SCROLL_THRESHOLD) {
        setStickyVisible(false);
      } else {
        const goingUp = y < lastY - 2;
        const goingDown = y > lastY + 2;
        if (goingUp) setStickyVisible(true);
        else if (goingDown) setStickyVisible(false);
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const showSticky = stickyVisible || menuOpen;

  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      <div
        className="relative min-h-screen"
        style={{
          transform: menuOpen
            ? "translateX(calc(-1 * var(--panel-w)))"
            : "translateX(0)",
          transition: `transform ${DURATION} ${EASE}`,
        }}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundColor: menuOpen
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(255, 255, 255, 0)",
            backdropFilter: menuOpen ? "blur(10px)" : "blur(0px)",
            WebkitBackdropFilter: menuOpen ? "blur(10px)" : "blur(0px)",
            transition: `background-color ${DURATION} ${EASE}, backdrop-filter ${DURATION} ${EASE}, -webkit-backdrop-filter ${DURATION} ${EASE}`,
          }}
        />
      </div>
      <Header variant="transparent" onMenuClick={() => setMenuOpen(true)} />
      <Header
        variant="sticky"
        visible={showSticky}
        onMenuClick={() => setMenuOpen(true)}
      />
      <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
