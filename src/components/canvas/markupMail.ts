import { profile } from "@/content/profile";
import type { Camera } from "./camera";
import { markupLabel, plural, type MarkupObject } from "./state";

const anchorOf = (o: MarkupObject) => ("pts" in o ? o.pts[0] : { x: o.x, y: o.y });

/**
 * Turns the visitor's markup into a mailto: draft that says which artboards
 * were annotated — there is no backend, so the visitor's mail client delivers it.
 */
export function buildMarkupMail(objs: MarkupObject[], camera: Camera): string {
  const boards = Array.from(camera.world?.querySelectorAll<HTMLElement>("[data-artboard]") ?? [])
    .filter((b) => b.offsetParent !== null)
    .map((b) => ({ title: b.dataset.title ?? "Artboard", rect: camera.rectOf(b) }));

  const lines = objs.map((o) => {
    const p = anchorOf(o);
    const hit = boards.find(({ rect: r }) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
    return `• ${markupLabel(o)} — ${hit ? `on “${hit.title}”` : "on the open canvas"}`;
  });

  const subject = `Portfolio feedback: ${plural(objs.length, "comment")}`;
  const body = `Hi Amita,\n\nI left markup on your portfolio canvas:\n\n${lines.join("\n")}\n\n`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
