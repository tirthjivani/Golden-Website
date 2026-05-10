import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(l: Lenis | null) {
  lenisInstance = l;
}

export function scrollToId(id: string, offset = 0) {
  if (typeof window === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
