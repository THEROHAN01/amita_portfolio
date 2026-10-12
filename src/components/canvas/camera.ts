import type { Box } from "@/content/types";
import { reducedMotion } from "@/lib/motion";

/** Space reserved for floating chrome (toolbar, top bar, layers, zoom). */
const INSETS = { l: 76, r: 328, t: 74, b: 56 };
const MIN_SCALE = 0.08;
const MAX_SCALE = 4;
const EASE = "cubic-bezier(.16,.84,.44,1)";

/**
 * Pan/zoom state for the canvas world. Lives outside React: every move writes
 * one transform and one CSS variable (`--inv`, the inverse scale used by
 * selection chrome) straight to the DOM, so panning never re-renders.
 */
export class Camera {
  x = 0;
  y = 0;
  s = 1;
  private animMs = 620;

  viewport: HTMLElement | null = null;
  world: HTMLElement | null = null;
  private zoomLabel: HTMLElement | null = null;

  /* Stable callback refs: the camera owns the nodes it drives. */
  bindViewport = (el: HTMLElement | null) => {
    this.viewport = el;
  };
  bindWorld = (el: HTMLElement | null) => {
    this.world = el;
  };
  bindZoomLabel = (el: HTMLElement | null) => {
    this.zoomLabel = el;
  };

  setCursor(cursor?: string) {
    if (this.viewport) this.viewport.style.cursor = cursor ?? "";
  }

  viewportRect(): DOMRect {
    return this.viewport?.getBoundingClientRect() ?? new DOMRect(0, 0, 1200, 800);
  }

  apply(animate = false) {
    const w = this.world;
    if (w) {
      w.style.transition = animate && !reducedMotion() ? `transform ${this.animMs}ms ${EASE}` : "none";
      w.style.transform = `translate3d(${this.x}px,${this.y}px,0) scale(${this.s})`;
      w.style.setProperty("--inv", String(1 / this.s));
    }
    if (this.zoomLabel) this.zoomLabel.textContent = `${Math.round(this.s * 100)}%`;
  }

  /** Client (screen) point → world coordinates. */
  toWorld(cx: number, cy: number) {
    const r = this.viewportRect();
    return { x: (cx - r.left - this.x) / this.s, y: (cy - r.top - this.y) / this.s };
  }

  /** An element's box in world space, independent of the current transform. */
  rectOf(el: HTMLElement): Box {
    let x = 0;
    let y = 0;
    let n: HTMLElement | null = el;
    while (n && n !== this.world) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent as HTMLElement | null;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }

  /** Frame a world rect inside the area left free by the chrome. */
  fit(rect: Box, pad: number, animate: boolean, extraRight = 0) {
    const v = this.viewportRect();
    const r = INSETS.r + extraRight;
    const aw = Math.max(240, v.width - INSETS.l - r);
    const ah = Math.max(240, v.height - INSETS.t - INSETS.b);
    const p = Math.min(pad, aw * 0.1, ah * 0.1);
    const s = clamp(Math.min((aw - p * 2) / rect.w, (ah - p * 2) / rect.h), MIN_SCALE, 2);
    this.s = s;
    this.x = INSETS.l + aw / 2 - (rect.x + rect.w / 2) * s;
    this.y = INSETS.t + ah / 2 - (rect.y + rect.h / 2) * s;
    this.apply(animate);
  }

  /** Zoom about a client point (defaults to the viewport centre, animated). */
  zoomBy(factor: number, cx?: number, cy?: number) {
    const v = this.viewportRect();
    const px = cx == null ? v.width / 2 : cx - v.left;
    const py = cy == null ? v.height / 2 : cy - v.top;
    const s = clamp(this.s * factor, MIN_SCALE, MAX_SCALE);
    const k = s / this.s;
    this.s = s;
    this.x = px - (px - this.x) * k;
    this.y = py - (py - this.y) * k;
    this.apply(cx == null);
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.apply(false);
  }
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
