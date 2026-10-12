"use client";

import { memo, type RefObject } from "react";
import { WORLD_SIZE } from "@/content/views";
import type { MarkupObject, Point } from "./state";
import s from "./canvas.module.css";

export const strokePath = (pts: Point[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

interface MarkupLayerProps {
  objs: MarkupObject[];
  /** The in-progress stroke, painted imperatively while the pointer moves. */
  liveRef: RefObject<SVGPathElement | null>;
}

/** Visitor markup: placed frames/shapes/text plus pencil & brush strokes. */
export const MarkupLayer = memo(function MarkupLayer({ objs, liveRef }: MarkupLayerProps) {
  return (
    <>
      {objs.map((o) =>
        "pts" in o ? null : o.kind === "t" ? (
          <input
            key={o.id}
            className={s.markText}
            style={{ left: o.x, top: o.y }}
            defaultValue="Type here"
            aria-label={`Text ${o.n}`}
          />
        ) : (
          <div key={o.id} className={o.kind === "f" ? s.markFrame : s.markRect} style={{ left: o.x, top: o.y }}>
            {o.kind === "f" ? <span className={s.markFrameTag}>Frame {o.n}</span> : null}
          </div>
        ),
      )}
      <svg className={s.strokes} width={WORLD_SIZE.w} height={WORLD_SIZE.h} aria-hidden>
        {objs.map((o) =>
          "pts" in o ? <path key={o.id} d={o.d} strokeWidth={o.w} strokeOpacity={o.op} /> : null,
        )}
        <path ref={liveRef} d="" strokeWidth={3} />
      </svg>
    </>
  );
});
