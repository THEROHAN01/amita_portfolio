import type { CSSProperties } from "react";
import { Artboard } from "@/components/ui/Artboard";
import { metaAttrs } from "@/components/ui/meta";
import { aboutBoards, roles, stages, timelineYears, YEAR_SPAN, type Role } from "@/content/about";
import s from "./timeline.module.css";

const pct = (n: number) => `${n.toFixed(2)}%`;

/** Role notes sit after their bar, or before it when the bar reaches the right edge. */
function notePlacement(r: Role): CSSProperties {
  const end = r.start + r.width;
  const room = 100 - end;
  if (room < 20) return { right: `calc(${pct(100 - r.start)} + 14px)`, width: "36%", textAlign: "right" };
  return { left: `calc(${pct(end)} + 14px)`, width: pct(Math.min(40, room - 4)) };
}

export function Timeline() {
  return (
    <Artboard board={aboutBoards.timeline} tone="white">
      <Artboard.Header pill="Career" aside="6 roles · 4 stages · 2020 → now" />
      <Artboard.Title>Experience &amp; Journey</Artboard.Title>
      <Artboard.Rule />

      <div className={`${s.track} ${s.stagesRow}`}>
        <div className={s.span}>
          <span className={s.spanYears}>
            2020<span className={s.arrow}>→</span>
            <span className={s.now}>26</span>
          </span>
          <span className={s.spanRole}>Intern → Graphic &amp; UI/UX Designer</span>
        </div>
        <div className={s.lane}>
          {stages.map((st, i) => (
            <div
              key={st.id}
              data-frame={st.id}
              {...metaAttrs({ title: st.title, kind: "Stage", year: st.years, status: `Stage ${i + 1} of 4`, brief: st.brief })}
              className={`${s.stage} ${s[`tone${st.tone}`]}`}
              style={{ left: pct(st.start), width: `calc(${pct(st.width)} - 4px)` }}
            >
              <span className={s.stageMeta}>
                0{i + 1} · {st.years}
              </span>
              <span className={s.stageTitle}>{st.title}</span>
              <p className={s.stageBrief}>{st.brief}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${s.track} ${s.axis}`}>
        <span />
        <div className={s.lane}>
          {timelineYears.map((y, i) => (
            <span key={y} className={s.year} style={{ left: pct(i * YEAR_SPAN) }}>
              {y}
            </span>
          ))}
          <span className={s.nowTag}>Now</span>
        </div>
      </div>

      <div className={s.roles} style={{ "--year": pct(YEAR_SPAN) } as CSSProperties}>
        {roles.map((r, i) => (
          <div
            key={r.id}
            data-frame={r.id}
            {...metaAttrs({
              title: r.company,
              kind: "Role",
              client: r.company,
              year: r.years,
              role: r.title,
              status: r.current ? "Current" : "Past",
              brief: r.brief,
            })}
            className={`${s.track} ${s.role} ${r.current ? s.current : ""}`}
          >
            <div className={s.who}>
              <span className={`${s.badge} ${s[`tone${r.tone}`]}`}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className={s.company}>{r.company}</div>
                <div className={s.roleMeta}>
                  {r.title} · {r.years}
                </div>
              </div>
            </div>
            <div className={s.gantt}>
              <span className={`${s.bar} ${s[`tone${r.tone}`]}`} style={{ left: pct(r.start), width: pct(r.width) }} />
              <p className={s.note} style={notePlacement(r)}>
                {r.brief}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Artboard>
  );
}
