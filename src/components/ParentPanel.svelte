<script lang="ts">
  import { t } from '../lib/i18n.svelte.ts';

  // Grown-ups' setup sheet, reached only through the gate.
  let { open, onclose }: { open: boolean; onclose: () => void } = $props();

  let dlg: HTMLDialogElement;
  $effect(() => {
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  });
</script>

<dialog bind:this={dlg} class="panel" aria-labelledby="panel-title" onclose={onclose}>
  <div class="sheet wide">
    <header class="bar">
      <h2 id="panel-title"><span aria-hidden="true">⚙️</span> {t('grownUps')}</h2>
      <button class="btn round" aria-label={t('close')} onclick={onclose}>✕</button>
    </header>
  </div>
</dialog>

<style>
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .bar h2 {
    margin: 0;
  }
</style>
