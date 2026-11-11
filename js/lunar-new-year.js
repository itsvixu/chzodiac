// Gregorian date of Lunar New Year (Chinese calendar, UTC+8) for each year,
// encoded as month * 100 + day (e.g. 206 = 6 February). Index 0 is 1900.
//
// These are the published dates, not computed ones. Do not regenerate this
// from Intl / ICU: its Chinese calendar is off by a day when the new moon
// falls close to midnight in Beijing (it gets 1954, 2027 and 2030 wrong).
// tests/zodiac.test.mjs pins a sample of these values.

export const FIRST_YEAR = 1900;
export const LAST_YEAR = 2043;

const DATES = [
  131, 219, 208, 129, 216, 204, 125, 213, 202, 122, // 1900
  210, 130, 218, 206, 126, 214, 203, 123, 211, 201, // 1910
  220, 208, 128, 216, 205, 124, 213, 202, 123, 210, // 1920
  130, 217, 206, 126, 214, 204, 124, 211, 131, 219, // 1930
  208, 127, 215, 205, 125, 213, 202, 122, 210, 129, // 1940
  217, 206, 127, 214, 203, 124, 212, 131, 218, 208, // 1950
  128, 215, 205, 125, 213, 202, 121, 209, 130, 217, // 1960
  206, 127, 215, 203, 123, 211, 131, 218, 207, 128, // 1970
  216, 205, 125, 213, 202, 220, 209, 129, 217, 206, // 1980
  127, 215, 204, 123, 210, 131, 219, 207, 128, 216, // 1990
  205, 124, 212, 201, 122, 209, 129, 218, 207, 126, // 2000
  214, 203, 123, 210, 131, 219, 208, 128, 216, 205, // 2010
  125, 212, 201, 122, 210, 129, 217, 206, 126, 213, // 2020
  203, 123, 211, 131, 219, 208, 128, 215, 204, 124, // 2030
  212, 201, 122, 210, // 2040
];

/** @returns {{ month: number, day: number }} Lunar New Year in the given Gregorian year. */
export function lunarNewYear(year) {
  if (!Number.isInteger(year) || year < FIRST_YEAR || year > LAST_YEAR) {
    throw new RangeError(`Year must be between ${FIRST_YEAR} and ${LAST_YEAR}`);
  }
  const code = DATES[year - FIRST_YEAR];
  return { month: Math.floor(code / 100), day: code % 100 };
}
