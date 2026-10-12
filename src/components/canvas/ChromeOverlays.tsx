"use client";

import { Check, Send, Trash2 } from "lucide-react";
import { useCanvas } from "./context";
import { DRAW_TOOLS } from "./state";
import s from "./overlays.module.css";

/** Transient chrome: the markup notice, the send/clear bar and toasts. */
export function ChromeOverlays() {
  const { state, dispatch, actions } = useCanvas();
  const showNotice = !state.noticeSeen && (DRAW_TOOLS.has(state.tool) || state.tool === "e");
  const hasObjs = state.objs.length > 0;

  return (
    <>
      {showNotice ? (
        <div className={s.notice} role="note">
          <div className={s.noticeTitle}>Markup is a comment</div>
          <p className={s.noticeBody}>
            Anything you draw here is a comment on this canvas — it is not saved to the portfolio. Send it to Amita as
            an email when you are done, or erase / clear the artboard to withdraw it.
          </p>
          <button type="button" className={s.gotIt} onClick={() => dispatch({ type: "noticeSeen" })}>
            Got it
          </button>
        </div>
      ) : null}

      <div className={s.dock}>
        {state.toast ? (
          <div className={s.toast} role="status">
            {state.toast.swatch ? (
              <span className={s.swatch} style={{ background: state.toast.swatch }} />
            ) : (
              <Check size={14} strokeWidth={3} className={s.tick} />
            )}
            {state.toast.text}
          </div>
        ) : null}
        {hasObjs ? (
          <div className={s.actions}>
            <button type="button" className={s.send} onClick={actions.sendMarkup}>
              <Send size={14} />
              Send
            </button>
            <button type="button" className={s.clear} onClick={() => dispatch({ type: "clear" })}>
              <Trash2 size={14} />
              Clear artboard
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
