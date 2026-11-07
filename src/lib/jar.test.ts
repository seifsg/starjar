import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addKid, addTask, award, isFull, newJar, normalize, removeStar, updateKid, type State } from './jar.ts';

// Guards the core rules only (owner: few tests): daily limit and jar filling.
const MON = '2026-11-09';
const TUE = '2026-11-10';

function setup(goal = 5): { s: State; kid: string; tasks: string[] } {
  let s = normalize(null, 'en');
  s = addKid(s, { name: 'Mira', emoji: '🦊', reward: 'Park picnic', goal });
  for (const label of ['Bed', 'Teeth', 'Toys', 'Help', 'Share', 'Read']) s = addTask(s, { label, emoji: '⭐', kind: 'chore' });
  return { s, kid: s.current, tasks: s.tasks.map((t) => t.id) };
}
const stars = (s: State): number => s.kids[0]!.stars;

test('a task earns one star per kid per day, again the next day', () => {
  const { s, kid, tasks } = setup();
  const once = award(s, kid, tasks[0]!, MON);
  assert.equal(stars(once), 1);
  assert.equal(stars(award(once, kid, tasks[0]!, MON)), 1);
  assert.equal(stars(award(once, kid, tasks[0]!, TUE)), 2);
});

test('the jar fills to its goal, stops, and a new jar starts empty', () => {
  const { s: start, kid, tasks } = setup(5);
  let s = start;
  for (const t of tasks) s = award(s, kid, t, MON);
  assert.equal(stars(s), 5);
  assert.ok(isFull(s.kids[0]!));
  assert.throws(() => newJar(start, kid), RangeError);
  const fresh = newJar(s, kid);
  assert.equal(stars(fresh), 0);
  assert.equal(fresh.kids[0]!.reward, 'Park picnic');
});

test('removing a star undoes the last tap so it can be earned again', () => {
  const { s, kid, tasks } = setup();
  const undone = removeStar(award(s, kid, tasks[0]!, MON), kid, MON);
  assert.equal(stars(undone), 0);
  assert.equal(stars(award(undone, kid, tasks[0]!, MON)), 1);
});

test('a smaller jar keeps at most its goal and becomes full', () => {
  const { s: start, kid, tasks } = setup(10);
  let s = start;
  for (const t of tasks) s = award(s, kid, t, MON);
  const smaller = updateKid(s, kid, { goal: 5 });
  assert.equal(stars(smaller), 5);
  assert.ok(isFull(smaller.kids[0]!));
});

test('saved data is normalized: junk dropped, numbers clamped', () => {
  assert.deepEqual(normalize('junk', 'fr'), { v: 1, lang: 'fr', sound: true, current: '', kids: [], tasks: [] });
  const s = normalize({ kids: [{ id: 'a', name: 'Sam', reward: 'Kite', goal: 99, stars: 120 }] }, 'en');
  assert.equal(s.kids[0]!.goal, 30);
  assert.equal(s.kids[0]!.stars, 30);
  assert.equal(s.current, 'a');
});
