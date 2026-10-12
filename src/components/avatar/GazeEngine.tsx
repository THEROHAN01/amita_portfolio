"use client";

import { useEffect } from "react";
import { onFrame } from "@/lib/frameLoop";
import { reducedMotion } from "@/lib/motion";
import { pointer, trackPointer } from "@/lib/pointer";

/** Eye centre within the 768 × 1376 source portrait. */
const EYE_X = 391 / 768;
const EYE_Y = 339 / 1376;
const SLEEP_AFTER_MS = 7000;
const LOOK_HOLD_MS = 1500;

type SleepListener = (asleep: boolean) => void;
const sleepListeners = new Set<SleepListener>();

/** Splash bubble and friends react to the avatar dozing off / waking. */
export function onSleepChange(cb: SleepListener): () => void {
  sleepListeners.add(cb);
  return () => {
    sleepListeners.delete(cb);
  };
}

function firstVisible(selector: string): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    if (el.getBoundingClientRect().width > 0) return el;
  }
  return null;
}

function inside(el: Element | null, x: number, y: number, slop: number) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left - slop && x <= r.right + slop && y >= r.top - slop && y <= r.bottom + slop;
}

const animatedZ = new WeakSet<Element>();

/**
 * Renders nothing. Mount once per page: every `[data-avatar]` follows the
 * pointer, blinks, and falls asleep after a period of inactivity.
 */
export function GazeEngine() {
  useEffect(() => {
    const stopPointer = trackPointer();
    const cur = [0, 0];
    let asleep = false;
    let blinkAt = performance.now() + 3200;

    const stopFrame = onFrame((t) => {
      const av = firstVisible("[data-avatar]");
      if (!av) return;
      const reduce = reducedMotion();
      const r = av.getBoundingClientRect();
      const ex = r.left + r.width * EYE_X;
      const ey = r.top + r.height * EYE_Y;
      const sc = r.width / 768;

      // Look at the pointer while it moves (or rests over a hold zone such as the splash name).
      const p = pointer.pos;
      const looking = p && (t - pointer.movedAt < LOOK_HOLD_MS || inside(document.querySelector("[data-gaze-hold]"), p.x, p.y, 24));
      let tx = 0;
      let ty = 0.5 * sc;
      if (looking) {
        const dx = p.x - ex;
        const dy = p.y - ey;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        tx = (dx / d) * 9 * sc * k;
        ty = (dy / d) * 3 * sc * k;
      }
      const ease = reduce ? 1 : 0.14;
      cur[0] += (tx - cur[0]) * ease;
      cur[1] += (ty - cur[1]) * ease;
      const transform = `translate(${cur[0].toFixed(2)}px,${cur[1].toFixed(2)}px)`;
      document.querySelectorAll<HTMLElement>("[data-pupil]").forEach((el) => {
        el.style.transform = transform;
      });

      const sleepy = t - pointer.activeAt > SLEEP_AFTER_MS;
      if (sleepy !== asleep) {
        asleep = sleepy;
        document.querySelectorAll<HTMLElement>("[data-lid]").forEach((el) => {
          el.style.clipPath = sleepy ? "inset(0 0 0 0)" : "";
        });
        document.querySelectorAll<HTMLElement>("[data-zzz]").forEach((el) => {
          el.style.opacity = sleepy ? "1" : "";
        });
        sleepListeners.forEach((cb) => cb(sleepy));
      }

      document.querySelectorAll("[data-z]").forEach((z, k) => {
        if (animatedZ.has(z)) return;
        animatedZ.add(z);
        if (reduce) {
          (z as HTMLElement).style.cssText += `;opacity:1;transform:translate(${(k % 3) * 60}%,-${(k % 3) * 110}%)`;
          return;
        }
        z.animate(
          [
            { transform: "translate(0,0) scale(.5)", opacity: 0 },
            { transform: "translate(40%,-90%) scale(.85)", opacity: 1, offset: 0.35 },
            { transform: "translate(110%,-260%) scale(1.1)", opacity: 0 },
          ],
          { duration: 2700, iterations: Infinity, delay: (k % 3) * 900, easing: "ease-out" },
        );
      });

      if (!reduce && !asleep && t >= blinkAt) {
        blinkAt = t + 2800 + Math.random() * 3200;
        av.querySelectorAll("[data-lid]").forEach((lid) =>
          lid.animate(
            [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }],
            { duration: 220, easing: "ease-in-out" },
          ),
        );
      }
    });

    return () => {
      stopFrame();
      stopPointer();
    };
  }, []);

  return null;
}
