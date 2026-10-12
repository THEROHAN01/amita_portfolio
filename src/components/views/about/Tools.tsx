import { Artboard } from "@/components/ui/Artboard";
import { aboutBoards, toolGroups, tools } from "@/content/about";
import s from "./tools.module.css";

const codeOf = Object.fromEntries(toolGroups.map((g) => [g.id, g.code]));

export function Tools() {
  return (
    <Artboard board={aboutBoards.tools}>
      <Artboard.Header pill="Software" aside={`${tools.length} tools · ${toolGroups.length} groups`} />
      <Artboard.Title>Tools</Artboard.Title>
      <Artboard.Rule />
      <Artboard.Body className={s.grid}>
        {tools.map((t, i) => (
          <div key={t.name} className={`${s.tile} ${s[t.group]}`}>
            <div className={s.tileHead}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className={t.group === "ai" ? s.aiBadge : undefined}>{codeOf[t.group]}</span>
            </div>
            <span className={s.abbr}>{t.abbr}</span>
            <span className={s.name}>{t.name}</span>
          </div>
        ))}
      </Artboard.Body>
      <ul className={s.legend}>
        {toolGroups.map((g) => (
          <li key={g.id}>
            <span className={`${s.swatch} ${s[g.id]}`} />
            {g.label}
          </li>
        ))}
      </ul>
    </Artboard>
  );
}
