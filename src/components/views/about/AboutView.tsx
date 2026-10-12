import { Awards } from "./Awards";
import { Education } from "./Education";
import { Intro } from "./Intro";
import { Philosophy } from "./Philosophy";
import { Skills } from "./Skills";
import { Timeline } from "./Timeline";
import { Tools } from "./Tools";

/** About view: introduction, philosophy, career timeline, skills, tools, awards, education. */
export function AboutView() {
  return (
    <>
      <Intro />
      <Philosophy />
      <Timeline />
      <Skills />
      <Tools />
      <Awards />
      <Education />
    </>
  );
}
