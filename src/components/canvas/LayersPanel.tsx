"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";
import { views } from "@/content/views";
import type { LayerNode } from "@/content/types";
import { useCanvas } from "./context";
import { markupLabel, plural } from "./state";
import s from "./layers.module.css";

export function LayersPanel({ layers }: { layers: LayerNode[] }) {
  const { state, actions } = useCanvas();
  const [groupOpen, setGroupOpen] = useState(true);
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const selected = state.sel?.id;
  const viewLabel = views.find((v) => v.id === state.view)?.label;
  const sentTotal = state.sent.reduce((n, b) => n + b.n, 0);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <aside className={s.panel} aria-label="Layers">
      <div data-guide="layers" className={s.scroll}>
        <div className={s.head}>
          <span>Layers</span>
          <span className={s.headAside}>Portfolio</span>
        </div>

        <button type="button" className={s.group} aria-expanded={groupOpen} onClick={() => setGroupOpen((o) => !o)}>
          <span className={s.caret}>{groupOpen ? "▾" : "▸"}</span>
          {viewLabel}
        </button>

        {groupOpen ? (
          <ul className={s.tree}>
            {layers.map((node) => {
              const expanded = open.has(node.id);
              return (
                <li key={node.id}>
                  <div className={s.row} aria-current={selected === node.id || undefined}>
                    {node.children ? (
                      <button
                        type="button"
                        className={s.toggle}
                        aria-label={`${expanded ? "Collapse" : "Expand"} ${node.label}`}
                        aria-expanded={expanded}
                        onClick={() => toggle(node.id)}
                      >
                        {expanded ? "▾" : "▸"}
                      </button>
                    ) : (
                      <span className={s.toggle} />
                    )}
                    <button type="button" className={s.rowLabel} onClick={() => actions.select(node.id)}>
                      <span className={s.icon} />
                      {node.label}
                    </button>
                  </div>
                  {node.children && expanded ? (
                    <ul className={s.children}>
                      {node.children.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            className={s.child}
                            aria-current={selected === c.id || undefined}
                            onClick={() => actions.select(c.id)}
                          >
                            {c.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {state.objs.length > 0 ? (
          <section className={s.section}>
            <div className={s.sectionHead}>
              Your Comments<span>{state.objs.length}</span>
            </div>
            <ul className={s.plain}>
              {state.objs.map((o) => (
                <li key={o.id}>{markupLabel(o)}</li>
              ))}
            </ul>
            <p className={s.note}>Nothing leaves this canvas until you send it. Erase or clear to withdraw.</p>
            <button type="button" className={s.send} onClick={actions.sendMarkup}>
              <Send size={13} />
              Send {state.objs.length} to Amita
            </button>
          </section>
        ) : null}

        {state.sent.length > 0 ? (
          <section className={s.section}>
            <div className={`${s.sectionHead} ${s.muted}`}>
              Sent<span>{sentTotal}</span>
            </div>
            <ul className={s.plain}>
              {state.sent.map((b, i) => (
                <li key={i} className={s.sentRow}>
                  <span>
                    <Check size={12} strokeWidth={3} className={s.tick} />
                    {plural(b.n, "comment")}
                  </span>
                  <span className={s.time}>{b.time}</span>
                </li>
              ))}
            </ul>
            <p className={s.note}>Handed to your email app with a note of where you drew — send it there to deliver.</p>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
