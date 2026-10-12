import Image from "next/image";
import type { ReactNode } from "react";
import portrait from "@/assets/avatar/avatar.png";
import irisL from "@/assets/avatar/iris-l.png";
import irisR from "@/assets/avatar/iris-r.png";
import lidL from "@/assets/avatar/lid-l.png";
import lidR from "@/assets/avatar/lid-r.png";
import s from "./avatar.module.css";

interface AvatarProps {
  /** Sizing/positioning class from the caller; the avatar keeps its own aspect ratio. */
  className?: string;
  /** `sizes` hint for the portrait — match the rendered width. */
  sizes: string;
  /** Preload when the avatar is the LCP element. */
  preload?: boolean;
  /** Extra layers drawn over the portrait (e.g. the sleep "zzz"). */
  children?: ReactNode;
}

/**
 * The 3D portrait with separately layered irises and eyelids. Markup only —
 * the shared gaze engine (./gaze) moves every `[data-pupil]` and toggles
 * `[data-lid]` / `[data-zzz]`, so any number of avatars stay in sync with one loop.
 */
export function Avatar({ className, sizes, preload, children }: AvatarProps) {
  return (
    <div data-avatar="" role="img" aria-label="Amita Hendre" className={className ? `${s.avatar} ${className}` : s.avatar}>
      <Image src={portrait} alt="" fill sizes={sizes} preload={preload} draggable={false} className={s.layer} />
      <div className={`${s.eye} ${s.eyeL}`}>
        <Image data-pupil="" src={irisL} alt="" draggable={false} className={`${s.iris} ${s.irisL}`} />
      </div>
      <div className={`${s.eye} ${s.eyeR}`}>
        <Image data-pupil="" src={irisR} alt="" draggable={false} className={`${s.iris} ${s.irisR}`} />
      </div>
      <Image data-lid="" src={lidL} alt="" draggable={false} className={`${s.lid} ${s.lidL}`} />
      <Image data-lid="" src={lidR} alt="" draggable={false} className={`${s.lid} ${s.lidR}`} />
      {children}
    </div>
  );
}

/** Drifting "z z Z" shown while the avatar sleeps. */
export function Zzz() {
  return (
    <div data-zzz="" className={s.zzz} aria-hidden>
      <span data-z="" style={{ fontSize: "7cqw" }}>
        z
      </span>
      <span data-z="" style={{ fontSize: "9cqw" }}>
        z
      </span>
      <span data-z="" style={{ fontSize: "11cqw" }}>
        Z
      </span>
    </div>
  );
}
