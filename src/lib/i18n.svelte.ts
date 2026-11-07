import { app } from './app.svelte.ts';
import { packs, type Lang } from '../i18n/index.ts';
import type { Plural, Strings } from '../i18n/types.ts';

// Text lookup for the current language: plain text, plurals, numbers.

type TextKey = { [K in keyof Strings]: Strings[K] extends string ? K : never }[keyof Strings];
type PluralKey = { [K in keyof Strings]: Strings[K] extends Plural ? K : never }[keyof Strings];
type Vars = Record<string, string | number>;

/** Strings of the current language. */
export const strings = (): Strings => packs[app.s.lang];

const numbers = new Map<Lang, Intl.NumberFormat>();
const plurals = new Map<Lang, Intl.PluralRules>();
const cached = <T>(m: Map<Lang, T>, make: (l: Lang) => T): T => {
  const l = app.s.lang;
  return m.get(l) ?? (m.set(l, make(l)), m.get(l)!);
};

/** A number in the current language's digits. */
export const num = (n: number): string => cached(numbers, (l) => new Intl.NumberFormat(l)).format(n);

const fill = (text: string, vars: Vars = {}): string =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => {
    const v = vars[k];
    return v === undefined ? m : typeof v === 'number' ? num(v) : v;
  });

export const t = (key: TextKey, vars?: Vars): string => fill(strings()[key], vars);

export function plural(key: PluralKey, n: number, vars?: Vars): string {
  const p = strings()[key];
  return fill(p[cached(plurals, (l) => new Intl.PluralRules(l)).select(n)] ?? p.other, { n, ...vars });
}
