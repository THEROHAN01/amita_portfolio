import type { ViewId } from "./types";

/*
 * Dependency-free on purpose: client components import this, so it must not
 * pull the rest of the content (copy, image imports) into the browser bundle.
 */

export const views: { id: ViewId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About Me" },
  { id: "contact", label: "Contact" },
];

export const WORLD_SIZE = { w: 4200, h: 3600 } as const;
