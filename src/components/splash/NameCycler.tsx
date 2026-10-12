"use client";

import { useEffect, useState } from "react";
import { nameInScripts } from "@/content/profile";
import s from "./splash.module.css";

const INTERVAL = 1000;
const FADE = 220;

/** Top-right: the name in a new script every second. Isolated so only it re-renders. */
export function NameCycler() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setShown(false);
      swap = setTimeout(() => {
        setI((n) => (n + 1) % nameInScripts.length);
        setShown(true);
      }, FADE);
    }, INTERVAL);
    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, []);

  const [name, language] = nameInScripts[i];
  return (
    <div className={s.scripts} data-shown={shown || undefined} aria-hidden>
      <div className={s.scriptName}>
        {name}
      </div>
      <div className={s.scriptLang}>{language}</div>
    </div>
  );
}
