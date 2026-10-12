"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { onSleepChange } from "@/components/avatar/GazeEngine";
import s from "./splash.module.css";

const GREETING = "Hi I am..";
const PROMPT = "Start by scrolling";
const WAKE = "yes I am up";
const PROMPT_DELAY = 2600;
/** The greeting holds longer at first: the bubble only appears once the portrait has risen. */
const GREETING_HOLD = 4200;

/** Rounded rect with a tail on the right edge pointing at the avatar. */
function bubblePath(w: number, h: number) {
  const r = 6;
  return (
    `M${r},0 H${w - r} Q${w},0 ${w},${r} V${h / 2 - 6} L${w + 9},${h / 2 + 1} L${w},${h / 2 + 7} ` +
    `V${h - r} Q${w},${h} ${w - r},${h} H${r} Q0,${h} 0,${h - r} V${r} Q0,0 ${r},0 Z`
  );
}

interface SpeechBubbleProps {
  /** The avatar the tail should point at. */
  avatar: RefObject<HTMLElement | null>;
}

/** Liquid-glass speech bubble beside the splash avatar; dozes off with her. */
export function SpeechBubble({ avatar }: SpeechBubbleProps) {
  const wrap = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(GREETING);
  const [asleep, setAsleep] = useState(false);
  const [shape, setShape] = useState({ w: 0, h: 0 });

  // Greeting → prompt; after a nap → "yes I am up" → prompt.
  useEffect(() => {
    let timer = setTimeout(() => setText(PROMPT), GREETING_HOLD);
    let sleptAt = 0;
    const off = onSleepChange((sleeping) => {
      setAsleep(sleeping);
      if (sleeping) {
        sleptAt = performance.now();
        return;
      }
      if (performance.now() - sleptAt > 1500) {
        setText(WAKE);
        clearTimeout(timer);
        timer = setTimeout(() => setText(PROMPT), PROMPT_DELAY);
      }
    });
    return () => {
      clearTimeout(timer);
      off();
    };
  }, []);

  // Track the bubble's size (for the glass path) and keep the tail on the avatar's face.
  // A passive effect: the avatar is a later sibling, so its ref is only set after layout effects.
  useEffect(() => {
    const b = box.current;
    const w = wrap.current;
    const av = avatar.current;
    if (!b || !w || !av) return;
    const host = w.parentElement!;
    const measure = () => {
      setShape({ w: b.offsetWidth, h: b.offsetHeight });
      const a = av.getBoundingClientRect();
      const edge = a.left + a.width * 0.242 - 36;
      w.style.right = `${Math.round(host.getBoundingClientRect().right - edge)}px`;
    };
    const ro = new ResizeObserver(measure);
    [b, host, av].forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [avatar]);

  const d = shape.w ? bubblePath(shape.w, shape.h) : "";

  return (
    <span ref={wrap} className={s.bubble} data-asleep={asleep || undefined} aria-live="polite">
      <span ref={box} className={s.bubbleBox}>
        <span className={s.bubbleGlass} style={d ? { clipPath: `path('${d}')` } : undefined} />
        <svg className={s.bubbleSvg} width={shape.w + 10} height={shape.h + 2} aria-hidden>
          <defs>
            <linearGradient id="bubFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".38" />
              <stop offset=".6" stopColor="#fff" stopOpacity=".18" />
              <stop offset="1" stopColor="#fff" stopOpacity=".26" />
            </linearGradient>
          </defs>
          <path d={d} fill="url(#bubFill)" stroke="rgba(255,255,255,.65)" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span key={text} className={s.bubbleText}>
          {text}
        </span>
      </span>
    </span>
  );
}
