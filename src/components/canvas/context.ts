"use client";

import { createContext, use, type Dispatch } from "react";
import type { Camera } from "./camera";
import type { Action, CanvasState } from "./state";
import type { ViewId } from "@/content/types";

export interface CanvasContextValue {
  state: CanvasState;
  dispatch: Dispatch<Action>;
  camera: Camera;
  actions: {
    /** Select an artboard/frame by id and fly the camera to it. */
    select: (id: string) => void;
    clearSelection: () => void;
    fitAll: () => void;
    goTo: (view: ViewId) => void;
    sendMarkup: () => void;
  };
}

export const CanvasContext = createContext<CanvasContextValue | null>(null);

export function useCanvas(): CanvasContextValue {
  const ctx = use(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside <CanvasApp>");
  return ctx;
}
