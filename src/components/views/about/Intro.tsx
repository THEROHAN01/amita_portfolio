import Image from "next/image";
import portrait from "@/assets/about/portrait.jpg";
import { Artboard } from "@/components/ui/Artboard";
import { aboutBoards, introFacts } from "@/content/about";
import { profile } from "@/content/profile";
import s from "./intro.module.css";

export function Intro() {
  return (
    <Artboard board={aboutBoards.intro} pad={0}>
      <div className={s.split}>
        <div className={s.main}>
          <span className={s.monogram} aria-hidden>
            {profile.initials}
          </span>
          <Artboard.Header pill="About Me" aside="Portfolio · 2026" />
          <h2 className={s.name}>
            AMITA
            <br />
            HENDRE<span className={s.dot}>.</span>
          </h2>
          <div className={s.roleLine}>
            <span>{profile.role}</span>
            <span className={s.roleRule} />
          </div>
          <p className={s.summary}>{profile.summaryLong}</p>
          <div className={s.facts}>
            {introFacts.map((f) => (
              <div key={f.label} className={s.fact}>
                <div className={s.factLabel}>{f.label}</div>
                <div className={"accent" in f ? `${s.factValue} ${s.factAccent}` : s.factValue}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={s.side}>
          <div className={s.plate} />
          <div className={s.photo}>
            <Image src={portrait} alt={`Portrait of ${profile.name}`} fill sizes="344px" className={s.photoImg} />
          </div>
          <div className={s.years}>
            <div className={s.yearsNum}>
              <span className={s.big}>5+</span>
              <span className={s.yearsLabel}>
                Years
                <br />
                designing
              </span>
            </div>
            <span className={s.disciplines}>
              Brand · Print
              <br />
              Social · UI/UX
            </span>
          </div>
        </div>
      </div>
    </Artboard>
  );
}
