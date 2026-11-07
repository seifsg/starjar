// Shape every language file must match; a missing key fails the type check.

/** Text per plural category (Intl.PluralRules); `other` is required. */
export type Plural = { other: string } & Partial<Record<Intl.LDMLPluralRule, string>>;

export interface Strings {
  langName: string;
  dir: 'ltr' | 'rtl';
  appName: string;
  tagline: string;
  chores: string;
  deeds: string;
  count: string;
  toGo: Plural;
  doneToday: string;
  starFor: string;
  grownUps: string;
  loadFailed: string;
  saveFailed: string;
  close: string;
  cancel: string;
  // Reward
  jarFull: string;
  earned: string;
  newJar: string;
  // Gate
  gateTitle: string;
  gateAsk: string;
  gateWrong: string;
  gateOpen: string;
  // Welcome + setup
  welcomeTitle: string;
  welcomeLead: string;
  start: string;
  kidName: string;
  kidNameHint: string;
  avatar: string;
  reward: string;
  rewardHint: string;
  jarSize: string;
  stars: Plural;
  kids: string;
  addKid: string;
  removeKid: string;
  removeStar: string;
  tasks: string;
  addTask: string;
  taskName: string;
  taskHint: string;
  kind: string;
  chore: string;
  deed: string;
  icon: string;
  removeTask: string;
  save: string;
  language: string;
  sound: string;
  installHint: string;
  confirmRemove: string;
  seed: { label: string; emoji: string; kind: 'chore' | 'deed' }[];
}
