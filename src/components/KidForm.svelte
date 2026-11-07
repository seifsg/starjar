<script lang="ts">
  import { LIMITS, type KidInput } from '../lib/jar.ts';
  import { plural, t } from '../lib/i18n.svelte.ts';

  // Name, picture, reward and jar size for one kid; used by welcome and setup.
  let { value, submit, onsave }: { value: KidInput; submit: string; onsave: (v: KidInput) => void } = $props();

  const AVATARS = ['🦊', '🐼', '🐯', '🐨', '🐰', '🦁', '🐸', '🐵', '🐻', '🐱', '🐶', '🦉'];
  // Local draft, reset whenever a different kid is passed in.
  const copy = (): KidInput => ({ ...value });
  let draft = $state(copy());
  $effect.pre(() => {
    draft = copy();
  });

  /** Hands the edited fields to the caller. */
  function save(e: SubmitEvent): void {
    e.preventDefault();
    onsave({ ...draft, goal: Number(draft.goal) });
  }
</script>

<form class="kid-form" onsubmit={save}>
  <label class="field">
    <span>{t('kidName')}</span>
    <input bind:value={draft.name} placeholder={t('kidNameHint')} maxlength={LIMITS.text} pattern=".*\S.*" required />
  </label>

  <fieldset class="field">
    <legend><span>{t('avatar')}</span></legend>
    <div class="avatars">
      {#each AVATARS as a (a)}
        <label class="avatar">
          <input type="radio" name="avatar" value={a} bind:group={draft.emoji} />
          <span aria-hidden="true">{a}</span>
        </label>
      {/each}
    </div>
  </fieldset>

  <label class="field">
    <span>{t('reward')}</span>
    <input bind:value={draft.reward} placeholder={t('rewardHint')} maxlength={LIMITS.text} pattern=".*\S.*" required />
  </label>

  <label class="field">
    <span>{t('jarSize')}: <b>{plural('stars', Number(draft.goal))}</b></span>
    <input type="range" min={LIMITS.goalMin} max={LIMITS.goalMax} step="1" bind:value={draft.goal} />
  </label>

  <div class="actions"><button class="btn primary">{submit}</button></div>
</form>

<style>
  .kid-form {
    display: grid;
    gap: 1rem;
  }
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }
  legend {
    padding: 0;
    margin-block-end: 0.35rem;
  }
  .avatars {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(3.1rem, 1fr));
    gap: 0.4rem;
  }
  .avatar {
    position: relative;
  }
  .avatar input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }
  .avatar span {
    display: grid;
    place-items: center;
    inline-size: 100%;
    block-size: 3.1rem;
    border-radius: 1rem;
    background: rgb(255 255 255 / 0.08);
    font-size: 1.8rem;
    border: 2px solid transparent;
  }
  .avatar input:checked + span {
    border-color: var(--gold);
    background: rgb(255 213 74 / 0.18);
  }
  .avatar input:focus-visible + span {
    outline: 3px solid var(--gold);
    outline-offset: 2px;
  }
  .field b {
    color: var(--gold);
  }
  input[type='range'] {
    appearance: none;
    min-block-size: 3rem;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
  }
  input[type='range']::-webkit-slider-runnable-track {
    block-size: 0.6rem;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.22);
  }
  input[type='range']::-moz-range-track {
    block-size: 0.6rem;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.22);
  }
  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    inline-size: 1.75rem;
    block-size: 1.75rem;
    margin-block-start: -0.575rem;
    border: 3px solid #fff;
    border-radius: 50%;
    background: var(--gold);
  }
  input[type='range']::-moz-range-thumb {
    inline-size: 1.75rem;
    block-size: 1.75rem;
    border: 3px solid #fff;
    border-radius: 50%;
    background: var(--gold);
  }
</style>
