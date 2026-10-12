import type { StaticImageData } from "next/image";

export type ViewId = "work" | "about" | "contact";

/** A rectangle in canvas world coordinates. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Inspectable metadata — rendered as data-* attributes and read by the guide. */
export interface Meta {
  title: string;
  kind?: string;
  client?: string;
  year?: string;
  role?: string;
  tools?: string;
  status?: string;
  brief?: string;
  outcome?: string;
}

/** Ids of the hand-drawn mock thumbnails in components/views/work/thumbs. */
export type ThumbId =
  | "brand-a"
  | "brand-b"
  | "brand-c"
  | "social-a"
  | "social-b"
  | "social-c"
  | "uiux-a"
  | "uiux-b"
  | "uiux-c"
  | "deck-a"
  | "deck-b"
  | "print-a"
  | "print-b"
  | "print-c"
  | "illus-a"
  | "atta"
  | "oat"
  | "calendar"
  | "ai";

export interface WorkFrame extends Meta {
  id: string;
  /** Short title on the card caption. */
  name: string;
  /** Uppercase meta line under the name. */
  caption: string;
  thumb: ThumbId;
  /** Real artwork — replaces the mock thumbnail and fixes the media ratio. */
  image?: StaticImageData;
  link?: { href: string; label: string };
}

export interface WorkBoard extends Meta {
  id: string;
  num: string;
  /** Pill text in the board header. */
  tagline: string;
  box: Box;
  /** CSS grid-template for the frame area. */
  grid: string;
  /** "row" frames put the caption beside the thumbnail instead of below. */
  frameLayout: "stack" | "row";
  frames: WorkFrame[];
}

export interface LayerNode {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}
