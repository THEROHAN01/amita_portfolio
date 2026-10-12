import { Artboard } from "@/components/ui/Artboard";
import { aboutBoards, skillGroups } from "@/content/about";
import s from "./skills.module.css";

const two = (n: number) => String(n).padStart(2, "0");
const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

export function Skills() {
  return (
    <Artboard board={aboutBoards.skills}>
      <Artboard.Header pill="What I do" aside={`${total} skills · ${skillGroups.length} groups`} />
      <Artboard.Title>Skills</Artboard.Title>
      <Artboard.Rule />
      <Artboard.Body className={s.groups}>
        {skillGroups.map((g, gi) => {
          const offset = skillGroups.slice(0, gi).reduce((n, p) => n + p.items.length, 0);
          return (
            <div key={g.name} className={`${s.group} ${s[`tone${g.tone}`]}`}>
              <div className={s.head}>
                <h3 className={s.groupName}>{g.name}</h3>
                <span className={s.groupNum}>{two(gi + 1)}</span>
              </div>
              <ul className={s.list}>
                {g.items.map((item, i) => (
                  <li key={item} className={s.item}>
                    <span className={s.itemNum}>{two(offset + i + 1)}</span>
                    <span className={s.itemName}>{item}</span>
                    <span className={s.marker} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Artboard.Body>
    </Artboard>
  );
}
