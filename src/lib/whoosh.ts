/**
 * A synthesized "whoosh" (filtered noise sweep) — no audio file to download.
 *
 * Browsers block audio until the visitor has interacted with the page, so on a
 * fresh load this usually stays silent. If the AudioContext is not allowed to
 * run, we give up quietly rather than queueing sound for later.
 */
export async function playWhoosh(duration = 0.7, volume = 0.22): Promise<void> {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  try {
    if (ctx.state !== "running") await ctx.resume();
  } catch {
    // Autoplay policy refused — fall through to the state check.
  }
  if (ctx.state !== "running") {
    void ctx.close();
    return;
  }

  const t0 = ctx.currentTime;
  const len = Math.ceil(ctx.sampleRate * duration);

  // White noise source.
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Band-pass sweeping upward reads as something rising past you.
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.9;
  band.frequency.setValueAtTime(260, t0);
  band.frequency.exponentialRampToValueAtTime(2400, t0 + duration * 0.55);
  band.frequency.exponentialRampToValueAtTime(900, t0 + duration);

  // Swell in, peak around the moment the portrait settles, then fade.
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + duration * 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  noise.connect(band).connect(gain).connect(ctx.destination);
  noise.start(t0);
  noise.stop(t0 + duration);
  noise.onended = () => void ctx.close();
}
