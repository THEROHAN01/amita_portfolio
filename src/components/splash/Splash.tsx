"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Avatar, Zzz } from "@/components/avatar/Avatar";
import { useCanvas } from "@/components/canvas/context";
import { runCurtain } from "@/lib/curtain";
import { trackPointer } from "@/lib/pointer";
import { FishName } from "./FishName";
import { NameCycler } from "./NameCycler";
import { SpeechBubble } from "./SpeechBubble";
import s from "./splash.module.css";

const SCROLL_TO_ENTER = 90;
const SWIPE_TO_ENTER = 60;
const ENTER_KEYS = new Set(["ArrowDown", "PageDown", " ", "Enter"]);
/** The name holds the stage alone for this long before the portrait rises. */
const PORTRAIT_DELAY = 400;

/**
 * Opening screen over the canvas. Scroll (or swipe / press ↓) to enter; a
 * curtain covers the swap and the splash unmounts entirely afterwards.
 */
export function Splash() {
  const { dispatch } = useCanvas();
  const [gone, setGone] = useState(false);
  const [risen, setRisen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const enterRef = useRef<() => void>(null);

  useEffect(() => {
    const host = root.current?.parentElement;
    if (!host) return;
    const wide = window.matchMedia("(min-width: 900px)");
    const stopPointer = trackPointer();

    const enter = () => {
      if (leaving.current) return;
      leaving.current = true;
      runCurtain(host, "Portfolio", () => {
        setGone(true);
        dispatch({ type: "splashDone" });
      });
    };
    enterRef.current = enter;

    let acc = 0;
    const onWheel = (e: WheelEvent) => {
      if (!wide.matches) return;
      e.preventDefault();
      acc = e.deltaY > 0 ? acc + e.deltaY : 0;
      if (acc > SCROLL_TO_ENTER) enter();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!wide.matches || !ENTER_KEYS.has(e.key)) return;
      e.preventDefault();
      enter();
    };
    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => (startY = e.touches[0]?.clientY ?? null);
    const onTouchMove = (e: TouchEvent) => {
      if (wide.matches && startY !== null && startY - (e.touches[0]?.clientY ?? startY) > SWIPE_TO_ENTER) enter();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      stopPointer();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [dispatch]);

  // Name first; the portrait rises once the beat has passed *and* the image is decoded,
  // so it never slides in half-loaded on a slow connection.
  useEffect(() => {
    let alive = true;
    const img = avatar.current?.querySelector("img");
    const beat = new Promise((r) => setTimeout(r, PORTRAIT_DELAY));
    const decoded = img ? img.decode().catch(() => undefined) : Promise.resolve();
    Promise.all([beat, decoded]).then(() => {
      if (!alive) return;
      setRisen(true);
      // Loaded on demand so the synth never touches the initial bundle.
      import("@/lib/whoosh").then((m) => m.playWhoosh()).catch(() => undefined);
    });
    return () => {
      alive = false;
    };
  }, []);

  const followGlow = (e: MouseEvent<HTMLDivElement>) => {
    const g = glow.current;
    if (!g) return;
    const r = e.currentTarget.getBoundingClientRect();
    g.style.opacity = "1";
    g.style.transform = `translate3d(${e.clientX - r.left}px,${e.clientY - r.top}px,0)`;
  };

  if (gone) return null;

  return (
    <div
      ref={root}
      className={s.splash}
      data-risen={risen || undefined}
      onMouseMove={followGlow}
      onMouseLeave={() => glow.current?.style.setProperty("opacity", "0")}
    >
      <div ref={glow} className={s.glow} aria-hidden />
      <div className={s.pulseA} aria-hidden />
      <div className={s.pulseB} aria-hidden />
      <div className={s.stage}>
        <FishName first="Amita" last="Hendre" bubble={<SpeechBubble avatar={avatar} />} />
        <div ref={avatar} className={s.avatarSlot}>
          <Avatar className={s.avatar} sizes="54vh" preload>
            <Zzz />
          </Avatar>
        </div>
      </div>
      <NameCycler />
      <button
        type="button"
        className={s.enter}
        onClick={() => enterRef.current?.()}
      >
        Enter portfolio ↓
      </button>
    </div>
  );
}
