import type { Box, ViewId } from "@/content/types";

export type ToolId = "v" | "h" | "z" | "f" | "r" | "t" | "i" | "p" | "b" | "e";
export const DRAW_TOOLS: ReadonlySet<ToolId> = new Set(["p", "b"]);
export const PLACE_TOOLS: ReadonlySet<ToolId> = new Set(["f", "r", "t"]);

export type Point = { x: number; y: number };

/** Visitor markup on the canvas — strokes or placed shapes. */
export type MarkupObject =
  | { id: string; n: number; kind: "p" | "b"; pts: Point[]; d: string; w: number; op: number }
  | { id: string; n: number; kind: "f" | "r" | "t"; x: number; y: number };

export interface Selection {
  id: string;
  rect: Box;
  /** The node's data-* metadata (title, brief, role…). */
  meta: Record<string, string | undefined>;
  isBoard: boolean;
}

export interface Toast {
  text: string;
  swatch?: string;
}

export interface CanvasState {
  view: ViewId;
  tool: ToolId;
  sel: Selection | null;
  objs: MarkupObject[];
  undone: MarkupObject[];
  sent: { n: number; time: string }[];
  toast: Toast | null;
  noticeSeen: boolean;
  splashDone: boolean;
}

export const initialState: CanvasState = {
  view: "work",
  tool: "v",
  sel: null,
  objs: [],
  undone: [],
  sent: [],
  toast: null,
  noticeSeen: false,
  splashDone: false,
};

export type Action =
  | { type: "view"; view: ViewId }
  | { type: "tool"; tool: ToolId }
  | { type: "select"; sel: Selection | null }
  | { type: "add"; obj: MarkupObject }
  | { type: "erase"; ids: Set<string> }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "clear" }
  | { type: "sent"; time: string }
  | { type: "toast"; toast: Toast | null }
  | { type: "noticeSeen" }
  | { type: "splashDone" };

export function reducer(s: CanvasState, a: Action): CanvasState {
  switch (a.type) {
    case "view":
      return { ...s, view: a.view, sel: null };
    case "tool":
      return s.tool === a.tool ? s : { ...s, tool: a.tool };
    case "select":
      return { ...s, sel: a.sel };
    case "add":
      return { ...s, objs: [...s.objs, a.obj], undone: [] };
    case "erase": {
      const objs = s.objs.filter((o) => !a.ids.has(o.id));
      return objs.length === s.objs.length ? s : { ...s, objs };
    }
    case "undo":
      return s.objs.length ? { ...s, objs: s.objs.slice(0, -1), undone: [...s.undone, s.objs[s.objs.length - 1]] } : s;
    case "redo":
      return s.undone.length ? { ...s, objs: [...s.objs, s.undone[s.undone.length - 1]], undone: s.undone.slice(0, -1) } : s;
    case "clear":
      return { ...s, objs: [], undone: [] };
    case "sent":
      return { ...s, objs: [], undone: [], sel: null, sent: [...s.sent, { n: s.objs.length, time: a.time }] };
    case "toast":
      return { ...s, toast: a.toast };
    case "noticeSeen":
      return { ...s, noticeSeen: true };
    case "splashDone":
      return { ...s, splashDone: true };
  }
}

export const markupLabel = (o: MarkupObject) =>
  ({ p: "Pencil comment", b: "Brush comment", r: "Rectangle", f: "Frame", t: "Text" })[o.kind] + " " + o.n;

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
