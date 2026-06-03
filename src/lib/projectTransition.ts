export type ProjectTransitionState = {
  slug: string;
  src: string;
  alt: string;
  rect: { top: number; left: number; width: number; height: number };
  viewport: { w: number; h: number };
  expanded: boolean;
};

let state: ProjectTransitionState | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

export function getProjectTransition(): ProjectTransitionState | null {
  return state;
}

export function setProjectTransition(
  next: ProjectTransitionState | null | ((prev: ProjectTransitionState | null) => ProjectTransitionState | null),
) {
  state = typeof next === "function" ? next(state) : next;
  notify();
}

export function subscribeProjectTransition(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
