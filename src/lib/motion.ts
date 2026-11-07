// Motion helpers shared by the jar and dialogs; all honor "reduce motion".

/** True when the device asks for less motion. */
export const reduced = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Duration scaled to 0 under reduced motion. */
export const ms = (n: number): number => (reduced() ? 0 : n);

export interface Target { x: number; y: number; size: number; rot: number }

/** Flies a star from a tapped tile to its slot in the jar along an arc. */
export async function fly(from: Element, to: Target): Promise<void> {
  if (reduced()) return;
  const r = from.getBoundingClientRect();
  const sx = r.left + r.width / 2;
  const sy = r.top + r.height / 2;
  const peak = Math.min(sy, to.y) - Math.max(80, Math.abs(sx - to.x) * 0.35);
  const el = document.createElement('div');
  el.className = 'flyer';
  el.style.offsetPath = `path("M ${sx} ${sy} Q ${(sx + to.x) / 2} ${peak} ${to.x} ${to.y}")`;
  const star = starSvg();
  el.append(star);
  document.body.append(el);
  // Path on the outer box, spin + size on the star: on one element rotate/scale would bend the path.
  const timing = { duration: 780, easing: 'cubic-bezier(.4,.1,.35,1)', fill: 'forwards' } as const;
  await Promise.all([
    el.animate([{ offsetDistance: '0%' }, { offsetDistance: '100%' }], timing).finished,
    star.animate(
      [
        { scale: 0.5, rotate: '0deg', opacity: 0.6 },
        { scale: 1.35, rotate: '200deg', opacity: 1, offset: 0.55 },
        { scale: to.size / 56, rotate: `${360 + to.rot}deg`, opacity: 1 },
      ],
      timing,
    ).finished,
  ]).finally(() => el.remove());
}

/** A star icon that reuses the shared #star path and #gold gradient. */
export function starSvg(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '-1.15 -1.15 2.3 2.3');
  const use = document.createElementNS(ns, 'use');
  use.setAttribute('href', '#star');
  svg.append(use);
  return svg;
}
