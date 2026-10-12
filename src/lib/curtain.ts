import { reducedMotion } from "./motion";

const DURATION = 1760;
const STAGGER = 90;
const EASE = "cubic-bezier(.76,0,.24,1)";
const PANEL_COLOURS = ["var(--color-text)", "var(--color-muted)", "var(--color-accent)"];

/**
 * Three stacked panels sweep down over `host`, hold on a label, then reveal.
 * `onCovered` fires while the screen is fully covered — swap content there.
 * Pure compositor animations (WAAPI), so a React commit underneath can't stall it.
 */
export function runCurtain(host: HTMLElement, label: string, onCovered: () => void) {
  if (reducedMotion()) {
    onCovered();
    return;
  }
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = "position:absolute;inset:0;z-index:500;pointer-events:none;overflow:hidden;";

  const panels = PANEL_COLOURS.map((bg) => {
    const p = document.createElement("div");
    p.style.cssText = `position:absolute;inset:0;background:${bg};transform:translateY(-101%);will-change:transform;`;
    wrap.appendChild(p);
    return p;
  });

  const text = document.createElement("span");
  text.textContent = label;
  text.style.cssText =
    "position:absolute;left:0;right:0;top:50%;text-align:center;font-family:var(--font-heading);font-weight:800;" +
    "font-size:clamp(40px,7vw,108px);letter-spacing:-.03em;text-transform:uppercase;color:var(--color-on-accent);opacity:0;";
  panels[2].appendChild(text);
  host.appendChild(wrap);

  const sweeps = panels.map((p, i) =>
    p.animate(
      [
        { transform: "translateY(-101%)", offset: 0, easing: EASE },
        { transform: "translateY(0)", offset: 0.33, easing: "linear" },
        { transform: "translateY(0)", offset: 0.62, easing: EASE },
        { transform: "translateY(101%)", offset: 1 },
      ],
      { duration: DURATION, delay: i * STAGGER, fill: "both" },
    ),
  );
  text.animate(
    [
      { opacity: 0, transform: "translateY(14px)", offset: 0 },
      { opacity: 1, transform: "translateY(-.5em)", offset: 0.28 },
      { opacity: 1, transform: "translateY(-.5em)", offset: 0.58 },
      { opacity: 0, transform: "translateY(-1.1em)", offset: 0.74 },
      { opacity: 0, transform: "translateY(-1.1em)", offset: 1 },
    ],
    { duration: DURATION, easing: "ease", fill: "both" },
  );

  setTimeout(onCovered, DURATION * 0.45);
  sweeps[sweeps.length - 1].finished.then(() => wrap.remove(), () => wrap.remove());
}
