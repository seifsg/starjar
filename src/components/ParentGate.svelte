<script lang="ts">
  import { t } from '../lib/i18n.svelte.ts';

  // Grown-up check before setup: a times-table question small kids can't answer yet.
  let { open, onpass, onclose }: { open: boolean; onpass: () => void; onclose: () => void } = $props();

  let dlg: HTMLDialogElement;
  let a = $state(0);
  let b = $state(0);
  let answer = $state('');
  let wrong = $state(false);

  $effect(() => {
    if (open && !dlg.open) {
      [a, b, answer, wrong] = [roll(), roll(), '', false];
      dlg.showModal();
    } else if (!open && dlg.open) dlg.close();
  });

  /** 6 to 9: products 36 to 81. */
  const roll = (): number => 6 + Math.floor(Math.random() * 4);

  /** Arabic-Indic and Persian digits typed on a phone become 0-9. */
  const ascii = (s: string): string => s.replace(/[٠-٩۰-۹]/g, (d) => String(d.charCodeAt(0) & 0xf));

  function submit(e: SubmitEvent): void {
    e.preventDefault();
    if (Number(ascii(answer.trim())) === a * b) return onpass();
    wrong = true;
    setTimeout(onclose, 1400);
  }
</script>

<dialog bind:this={dlg} aria-labelledby="gate-title" onclose={onclose}>
  <form class="sheet narrow" onsubmit={submit}>
    <h2 id="gate-title"><span aria-hidden="true">🔒</span> {t('gateTitle')}</h2>
    <label class="field">
      <span class="ask">{t('gateAsk', { a, b })}</span>
      <input bind:value={answer} inputmode="numeric" autocomplete="off" enterkeyhint="go" maxlength="4" required />
    </label>
    {#if wrong}<p class="wrong" role="alert">{t('gateWrong')}</p>{/if}
    <div class="actions">
      <button type="button" class="btn ghost" onclick={onclose}>{t('cancel')}</button>
      <button class="btn primary" disabled={wrong}>{t('gateOpen')}</button>
    </div>
  </form>
</dialog>

<style>
  .ask {
    color: var(--text);
    font-size: 1.4rem;
  }
  .wrong {
    margin: 0;
    font-weight: 800;
    color: #ffb4bf;
  }
</style>
