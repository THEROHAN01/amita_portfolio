import { Brush, Eraser, Frame, Hand, MousePointer2, Pencil, Pipette, Square, Type, ZoomIn, type LucideIcon } from "lucide-react";
import type { ToolId } from "./state";

export interface ToolDef {
  id: ToolId;
  label: string;
  key: string;
  cursor: string;
  icon: LucideIcon;
}

/** Toolbar order; `null` draws a divider. */
export const toolbar: (ToolDef | null)[] = [
  { id: "v", label: "Selection", key: "V", cursor: "default", icon: MousePointer2 },
  { id: "h", label: "Hand / Pan", key: "H", cursor: "grab", icon: Hand },
  { id: "z", label: "Zoom (alt = out)", key: "Z", cursor: "zoom-in", icon: ZoomIn },
  null,
  { id: "f", label: "Frame", key: "F", cursor: "crosshair", icon: Frame },
  { id: "r", label: "Rectangle", key: "R", cursor: "crosshair", icon: Square },
  { id: "t", label: "Text", key: "T", cursor: "text", icon: Type },
  { id: "i", label: "Eyedropper", key: "I", cursor: "crosshair", icon: Pipette },
  null,
  { id: "p", label: "Pencil — draw a comment", key: "P", cursor: "crosshair", icon: Pencil },
  { id: "b", label: "Brush — draw a comment", key: "B", cursor: "crosshair", icon: Brush },
  { id: "e", label: "Eraser", key: "E", cursor: "crosshair", icon: Eraser },
];

export const toolById = Object.fromEntries(
  toolbar.filter((t): t is ToolDef => t !== null).map((t) => [t.id, t]),
) as Record<ToolId, ToolDef>;
