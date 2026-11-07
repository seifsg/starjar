// Tiny synthesized sounds (no audio files, nothing downloaded): star chime, landing plink, fanfare.

let ctx: AudioContext | undefined;

/** One shared AudioContext, created on the first tap (browsers require a gesture). */
function audio(): AudioContext {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** One soft note: quick attack, exponential fade. */
function note(freq: number, at: number, length: number, volume = 0.16, type: OscillatorType = 'triangle'): void {
  if (!(navigator.userActivation?.hasBeenActive ?? true)) return; // e.g. a full jar on reload: no tap yet
  const c = audio();
  const start = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

/** Sparkle when a star is earned (notes A5, E6, A6). */
export const chime = (): void => [880, 1318.5, 1760].forEach((f, i) => note(f, i * 0.07, 0.4));

/** Soft plink when the star lands in the jar. */
export const plink = (): void => note(1046.5, 0, 0.18, 0.1, 'sine');

/** Rising fanfare for a full jar (C5 E5 G5 C6). */
export const fanfare = (): void =>
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, i * 0.13, i === 3 ? 0.9 : 0.3, 0.18));
