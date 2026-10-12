"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { profile } from "@/content/profile";
import type { Box, LayerNode, ViewId } from "@/content/types";
import { Camera } from "./camera";
import { CanvasContext, type CanvasContextValue } from "./context";
import { ChromeOverlays } from "./ChromeOverlays";
import { LayersPanel } from "./LayersPanel";
import { buildMarkupMail } from "./markupMail";
import { initialState, reducer, type ToolId } from "./state";
import { Toolbar } from "./Toolbar";
import { TopBar } from "./TopBar";
import { useCanvasKeys } from "./useCanvasKeys";
import { Viewport } from "./Viewport";
import { ZoomControl } from "./ZoomControl";
import s from "./canvas.module.css";

/* The guide is decorative and only appears after the splash — keep it out of the initial bundle. */
const Guide = dynamic(() => import("@/components/guide/Guide").then((m) => m.Guide), { ssr: false });

interface CanvasAppProps {
  /** Server-rendered artboards for each view. */
  views: Record<ViewId, ReactNode>;
  layers: Record<ViewId, LayerNode[]>;
  /** Region "Fit" frames for each view (computed on the server). */
  worlds: Record<ViewId, Box>;
  /** Overlay rendered above the canvas (the splash). */
  children?: ReactNode;
}

export function CanvasApp({ views, layers, worlds, children }: CanvasAppProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [camera] = useState(() => new Camera());

  // Latest state for stable callbacks (they must not re-bind on every change).
  const latest = useRef(state);
  useLayoutEffect(() => {
    latest.current = state;
  });

  const findNode = useCallback((id: string) => {
    const nodes = camera.world?.querySelectorAll<HTMLElement>(`[data-artboard="${id}"], [data-frame="${id}"]`) ?? [];
    return Array.from(nodes).find((n) => n.offsetParent !== null) ?? null;
  }, [camera]);

  const fitAll = useCallback(() => {
    dispatch({ type: "select", sel: null });
    camera.fit(worlds[latest.current.view], 60, true);
  }, [camera, worlds]);

  const actions = useMemo<CanvasContextValue["actions"]>(
    () => ({
      select(id) {
        const el = findNode(id);
        if (!el) return;
        const rect = camera.rectOf(el);
        const isBoard = el.dataset.artboard !== undefined;
        dispatch({ type: "select", sel: { id, rect, meta: { ...el.dataset }, isBoard } });
        // Boards leave room on the right for the guide's caption.
        const room = isBoard ? Math.min(330, Math.max(200, (camera.viewportRect().width - 404) * 0.4)) : 0;
        camera.fit(rect, isBoard ? 90 : 140, true, room);
      },
      clearSelection: () => dispatch({ type: "select", sel: null }),
      fitAll,
      goTo(view) {
        if (view === latest.current.view) fitAll();
        else dispatch({ type: "view", view });
      },
      sendMarkup() {
        const { objs } = latest.current;
        if (!objs.length) return;
        window.location.href = buildMarkupMail(objs, camera);
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        dispatch({ type: "sent", time });
        dispatch({ type: "toast", toast: { text: "Email draft opened" } });
      },
    }),
    [camera, findNode, fitAll],
  );

  // Frame the active view whenever it changes (and on first paint).
  useLayoutEffect(() => {
    camera.fit(worlds[state.view], 60, false);
  }, [camera, state.view, worlds]);

  // Re-frame on resize unless the visitor is inspecting something.
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!latest.current.sel) camera.fit(worlds[latest.current.view], 60, false);
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [camera, worlds]);

  // Toasts dismiss themselves.
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "toast", toast: null }), 4000);
    return () => clearTimeout(t);
  }, [state.toast]);

  const space = useCanvasKeys({
    enabled: state.splashDone,
    setTool: (tool: ToolId) => dispatch({ type: "tool", tool }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    escape: actions.clearSelection,
    fit: fitAll,
    zoom: (f) => camera.zoomBy(f),
  });

  const value = useMemo<CanvasContextValue>(
    () => ({ state, dispatch, camera, actions }),
    [state, camera, actions],
  );

  return (
    <CanvasContext value={value}>
      <div className={s.app}>
        <h1 className="sr-only">
          {profile.name} — {profile.role}
        </h1>
        <Viewport views={views} space={space} />
        <TopBar />
        <Toolbar />
        <LayersPanel layers={layers[state.view]} />
        <ZoomControl />
        <ChromeOverlays />
        {state.splashDone ? <Guide /> : null}
        {children}
      </div>
    </CanvasContext>
  );
}
