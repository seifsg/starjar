<script lang="ts">
  import { act, app } from '../lib/app.svelte.ts';
  import { setLang } from '../lib/jar.ts';
  import { LANGS, packs, type Lang } from '../i18n/index.ts';
  import { t } from '../lib/i18n.svelte.ts';

  // Language switch; each option is written in its own language.
</script>

<label class="field">
  <span>🌐 {t('language')}</span>
  <select value={app.s.lang} onchange={(e) => act(setLang, e.currentTarget.value as Lang)}>
    {#each LANGS as l (l)}<option value={l} lang={l}>{packs[l].langName}</option>{/each}
  </select>
</label>
