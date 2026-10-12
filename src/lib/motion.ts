let query: MediaQueryList | null = null;

/** Live prefers-reduced-motion flag (the MediaQueryList is created once and reused). */
export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  query ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}
