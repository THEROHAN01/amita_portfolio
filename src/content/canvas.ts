import { aboutBoards, roles, stages } from "./about";
import { contactBoards } from "./contact";
import type { Box, LayerNode, ViewId } from "./types";
import { workBoards } from "./work";

export const views: { id: ViewId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About Me" },
  { id: "contact", label: "Contact" },
];

const label = (b: { num: string; title: string }) => `${b.num} ${b.title}`;

/** Layers panel tree for each view — derived, never hand-maintained. */
export const layers: Record<ViewId, LayerNode[]> = {
  work: workBoards.map((b) => ({
    id: b.id,
    label: label(b),
    children: b.frames.map((f) => ({ id: f.id, label: f.name })),
  })),
  about: Object.values(aboutBoards).map((b) =>
    b.id === "timeline"
      ? {
          id: b.id,
          label: label(b),
          children: [
            ...stages.map((s) => ({ id: s.id, label: `Stage · ${s.title}` })),
            ...roles.map((r) => ({ id: r.id, label: r.company })),
          ],
        }
      : { id: b.id, label: label(b) },
  ),
  contact: Object.values(contactBoards).map((b) => ({ id: b.id, label: label(b) })),
};

const bounds = (boxes: Box[]): Box => {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return {
    x,
    y,
    w: Math.max(...boxes.map((b) => b.x + b.w)) - x,
    h: Math.max(...boxes.map((b) => b.y + b.h)) - y,
  };
};

/** The region "Fit" frames for each view. */
export const worlds: Record<ViewId, Box> = {
  work: bounds(workBoards.map((b) => b.box)),
  about: bounds(Object.values(aboutBoards).map((b) => b.box)),
  contact: bounds(Object.values(contactBoards).map((b) => b.box)),
};

export const WORLD_SIZE = { w: 4200, h: 3600 } as const;
