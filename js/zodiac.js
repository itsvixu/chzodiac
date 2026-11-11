// Pure zodiac logic. No DOM, no storage, no network: safe to unit test in Node.
import { FIRST_YEAR, LAST_YEAR, lunarNewYear } from './lunar-new-year.js';

export const ANIMALS = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
];
export const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export const MIN_YEAR = FIRST_YEAR + 1; // need the previous year's sign for January births
export const MAX_YEAR = LAST_YEAR;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const mod = (n, m) => ((n % m) + m) % m;

function daysInMonth(month, year) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Validates a day / month / year typed by the user.
 * `today` is injectable so tests are deterministic.
 * @returns {{ ok: true, date: {day:number, month:number, year:number} } | { ok: false, field: string, message: string }}
 */
export function parseBirthDate(dayStr, monthStr, yearStr, today = new Date()) {
  const digits = /^\d+$/;
  const fail = (field, message) => ({ ok: false, field, message });

  if (!digits.test(String(dayStr).trim())) return fail('day', 'Enter the day as a number, 1 to 31.');
  if (!digits.test(String(monthStr).trim())) return fail('month', 'Enter the month as a number, 1 to 12.');
  if (!/^\d{4}$/.test(String(yearStr).trim())) return fail('year', 'Enter the full year, like 1948.');

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (month < 1 || month > 12) return fail('month', 'Month should be between 1 and 12.');
  if (year < MIN_YEAR) return fail('year', `Sorry, we can only go back to ${MIN_YEAR}.`);
  if (year > MAX_YEAR) return fail('year', 'That year is too far in the future.');
  if (day < 1 || day > daysInMonth(month, year)) {
    return fail('day', `${MONTH_NAMES[month - 1]} ${year} has ${daysInMonth(month, year)} days.`);
  }

  const todayKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  if (year * 10000 + month * 100 + day > todayKey) {
    return fail('year', 'That date is in the future.');
  }
  return { ok: true, date: { day, month, year } };
}

/**
 * Chinese zodiac for a Gregorian birth date. The zodiac year turns over on
 * Lunar New Year, so January and early-February births may belong to the
 * previous year's sign.
 */
export function getZodiac({ day, month, year }) {
  const newYear = lunarNewYear(year);
  const bornBeforeNewYear = month * 100 + day < newYear.month * 100 + newYear.day;
  const zodiacYear = bornBeforeNewYear ? year - 1 : year;

  const animalIndex = mod(zodiacYear - 4, 12);
  const stem = mod(zodiacYear - 4, 10);
  const elementIndex = Math.floor(stem / 2);

  return {
    zodiacYear,
    animalIndex,
    animal: ANIMALS[animalIndex],
    elementIndex,
    element: ELEMENTS[elementIndex],
    polarity: stem % 2 === 0 ? 'Yang' : 'Yin',
    bornBeforeNewYear,
    newYear: { ...newYear, year },
  };
}

export function formatDate({ day, month, year }) {
  return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
}

/** Traditional relationship between two animal signs. */
export function animalRelation(a, b) {
  if (a === b) return 'same';
  if (mod(a + b, 12) === 1) return 'harmony'; // the six harmonies ("secret friends")
  if (mod(a - b, 4) === 0) return 'trine'; // the four trines of affinity
  if (mod(a - b, 12) === 6) return 'clash'; // the six clashes, opposite on the wheel
  if (mod(a + b, 12) === 7) return 'harm'; // the six harms
  return 'neutral';
}

/** Five-element (wu xing) relationship. Wood > Fire > Earth > Metal > Water > Wood feeds. */
export function elementRelation(a, b) {
  if (a === b) return 'same';
  const diff = mod(b - a, 5);
  if (diff === 1 || diff === 4) return 'generating';
  return 'controlling';
}

const ANIMAL_SCORE = { harmony: 92, trine: 88, same: 72, neutral: 62, harm: 46, clash: 38 };
const ELEMENT_SCORE = { generating: 6, same: 3, controlling: -6 };

/** Light-hearted compatibility reading for two zodiac results. */
export function compatibility(you, friend) {
  const animal = animalRelation(you.animalIndex, friend.animalIndex);
  const element = elementRelation(you.elementIndex, friend.elementIndex);
  const score = Math.max(5, Math.min(99, ANIMAL_SCORE[animal] + ELEMENT_SCORE[element]));
  return { animal, element, score };
}
