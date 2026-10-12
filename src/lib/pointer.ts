/**
 * One set of global listeners shared by every consumer (gaze, splash, guide).
 * Values are plain mutable fields read inside animation frames — never state.
 */
export const pointer = {
  /** Last known pointer position, or null once it leaves the window. */
  pos: null as { x: number; y: number } | null,
  /** performance.now() of the last pointer move. */
  movedAt: 0,
  /** performance.now() of the last user activity of any kind. */
  activeAt: 0,
};

let users = 0;
const now = () => performance.now();

const onMove = (e: MouseEvent) => {
  pointer.pos = { x: e.clientX, y: e.clientY };
  pointer.movedAt = pointer.activeAt = now();
};
const onOut = (e: MouseEvent) => {
  if (!e.relatedTarget) pointer.pos = null;
};
const onTouch = (e: TouchEvent) => {
  const t = e.touches[0];
  pointer.activeAt = now();
  if (t) {
    pointer.pos = { x: t.clientX, y: t.clientY };
    pointer.movedAt = pointer.activeAt;
  }
};
const onTouchEnd = () => {
  pointer.movedAt = now() - 1000;
};
const onActivity = () => {
  pointer.activeAt = now();
};

const ACTIVITY = ["wheel", "keydown", "pointerdown", "scroll"] as const;
const PASSIVE = { passive: true } as const;

/** Ref-counted: listeners attach on first use and detach when the last user leaves. */
export function trackPointer(): () => void {
  if (users++ === 0) {
    pointer.activeAt = pointer.movedAt = now();
    ACTIVITY.forEach((ev) => window.addEventListener(ev, onActivity, PASSIVE));
    window.addEventListener("mousemove", onMove, PASSIVE);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("touchstart", onTouch, PASSIVE);
    window.addEventListener("touchmove", onTouch, PASSIVE);
    window.addEventListener("touchend", onTouchEnd, PASSIVE);
  }
  return () => {
    if (--users > 0) return;
    ACTIVITY.forEach((ev) => window.removeEventListener(ev, onActivity));
    window.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseout", onOut);
    window.removeEventListener("touchstart", onTouch);
    window.removeEventListener("touchmove", onTouch);
    window.removeEventListener("touchend", onTouchEnd);
  };
}
