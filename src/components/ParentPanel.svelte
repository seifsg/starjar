<script lang="ts">
  import { act, app } from '../lib/app.svelte.ts';
  import { addKid, LIMITS, removeKid, removeStar, setCurrent, setSound, updateKid, type KidInput } from '../lib/jar.ts';
  import { num, t } from '../lib/i18n.svelte.ts';
  import KidForm from './KidForm.svelte';
  import TaskEditor from './TaskEditor.svelte';
  import LangPicker from './LangPicker.svelte';
  import { install } from '../lib/install.svelte.ts';

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

  let adding = $state(false);
  let confirming = $state(false);
  const fresh: KidInput = { name: '', emoji: '🐼', reward: '', goal: 10 };
  const add = (v: KidInput): void => {
    act(addKid, v);
    adding = false;
  };
  const pick = (id: string): void => {
    act(setCurrent, id);
    confirming = false;
  };
</script>

<dialog bind:this={dlg} class="panel" aria-labelledby="panel-title" onclose={onclose}>
  <div class="sheet wide">
    <header class="bar">
      <h2 id="panel-title"><span aria-hidden="true">⚙️</span> {t('grownUps')}</h2>
      <button class="btn round" aria-label={t('close')} onclick={onclose}>✕</button>
    </header>

    {#if open && kid}
      <section class="box" aria-labelledby="kids-title">
        <h3 id="kids-title">{t('kids')}</h3>
        <div class="chips">
          {#each app.s.kids as k (k.id)}
            <button class="btn ghost" aria-pressed={k.id === kid.id} onclick={() => pick(k.id)}>{k.emoji} {k.name}</button>
          {/each}
          {#if app.s.kids.length < LIMITS.kidsMax}
            <button class="btn ghost" aria-expanded={adding} onclick={() => (adding = !adding)}>＋ {t('addKid')}</button>
          {/if}
        </div>
        {#if adding}<KidForm value={fresh} submit={t('addKid')} onsave={add} />{/if}
      </section>

      <section class="box" aria-labelledby="kid-title">
        <h3 id="kid-title">{kid.emoji} {kid.name}</h3>
        <KidForm value={{ name: kid.name, emoji: kid.emoji, reward: kid.reward, goal: kid.goal }} submit={t('save')} onsave={save} />
        <div class="undo">
          <span>⭐ {num(kid.stars)} / {num(kid.goal)}</span>
          <button class="btn ghost" disabled={!kid.stars} onclick={() => act(removeStar, kid.id, app.today)}>
            ↩ {t('removeStar')}
          </button>
        </div>
        {#if app.s.kids.length > 1}
          <div class="undo">
            {#if confirming}
              <span role="alert">{t('confirmRemove', { name: kid.name })}</span>
              <span class="actions">
                <button class="btn ghost" onclick={() => (confirming = false)}>{t('cancel')}</button>
                <button class="btn danger" onclick={() => ((confirming = false), act(removeKid, kid.id))}>{t('removeKid')}</button>
              </span>
            {:else}
              <button class="btn ghost" onclick={() => (confirming = true)}>🗑️ {t('removeKid')}</button>
            {/if}
          </div>
        {/if}
      </section>

      <section class="box" aria-labelledby="tasks-title">
        <h3 id="tasks-title">{t('tasks')}</h3>
        <TaskEditor />
      </section>

      <section class="box" aria-label="{t('language')}, {t('sound')}">
        <LangPicker />
        <label class="switch">
          <input type="checkbox" checked={app.s.sound} onchange={(e) => act(setSound, e.currentTarget.checked)} />
          <span>🔔 {t('sound')}</span>
        </label>
        {#if install.ready}
          <button class="btn primary" onclick={install.run}>📲 {t('install')}</button>
        {/if}
        {#if !install.standalone}<p class="hint">{t('installHint')}</p>{/if}
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
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .chips [aria-pressed='true'] {
    outline: 2px solid var(--gold);
    background: rgb(255 213 74 / 0.2);
  }
  .danger {
    background: #ff6b81;
    color: var(--ink);
  }
  .switch {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    min-block-size: 3rem;
    font-weight: 800;
    cursor: pointer;
  }
  .switch input {
    inline-size: 1.6rem;
    block-size: 1.6rem;
    min-block-size: 0;
    accent-color: var(--gold);
  }
  .hint {
    margin: 0;
    color: var(--muted);
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
