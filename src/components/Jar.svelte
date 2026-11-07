<script lang="ts">
  import { slots } from '../lib/slots.ts';
  import { ms, type Target } from '../lib/motion.ts';

  // The glass jar and its stars; `shown` lags `goal` stars while one is flying in.
  let { goal, shown }: { goal: number; shown: number } = $props();

  let svg: SVGSVGElement;
  const spots = $derived(slots(goal));

  /** Screen position and size of star slot i, for the flight animation. */
  export function target(i: number): Target {
    const s = spots[Math.min(i, spots.length - 1)]!;
    const m = svg.getScreenCTM();
    if (!m) throw new Error('Starjar: jar is not rendered');
    const p = new DOMPoint(s.x, s.y).matrixTransform(m);
    return { x: p.x, y: p.y, size: s.size * m.a, rot: s.rot };
  }

  /** Squash-and-settle landing for a new star. */
  function land(_: Element) {
    return {
      duration: ms(520),
      css: (t: number) => {
        const k = 1 + Math.sin(t * Math.PI) * 0.35 * (1 - t);
        return `transform: scale(${k}, ${2 - k}); opacity: ${Math.min(1, t * 3)}`;
      },
    };
  }
</script>

<svg class="jar" viewBox="0 0 200 260" bind:this={svg} aria-hidden="true">
  <defs>
    <clipPath id="jar-inside"><rect x="20" y="52" width="160" height="196" rx="40" /></clipPath>
    <radialGradient id="jar-glow" cx="50%" cy="70%" r="65%">
      <stop offset="0" stop-color="#ffd54a" stop-opacity={Math.min(0.55, shown / goal)} />
      <stop offset="1" stop-color="#ffd54a" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect x="14" y="44" width="172" height="210" rx="46" fill="url(#jar-glow)" />
  <rect class="glass" x="14" y="44" width="172" height="210" rx="46" />
  <path class="shine" d="M38 92 v96" />
  <path class="shine small" d="M38 204 v12" />
  <g clip-path="url(#jar-inside)" class="pile">
    {#each spots.slice(0, shown) as s, i (i)}
      <g transform="translate({s.x} {s.y}) rotate({s.rot}) scale({s.size / 2})">
        <use href="#star" in:land class="star" />
      </g>
    {/each}
  </g>
  <rect class="rim" x="40" y="34" width="120" height="16" rx="8" />
  <rect class="lid" x="50" y="12" width="100" height="26" rx="10" />
</svg>

<style>
  .jar {
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 18px 30px rgb(0 0 0 / 0.35));
  }
  .glass {
    fill: rgb(255 255 255 / 0.1);
    stroke: rgb(255 255 255 / 0.75);
    stroke-width: 5;
  }
  .rim {
    fill: rgb(255 255 255 / 0.85);
  }
  .lid {
    fill: url(#lid);
  }
  .shine {
    stroke: rgb(255 255 255 / 0.5);
    stroke-width: 8;
    stroke-linecap: round;
  }
  .shine.small {
    stroke-width: 8;
    opacity: 0.6;
  }
  .pile {
    filter: drop-shadow(0 0 6px rgb(255 213 74 / 0.55));
  }
  .star {
    transform-origin: 0 0;
  }
</style>
