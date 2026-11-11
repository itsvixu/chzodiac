// UI wiring. Everything stays in memory for the life of the page:
// no localStorage, cookies, analytics or network requests.
import { parseBirthDate, getZodiac, compatibility, formatDate, ANIMALS } from './zodiac.js';
import {
  SIGNS, ELEMENT_INFO, POLARITY_INFO, ANIMAL_RELATION_COPY, ELEMENT_RELATION_COPY,
} from './content.js';
import { initSky } from './sky.js';
import { renderCard } from './card.js';
import { mountArt } from './illustrations.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
/** True when the device asks for less motion. */
const reducedMotion = () => motionQuery.matches;

const story = $('#story');
const revealSection = $('#reveal');
const wheel = $('#wheel');
const ring = $('#wheel-ring');
const shareHint = $('#share-hint');
const shareSteps = $('#share-steps');
const DEFAULT_SHARE_HINT = shareHint.textContent;

let you = null; // the current reading; gone as soon as the tab closes
let card = null;
let revealTimer = 0;

const sky = initSky({ canvas: $('#sky'), twinkles: $('#twinkles'), progress: $('#progress') });

/* ---------- Date forms ---------------------------------------------------- */

function mountDateForm(form, onDate) {
  form.appendChild($('#date-fields').content.cloneNode(true));
  $('legend', form).textContent = form.dataset.legend;
  $('button', form).textContent = form.dataset.submit;

  const inputs = ['day', 'month', 'year'].map((name) => form.elements[name]);
  const error = $('.date-form__error', form);

  inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, input.maxLength);
      input.removeAttribute('aria-invalid');
      error.textContent = '';
      if (input.value.length === input.maxLength && inputs[i + 1]) inputs[i + 1].focus();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && input.value === '' && inputs[i - 1]) inputs[i - 1].focus();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    const result = parseBirthDate(...inputs.map((input) => input.value));
    if (!result.ok) {
      error.textContent = result.message;
      const field = form.elements[result.field];
      field.setAttribute('aria-invalid', 'true');
      field.focus();
      return;
    }
    error.textContent = '';
    whenKeyboardCloses(() => onDate(result.date));
  });

  return {
    reset() {
      form.reset();
      error.textContent = '';
      inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    },
  };
}

/* ---------- Scroll-in reveals --------------------------------------------- */

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

function armReveals() {
  $$('.chapter', story).forEach((chapter) => {
    $$('[data-reveal]', chapter).forEach((el, i) => {
      el.classList.remove('in');
      el.style.setProperty('--i', i);
      revealObserver.observe(el);
    });
  });
}

let settleTimer = 0;

function scrollToEl(el) {
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  // Safety net: if something cut the scroll short (a closing keyboard, a
  // collapsing toolbar), finish the job once things have settled.
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    if (Math.abs(el.getBoundingClientRect().top) > 12) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, 900);
}

// Never fight the visitor: if they start scrolling themselves, leave it alone.
for (const type of ['touchstart', 'wheel']) {
  window.addEventListener(type, () => clearTimeout(settleTimer), { passive: true });
}

/**
 * Closes the on-screen keyboard, then runs `callback` once it has gone.
 * On Android the visible area is still growing while the keyboard slides
 * away, and a scroll started during that time stops short of its target.
 */
function whenKeyboardCloses(callback) {
  const viewport = window.visualViewport;
  const keyboardHeight = () => (viewport ? window.innerHeight - viewport.height : 0);
  const wasOpen = keyboardHeight() > 120;
  document.activeElement?.blur();
  if (!wasOpen) { callback(); return; }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    viewport.removeEventListener('resize', onResize);
    requestAnimationFrame(callback);
  };
  const onResize = () => { if (keyboardHeight() < 120) finish(); };
  viewport.addEventListener('resize', onResize);
  setTimeout(finish, 600); // in case no resize event arrives
}

/* ---------- Reveal -------------------------------------------------------- */

SIGNS.forEach((sign, i) => {
  const glyph = document.createElement('span');
  glyph.className = 'wheel__glyph';
  glyph.textContent = sign.hanzi;
  glyph.style.setProperty('--a', `${i * 30}deg`);
  ring.appendChild(glyph);
});

function bind(values) {
  for (const el of $$('[data-bind]', story)) {
    const key = el.dataset.bind;
    if (key in values) el.textContent = values[key];
  }
}

function showReading(date) {
  const zodiac = getZodiac(date);
  const sign = SIGNS[zodiac.animalIndex];
  const element = ELEMENT_INFO[zodiac.elementIndex];
  const polarity = POLARITY_INFO[zodiac.polarity];
  you = { ...zodiac, sign, elementInfo: element };

  const newYear = formatDate(zodiac.newYear);
  const note = zodiac.bornBeforeNewYear
    ? `Lunar New Year fell on ${newYear}, after your birthday, so you belong to the year before.`
    : `The Year of the ${sign.name} began on ${newYear}.`;

  root.style.setProperty('--element', element.color);
  bind({
    hanzi: sign.hanzi,
    animal: sign.name,
    pinyin: sign.pinyin,
    zodiacYear: zodiac.zodiacYear,
    note,
    blurb: sign.blurb,
    strength: sign.strength,
    watch: sign.watch,
    element: element.name,
    elementHanzi: element.hanzi,
    elementBlurb: element.blurb,
    planet: element.planet,
    season: element.season,
    polarity: zodiac.polarity,
    polarityHanzi: polarity.hanzi,
    polarityBlurb: polarity.blurb,
  });

  $('#trait-chips').replaceChildren(...sign.traits.map((trait) => {
    const li = document.createElement('li');
    li.textContent = trait;
    li.setAttribute('data-reveal', '');
    return li;
  }));

  $('#cycle').replaceChildren(...ELEMENT_INFO.map((info, i) => {
    const li = document.createElement('li');
    const han = document.createElement('span');
    han.className = 'han';
    han.textContent = info.hanzi;
    li.append(han, info.name);
    if (i === zodiac.elementIndex) li.setAttribute('aria-current', 'true');
    return li;
  }));

  mountArt($('#wheel-art'), zodiac.animalIndex);

  // Reset the wheel, then spin it so the user's sign lands under the pointer.
  clearTimeout(revealTimer);
  wheel.classList.remove('is-live');
  revealSection.classList.remove('is-live');
  ring.style.setProperty('--turn', '0deg');
  $$('.wheel__glyph', ring).forEach((glyph, i) => {
    glyph.classList.toggle('is-picked', i === zodiac.animalIndex);
  });

  friendForm.reset();
  $('#match').hidden = true;
  prepareCard();

  story.hidden = false;
  armReveals();
  scrollToEl(revealSection);
  sky.refresh();

  revealTimer = setTimeout(() => {
    wheel.classList.add('is-live');
    revealSection.classList.add('is-live');
    ring.style.setProperty('--turn', `${-720 - zodiac.animalIndex * 30}deg`);
    $('#reveal-name').focus({ preventScroll: true });
  }, reducedMotion() ? 0 : 450);
}

/* ---------- Share card ---------------------------------------------------- */

const cardImg = $('#card-img');
const saveLink = $('#save-link');

async function prepareCard() {
  card = null;
  shareHint.textContent = DEFAULT_SHARE_HINT;
  shareSteps.hidden = true;
  const reading = you;
  const rendered = await renderCard({
    sign: reading.sign, element: reading.elementInfo, animalIndex: reading.animalIndex,
  });
  if (reading !== you) return; // a newer reading replaced this one
  card = rendered;
  cardImg.src = rendered.dataUrl;
  cardImg.alt = `Card: ${reading.element} ${reading.animal}, ${reading.sign.cardTrait}.`;
  saveLink.href = rendered.dataUrl;
}

const pageUrl = () => location.origin + location.pathname; // never includes a birth date

function showSaveSteps(message) {
  shareHint.textContent = message;
  shareSteps.hidden = false;
  scrollToEl($('.card-frame'));
}

// One button, the phone's own share menu. That menu lists the apps the visitor
// actually has (Instagram, WhatsApp, Facebook...) and can pass the image itself,
// which brand buttons on a web page cannot do.
$('#share-btn').addEventListener('click', async () => {
  if (!card || !you) return;
  const data = {
    title: `I'm a ${you.element} ${you.animal}`,
    text: `I'm a ${you.element} ${you.animal} in the Chinese zodiac. What are you?`,
    url: pageUrl(),
  };
  try {
    if (card.file && navigator.canShare?.({ files: [card.file] })) {
      await navigator.share({ ...data, files: [card.file] });
      return;
    }
    if (navigator.share) {
      // Link-only share (some in-app browsers cannot pass images).
      await navigator.share(data);
      showSaveSteps('Link shared. To share the card itself:');
      return;
    }
  } catch (error) {
    if (error.name === 'AbortError') return; // visitor closed the share menu
  }
  showSaveSteps('Sharing is switched off in this browser. To share your card:');
});

// The download attribute is ignored inside most in-app browsers.
saveLink.addEventListener('click', () => {
  shareHint.textContent = 'If nothing downloads, press and hold the card and choose Save to Photos.';
});

const copyLink = $('#copy-link');
if (!navigator.clipboard?.writeText) copyLink.hidden = true;
copyLink.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(pageUrl());
    shareHint.textContent = 'Link copied. Paste it anywhere.';
  } catch {
    shareHint.textContent = `Copy this link: ${pageUrl()}`;
  }
});

/* ---------- Compatibility ------------------------------------------------- */

function countUp(el, target) {
  if (reducedMotion()) { el.textContent = target; return; }
  const start = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = Math.round(target * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function showMatch(date) {
  if (!you) return;
  const friend = getZodiac(date);
  const result = compatibility(you, friend);
  const copy = ANIMAL_RELATION_COPY[result.animal];
  const values = {
    youHanzi: you.sign.hanzi,
    friendHanzi: SIGNS[friend.animalIndex].hanzi,
    youName: `${you.element} ${you.animal}`,
    friendName: `${friend.element} ${ANIMALS[friend.animalIndex]}`,
    title: copy.title,
    text: copy.text,
    elements: ELEMENT_RELATION_COPY[result.element](you.element, friend.element),
  };

  const match = $('#match');
  for (const el of $$('[data-match]', match)) el.textContent = values[el.dataset.match];

  match.hidden = true; // restart the entrance animation on repeat checks
  void match.offsetWidth;
  match.hidden = false;
  countUp($('#match-score'), result.score);
  scrollToEl(match);
  $('#match-title').focus({ preventScroll: true });
  sky.refresh();
}

/* ---------- Boot ---------------------------------------------------------- */

const birthForm = mountDateForm($('#birth-form'), showReading);
const friendForm = mountDateForm($('#friend-form'), showMatch);

$('#restart').addEventListener('click', () => {
  you = null;
  card = null;
  clearTimeout(revealTimer);
  birthForm.reset();
  friendForm.reset();
  cardImg.removeAttribute('src');
  saveLink.removeAttribute('href');
  story.hidden = true;
  window.scrollTo({ top: 0, behavior: 'auto' });
  sky.refresh();
  $('#birth-form').elements.day.focus({ preventScroll: true });
});
