<script lang="ts">
  import { act, app } from './lib/app.svelte.ts';
  import { award, doneToday, isFull } from './lib/jar.ts';
  import { dir, num, plural, t } from './lib/i18n.svelte.ts';
  import { fly } from './lib/motion.ts';
  import Jar from './components/Jar.svelte';
  import TaskGrid from './components/TaskGrid.svelte';
  import Notice from './components/Notice.svelte';

  // Kid screen: the current kid's jar, status and task tiles.
  const kid = $derived(app.s.kids.find((k) => k.id === app.s.current));
  let flying = $state<Record<string, number>>({});
  let jar = $state<ReturnType<typeof Jar>>();
  const shown = $derived(kid ? kid.stars - (flying[kid.id] ?? 0) : 0);

  $effect(() => {
    document.documentElement.lang = app.s.lang;
    document.documentElement.dir = dir(app.s.lang);
  });

  /** Awards a star for a tapped tile and flies it into the jar. */
  async function pick(taskId: string, tile: HTMLElement): Promise<void> {
    if (!kid || !jar) return;
    const id = kid.id;
    const before = kid.stars;
    const after = act(award, id, taskId, app.today).kids.find((k) => k.id === id)?.stars ?? before;
    if (after === before) return;
    flying[id] = (flying[id] ?? 0) + 1;
    try {
      await fly(tile, jar.target(before));
    } finally {
      flying[id] = (flying[id] ?? 1) - 1;
    }
  }
</script>

<svg class="defs" width="0" height="0" aria-hidden="true">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff07a" />
      <stop offset="1" stop-color="#ffb11f" />
    </linearGradient>
    <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffc77d" />
      <stop offset="1" stop-color="#ff9d4d" />
    </linearGradient>
    <path
      id="star"
      d="M0-1 .25-.34.95-.31.4.13.59.81 0 .42-.59.81-.4.13-.95-.31-.25-.34Z"
      fill="url(#gold)"
      stroke="#fff3c4"
      stroke-width=".09"
      stroke-linejoin="round"
    />
  </defs>
</svg>

{#if kid}
  <div class="app">
    <header class="top">
      <h1 class="who"><span class="avatar" aria-hidden="true">{kid.emoji}</span>{kid.name}</h1>
    </header>

    <main class="stage">
      <section class="jar-side" aria-label={t('count', { n: kid.stars, goal: kid.goal })}>
        <div class="jar-box">
          <Jar bind:this={jar} goal={kid.goal} {shown} />
        </div>
        <p class="count" aria-hidden="true"><b>{num(shown)}</b><span>/ {num(kid.goal)}</span></p>
        <p class="to-go" aria-live="polite">
          <span aria-hidden="true">🎁</span>
          {isFull(kid) ? t('jarFull') : plural('toGo', kid.goal - kid.stars, { reward: kid.reward })}
        </p>
      </section>

      <section class="tasks-side">
        <TaskGrid tasks={app.s.tasks} done={doneToday(kid, app.today)} locked={isFull(kid)} onpick={pick} />
      </section>
    </main>
  </div>
{/if}

<Notice />

<style>
  .defs {
    position: absolute;
    inline-size: 0;
    block-size: 0;
  }
  .app {
    max-inline-size: 75rem;
    margin-inline: auto;
    padding:
      max(0.75rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
      max(1.5rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
  }
  .top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-block-size: 3.5rem;
  }
  .who {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.6rem;
  }
  .avatar {
    font-size: 2rem;
  }
  .stage {
    display: grid;
    gap: 1.25rem;
  }
  .jar-side {
    display: grid;
    justify-items: center;
    gap: 0.25rem;
  }
  .jar-box {
    block-size: clamp(14rem, 42dvh, 26rem);
    aspect-ratio: 200 / 260;
  }
  .count {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    margin: 0.25rem 0 0;
    font-weight: 900;
    font-size: 1.4rem;
    color: var(--muted);
  }
  .count b {
    font-size: 2.6rem;
    color: var(--gold);
    text-shadow: 0 0 18px rgb(255 213 74 / 0.6);
  }
  .to-go {
    margin: 0;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.12);
    font-weight: 800;
    text-align: center;
  }
  @media (min-width: 56rem) {
    .stage {
      grid-template-columns: minmax(20rem, 26rem) 1fr;
      align-items: start;
      gap: 2.5rem;
    }
    .jar-side {
      position: sticky;
      inset-block-start: 1rem;
    }
    .jar-box {
      block-size: min(62dvh, 32rem);
    }
  }
</style>
