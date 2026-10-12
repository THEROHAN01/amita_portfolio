import { Artboard } from "@/components/ui/Artboard";
import { aboutBoards, education } from "@/content/about";
import s from "./education.module.css";

export function Education() {
  return (
    <Artboard board={aboutBoards.education}>
      <Artboard.Header pill="Learning" aside={education.map((e) => e.level).join(" → ")} />
      <Artboard.Title>Education</Artboard.Title>
      <Artboard.Rule />
      <Artboard.Body className={s.steps}>
        {education.map((e) => (
          <div key={e.step} className={s.step} style={{ height: `${e.height}%` }}>
            <span className={s.stepNum}>STEP {e.step}</span>
            <span className={s.level}>{e.level}</span>
            <span className={s.school}>{e.school}</span>
            <span className={s.city}>{e.city}</span>
          </div>
        ))}
      </Artboard.Body>
    </Artboard>
  );
}
