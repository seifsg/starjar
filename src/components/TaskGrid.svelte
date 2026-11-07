<script lang="ts">
  import type { Kind, Task } from '../lib/jar.ts';
  import { t } from '../lib/i18n.svelte.ts';

  // Big candy tiles, one per chore or good deed; a tap asks for a star.
  let {
    tasks,
    done,
    locked,
    onpick,
  }: { tasks: Task[]; done: readonly string[]; locked: boolean; onpick: (id: string, tile: HTMLElement) => void } = $props();

  const groups = $derived(
    (['chore', 'deed'] as const satisfies readonly Kind[])
      .map((kind) => ({ kind, items: tasks.filter((x) => x.kind === kind) }))
      .filter((g) => g.items.length),
  );
</script>

{#each groups as g (g.kind)}
  <section class="group" aria-labelledby="h-{g.kind}">
    <h2 id="h-{g.kind}">{g.kind === 'chore' ? t('chores') : t('deeds')}</h2>
    <ul>
      {#each g.items as task, i (task.id)}
        {@const isDone = done.includes(task.id)}
        <li>
          <button
            class="tile c{i % 5}"
            class:done={isDone}
            disabled={isDone || locked}
            aria-label={isDone ? `${task.label}, ${t('doneToday')}` : t('starFor', { task: task.label })}
            onclick={(e) => onpick(task.id, e.currentTarget)}
          >
            <span class="emoji" aria-hidden="true">{task.emoji}</span>
            <span class="label">{task.label}</span>
            {#if isDone}<span class="check" aria-hidden="true">✓</span>{/if}
          </button>
        </li>
      {/each}
    </ul>
  </section>
{/each}

<style>
  .group + .group {
    margin-block-start: 1.25rem;
  }
  h2 {
    margin: 0 0 0.6rem;
    font-size: 1.05rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted);
  }
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 9.5rem), 1fr));
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    inline-size: 100%;
    min-block-size: 6.5rem;
    padding: 0.8rem 0.6rem;
    border: 0;
    border-radius: 1.4rem;
    background: var(--tile);
    color: var(--ink);
    font: inherit;
    font-weight: 800;
    font-size: 1.02rem;
    line-height: 1.15;
    text-align: center;
    cursor: pointer;
    box-shadow:
      0 6px 0 color-mix(in srgb, var(--tile) 62%, #000),
      0 12px 22px rgb(0 0 0 / 0.25);
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      filter 200ms ease;
    -webkit-tap-highlight-color: transparent;
  }
  .tile:active:not(:disabled) {
    transform: translateY(4px) scale(0.98);
    box-shadow:
      0 2px 0 color-mix(in srgb, var(--tile) 62%, #000),
      0 6px 12px rgb(0 0 0 / 0.25);
  }
  .tile:focus-visible {
    outline: 4px solid #fff;
    outline-offset: 3px;
  }
  .tile:disabled {
    cursor: default;
  }
  .tile.done {
    filter: saturate(0.35) brightness(0.8);
    transform: translateY(4px);
    box-shadow: 0 2px 0 color-mix(in srgb, var(--tile) 62%, #000);
  }
  .emoji {
    font-size: 2.3rem;
    line-height: 1;
  }
  .check {
    position: absolute;
    inset-block-start: 0.45rem;
    inset-inline-end: 0.55rem;
    display: grid;
    place-items: center;
    inline-size: 1.7rem;
    block-size: 1.7rem;
    border-radius: 50%;
    background: #fff;
    color: #1f9d6b;
    font-size: 1.05rem;
  }
  .c0 { --tile: #ff8a9a; }
  .c1 { --tile: #5fdcae; }
  .c2 { --tile: #6cc2ff; }
  .c3 { --tile: #ffd95e; }
  .c4 { --tile: #c3a2ff; }
</style>
