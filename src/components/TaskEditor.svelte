<script lang="ts">
  import { act, app } from '../lib/app.svelte.ts';
  import { addTask, LIMITS, removeTask, updateTask, type Kind, type Task, type TaskInput } from '../lib/jar.ts';
  import { t } from '../lib/i18n.svelte.ts';

  // Add, rename, re-type and remove chores and good deeds.
  const ICONS = ['⭐', '🛏️', '🪥', '🧸', '🍽️', '🧹', '🧺', '🌱', '🐶', '📚', '✏️', '🎒', '👕', '🛁', '🥦', '🗑️', '🤝', '🍪', '💛', '🙏', '😊', '🎨', '🎵', '🕌'];
  const KINDS: Kind[] = ['chore', 'deed'];

  let fresh = $state<TaskInput>({ label: '', emoji: '⭐', kind: 'chore' });
  const full = $derived(app.s.tasks.length >= LIMITS.tasksMax);

  /** Adds the new task and clears its name for the next one. */
  function add(e: SubmitEvent): void {
    e.preventDefault();
    act(addTask, fresh);
    fresh = { ...fresh, label: '' };
  }

  /** Saves a renamed task; an empty name puts the old one back. */
  function rename(task: Task, input: HTMLInputElement): void {
    if (input.checkValidity()) act(updateTask, task.id, { label: input.value });
    else input.value = task.label;
  }
</script>

<ul class="tasks">
  {#each app.s.tasks as task (task.id)}
    <li class="row">
      <select aria-label={t('icon')} value={task.emoji} onchange={(e) => act(updateTask, task.id, { emoji: e.currentTarget.value })}>
        {#each ICONS.includes(task.emoji) ? ICONS : [task.emoji, ...ICONS] as i (i)}<option value={i}>{i}</option>{/each}
      </select>
      <input
        aria-label={t('taskName')}
        value={task.label}
        maxlength={LIMITS.text}
        pattern=".*\S.*"
        required
        onchange={(e) => rename(task, e.currentTarget)}
      />
      <select aria-label={t('kind')} value={task.kind} onchange={(e) => act(updateTask, task.id, { kind: e.currentTarget.value as Kind })}>
        {#each KINDS as k (k)}<option value={k}>{t(k)}</option>{/each}
      </select>
      <button class="btn round" aria-label="{t('removeTask')}: {task.label}" onclick={() => act(removeTask, task.id)}>🗑️</button>
    </li>
  {/each}
</ul>

<form class="row add" onsubmit={add}>
  <select aria-label={t('icon')} bind:value={fresh.emoji}>
    {#each ICONS as i (i)}<option value={i}>{i}</option>{/each}
  </select>
  <input aria-label={t('taskName')} placeholder={t('taskHint')} bind:value={fresh.label} maxlength={LIMITS.text} pattern=".*\S.*" required disabled={full} />
  <select aria-label={t('kind')} bind:value={fresh.kind}>
    {#each KINDS as k (k)}<option value={k}>{t(k)}</option>{/each}
  </select>
  <button class="btn primary" disabled={full}>{t('addTask')}</button>
</form>

<style>
  .tasks {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .row {
    display: grid;
    grid-template-columns: 4.2rem minmax(0, 1fr) minmax(0, 9rem) 3rem;
    gap: 0.4rem;
    align-items: center;
  }
  .row select:first-child {
    padding: 0 0.3rem;
    font-size: 1.5rem;
    text-align: center;
  }
  .add {
    margin-block-start: 0.75rem;
    padding-block-start: 0.75rem;
    border-block-start: 1px dashed var(--line);
  }
  .add .btn {
    padding: 0 0.6rem;
  }
  @media (max-width: 30rem) {
    .row {
      grid-template-columns: 4rem minmax(0, 1fr) 3rem;
    }
    .row select:nth-of-type(2) {
      grid-column: 2;
      grid-row: 2;
    }
    .add .btn {
      grid-column: 3;
      grid-row: 1 / span 2;
      block-size: 100%;
    }
  }
</style>
