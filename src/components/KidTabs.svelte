<script lang="ts">
  import { act, app } from '../lib/app.svelte.ts';
  import { setCurrent } from '../lib/jar.ts';
  import { t } from '../lib/i18n.svelte.ts';

  // One tab per kid: one tap shows that kid's jar.
</script>

<nav class="kids" aria-label={t('kids')}>
  {#each app.s.kids as k (k.id)}
    <button class="kid" aria-pressed={k.id === app.s.current} onclick={() => act(setCurrent, k.id)}>
      <span class="emoji" aria-hidden="true">{k.emoji}</span>
      <span class="name">{k.name}</span>
    </button>
  {/each}
</nav>

<style>
  .kids {
    display: flex;
    gap: 0.5rem;
    min-inline-size: 0;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    padding-block: 0.25rem;
  }
  .kid {
    flex: none;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-block-size: 3.25rem;
    padding-block: 0;
    padding-inline: 0.5rem 1rem;
    border: 2px solid transparent;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.14);
    color: var(--text);
    font-weight: 900;
    font-size: 1.15rem;
    cursor: pointer;
    scroll-snap-align: start;
    transition: background 150ms ease, transform 150ms ease;
  }
  .kid[aria-pressed='true'] {
    border-color: var(--gold);
    background: rgb(255 213 74 / 0.2);
  }
  .kid:active {
    transform: scale(0.96);
  }
  .kid:focus-visible {
    outline: 3px solid var(--gold);
    outline-offset: 2px;
  }
  .emoji {
    font-size: 1.8rem;
  }
  .name {
    max-inline-size: 9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
