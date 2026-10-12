"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar/Avatar";
import { useCanvas } from "@/components/canvas/context";
import type { Selection } from "@/components/canvas/state";
import { onFrame } from "@/lib/frameLoop";
import { reducedMotion } from "@/lib/motion";
import { chromeSpot, selectionSpot, type Spot } from "./placement";
import s from "./guide.module.css";

const TOUR = [
  { target: "tools", text: "Hi, welcome in! You can interact with the artboards using the tools from here." },
  { target: "boards", text: "These are my artboards. Click any one to zoom in and see what it holds." },
  { target: "menu", text: "Use the top menu to switch between Work, About Me and Contact." },
  { target: "layers", text: "Every artboard is listed in Layers. Click one to jump straight to it." },
  { target: "zoom", text: "Zoom in, zoom out or fit the whole canvas from here." },
] as const;

const STEP_MS = 4800;
const START_MS = 900;

/** Caption for a selection: title, first sentence of the brief, then role · year. */
function caption(sel: Selection) {
  const m = sel.meta;
  const first = (m.brief ?? "").split(/(?<=[.!?])\s+/)[0];
  const bits = [m.role, m.year].filter(Boolean).join(" · ");
  const tail = sel.isBoard ? "Click and explore the project." : (m.outcome ?? "");
  return { title: m.title ?? "Artboard", body: [first, bits && `(${bits})`, tail].filter(Boolean).join(" ") };
}

/**
 * A small avatar that tours the chrome, then follows whatever is selected and
 * narrates it. Loaded lazily after the splash; position is eased per frame.
 */
export function Guide() {
  const { state } = useCanvas();
  const { sel } = state;
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);

  // Selecting anything ends the tour for good (derived during render, not in an effect).
  if (sel && step < TOUR.length) setStep(TOUR.length);

  useEffect(() => {
    if (step >= TOUR.length) return;
    const t = setTimeout(() => setStep((n) => n + 1), step < 0 ? START_MS : STEP_MS);
    return () => clearTimeout(t);
  }, [step]);

  const touring = step >= 0 && step < TOUR.length;
  const content = sel ? caption(sel) : touring ? { title: "", body: TOUR[step].text } : null;
  const textLength = content ? content.title.length + content.body.length : 0;
  const target = sel ? null : touring ? TOUR[step].target : "zoom";

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const node = sel
      ? Array.from(document.querySelectorAll(`[data-artboard="${sel.id}"], [data-frame="${sel.id}"]`)).find(
          (n) => (n as HTMLElement).offsetParent !== null,
        )
      : null;
    let pos: { x: number; y: number } | null = null;
    let spot: Spot | null = null;
    let lastRect = "";
    let placedAt = 0;
    let side = "";

    return onFrame((now) => {
      if (node) {
        // Re-place only when the selection moved on screen, at most every 120ms.
        const r = node.getBoundingClientRect();
        const key = `${Math.round(r.left / 4)},${Math.round(r.top / 4)},${Math.round(r.width / 4)}`;
        if (key !== lastRect && (!spot || now - placedAt > 120)) {
          lastRect = key;
          placedAt = now;
          spot = selectionSpot(node, textLength);
        }
      } else if (target) {
        spot = chromeSpot(target);
      }
      if (!spot) return;
      const parent = (el.offsetParent ?? document.body).getBoundingClientRect();
      const x = spot.x - parent.left;
      const y = spot.y - parent.top;
      if (!pos || reducedMotion()) pos = { x, y };
      else {
        pos.x += (x - pos.x) * 0.1;
        pos.y += (y - pos.y) * 0.1;
      }
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px,0)`;
      el.style.opacity = "1";
      const nextSide = `${spot.side}:${spot.maxWidth}`;
      if (nextSide !== side) {
        side = nextSide;
        el.dataset.side = spot.side;
        el.style.setProperty("--bubble-max", `${spot.maxWidth}px`);
      }
    });
  }, [sel, target, textLength]);

  return (
    <div ref={root} className={s.guide} data-side="right" data-board={sel ? "" : undefined} aria-live="polite">
      <div className={s.row}>
        <div className={s.portrait}>
          <Avatar className={s.avatar} sizes="96px" />
        </div>
        {content ? (
          <button
            key={content.title + content.body}
            type="button"
            className={s.bubble}
            onClick={() => touring && setStep((n) => n + 1)}
          >
            {content.title ? <strong className={s.title}>{content.title}</strong> : null}
            {content.body}
          </button>
        ) : null}
      </div>
    </div>
  );
}
