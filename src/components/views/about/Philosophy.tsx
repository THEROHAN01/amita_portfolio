import { Artboard } from "@/components/ui/Artboard";
import { aboutBoards, principles } from "@/content/about";
import s from "./philosophy.module.css";

export function Philosophy() {
  return (
    <Artboard board={aboutBoards.philosophy} tone="plum">
      <div className={s.backdrop} aria-hidden>
        <span>&amp;</span>
      </div>
      <Artboard.Header pill="Design Philosophy" pillTone="inverse" aside="How I work" />
      <h2 className={s.headline}>
        Clear first.
        <br />
        <span className={s.soft}>Then beautiful.</span>
      </h2>
      <ol className={s.principles}>
        {principles.map((p, i) => (
          <li key={p.title} className={s.principle}>
            <div className={s.num}>{String(i + 1).padStart(2, "0")}</div>
            <div className={s.title}>{p.title}</div>
            <p className={s.body}>{p.body}</p>
          </li>
        ))}
      </ol>
    </Artboard>
  );
}
