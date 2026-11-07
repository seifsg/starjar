<script lang="ts">
  import type { Kid } from '../lib/jar.ts';
  import { t } from '../lib/i18n.svelte.ts';
  import { app } from '../lib/app.svelte.ts';
  import { fanfare } from '../lib/sound.ts';

  // Full-jar celebration: names the reward; only "new jar" (or a grown-up) moves on.
  let { open, kid, onnew, onparent }: { open: boolean; kid: Kid; onnew: () => void; onparent: () => void } = $props();

  let dlg: HTMLDialogElement;
  $effect(() => {
    if (open && !dlg.open) {
      dlg.showModal();
      if (app.s.sound) fanfare();
    } else if (!open && dlg.open) dlg.close();
  });

  const COLORS = ['#ffd54a', '#ff8a9a', '#5fdcae', '#6cc2ff', '#c3a2ff', '#fff8e7'];
  const pieces = Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2 + Math.random() * 0.4;
    const d = 230 + Math.random() * 170;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.75 - 90, r: Math.random() * 720 - 360, c: COLORS[i % COLORS.length], delay: Math.random() * 120 };
  });
</script>

<dialog bind:this={dlg} class="reward" aria-labelledby="reward-title" oncancel={(e) => e.preventDefault()} onclose={() => open && dlg.showModal()}>
  {#if open}
    <!-- before the card: pieces fly out around it, never over the text -->
    <div class="burst" aria-hidden="true">
      {#each pieces as p, i (i)}
        <i style:--x="{p.x}px" style:--y="{p.y}px" style:--r="{p.r}deg" style:--c={p.c} style:--d="{p.delay}ms"></i>
      {/each}
    </div>
    <div class="card">
      <p class="gift" aria-hidden="true">🎁</p>
      <h2 id="reward-title">{t('jarFull')}</h2>
      <p class="who">{kid.emoji} {t('earned', { name: kid.name })}</p>
      <p class="prize">{kid.reward}</p>
      <button class="go" onclick={onnew}>{t('newJar')} ✨</button>
      <!-- after the main button so the dialog focuses "new jar" first -->
      <button class="grown" onclick={onparent}>⚙️ {t('grownUps')}</button>
    </div>
  {/if}
</dialog>

<style>
  .reward {
    overflow: visible;
  }
  .card {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 0.4rem;
    inline-size: min(26rem, calc(100vw - 2rem));
    padding: 2rem 1.5rem 1.6rem;
    border-radius: 2rem;
    background: linear-gradient(160deg, #fff6d6, #ffd9a8);
    color: var(--ink);
    text-align: center;
    box-shadow:
      0 0 60px rgb(255 213 74 / 0.35),
      0 30px 80px rgb(0 0 0 / 0.5);
    animation: pop 600ms cubic-bezier(0.2, 1.6, 0.4, 1) both;
  }
  .gift {
    margin: -4.2rem 0 0;
    font-size: 5rem;
    line-height: 1;
    animation: hop 1.2s ease-in-out 600ms infinite;
  }
  h2 {
    margin: 0.3rem 0 0;
    font-size: 2rem;
  }
  .who {
    margin: 0.4rem 0 0;
    font-weight: 800;
    font-size: 1.1rem;
    color: #6b4fa8;
  }
  .prize {
    margin: 0;
    font-weight: 900;
    font-size: clamp(1.8rem, 7vw, 2.4rem);
    line-height: 1.1;
    overflow-wrap: anywhere;
  }
  .go {
    margin-block-start: 1rem;
    min-block-size: 3.6rem;
    padding: 0 1.6rem;
    border: 0;
    border-radius: 999px;
    background: #6b3fd4;
    color: #fff;
    font-weight: 900;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 6px 0 #45238f;
  }
  .go:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 #45238f;
  }
  .grown {
    min-block-size: 3rem;
    padding: 0 1rem;
    border: 0;
    border-radius: 999px;
    background: none;
    color: #5b4a8a;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
  }
  .burst {
    position: absolute;
    inset: 50% auto auto 50%;
    pointer-events: none;
  }
  .burst i {
    position: absolute;
    inline-size: 0.85rem;
    block-size: 1.15rem;
    border-radius: 0.2rem;
    background: var(--c);
    opacity: 0;
    animation: burst 1.6s cubic-bezier(0.15, 0.7, 0.3, 1) var(--d) forwards;
  }
  @keyframes burst {
    0% { opacity: 1; transform: translate(0, 0) rotate(0); }
    80% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--x), calc(var(--y) + 160px)) rotate(var(--r)); }
  }
  @keyframes pop {
    from { transform: scale(0.6); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes hop {
    0%, 100% { transform: translateY(0) rotate(-4deg); }
    50% { transform: translateY(-10px) rotate(4deg); }
  }
</style>
