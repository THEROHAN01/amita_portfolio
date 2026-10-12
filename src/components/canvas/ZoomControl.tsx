"use client";

import { useCallback } from "react";
import { useCanvas } from "./context";
import s from "./zoom.module.css";

export function ZoomControl() {
  const { camera, actions } = useCanvas();
  const labelRef = useCallback((el: HTMLSpanElement | null) => camera.bindZoomLabel(el), [camera]);
  return (
    <div data-guide="zoom" className={s.zoom}>
      <button type="button" className={s.step} aria-label="Zoom out" onClick={() => camera.zoomBy(0.8)}>
        −
      </button>
      {/* Text is written by the camera on every move — never through React. */}
      <span ref={labelRef} className={s.value} aria-live="off">
        100%
      </span>
      <button type="button" className={s.step} aria-label="Zoom in" onClick={() => camera.zoomBy(1.25)}>
        +
      </button>
      <button type="button" className={s.fit} onClick={actions.fitAll}>
        Fit
      </button>
    </div>
  );
}
