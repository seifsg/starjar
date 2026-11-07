import { en } from './en.ts';
import { ar } from './ar.ts';
import { fr } from './fr.ts';
import type { Strings } from './types.ts';

// Language registry: add a language by adding its file and one line here.
export const packs = { en, ar, fr } satisfies Record<string, Strings>;

export type Lang = keyof typeof packs;
export const LANGS = Object.keys(packs) as Lang[];
