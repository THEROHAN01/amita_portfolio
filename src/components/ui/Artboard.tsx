import type { CSSProperties, ReactNode } from "react";
import type { BoardDef } from "@/content/types";
import { metaAttrs } from "./meta";
import s from "./artboard.module.css";

export type BoardTone = "paper" | "white" | "plum" | "night";

interface ArtboardProps {
  board: BoardDef;
  tone?: BoardTone;
  /** Inner padding in px; boards with full-bleed layouts pass 0. */
  pad?: number;
  children: ReactNode;
}

/** A positioned artboard on the canvas world, with its Figma-style name label above. */
export function Artboard({ board, tone = "paper", pad = 36, children }: ArtboardProps) {
  const { id, num, title, box } = board;
  const style: CSSProperties = { left: box.x, top: box.y, width: box.w, height: box.h, padding: pad };
  return (
    <section
      data-artboard={id}
      {...metaAttrs({ kind: "Artboard", ...board })}
      aria-label={title}
      className={`${s.board} ${s[tone]}`}
      style={style}
    >
      <div className={s.label} aria-hidden>
        <span className={s.labelNum}>{num}</span>
        <span className={s.labelTitle}>{title}</span>
        <span className={s.labelSize}>
          {box.w} × {box.h}
        </span>
      </div>
      {children}
    </section>
  );
}

interface HeaderProps {
  pill: ReactNode;
  aside?: ReactNode;
  /** Inverse pill reads white-on-plum boards. */
  pillTone?: "solid" | "inverse";
}

function Header({ pill, aside, pillTone = "solid" }: HeaderProps) {
  return (
    <div className={s.header}>
      <span className={pillTone === "inverse" ? `${s.pill} ${s.pillInverse}` : s.pill}>{pill}</span>
      {aside ? <span className={s.aside}>{aside}</span> : null}
    </div>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h2 className={s.title}>{children}</h2>;
}

function Rule() {
  return <div className={s.rule} />;
}

/** Fills the remaining board height; children lay out inside it. */
function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `${s.body} ${className}` : s.body}>{children}</div>;
}

Artboard.Header = Header;
Artboard.Title = Title;
Artboard.Rule = Rule;
Artboard.Body = Body;
