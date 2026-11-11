// Draws the shareable card on a canvas. Evergreen by design: sign, element
// and one trait only. No birth date or year ever goes on the card.
import { paintStars } from './sky.js';
import { artImage } from './illustrations.js';

const W = 1080;
const H = 1350;
const GOLD = '#f0c36a';
const PAPER = '#f7efe0';
const CINNABAR = '#d63a2a';
const HAN = '"Ma Shan Zheng", "Kaiti SC", "STKaiti", "KaiTi", serif';
const DISPLAY = '"Cormorant Garamond", Georgia, serif';
const BODY = '"Atkinson Hyperlegible Next", system-ui, sans-serif';

/** Canvas text only uses web fonts that have finished loading. */
async function fontsReady(hanzi) {
  if (!document.fonts || !document.fonts.load) return;
  const loads = Promise.all([
    document.fonts.load(`400 100px "Ma Shan Zheng"`, hanzi),
    document.fonts.load(`600 100px "Cormorant Garamond"`),
    document.fonts.load(`italic 500 100px "Cormorant Garamond"`),
    document.fonts.load(`600 30px "Atkinson Hyperlegible Next"`),
  ]).catch(() => {});
  const timeout = new Promise((resolve) => setTimeout(resolve, 2500));
  await Promise.race([loads, timeout]);
}

function spaced(ctx, text, x, y, spacing) {
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${spacing}px`;
    ctx.fillText(text, x + spacing / 2, y);
    ctx.letterSpacing = '0px';
  } else {
    ctx.fillText(text, x, y);
  }
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw(ctx, { sign, element, animalIndex, art }) {
  const cx = W / 2;
  const cy = 520;

  // Night sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#07061a');
  sky.addColorStop(0.55, '#120e36');
  sky.addColorStop(1, '#2a0d1f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const ember = ctx.createRadialGradient(cx, H + 80, 0, cx, H + 80, 760);
  ember.addColorStop(0, 'rgba(214,58,42,0.42)');
  ember.addColorStop(1, 'rgba(214,58,42,0)');
  ctx.fillStyle = ember;
  ctx.fillRect(0, 0, W, H);

  ctx.globalAlpha = 0.3;
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 520);
  glow.addColorStop(0, element.color);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.scale(2, 2);
  paintStars(ctx, W / 2, H / 2, 170, 100 + animalIndex);
  ctx.restore();

  // Frame
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  roundedRect(ctx, 40, 40, W - 80, H - 80, 28);
  ctx.stroke();
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.5;
  roundedRect(ctx, 58, 58, W - 116, H - 116, 16);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Orbits with twelve markers; the user's sign sits at the top
  ctx.strokeStyle = 'rgba(240,195,106,0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 12]);
  ctx.beginPath();
  ctx.arc(cx, cy, 340, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(240,195,106,0.22)';
  ctx.beginPath();
  ctx.arc(cx, cy, 270, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * 340;
    const y = cy + Math.sin(angle) * 340;
    ctx.fillStyle = i === 0 ? CINNABAR : GOLD;
    ctx.beginPath();
    ctx.arc(x, y, i === 0 ? 13 : 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Eyebrow
  ctx.fillStyle = GOLD;
  ctx.font = `600 30px ${BODY}`;
  spaced(ctx, 'CHINESE ZODIAC', cx, 128, 10);

  // The sign: star-line drawing, or the character if the drawing could not load
  ctx.save();
  ctx.shadowColor = 'rgba(240,195,106,0.55)';
  ctx.shadowBlur = 36;
  if (art) {
    ctx.drawImage(art, cx - 235, cy - 235, 470, 470);
  } else {
    ctx.fillStyle = GOLD;
    ctx.font = `400 400px ${HAN}`;
    ctx.textBaseline = 'middle';
    ctx.fillText(sign.hanzi, cx, cy + 10);
  }
  ctx.restore();

  // Seal: the sign's character with a drawing, the element's character without
  ctx.save();
  ctx.translate(800, 742);
  ctx.rotate(-0.07);
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = CINNABAR;
  roundedRect(ctx, -62, -62, 124, 124, 18);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = PAPER;
  ctx.font = `400 92px ${HAN}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(art ? sign.hanzi : element.hanzi, 0, 4);
  ctx.restore();

  // Name
  ctx.font = `600 132px ${DISPLAY}`;
  const elementWidth = ctx.measureText(`${element.name} `).width;
  const total = ctx.measureText(`${element.name} ${sign.name}`).width;
  ctx.textAlign = 'left';
  ctx.fillStyle = element.color;
  ctx.fillText(element.name, cx - total / 2, 1020);
  ctx.fillStyle = PAPER;
  ctx.fillText(sign.name, cx - total / 2 + elementWidth, 1020);
  ctx.textAlign = 'center';

  // Trait
  ctx.fillStyle = GOLD;
  ctx.fillRect(cx - 40, 1062, 80, 2);
  ctx.fillStyle = PAPER;
  ctx.font = `italic 500 68px ${DISPLAY}`;
  ctx.fillText(sign.cardTrait, cx, 1150);

  // Footer
  ctx.fillStyle = 'rgba(247,239,224,0.85)';
  ctx.font = `600 28px ${BODY}`;
  spaced(ctx, 'FIND YOUR SIGN', cx, 1252, 8);
}

/**
 * @returns {Promise<{ dataUrl: string, file: File | null }>}
 * `file` is prepared up front so navigator.share can run inside the tap.
 */
export async function renderCard({ sign, element, animalIndex }) {
  await fontsReady(sign.hanzi + element.hanzi);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const art = await artImage(animalIndex, 940).catch(() => null);

  let dataUrl;
  try {
    draw(ctx, { sign, element, animalIndex, art });
    dataUrl = canvas.toDataURL('image/png');
  } catch {
    // A few older webviews refuse to export a canvas that holds an SVG image.
    // Start again on a clean canvas with the character in place of the drawing.
    canvas.width = W;
    draw(canvas.getContext('2d'), { sign, element, animalIndex, art: null });
    dataUrl = canvas.toDataURL('image/png');
  }

  let file = null;
  try {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (blob) file = new File([blob], 'my-chinese-zodiac.png', { type: 'image/png' });
  } catch {
    // Older webviews without File/toBlob: the long-press fallback still works.
  }
  return { dataUrl, file };
}
