type FrameCallback = (now: number) => void;

const subscribers = new Set<FrameCallback>();
let handle = 0;

function tick(now: number) {
  handle = requestAnimationFrame(tick);
  for (const cb of subscribers) cb(now);
}

/**
 * Subscribe to a single shared requestAnimationFrame loop. The loop only runs
 * while it has subscribers, so idle islands cost nothing.
 */
export function onFrame(cb: FrameCallback): () => void {
  subscribers.add(cb);
  if (!handle) handle = requestAnimationFrame(tick);
  return () => {
    subscribers.delete(cb);
    if (!subscribers.size && handle) {
      cancelAnimationFrame(handle);
      handle = 0;
    }
  };
}
