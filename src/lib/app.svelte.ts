import type { State } from './jar.ts';
import { LANGS, type Lang } from '../i18n/index.ts';
import { KEY, load, persist, save } from './storage.ts';

// App state owner: holds the current State, runs rules, saves, tracks "today".
// Components read `app` and change state only through `act`.

export type Notice = '' | 'loadFailed' | 'saveFailed';

const store = (): Storage => localStorage;
const pad = (n: number): string => String(n).padStart(2, '0');

/** Local calendar day, the unit of the once-a-day rule. */
const todayKey = (d = new Date()): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** First supported language the device prefers. */
function deviceLang(): Lang {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase() as Lang;
    if (LANGS.includes(base)) return base;
  }
  return 'en';
}

const first = load(store, deviceLang());
let state = $state.raw<State>(first.state);
let today = $state(todayKey());
let notice = $state<Notice>(first.error ? 'loadFailed' : '');
let persisted = false;

export const app = {
  get s(): State { return state; },
  get today(): string { return today; },
  get notice(): Notice { return notice; },
  set notice(v: Notice) { notice = v; },
};

/** Applies a rule to the current state, saves it, and returns the new state. */
export function act<A extends unknown[]>(rule: (s: State, ...args: A) => State, ...args: A): State {
  today = todayKey();
  state = rule(state, ...args);
  if (save(store, state)) notice = 'saveFailed';
  else if (!persisted) {
    persisted = true;
    persist().catch((e: unknown) => console.error('Starjar: persist failed', e));
  }
  return state;
}

// Day rollover for a tablet left open overnight; other tabs' saves.
setInterval(() => (today = todayKey()), 60_000);
document.addEventListener('visibilitychange', () => (today = todayKey()));
addEventListener('storage', (e) => {
  if (e.key === KEY) state = load(store, state.lang).state;
});
