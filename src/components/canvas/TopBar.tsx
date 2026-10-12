"use client";

import { Redo2, Undo2 } from "lucide-react";
import { views } from "@/content/canvas";
import { profile } from "@/content/profile";
import { useCanvas } from "./context";
import s from "./topbar.module.css";

export function TopBar() {
  const { state, dispatch, actions } = useCanvas();
  return (
    <header className={s.bar}>
      <div className={s.left}>
        <span className={s.logo} aria-label={profile.name}>
          {profile.initials}
        </span>
        <div className={s.history}>
          <button type="button" className={s.round} title="Undo (Ctrl+Z)" aria-label="Undo" onClick={() => dispatch({ type: "undo" })}>
            <Undo2 size={15} />
          </button>
          <button type="button" className={s.round} title="Redo (Ctrl+Shift+Z)" aria-label="Redo" onClick={() => dispatch({ type: "redo" })}>
            <Redo2 size={15} />
          </button>
        </div>
      </div>
      <nav data-guide="menu" className={s.nav} aria-label="Sections">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            className={s.navItem}
            aria-current={state.view === v.id ? "page" : undefined}
            onClick={() => actions.goTo(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>
      <div className={s.right} />
    </header>
  );
}
