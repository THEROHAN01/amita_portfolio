const RGB = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?/;

function toHex(css: string): string | null {
  const m = RGB.exec(css);
  if (!m) return null;
  const alpha = m[4] === undefined ? 1 : parseFloat(m[4]) / (m[4].endsWith("%") ? 100 : 1);
  if (alpha === 0) return null;
  return "#" + [m[1], m[2], m[3]].map((c) => Math.round(+c).toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Eyedropper: the first opaque background colour from `el` up to (not including) `stop`. */
export function sampleColor(el: Element | null, stop: Element | null): string | null {
  for (let n = el; n && n !== stop; n = n.parentElement) {
    const hex = toHex(getComputedStyle(n).backgroundColor);
    if (hex) return hex;
  }
  return null;
}
