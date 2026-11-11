import { test } from 'node:test';
import assert from 'node:assert/strict';

import { lunarNewYear, FIRST_YEAR, LAST_YEAR } from '../js/lunar-new-year.js';
import {
  parseBirthDate, getZodiac, animalRelation, elementRelation, compatibility, ANIMALS,
} from '../js/zodiac.js';
import { SIGNS, ELEMENT_INFO } from '../js/content.js';

const sign = (day, month, year) => {
  const z = getZodiac({ day, month, year });
  return `${z.element} ${z.animal}`;
};

test('Lunar New Year table matches published dates', () => {
  const known = {
    1900: [1, 31], 1912: [2, 18], 1940: [2, 8], 1945: [2, 13], 1948: [2, 10],
    1984: [2, 2], 1985: [2, 20], 1990: [1, 27], 2000: [2, 5], 2020: [1, 25],
    2023: [1, 22], 2024: [2, 10], 2025: [1, 29], 2026: [2, 17], 2027: [2, 6],
    1954: [2, 3], 2030: [2, 3], // years where ICU's computed calendar is a day late
  };
  for (const [year, [month, day]] of Object.entries(known)) {
    assert.deepEqual(lunarNewYear(Number(year)), { month, day }, `LNY ${year}`);
  }
});

test('every Lunar New Year falls between 21 January and 20 February', () => {
  for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
    const { month, day } = lunarNewYear(y);
    const code = month * 100 + day;
    assert.ok(code >= 121 && code <= 220, `${y}: ${code}`);
  }
});

test('sign changes on Lunar New Year, not 1 January', () => {
  // 1948: New Year on 10 February
  assert.equal(sign(9, 2, 1948), 'Fire Pig');
  assert.equal(sign(10, 2, 1948), 'Earth Rat');
  assert.equal(sign(1, 1, 1948), 'Fire Pig');
  // 1990: New Year on 27 January
  assert.equal(sign(26, 1, 1990), 'Earth Snake');
  assert.equal(sign(27, 1, 1990), 'Metal Horse');
  // 2027: New Year on 6 February
  assert.equal(sign(5, 2, 2027), 'Fire Horse');
  assert.equal(sign(6, 2, 2027), 'Fire Goat');
});

test('well-known years', () => {
  assert.equal(sign(1, 7, 1940), 'Metal Dragon');
  assert.equal(sign(1, 7, 1984), 'Wood Rat');
  assert.equal(sign(1, 7, 2000), 'Metal Dragon');
  assert.equal(sign(1, 7, 2024), 'Wood Dragon');
  assert.equal(sign(1, 7, 2026), 'Fire Horse');
});

test('polarity follows the heavenly stem', () => {
  assert.equal(getZodiac({ day: 1, month: 7, year: 1984 }).polarity, 'Yang');
  assert.equal(getZodiac({ day: 1, month: 7, year: 1985 }).polarity, 'Yin');
});

test('bornBeforeNewYear flag and zodiac year', () => {
  const z = getZodiac({ day: 20, month: 1, year: 1948 });
  assert.equal(z.bornBeforeNewYear, true);
  assert.equal(z.zodiacYear, 1947);
  assert.equal(getZodiac({ day: 1, month: 3, year: 1948 }).bornBeforeNewYear, false);
});

test('date validation', () => {
  const today = new Date(2026, 10, 11);
  assert.equal(parseBirthDate('14', '3', '1946', today).ok, true);
  assert.equal(parseBirthDate('29', '2', '1948', today).ok, true); // leap year
  assert.equal(parseBirthDate('29', '2', '1949', today).field, 'day');
  assert.equal(parseBirthDate('31', '4', '1990', today).field, 'day');
  assert.equal(parseBirthDate('0', '4', '1990', today).field, 'day');
  assert.equal(parseBirthDate('1', '13', '1990', today).field, 'month');
  assert.equal(parseBirthDate('1', '1', '90', today).field, 'year');
  assert.equal(parseBirthDate('1', '1', '1850', today).field, 'year');
  assert.equal(parseBirthDate('12', '11', '2026', today).field, 'year'); // tomorrow
  assert.equal(parseBirthDate('11', '11', '2026', today).ok, true); // today
  assert.equal(parseBirthDate('', '', '', today).field, 'day');
  assert.equal(parseBirthDate('1.5', '1', '1990', today).field, 'day');
});

test('animal relations are symmetric and cover the traditional pairs', () => {
  const idx = (name) => ANIMALS.indexOf(name);
  assert.equal(animalRelation(idx('Rat'), idx('Ox')), 'harmony');
  assert.equal(animalRelation(idx('Tiger'), idx('Pig')), 'harmony');
  assert.equal(animalRelation(idx('Rat'), idx('Dragon')), 'trine');
  assert.equal(animalRelation(idx('Rabbit'), idx('Pig')), 'trine');
  assert.equal(animalRelation(idx('Rat'), idx('Horse')), 'clash');
  assert.equal(animalRelation(idx('Rat'), idx('Goat')), 'harm');
  assert.equal(animalRelation(idx('Monkey'), idx('Pig')), 'harm');
  assert.equal(animalRelation(idx('Rat'), idx('Rat')), 'same');
  assert.equal(animalRelation(idx('Rat'), idx('Tiger')), 'neutral');
  for (let a = 0; a < 12; a++) {
    for (let b = 0; b < 12; b++) {
      assert.equal(animalRelation(a, b), animalRelation(b, a));
    }
  }
});

test('element relations', () => {
  assert.equal(elementRelation(0, 1), 'generating'); // Wood feeds Fire
  assert.equal(elementRelation(4, 0), 'generating'); // Water feeds Wood
  assert.equal(elementRelation(0, 2), 'controlling'); // Wood parts Earth
  assert.equal(elementRelation(4, 1), 'controlling'); // Water quenches Fire
  assert.equal(elementRelation(3, 3), 'same');
});

test('compatibility score stays in range and is symmetric', () => {
  const a = getZodiac({ day: 1, month: 7, year: 1984 });
  const b = getZodiac({ day: 1, month: 7, year: 1985 });
  const result = compatibility(a, b);
  assert.equal(result.animal, 'harmony');
  assert.ok(result.score >= 5 && result.score <= 99);
  assert.equal(result.score, compatibility(b, a).score);
});

test('content exists for every sign and element', () => {
  assert.equal(SIGNS.length, 12);
  SIGNS.forEach((s, i) => {
    assert.equal(s.name, ANIMALS[i]);
    assert.equal(s.hanzi.length, 1);
    assert.equal(s.traits.length, 3);
    assert.ok(s.cardTrait && s.blurb && s.strength && s.watch);
  });
  assert.equal(ELEMENT_INFO.length, 5);
});
