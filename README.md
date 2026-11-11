# Chinese Zodiac: written in the stars

A mobile-first scrollytelling prototype. Enter a birth date, get your Chinese
zodiac animal and element based on the real Lunar New Year date for that year,
scroll through a few short chapters, save a shareable card and check
compatibility with a friend.

Launch target: before Lunar New Year, 6 February 2027.

## Run it

No build step and no dependencies.

```bash
npm start   # http://localhost:4173
npm test    # unit tests (Node 20+)
```

## How it works

| Path | What it does |
| --- | --- |
| `index.html` | Markup for every chapter. Includes a strict Content Security Policy. |
| `css/styles.css` | All styling and motion. |
| `js/lunar-new-year.js` | Published Lunar New Year dates, 1900 to 2043. |
| `js/zodiac.js` | Pure logic: date validation, sign, element, compatibility. |
| `js/content.js` | All copy: traits, element text, compatibility text. |
| `js/app.js` | UI wiring: forms, reveal, scroll-in animation, sharing. |
| `js/sky.js` | Starfield background and scroll progress. |
| `js/card.js` | Draws the 1080 x 1350 share card on a canvas. |
| `tests/` | Unit tests for the date table and logic. |

### Zodiac rules

- The zodiac year changes on Lunar New Year, not 1 January. Someone born on
  20 January 1948 is a Fire Pig (lunar year 1947), not an Earth Rat.
- Births from 1901 onwards are supported.
- Element and yin/yang come from the heavenly stem of the lunar year.
- Compatibility uses the traditional six harmonies, four trines, six clashes
  and six harms, nudged by the five-element generating and controlling cycles.
  The score is for fun.
- Some traditions change sign at Lichun (around 4 February) instead. This
  project uses Lunar New Year.

### Privacy

The birth date is read in the browser, used in memory and discarded when the
tab closes. There is no storage, no cookies, no analytics and no query string.
The Content Security Policy sets `connect-src 'none'`, so scripts cannot send
data anywhere. The share card carries sign, element and one trait only.

The one third-party request is Google Fonts (see the checklist below).

### In-app browsers

Built for Instagram and TikTok webviews:

- Animation uses `transform` and `opacity` only. Stars are painted once.
- `svh` / `lvh` units handle collapsing toolbars.
- Inputs are 16px or larger so iOS does not zoom on focus.
- Sharing uses the native share sheet where files are supported, and falls
  back to "press and hold the card to save".
- `prefers-reduced-motion` is respected.

## Before launch

- [ ] Fill the "This month" slot (`[data-slot="this-month"]` in `index.html`).
- [ ] Test on real devices inside Instagram and TikTok (iOS and Android).
- [ ] Self-host the fonts so no request goes to Google.
- [ ] Add an `og:image` and the final URL to the share text.
- [ ] Have the copy in `js/content.js` reviewed by someone who knows the tradition.
- [ ] Choose hosting (any static host works).
