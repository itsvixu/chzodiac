// Background starfield. Stars are painted once to a canvas (no per-frame
// drawing); a handful of DOM stars twinkle with CSS; scroll adds parallax.

/** Small seeded PRNG so the sky (and the share card) look the same every time. */
export function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_TINTS = ['255,255,255', '255,255,255', '255,244,214', '240,195,106', '255,170,150', '170,190,255'];

export function paintStars(ctx, width, height, count, seed) {
  const rand = seededRandom(seed);
  for (let i = 0; i < count; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const big = rand() > 0.92;
    const radius = (big ? 1.4 : 0.4) + rand() * 0.9;
    const tint = STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)];
    ctx.fillStyle = `rgba(${tint},${0.35 + rand() * 0.65})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function initSky({ canvas, twinkles, progress }) {
  const ctx = canvas.getContext('2d');
  let paintedWidth = 0;

  function paint() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // In-app browsers fire resize as their toolbars slide; only repaint on width change.
    if (!width || width === paintedWidth) return;
    paintedWidth = width;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    paintStars(ctx, width, height, Math.min(260, Math.round((width * height) / 3800)), 2027);
  }

  const rand = seededRandom(88);
  for (let i = 0; i < 14; i++) {
    const star = document.createElement('span');
    star.style.left = `${rand() * 100}%`;
    star.style.top = `${rand() * 100}%`;
    star.style.animationDelay = `${(rand() * -3.6).toFixed(2)}s`;
    star.style.animationDuration = `${(2.6 + rand() * 2.4).toFixed(2)}s`;
    twinkles.appendChild(star);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
      canvas.style.transform = `translate3d(0, ${(-ratio * 18).toFixed(2)}%, 0)`;
    });
  }

  paint();
  window.addEventListener('resize', paint, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  return { refresh: onScroll };
}
