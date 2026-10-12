import type { Box } from "@/content/types";
import s from "./canvas.module.css";

/** Accent outline + dimensions tag around the selection. Counter-scaled via the world's `--inv`. */
export function SelectionRing({ rect }: { rect: Box }) {
  return (
    <div className={s.ring} style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }} aria-hidden>
      <span className={s.ringLabel}>
        {Math.round(rect.w)} × {Math.round(rect.h)}
      </span>
    </div>
  );
}
