"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type { ToolId } from "./state";

const TOOL_KEYS = new Set<string>(["v", "h", "z", "f", "r", "t", "i", "p", "b", "e"]);

interface KeyHandlers {
  enabled: boolean;
  setTool: (t: ToolId) => void;
  undo: () => void;
  redo: () => void;
  escape: () => void;
  fit: () => void;
  zoom: (factor: number) => void;
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA");

/**
 * Figma-style shortcuts. Registers one pair of window listeners for the
 * component's lifetime; handlers are read from a ref so they never re-bind.
 * Returns a ref that is true while the space bar (temporary pan) is held.
 */
export function useCanvasKeys(handlers: KeyHandlers): RefObject<boolean> {
  const h = useRef(handlers);
  useLayoutEffect(() => {
    h.current = handlers;
  });
  const space = useRef(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = h.current;
      if (!k.enabled || isTyping(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === " ") {
        space.current = true;
        if (e.target === document.body) e.preventDefault();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && key === "z") {
        e.preventDefault();
        if (e.shiftKey) k.redo();
        else k.undo();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (TOOL_KEYS.has(key)) k.setTool(key as ToolId);
      else if (key === "escape") k.escape();
      else if (key === "0" || key === "1") k.fit();
      else if (key === "=" || key === "+") k.zoom(1.25);
      else if (key === "-" || key === "_") k.zoom(0.8);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === " ") space.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return space;
}
