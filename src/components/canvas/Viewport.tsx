"use client";

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode, type RefObject } from "react";
import { WORLD_SIZE } from "@/content/canvas";
import type { ViewId } from "@/content/types";
import { sampleColor } from "./color";
import { useCanvas } from "./context";
import { MarkupLayer, strokePath } from "./MarkupLayer";
import { SelectionRing } from "./SelectionRing";
import { DRAW_TOOLS, PLACE_TOOLS, type MarkupObject, type Point } from "./state";
import { toolById } from "./tools";
import s from "./canvas.module.css";

const VIEW_IDS: ViewId[] = ["work", "about", "contact"];
const INTERACTIVE = "input, a, button, textarea, select, label, form";

type Drawing = { erasing: true } | { erasing: false; kind: "p" | "b"; pts: Point[]; w: number; op: number };
type Drag = { sx: number; sy: number; cx: number; cy: number; moved: boolean; panning: boolean; target: Element };

interface ViewportProps {
  views: Record<ViewId, ReactNode>;
  /** True while the space bar is held (temporary hand tool). */
  space: RefObject<boolean>;
}

/**
 * The pannable world. Pointer gestures are tracked in refs and applied
 * imperatively; React state only changes when a gesture completes.
 */
export function Viewport({ views, space }: ViewportProps) {
  const { state, dispatch, camera, actions } = useCanvas();
  const glow = useRef<HTMLDivElement>(null);
  const live = useRef<SVGPathElement>(null);
  const drawing = useRef<Drawing | null>(null);
  const drag = useRef<Drag | null>(null);
  const count = useRef(0);
  const { tool } = state;
  const viewportRef = useCallback((el: HTMLDivElement | null) => camera.bindViewport(el), [camera]);
  const worldRef = useCallback((el: HTMLDivElement | null) => camera.bindWorld(el), [camera]);

  // Wheel: pinch / ctrl / big deltas zoom, trackpad scroll pans. Must be non-passive.
  useEffect(() => {
    const vp = camera.viewport;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 24) camera.zoomBy(e.deltaY < 0 ? 1.12 : 0.89, e.clientX, e.clientY);
      else camera.moveTo(camera.x - e.deltaX, camera.y - e.deltaY);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [camera]);

  const paintLive = () => {
    const el = live.current;
    const d = drawing.current;
    if (!el) return;
    if (!d || d.erasing) return el.setAttribute("d", "");
    el.setAttribute("d", strokePath(d.pts));
    el.setAttribute("stroke-width", String(d.w));
    el.setAttribute("stroke-opacity", String(d.op));
  };

  const erase = (p: Point) => {
    const r = 20 / camera.s;
    const ids = new Set<string>();
    for (const o of state.objs) {
      const hit =
        "pts" in o
          ? o.pts.some((q) => Math.abs(q.x - p.x) < r && Math.abs(q.y - p.y) < r)
          : Math.abs(o.x - p.x) < 90 && Math.abs(o.y - p.y) < 90;
      if (hit) ids.add(o.id);
    }
    if (ids.size) dispatch({ type: "erase", ids });
  };

  const nextId = () => ++count.current;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest(INTERACTIVE)) return;
    const capture = () => e.currentTarget.setPointerCapture?.(e.pointerId);
    if ((DRAW_TOOLS.has(tool) || tool === "e") && !space.current && e.button !== 1) {
      const p = camera.toWorld(e.clientX, e.clientY);
      drawing.current =
        tool === "e"
          ? { erasing: true }
          : { erasing: false, kind: tool as "p" | "b", pts: [p], w: tool === "b" ? 16 : 3, op: tool === "b" ? 0.5 : 1 };
      capture();
      if (tool === "e") erase(p);
      else paintLive();
      return;
    }
    const panning = tool === "h" || e.button === 1 || space.current;
    drag.current = { sx: e.clientX, sy: e.clientY, cx: camera.x, cy: camera.y, moved: false, panning, target: e.target as Element };
    capture();
    if (panning) camera.setCursor("grabbing");
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = glow.current;
    if (g) {
      const r = e.currentTarget.getBoundingClientRect();
      g.style.opacity = "1";
      g.style.transform = `translate3d(${e.clientX - r.left}px,${e.clientY - r.top}px,0)`;
    }
    const d = drawing.current;
    if (d) {
      const p = camera.toWorld(e.clientX, e.clientY);
      if (d.erasing) return erase(p);
      const last = d.pts[d.pts.length - 1];
      const min = 2 / camera.s;
      if (Math.abs(p.x - last.x) < min && Math.abs(p.y - last.y) < min) return;
      d.pts.push(p);
      return paintLive();
    }
    const g2 = drag.current;
    if (!g2) return;
    const dx = e.clientX - g2.sx;
    const dy = e.clientY - g2.sy;
    if (!g2.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    if (!g2.panning && tool !== "v") return;
    g2.moved = true;
    camera.setCursor("grabbing");
    camera.moveTo(g2.cx + dx, g2.cy + dy);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drawing.current;
    if (d) {
      drawing.current = null;
      paintLive();
      if (!d.erasing && d.pts.length > 1) {
        const n = nextId();
        dispatch({ type: "add", obj: { id: `o${n}`, n, kind: d.kind, pts: d.pts, d: strokePath(d.pts), w: d.w, op: d.op } });
      }
      return;
    }
    const g = drag.current;
    drag.current = null;
    camera.setCursor();
    if (g && !g.moved) tap(e, g.target);
  };

  const tap = (e: ReactPointerEvent, target: Element) => {
    if (tool === "v" || tool === "h") {
      const frame = target.closest<HTMLElement>("[data-frame]");
      const board = target.closest<HTMLElement>("[data-artboard]");
      if (!frame && !board) return actions.clearSelection();
      const boardId = board?.dataset.artboard;
      const sel = state.sel;
      // First click frames the artboard; once it is selected, clicks drill into its frames.
      const onBoard = !!sel && !!board && (sel.id === boardId || board.querySelector(`[data-frame="${sel.id}"]`) !== null);
      const id = frame && onBoard ? frame.dataset.frame : (boardId ?? frame?.dataset.frame);
      if (id) actions.select(id);
      return;
    }
    if (tool === "z") return camera.zoomBy(e.altKey || e.shiftKey ? 0.66 : 1.5, e.clientX, e.clientY);
    if (tool === "i") {
      const hex = sampleColor(target, camera.world);
      if (hex) dispatch({ type: "toast", toast: { text: `Sampled ${hex}`, swatch: hex } });
      return;
    }
    if (PLACE_TOOLS.has(tool)) {
      const p = camera.toWorld(e.clientX, e.clientY);
      const n = nextId();
      const obj: MarkupObject = { id: `o${n}`, n, kind: tool as "f" | "r" | "t", x: Math.round(p.x), y: Math.round(p.y) };
      dispatch({ type: "add", obj });
    }
  };

  return (
    <div
      ref={viewportRef}
      className={s.viewport}
      style={{ cursor: toolById[tool].cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => glow.current?.style.setProperty("opacity", "0")}
    >
      <div ref={glow} className={s.glow} aria-hidden />
      <div ref={worldRef} className={s.world} style={{ width: WORLD_SIZE.w, height: WORLD_SIZE.h }}>
        {VIEW_IDS.map((id) => (
          <div key={id} hidden={state.view !== id}>
            {views[id]}
          </div>
        ))}
        <MarkupLayer objs={state.objs} liveRef={live} />
        {state.sel ? <SelectionRing rect={state.sel.rect} /> : null}
      </div>
    </div>
  );
}
