"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { onFrame } from "@/lib/frameLoop";
import { pointer } from "@/lib/pointer";
import s from "./splash.module.css";

const WEIGHTS = [700, 600, 500];

/** Letters swell in weight around the pointer, like a fish-eye over the name. */
export function FishName({ first, last, bubble }: { first: string; last: string; bubble: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-ltr]"));
    const applied = letters.map(() => 400);
    return onFrame(() => {
      const p = pointer.pos;
      const r = el.getBoundingClientRect();
      let focus = -1;
      if (p && p.x >= r.left - 24 && p.x <= r.right + 24 && p.y >= r.top - 24 && p.y <= r.bottom + 24) {
        let best = Infinity;
        letters.forEach((l, k) => {
          const b = l.getBoundingClientRect();
          const d = Math.abs(p.x - (b.left + b.width / 2));
          if (d < best) {
            best = d;
            focus = k;
          }
        });
      }
      letters.forEach((l, k) => {
        const w = focus < 0 ? 400 : (WEIGHTS[Math.abs(k - focus)] ?? 400);
        if (applied[k] !== w) {
          applied[k] = w;
          l.style.fontWeight = String(w);
        }
      });
    });
  }, []);

  const split = (word: string) =>
    word.split("").map((ch, i) => (
      <span key={i} data-ltr="" className={s.letter}>
        {ch}
      </span>
    ));

  return (
    <div ref={root} className={s.fish} data-gaze-hold="" aria-label={`${first} ${last}`} role="img">
      <span className={s.first}>
        {bubble}
        {split(first)}
      </span>
      <span />
      <span className={s.last}>{split(last)}</span>
    </div>
  );
}
