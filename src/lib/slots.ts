// Where each star sits inside the jar, so the pile looks the same after every reload.
// Coordinates are in the jar's SVG viewBox (0 0 200 260); stars fill from the bottom.

export interface Slot { x: number; y: number; rot: number; size: number }

const INNER = { left: 26, right: 174, top: 62, bottom: 240 } as const;

/** Seeded 0..1 noise for index i (mulberry32 step): stable, no state. */
function noise(i: number): number {
  let t = (i + 1) * 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** One slot per star for a jar of `goal` stars, bottom row first. */
export function slots(goal: number): Slot[] {
  const w = INNER.right - INNER.left;
  const h = INNER.bottom - INNER.top;
  const cols = Math.max(1, Math.round(Math.sqrt((goal * w) / h)));
  const rows = Math.ceil(goal / cols);
  const cw = w / cols;
  const ch = h / rows;
  const size = Math.min(cw, ch) * 0.86;
  return Array.from({ length: goal }, (_, i) => {
    const row = Math.floor(i / cols);
    const shift = (row % 2 ? 0.18 : -0.18) * cw;
    return {
      x: INNER.left + cw * ((i % cols) + 0.5) + shift * (cols > 1 ? 1 : 0) + (noise(i) - 0.5) * cw * 0.16,
      y: INNER.bottom - ch * (row + 0.5) + (noise(i + 97) - 0.5) * ch * 0.14,
      rot: (noise(i + 211) - 0.5) * 50,
      size: size * (0.88 + noise(i + 331) * 0.16),
    };
  });
}
