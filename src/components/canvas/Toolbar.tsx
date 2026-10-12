"use client";

import { useCanvas } from "./context";
import { toolbar } from "./tools";
import s from "./toolbar.module.css";

export function Toolbar() {
  const { state, dispatch } = useCanvas();
  return (
    <div data-guide="tools" className={s.bar} role="toolbar" aria-label="Canvas tools" aria-orientation="vertical">
      {toolbar.map((t, i) =>
        t ? (
          <button
            key={t.id}
            type="button"
            className={s.tool}
            aria-pressed={state.tool === t.id}
            aria-label={`${t.label} (${t.key})`}
            onClick={() => dispatch({ type: "tool", tool: t.id })}
          >
            <t.icon size={17} />
            <span className={s.tip} aria-hidden>
              <strong>{t.label}</strong>
              <span className={s.key}>{t.key}</span>
            </span>
          </button>
        ) : (
          <span key={`sep-${i}`} className={s.sep} />
        ),
      )}
    </div>
  );
}
