export interface Spot {
  x: number;
  y: number;
  side: "left" | "right";
  maxWidth: number;
}

const rectOf = (sel: string) => document.querySelector(sel)?.getBoundingClientRect() ?? null;

/** Where the guide parks next to a piece of chrome during the tour. */
export function chromeSpot(target: "tools" | "boards" | "menu" | "layers" | "zoom"): Spot | null {
  if (target === "boards") {
    let u: { left: number; top: number; right: number } | null = null;
    for (const el of document.querySelectorAll("[data-artboard]")) {
      const b = el.getBoundingClientRect();
      if (!b.width || b.right < 0 || b.left > innerWidth || b.bottom < 0 || b.top > innerHeight) continue;
      u = u
        ? { left: Math.min(u.left, b.left), top: Math.min(u.top, b.top), right: Math.max(u.right, b.right) }
        : { left: b.left, top: b.top, right: b.right };
    }
    return u ? { x: (u.left + u.right) / 2 - 120, y: Math.max(110, u.top - 70), side: "right", maxWidth: 240 } : null;
  }
  const r = rectOf(`[data-guide="${target}"]`);
  if (!r) return null;
  switch (target) {
    case "tools":
      return { x: r.right + 52, y: r.top + 60, side: "right", maxWidth: 240 };
    case "menu":
      return { x: r.left + r.width / 2 - 110, y: r.bottom + 54, side: "right", maxWidth: 240 };
    case "layers":
      return { x: r.left - 52, y: r.top + 64, side: "left", maxWidth: 240 };
    case "zoom":
      return { x: r.right - 36, y: r.top - 50, side: "left", maxWidth: 240 };
  }
}

/**
 * Finds the free spot nearest the selection's top-right corner, scoring
 * candidate bubble positions by overlap with other artboards and chrome.
 * O(grid × obstacles) — call it when the selection moves, not every frame.
 */
export function selectionSpot(target: Element, textLength: number): Spot | null {
  const r = target.getBoundingClientRect();
  const tools = rectOf('[data-guide="tools"]');
  const layers = rectOf('[data-guide="layers"]');
  const menu = rectOf('[data-guide="menu"]');
  const zoom = rectOf('[data-guide="zoom"]');
  const L = (tools?.right ?? 0) + 12;
  const R = (layers?.left ?? innerWidth) - 12;
  const T = (menu?.bottom ?? 0) + 20;
  const B = innerHeight - 12;

  const obstacles: { r: DOMRect; w: number }[] = [{ r, w: 50 }];
  if (zoom) obstacles.push({ r: zoom, w: 20 });
  for (const o of document.querySelectorAll("[data-artboard], [data-frame]")) {
    if (o === target || target.contains(o) || o.contains(target)) continue;
    const b = o.getBoundingClientRect();
    if (!b.width || b.right < L || b.left > R || b.bottom < T || b.top > innerHeight) continue;
    obstacles.push({ r: b, w: 1 });
  }

  const estH = (w: number) => Math.max(72, 40 + Math.ceil((textLength * 6.7) / (w - 28)) * 19);
  let best: { score: number; bx: number; by: number; W: number; w: number } | null = null;
  for (const w of [260, 210, 160]) {
    const H = estH(w);
    const W = 84 + w;
    for (let by = T; by <= B - H; by += 16) {
      for (let bx = L; bx <= R - W; bx += 16) {
        let score = 0;
        for (const o of obstacles) {
          const ox = Math.min(bx + W, o.r.right) - Math.max(bx, o.r.left);
          const oy = Math.min(by + H, o.r.bottom) - Math.max(by, o.r.top);
          if (ox > 0 && oy > 0) score += ox * oy * o.w;
        }
        score += Math.hypot(bx + W / 2 - r.right, by + H / 2 - r.top) * 2 + (260 - w) * 0.5;
        if (!best || score < best.score) best = { score, bx, by, W, w };
      }
    }
  }
  if (!best) return null;
  const leftOfTarget = best.bx + best.W / 2 < r.left + r.width / 2;
  return {
    x: leftOfTarget ? best.bx + best.W - 36 : best.bx + 36,
    y: best.by + 36,
    side: leftOfTarget ? "left" : "right",
    maxWidth: best.w,
  };
}
