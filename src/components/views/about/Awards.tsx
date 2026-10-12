import { Artboard } from "@/components/ui/Artboard";
import { aboutBoards, awards, metrics } from "@/content/about";
import s from "./awards.module.css";

export function Awards() {
  return (
    <Artboard board={aboutBoards.awards} tone="night">
      <Artboard.Header pill="Recognition" aside={`${awards.length} awards · ${metrics.length} numbers`} />
      <Artboard.Title>Awards &amp; Achievements</Artboard.Title>
      <Artboard.Rule />
      <div className={s.awards}>
        {awards.map((a) => (
          <div key={a.title} className={s.award}>
            <span className={s.year}>{a.year}</span>
            <div>
              <div className={s.title}>{a.title}</div>
              <div className={s.org}>{a.org}</div>
              <div className={s.note}>{a.note}</div>
            </div>
          </div>
        ))}
      </div>
      <dl className={s.metrics}>
        {metrics.map((m) => (
          <div key={m.label} className={s.metric}>
            <dt className={s.label}>{m.label}</dt>
            <dd className={s.value}>{m.value}</dd>
          </div>
        ))}
      </dl>
    </Artboard>
  );
}
