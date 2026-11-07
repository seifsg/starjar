import { normalize, type State } from './jar.ts';
import type { Lang } from '../i18n/index.ts';

// Device-only persistence: one JSON value in localStorage. Errors are returned, never swallowed.
export const KEY = 'starjar';

export interface Loaded { state: State; error: unknown }

/** Reads saved state; unreadable or corrupt data gives a blank state plus the error. */
export function load(store: () => Storage, lang: Lang): Loaded {
  try {
    const raw = store().getItem(KEY);
    return { state: normalize(raw === null ? null : JSON.parse(raw), lang), error: null };
  } catch (error) {
    console.error('Starjar: could not read saved stars', error);
    return { state: normalize(null, lang), error };
  }
}

/** Writes state; returns the error (quota, private mode) or null. */
export function save(store: () => Storage, state: State): unknown {
  try {
    store().setItem(KEY, JSON.stringify(state));
    return null;
  } catch (error) {
    console.error('Starjar: could not save stars', error);
    return error;
  }
}

/** Asks the browser not to evict our data (best on installed apps). */
export async function persist(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  return navigator.storage.persisted().then((yes) => yes || navigator.storage.persist());
}
