<script lang="ts">
  import { act, app } from '../lib/app.svelte.ts';
  import { removeStar, updateKid, type KidInput } from '../lib/jar.ts';
  import { num, t } from '../lib/i18n.svelte.ts';
  import KidForm from './KidForm.svelte';
  import TaskEditor from './TaskEditor.svelte';

  // Grown-ups' setup sheet, reached only through the gate.
  let { open, onclose }: { open: boolean; onclose: () => void } = $props();

  let dlg: HTMLDialogElement;
  $effect(() => {
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  });

  const kid = $derived(app.s.kids.find((k) => k.id === app.s.current));
  const save = (v: KidInput): void => {
    if (kid) act(updateKid, kid.id, v);
  };
</script>

<dialog bind:this={dlg} class="panel" aria-labelledby="panel-title" onclose={onclose}>
  <div class="sheet wide">
    <header class="bar">
      <h2 id="panel-title"><span aria-hidden="true">⚙️</span> {t('grownUps')}</h2>
      <button class="btn round" aria-label={t('close')} onclick={onclose}>✕</button>
    </header>

    {#if open && kid}
      <section class="box" aria-labelledby="kid-title">
        <h3 id="kid-title">{kid.emoji} {kid.name}</h3>
        <KidForm value={{ name: kid.name, emoji: kid.emoji, reward: kid.reward, goal: kid.goal }} submit={t('save')} onsave={save} />
        <div class="undo">
          <span>⭐ {num(kid.stars)} / {num(kid.goal)}</span>
          <button class="btn ghost" disabled={!kid.stars} onclick={() => act(removeStar, kid.id, app.today)}>
            ↩ {t('removeStar')}
          </button>
        </div>
      </section>

      <section class="box" aria-labelledby="tasks-title">
        <h3 id="tasks-title">{t('tasks')}</h3>
        <TaskEditor />
      </section>
    {/if}
  </div>
</dialog>

<style>
  .panel .sheet {
    max-block-size: calc(100dvh - 1rem);
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .bar {
    position: sticky;
    inset-block-start: -1.4rem;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: -1.4rem -1.4rem 0;
    padding: 1rem 1.4rem;
    background: #33237d;
    border-radius: 1.6rem 1.6rem 0 0;
  }
  .box {
    display: grid;
    gap: 0.9rem;
    padding: 1.1rem;
    border-radius: 1.2rem;
    background: rgb(0 0 0 / 0.16);
  }
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  .undo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    padding-block-start: 0.8rem;
    border-block-start: 1px dashed var(--line);
    font-weight: 800;
  }
</style>
