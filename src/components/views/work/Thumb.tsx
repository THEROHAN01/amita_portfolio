import type { CSSProperties, ReactNode } from "react";
import { aiStack } from "@/content/work";
import type { ThumbId } from "@/content/types";
import s from "./thumbs.module.css";

/* Short-hands for the flat-block vocabulary every mock is drawn with. */
const v = (name: string) => `var(--t-${name})`;
const Abs = ({ style, className }: { style: CSSProperties; className?: string }) => (
  <div className={className ? `${s.abs} ${className}` : s.abs} style={style} />
);
const Bar = ({ w, bg, h }: { w?: string; bg?: string; h?: number }) => (
  <div className={s.bar} style={{ width: w, background: bg && v(bg), height: h }} />
);
const Word = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div className={`${s.word} ${s.abs}`} style={style}>
    {children}
  </div>
);

const thumbs: Record<ThumbId, () => ReactNode> = {
  "brand-a": () => (
    <>
      <Abs className={s.ink} style={{ inset: 0 }} />
      <Abs style={{ left: 16, right: 16, top: 20, height: 2, background: v("paper"), opacity: 0.45 }} />
      <Abs className={s.acc} style={{ right: 16, top: 36, width: 46, height: 46 }} />
      <Word style={{ left: 16, bottom: 14, fontSize: 62, lineHeight: 0.82, letterSpacing: 0, textTransform: "none", color: v("paper") }}>A2</Word>
    </>
  ),
  "brand-b": () => (
    <div className={s.col} style={{ height: "100%" }}>
      <div className={s.acc} style={{ height: "38%" }} />
      <div className={s.ink} style={{ height: "22%" }} />
      <div style={{ flex: 1, position: "relative" }}>
        <Abs className={s.ink} style={{ left: 14, top: 12, width: "34%", height: 2 }} />
        <Abs style={{ left: 14, top: 22, width: "58%", height: 2, background: v("line") }} />
        <Word style={{ left: 14, bottom: 12, fontSize: 13, letterSpacing: "0.14em" }}>Expo</Word>
      </div>
    </div>
  ),
  "brand-c": () => (
    <div style={{ display: "grid", gridTemplate: "1fr 1fr / 1fr 1fr", gap: 2, padding: 2, height: "100%" }}>
      <Cell>
        <div className={s.ink} style={{ width: 26, height: 26 }} />
      </Cell>
      <Cell gap={3}>
        <div className={s.ink} style={{ width: 8, height: 26 }} />
        <div className={s.acc} style={{ width: 8, height: 26 }} />
      </Cell>
      <Cell bg="acc">
        <div className={s.paper} style={{ width: 30, height: 4 }} />
      </Cell>
      <Cell>
        <span className={s.word} style={{ fontSize: 22, letterSpacing: 0 }}>
          W
        </span>
      </Cell>
    </div>
  ),
  "social-a": () => (
    <div className={s.row} style={{ gap: 6, padding: 12, height: "100%" }}>
      <div className={s.ink} style={{ flex: 1, position: "relative" }}>
        <Abs className={s.acc} style={{ left: 10, bottom: 10, width: 22, height: 22 }} />
      </div>
      <div className={s.acc} style={{ flex: 1, position: "relative" }}>
        <Abs className={s.paper} style={{ left: 10, right: 10, bottom: 10, height: 3 }} />
      </div>
      <div className={s.boxed} style={{ flex: 1, position: "relative" }}>
        <Word style={{ left: 10, top: 10, fontSize: 20, letterSpacing: 0 }}>60%</Word>
      </div>
    </div>
  ),
  "social-b": () => (
    <div className={s.row} style={{ gap: 8, padding: 12, height: "100%" }}>
      <div className={s.boxed} style={{ width: "46%", position: "relative" }}>
        <Abs className={s.ink} style={{ left: 0, right: 0, top: 0, height: "58%" }} />
        <Abs style={{ left: 8, right: 22, bottom: 20, height: 3, background: v("line") }} />
        <Abs style={{ left: 8, right: 40, bottom: 11, height: 3, background: v("line") }} />
      </div>
      <div className={s.col} style={{ flex: 1, justifyContent: "center", gap: 7 }}>
        <Bar bg="ink" />
        <Bar w="72%" />
        <div className={s.acc} style={{ height: 14, width: 46 }} />
      </div>
    </div>
  ),
  "social-c": () => (
    <div className={s.acc} style={{ position: "absolute", inset: 0 }}>
      <Abs style={{ left: 14, top: 12, right: 14, height: 2, background: v("paper"), opacity: 0.6 }} />
      <Word style={{ left: 14, bottom: 12, fontSize: 40, lineHeight: 0.9, letterSpacing: 0, color: v("paper") }}>
        CTR
        <br />
        +80%
      </Word>
      <Abs className={s.ink} style={{ right: 14, bottom: 14, width: 34, height: 24 }} />
    </div>
  ),
  "uiux-a": () => (
    <div className={s.col} style={{ padding: 14, gap: 8, height: "100%" }}>
      <div className={s.row} style={{ gap: 6, alignItems: "center" }}>
        <div className={s.acc} style={{ width: 14, height: 14 }} />
        <div style={{ flex: 1, height: 2, background: v("line") }} />
      </div>
      <div className={s.row} style={{ flex: 1, gap: 8 }}>
        <div className={`${s.boxed} ${s.col}`} style={{ width: "26%", gap: 6, padding: 8 }}>
          <Bar bg="ink" />
          <Bar />
          <Bar />
        </div>
        <div className={s.col} style={{ flex: 1, gap: 8 }}>
          <div className={s.ink} style={{ flex: 1 }} />
          <div className={s.boxed} style={{ height: "34%" }} />
        </div>
      </div>
      <div className={s.acc} style={{ height: 20, width: 62 }} />
    </div>
  ),
  "uiux-b": () => (
    <div className={s.col} style={{ padding: 14, gap: 10, height: "100%" }}>
      <div className={s.row} style={{ alignItems: "flex-end", gap: 6, height: "46%" }}>
        {(
          [
            ["40%", "line"],
            ["66%", "mid"],
            ["100%", "acc"],
            ["54%", "mid"],
            ["78%", "ink"],
          ] as const
        ).map(([h, c]) => (
          <div key={h} style={{ flex: 1, height: h, background: v(c) }} />
        ))}
      </div>
      <div className={s.ink} style={{ height: 2 }} />
      <div className={s.col} style={{ gap: 7 }}>
        {["90%", "76%", "84%", "60%"].map((w) => (
          <Bar key={w} w={w} />
        ))}
      </div>
    </div>
  ),
  "uiux-c": () => (
    <div className={s.col} style={{ padding: 14, gap: 8, height: "100%" }}>
      <div className={s.ink} style={{ height: "38%", position: "relative" }}>
        <Abs className={s.paper} style={{ left: 10, top: 12, width: "56%", height: 4 }} />
        <Abs style={{ left: 10, top: 24, width: "34%", height: 3, background: v("mid") }} />
        <Abs className={s.acc} style={{ left: 10, bottom: 10, width: 48, height: 16 }} />
      </div>
      <div className={s.row} style={{ gap: 6, flex: 1 }}>
        <div className={s.boxed} style={{ flex: 1 }} />
        <div className={s.boxed} style={{ flex: 1 }} />
        <div className={s.boxed} style={{ flex: 1 }} />
      </div>
      <div style={{ height: 2, background: v("line") }} />
    </div>
  ),
  "deck-a": () => (
    <div className={s.col} style={{ padding: 16, gap: 10, height: "100%" }}>
      <div className={s.row} style={{ alignItems: "baseline", gap: 8 }}>
        <div className={s.acc} style={{ width: 28, height: 6 }} />
        <span className={s.word} style={{ fontSize: 15, letterSpacing: "0.1em" }}>
          BFSI
        </span>
      </div>
      <div className={s.word} style={{ fontSize: 26, lineHeight: 1.05, maxWidth: "80%", letterSpacing: 0, textTransform: "none" }}>
        Quarterly review, built on a grid
      </div>
      <div className={s.row} style={{ flex: 1, gap: 10 }}>
        <div className={s.col} style={{ flex: 1, gap: 5 }}>
          <Bar />
          <Bar />
          <Bar w="70%" />
        </div>
        <div className={s.ink} style={{ flex: 1 }} />
      </div>
    </div>
  ),
  "deck-b": () => (
    <div className={s.row} style={{ padding: 16, gap: 10, height: "100%" }}>
      <div className={s.col} style={{ flex: 1, gap: 5 }}>
        <Bar bg="ink" h={8} />
        <Bar />
        <Bar />
        <Bar />
        <Bar w="60%" />
        <div className={s.acc} style={{ height: 3, width: "40%", marginTop: 4 }} />
      </div>
      <div style={{ width: 1, background: v("line") }} />
      <div className={s.col} style={{ flex: 1, gap: 5 }}>
        <Bar />
        <Bar />
        <Bar w="80%" />
        <div style={{ height: 22, background: v("line"), marginTop: 4 }} />
      </div>
    </div>
  ),
  "print-a": () => (
    <div className={s.row} style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
      <div className={`${s.boxed} ${s.col}`} style={{ width: "54%", height: "78%" }}>
        <div className={s.acc} style={{ height: "26%" }} />
        <div className={s.col} style={{ flex: 1, padding: 8, gap: 5 }}>
          <Bar bg="ink" w="80%" />
          <Bar w="55%" />
          <div style={{ flex: 1 }} />
          <div className={s.ink} style={{ height: 12, width: "60%" }} />
        </div>
      </div>
    </div>
  ),
  "print-b": () => (
    <div className={`${s.col} ${s.paper}`} style={{ padding: 12, gap: 4, height: "100%" }}>
      <div className={s.ink} style={{ height: 6 }} />
      <div className={s.row} style={{ gap: 6, flex: 1 }}>
        <div className={s.col} style={{ flex: 1, gap: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Bar key={i} h={2} />
          ))}
        </div>
        <div className={`${s.acc} ${s.row}`} style={{ width: "42%", alignItems: "flex-end", padding: 6 }}>
          <span className={s.word} style={{ fontSize: 12, letterSpacing: "0.06em", color: v("paper") }}>
            1,000+
          </span>
        </div>
      </div>
      <div className={s.row} style={{ gap: 4 }}>
        <Bar h={2} w="50%" />
        <Bar h={2} w="50%" />
      </div>
    </div>
  ),
  "print-c": () => (
    <div className={s.row} style={{ padding: 14, height: "100%" }}>
      <div style={{ width: 8, background: v("soft") }} />
      <div className={s.ink} style={{ flex: 1, position: "relative", padding: 12 }}>
        <Abs className={s.acc} style={{ left: 0, top: "34%", width: "100%", height: 8 }} />
        <div className={s.word} style={{ position: "relative", fontSize: 15, lineHeight: 1.1, letterSpacing: "0.04em", color: v("paper") }}>
          COVER
          <br />
          STUDY
        </div>
        <Abs style={{ left: 12, bottom: 12, width: "40%", height: 2, background: v("mid") }} />
      </div>
    </div>
  ),
  "illus-a": () => (
    <>
      <Abs className={s.ink} style={{ left: "12%", top: "14%", width: "44%", height: "52%" }} />
      <Abs className={s.acc} style={{ left: "38%", top: "40%", width: "40%", height: "44%" }} />
      <Abs className={s.ink} style={{ left: 0, right: 0, top: "62%", height: 2 }} />
      <Abs style={{ left: "24%", top: 0, bottom: 0, width: 2, background: v("mid") }} />
      <Word style={{ right: 12, bottom: 10, fontSize: 13 }}>Study 04</Word>
    </>
  ),
  atta: () => (
    <div className={s.row} style={{ height: "100%", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>
      <div className={`${s.boxed} ${s.col}`} style={{ width: "50%", height: "80%" }}>
        <div style={{ height: 8, background: v("line") }} />
        <div className={s.col} style={{ padding: 8, gap: 4 }}>
          <Bar bg="ink" h={4} w="70%" />
          <Bar h={2} w="45%" />
        </div>
        <div className={`${s.acc} ${s.row}`} style={{ flex: 1, margin: "0 8px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "34%", aspectRatio: 1, borderRadius: "50%", border: `2px solid ${v("paper")}` }} />
        </div>
        <div className={s.row} style={{ height: "22%", gap: 3, padding: "6px 8px" }}>
          <div style={{ flex: 1, background: v("line") }} />
          <div style={{ flex: 1, background: v("soft") }} />
          <div style={{ flex: 1, background: v("line") }} />
        </div>
      </div>
    </div>
  ),
  oat: () => (
    <div className={s.row} style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
      <div className={s.row} style={{ width: "74%", height: "50%" }}>
        <div className={s.ink} style={{ flex: 1, position: "relative", padding: 10 }}>
          <div className={s.word} style={{ fontSize: 13, lineHeight: 1.05, letterSpacing: "0.04em", color: v("paper") }}>
            OAT
            <br />
            COOKIES
          </div>
          <div className={`${s.abs} ${s.row}`} style={{ right: 10, bottom: 10, gap: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: v("soft") }} />
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: v("line") }} />
          </div>
        </div>
        <div className={s.acc} style={{ width: "22%" }} />
      </div>
    </div>
  ),
  calendar: () => (
    <div className={s.row} style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
      <div className={`${s.boxed} ${s.col}`} style={{ width: "56%", height: "82%" }}>
        <div className={`${s.acc} ${s.row}`} style={{ height: "34%", padding: 8, alignItems: "flex-end" }}>
          <span className={s.word} style={{ fontSize: 14, letterSpacing: "0.04em", color: v("paper") }}>
            2025
          </span>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, padding: 8 }}>
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} style={{ background: v(i === 12 ? "ink" : "line") }} />
          ))}
        </div>
      </div>
    </div>
  ),
  ai: () => (
    <div className={s.col} style={{ padding: 16, height: "100%", justifyContent: "space-between" }}>
      <div className={s.row} style={{ flexWrap: "wrap", gap: 6, alignContent: "flex-start" }}>
        {aiStack.map((t) => (
          <span key={t} className={s.tag}>
            {t}
          </span>
        ))}
      </div>
      <div className={s.row} style={{ alignItems: "flex-end", gap: 10 }}>
        <span className={s.word} style={{ fontSize: 46, lineHeight: 0.9, letterSpacing: 0, color: v("acc") }}>
          −40%
        </span>
        <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.55, paddingBottom: 6 }}>
          turnaround
          <br />
          time
        </span>
      </div>
    </div>
  ),
};

function Cell({ children, bg = "paper", gap }: { children: ReactNode; bg?: string; gap?: number }) {
  return (
    <div className={s.row} style={{ background: v(bg), alignItems: "center", justifyContent: "center", gap }}>
      {children}
    </div>
  );
}

/** Mock artwork for a frame, keyed by content ThumbId. */
export function Thumb({ id }: { id: ThumbId }) {
  return (
    <div className={s.thumb} aria-hidden>
      {thumbs[id]()}
    </div>
  );
}
