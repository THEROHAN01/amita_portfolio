import { Avatar, Zzz } from "@/components/avatar/Avatar";
import { profile } from "@/content/profile";
import { workBoards } from "@/content/work";
import s from "./mobile.module.css";

/** Single-column page for narrow screens; the canvas is a desktop experience. */
export function MobileHome() {
  return (
    <div className={s.page}>
      <header className={s.header}>
        <span className={s.mark} aria-hidden />
        <span className={s.file}>Amita_Hendre_Portfolio</span>
      </header>

      <div className={s.hero}>
        <Avatar className={s.avatar} sizes="264px">
          <Zzz />
        </Avatar>
        <h1 className={s.name}>{profile.name}</h1>
      </div>

      <p className={s.role}>{profile.role}</p>
      <div className={s.rule} />
      <p className={s.summary}>{profile.summary}</p>

      <h2 className={s.kicker}>Work</h2>
      <ol className={s.work}>
        {workBoards.map((b) => (
          <li key={b.id}>
            <span className={s.num}>{b.num}</span>
            {b.title}
          </li>
        ))}
      </ol>

      <p className={s.note}>
        The full portfolio is a design-file canvas — open it on a desktop to pan, zoom and inspect the artboards.
      </p>

      <ul className={s.links}>
        <li>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li>
          <a href={profile.phone.href}>{profile.phone.display}</a>
        </li>
        <li>
          <a href={profile.behance.href} target="_blank" rel="noopener">
            {profile.behance.display}
          </a>
        </li>
      </ul>

      <a href={profile.cv.href} download={profile.cv.file} className={s.cv}>
        Download Resume ↓
      </a>
    </div>
  );
}
