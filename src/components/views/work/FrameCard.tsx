import Image from "next/image";
import { metaAttrs } from "@/components/ui/meta";
import type { WorkBoard, WorkFrame } from "@/content/types";
import { Thumb } from "./Thumb";
import s from "./work.module.css";

interface FrameCardProps {
  frame: WorkFrame;
  layout: WorkBoard["frameLayout"];
}

/** A project frame inside a work artboard: artwork (real or mock) plus caption. */
export function FrameCard({ frame, layout }: FrameCardProps) {
  const { id, name, caption, image, link, thumb } = frame;
  return (
    <article data-frame={id} {...metaAttrs({ kind: "Frame", ...frame })} className={`${s.frame} ${s[layout]}`}>
      {image ? (
        <div className={s.photo}>
          <Image src={image} alt={frame.title} fill sizes="600px" className={s.photoImg} />
        </div>
      ) : (
        <Thumb id={thumb} />
      )}
      <div className={s.caption}>
        <div className={s.name}>{name}</div>
        {link ? (
          <div className={s.metaRow}>
            <span className={s.metaMuted}>{caption}</span>
            <a href={link.href} target="_blank" rel="noopener" className={s.link}>
              {link.label}
            </a>
          </div>
        ) : (
          <div className={s.meta}>{caption}</div>
        )}
      </div>
    </article>
  );
}
