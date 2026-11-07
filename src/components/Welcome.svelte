<script lang="ts">
  import { act } from '../lib/app.svelte.ts';
  import { addKid, addTask, type KidInput, type State } from '../lib/jar.ts';
  import { strings, t } from '../lib/i18n.svelte.ts';
  import KidForm from './KidForm.svelte';
  import LangPicker from './LangPicker.svelte';

  // First run: set up the first kid's jar; starter chores and good deeds come with it.
  const start = (v: KidInput): void => {
    act((s: State) => {
      const withKid = addKid(s, v);
      return s.tasks.length ? withKid : strings().seed.reduce(addTask, withKid);
    });
  };
</script>

<main class="welcome">
  <div class="sheet">
    <svg class="logo" viewBox="0 0 200 260" aria-hidden="true">
      <rect x="14" y="44" width="172" height="210" rx="46" fill="rgb(255 255 255 / .1)" stroke="rgb(255 255 255 / .75)" stroke-width="6" />
      <rect x="50" y="12" width="100" height="26" rx="10" fill="url(#lid)" />
      <rect x="40" y="34" width="120" height="16" rx="8" fill="rgb(255 255 255 / .85)" />
      <use href="#star" transform="translate(100 160) scale(46)" />
    </svg>
    <h1>{t('welcomeTitle')}</h1>
    <p class="lead">{t('welcomeLead')}</p>
    <LangPicker />
    <KidForm value={{ name: '', emoji: '🦊', reward: '', goal: 10 }} submit={`${t('start')} ✨`} onsave={start} />
  </div>
</main>

<style>
  .welcome {
    display: grid;
    place-items: center;
    min-block-size: 100dvh;
    padding: 1rem;
  }
  .logo {
    justify-self: center;
    block-size: 6.5rem;
    filter: drop-shadow(0 0 18px rgb(255 213 74 / 0.45));
  }
  h1 {
    margin: 0;
    text-align: center;
    font-size: clamp(1.7rem, 6vw, 2.2rem);
  }
  .lead {
    margin: 0;
    text-align: center;
    color: var(--muted);
  }
</style>
