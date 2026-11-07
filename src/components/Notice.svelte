<script lang="ts">
  import { fly } from 'svelte/transition';
  import { app } from '../lib/app.svelte.ts';
  import { t } from '../lib/i18n.svelte.ts';
  import { ms } from '../lib/motion.ts';

  // One-line status for storage problems; hides itself after a few seconds.
  $effect(() => {
    if (!app.notice) return;
    const timer = setTimeout(() => (app.notice = ''), 6000);
    return () => clearTimeout(timer);
  });
</script>

<div class="slot" role="status" aria-live="polite">
  {#if app.notice}
    <p transition:fly={{ y: 30, duration: ms(250) }}>{t(app.notice)}</p>
  {/if}
</div>

<style>
  .slot {
    position: fixed;
    inset-inline: 1rem;
    inset-block-end: calc(1rem + env(safe-area-inset-bottom));
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 30;
  }
  p {
    margin: 0;
    padding: 0.8rem 1.1rem;
    border-radius: 1rem;
    background: #fff8e7;
    color: var(--ink);
    font-weight: 700;
    box-shadow: 0 10px 30px rgb(0 0 0 / 0.35);
  }
</style>
