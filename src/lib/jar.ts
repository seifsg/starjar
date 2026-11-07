// Jar rules: the only code that changes app state. Pure: no clock, storage or DOM.
// Every function returns a new State and throws on input the UI should never send.

export type Lang = 'en' | 'ar' | 'fr';
export type Kind = 'chore' | 'deed';
export interface Task { id: string; label: string; emoji: string; kind: Kind }
export interface Kid {
  id: string; name: string; emoji: string; reward: string;
  goal: number; stars: number; day: string; done: string[];
}
export interface State { v: 1; lang: Lang; sound: boolean; current: string; kids: Kid[]; tasks: Task[] }
export type KidInput = Pick<Kid, 'name' | 'emoji' | 'reward' | 'goal'>;
export type TaskInput = Pick<Task, 'label' | 'emoji' | 'kind'>;

export const LIMITS = { goalMin: 5, goalMax: 30, kidsMax: 6, tasksMax: 24, text: 40, emoji: 16 } as const;
export const LANGS: readonly Lang[] = ['en', 'ar', 'fr'];

/** Stars needed to fill a jar is reached. */
export const isFull = (k: Kid): boolean => k.stars >= k.goal;

/** Task ids this kid already earned a star for today. */
export const doneToday = (k: Kid, today: string): readonly string[] => (k.day === today ? k.done : []);

/** Adds one star unless the task was done today or the jar is full. */
export function award(s: State, kidId: string, taskId: string, today: string): State {
  must(s.tasks.some((t) => t.id === taskId), `unknown task ${taskId}`);
  return mapKid(s, kidId, (k) => {
    const done = doneToday(k, today);
    if (isFull(k) || done.includes(taskId)) return k;
    return { ...k, stars: k.stars + 1, day: today, done: [...done, taskId] };
  });
}

/** Undoes the last star; today's last tap becomes tappable again. */
export const removeStar = (s: State, kidId: string, today: string): State =>
  mapKid(s, kidId, (k) => (k.stars ? { ...k, stars: k.stars - 1, done: doneToday(k, today).slice(0, -1), day: today } : k));

/** Empties a full jar after the reward; reward and goal stay. */
export const newJar = (s: State, kidId: string): State =>
  mapKid(s, kidId, (k) => (must(isFull(k), 'jar is not full'), { ...k, stars: 0 }));

export function addKid(s: State, input: KidInput): State {
  must(s.kids.length < LIMITS.kidsMax, `at most ${LIMITS.kidsMax} kids`);
  const kid: Kid = { id: crypto.randomUUID(), ...kidFields(input), stars: 0, day: '', done: [] };
  return { ...s, kids: [...s.kids, kid], current: kid.id };
}

/** Edits a kid; a smaller jar keeps at most `goal` stars (so it may become full). */
export const updateKid = (s: State, id: string, patch: Partial<KidInput>): State =>
  mapKid(s, id, (k) => {
    const next = { ...k, ...kidFields({ ...k, ...patch }) };
    return { ...next, stars: Math.min(next.stars, next.goal) };
  });

export function removeKid(s: State, id: string): State {
  must(s.kids.length > 1, 'the last kid cannot be removed');
  const kids = without(s.kids, id);
  return { ...s, kids, current: s.current === id ? kids[0]!.id : s.current };
}

export function addTask(s: State, input: TaskInput): State {
  must(s.tasks.length < LIMITS.tasksMax, `at most ${LIMITS.tasksMax} tasks`);
  return { ...s, tasks: [...s.tasks, { id: crypto.randomUUID(), ...taskFields(input) }] };
}

export const updateTask = (s: State, id: string, patch: Partial<TaskInput>): State => ({
  ...s,
  tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...taskFields({ ...t, ...patch }) } : t)),
});

export const removeTask = (s: State, id: string): State => ({
  ...s,
  tasks: without(s.tasks, id),
  kids: s.kids.map((k) => ({ ...k, done: k.done.filter((d) => d !== id) })),
});

export const setCurrent = (s: State, id: string): State => (find(s.kids, id), { ...s, current: id });
export const setSound = (s: State, sound: boolean): State => ({ ...s, sound });
export const setLang = (s: State, lang: Lang): State => (must(LANGS.includes(lang), `unknown language ${lang}`), { ...s, lang });

/** Turns anything read from storage into a valid State; bad parts are dropped or clamped. */
export function normalize(raw: unknown, lang: Lang): State {
  const r = obj(raw);
  const tasks = uniq(list(r.tasks).map((t): Task => ({
    id: str(t.id, 64), label: str(t.label), emoji: str(t.emoji, LIMITS.emoji) || '⭐',
    kind: t.kind === 'deed' ? 'deed' : 'chore',
  })).filter((t) => t.label)).slice(0, LIMITS.tasksMax);
  const kids = uniq(list(r.kids).map((k): Kid => {
    const goal = clamp(k.goal, LIMITS.goalMin, LIMITS.goalMax);
    return {
      id: str(k.id, 64), name: str(k.name), emoji: str(k.emoji, LIMITS.emoji) || '🙂', reward: str(k.reward),
      goal, stars: clamp(k.stars, 0, goal), day: str(k.day, 10),
      done: Array.isArray(k.done) ? k.done.filter((d): d is string => typeof d === 'string') : [],
    };
  }).filter((k) => k.name && k.reward)).slice(0, LIMITS.kidsMax);
  const current = kids.find((k) => k.id === r.current)?.id ?? kids[0]?.id ?? '';
  return { v: 1, lang: LANGS.includes(r.lang as Lang) ? (r.lang as Lang) : lang, sound: r.sound !== false, current, kids, tasks };
}

// Entry checks: wrong input from the UI is a bug, so it fails loudly.
function kidFields(i: KidInput): KidInput {
  must(Number.isInteger(i.goal) && i.goal >= LIMITS.goalMin && i.goal <= LIMITS.goalMax, `goal ${LIMITS.goalMin} to ${LIMITS.goalMax}`);
  return { name: text(i.name), emoji: text(i.emoji, LIMITS.emoji), reward: text(i.reward), goal: i.goal };
}
const taskFields = (i: TaskInput): TaskInput => (
  must(i.kind === 'chore' || i.kind === 'deed', `unknown kind ${i.kind}`),
  { label: text(i.label), emoji: text(i.emoji, LIMITS.emoji), kind: i.kind });

function text(v: string, max: number = LIMITS.text): string {
  const t = v.trim();
  must(t.length > 0 && t.length <= max, `text must be 1 to ${max} characters`);
  return t;
}
function must(ok: boolean, why: string): void {
  if (!ok) throw new RangeError(`Starjar: ${why}`);
}
const find = <T extends { id: string }>(xs: T[], id: string): T => {
  const x = xs.find((v) => v.id === id);
  must(!!x, `unknown id ${id}`);
  return x!;
};
const mapKid = (s: State, id: string, f: (k: Kid) => Kid): State =>
  (find(s.kids, id), { ...s, kids: s.kids.map((k) => (k.id === id ? f(k) : k)) });
const without = <T extends { id: string }>(xs: T[], id: string): T[] => (find(xs, id), xs.filter((x) => x.id !== id));

// Normalize helpers.
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});
const list = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.map(obj) : []);
const str = (v: unknown, max: number = LIMITS.text): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const clamp = (v: unknown, lo: number, hi: number): number => Math.min(hi, Math.max(lo, Math.round(Number(v)) || 0));
const uniq = <T extends { id: string }>(xs: T[]): T[] => {
  const seen = new Set<string>();
  return xs.filter((x) => x.id && !seen.has(x.id) && !!seen.add(x.id));
};
