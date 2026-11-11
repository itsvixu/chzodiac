// Star-line illustrations: one gold line drawing per sign, on a 240 x 240 grid.
//
// Each drawing is a string of plain SVG shapes. Every stroked shape carries
// class="ln" and pathLength="1" so CSS can "draw" it with a single dash value, and moving
// parts sit in <g data-anim="..." data-origin="x y"> groups (see styles.css).
// The same markup is rasterised for the share card, so keep it free of CSS
// dependencies: colours are presentation attributes on the root group.

const GOLD = '#f0c36a';
const FILL = '#130f3d'; // dark fill hides the lines of shapes behind

/* ---------- Tiny shape helpers -------------------------------------------- */

const shape = (d) => `<path class="ln" pathLength="1" d="${d}"/>`;
const line = (d) => `<path class="ln" pathLength="1" fill="none" d="${d}"/>`;
const circle = (cx, cy, r) => `<circle class="ln" pathLength="1" cx="${cx}" cy="${cy}" r="${r}"/>`;
const ellipse = (cx, cy, rx, ry, rot = 0) => `<ellipse class="ln" pathLength="1" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const dot = (cx, cy, r) => `<circle class="eye" fill="${GOLD}" stroke="none" cx="${cx}" cy="${cy}" r="${r}"/>`;
const eyes = (...points) => `<g data-anim="blink">${points.map(([x, y, r = 5.5]) => dot(x, y, r)).join('')}</g>`;
const group = (anim, origin, ...kids) => `<g data-anim="${anim}" data-origin="${origin}">${kids.join('')}</g>`;

/* ---------- Shared parts for the front-facing, sitting animals ------------- */

const BODY = ellipse(120, 182, 46, 40);
const BELLY = ellipse(120, 188, 26, 25);
const FEET = ellipse(96, 220, 17, 9) + ellipse(144, 220, 17, 9);
const HEAD = circle(120, 96, 46);
const head = (...kids) => group('tilt', '120 140', ...kids);
const mouth = (y) => line(`M120 ${y} v5 M120 ${y + 5} q-7 7 -14 2 M120 ${y + 5} q7 7 14 2`);

/* ---------- The twelve signs, Rat first ----------------------------------- */

const ART = [
  // Rat: big round ears, whiskers, front teeth, long tail
  group('sway', '160 200', line('M160 200 C 200 206, 218 182, 206 160 C 199 147, 212 136, 224 142'))
  + BODY + BELLY + FEET
  + head(
    circle(78, 60, 24), circle(78, 60, 13), circle(162, 60, 24), circle(162, 60, 13),
    HEAD,
    eyes([104, 92], [136, 92]),
    line('M100 110 L74 104 M100 116 L74 122 M140 110 L166 104 M140 116 L166 122'),
    dot(120, 107, 5),
    mouth(112),
    shape('M116 121 v8 h8 v-8'),
  ),

  // Ox: horns, wide muzzle, nose ring
  group('sway', '160 196', line('M160 196 C 190 196, 200 176, 196 160'), shape('M196 160 c-8 -8 -4 -18 2 -20 c6 6 6 14 -2 20 Z'))
  + BODY + FEET
  + head(
    shape('M88 66 C 66 64, 52 46, 58 26 C 66 42, 80 50, 100 54 Z'),
    shape('M152 66 C 174 64, 188 46, 182 26 C 174 42, 160 50, 140 54 Z'),
    ellipse(66, 92, 17, 9, -20), ellipse(174, 92, 17, 9, 20),
    HEAD,
    eyes([102, 86], [138, 86]),
    ellipse(120, 118, 30, 19),
    dot(109, 115, 3.5), dot(131, 115, 3.5),
    line('M112 127 a8 9 0 0 0 16 0'),
  ),

  // Tiger: stripes on brow, cheeks, body and tail
  group('sway', '160 196', line('M160 196 C 198 198, 214 168, 200 142'), line('M186 191 l6 -9 M201 176 l9 -4 M204 157 l9 2'))
  + BODY + BELLY + FEET
  + line('M78 172 h13 M76 186 h13 M162 172 h-13 M164 186 h-13')
  + head(
    circle(84, 58, 17), circle(84, 58, 8), circle(156, 58, 17), circle(156, 58, 8),
    HEAD,
    line('M120 52 v15 M107 55 l3 13 M133 55 l-3 13'),
    line('M76 92 h13 M77 104 h12 M164 92 h-13 M163 104 h-12'),
    eyes([104, 90], [136, 90]),
    shape('M113 104 h14 l-7 8 Z'),
    mouth(112),
  ),

  // Rabbit: tall ears, buck teeth, round tail
  circle(166, 204, 12)
  + BODY + BELLY + FEET
  + head(
    group('twitch', '100 64', ellipse(100, 36, 13, 34, -8), line('M100 18 L101 54')),
    ellipse(140, 36, 13, 34, 8), line('M140 18 L139 54'),
    circle(120, 100, 42),
    eyes([105, 96], [135, 96]),
    line('M98 110 L76 106 M98 115 L76 119 M142 110 L164 106 M142 115 L164 119'),
    shape('M115 106 h10 l-5 6 Z'),
    mouth(112),
    shape('M117 121 v7 h6 v-7'),
  ),

  // Dragon: swept horns, long whiskers, plated belly, flame-tipped tail
  group('sway', '160 198',
    line('M160 198 C 204 204, 224 170, 206 146'),
    shape('M206 146 C 196 134, 204 120, 214 114 C 212 124, 224 128, 222 140 C 220 148, 212 150, 206 146 Z'))
  + BODY + BELLY + line('M97 178 h46 M95 190 h50 M99 202 h42') + FEET
  + head(
    shape('M100 58 C 96 40, 86 28, 70 22 C 77 36, 81 50, 85 66 Z'),
    shape('M140 58 C 144 40, 154 28, 170 22 C 163 36, 159 50, 155 66 Z'),
    shape('M77 88 L60 84 L73 104 Z'), shape('M163 88 L180 84 L167 104 Z'),
    HEAD,
    line('M94 80 q9 -6 18 0 M128 80 q9 -6 18 0'),
    eyes([104, 92], [136, 92]),
    line('M92 120 C 70 118, 58 132, 64 150 M148 120 C 170 118, 182 132, 176 150'),
    ellipse(120, 118, 30, 17),
    dot(110, 114, 3.5), dot(130, 114, 3.5),
    line('M106 124 Q120 133 134 124'),
  ),

  // Snake: three coils, raised head, forked tongue
  group('sway', '54 206', line('M54 206 C 36 208, 26 194, 36 182'))
  + ellipse(120, 204, 70, 22) + ellipse(120, 180, 54, 20) + ellipse(120, 158, 38, 17)
  + line('M82 207 q8 6 16 0 M112 211 q8 6 16 0 M142 207 q8 6 16 0')
  + group('tilt', '120 158',
    shape('M102 156 C 96 124, 104 100, 120 88 L148 100 C 136 112, 132 132, 138 156 Z'),
    ellipse(138, 82, 27, 20, -12),
    eyes([128, 80], [149, 76]),
    line('M150 91 q6 3 12 -3'),
    group('flick', '163 86', line('M163 86 L178 90 M178 90 l9 -4 M178 90 l7 6')),
  ),

  // Horse: long tapering face, leaf ears, mane on both sides, flowing tail
  group('sway', '162 190', shape('M162 188 C 198 182, 210 208, 198 228 C 194 212, 182 204, 164 208 Z'))
  + BODY + FEET
  + head(
    shape('M94 64 C 78 70, 72 84, 77 96 L67 100 C 69 110, 72 117, 77 123 L66 129 C 70 139, 79 143, 91 140 L95 120 Z'),
    shape('M146 64 C 162 70, 168 84, 163 96 L173 100 C 171 110, 168 117, 163 123 L174 129 C 170 139, 161 143, 149 140 L145 120 Z'),
    shape('M96 62 C 90 46, 94 34, 100 28 C 108 38, 110 50, 108 58 Z'),
    shape('M144 62 C 150 46, 146 34, 140 28 C 132 38, 130 50, 132 58 Z'),
    shape('M90 78 C 90 52, 150 52, 150 78 C 150 104, 142 122, 140 136 C 140 152, 100 152, 100 136 C 98 122, 90 104, 90 78 Z'),
    shape('M108 56 C 110 70, 116 80, 122 84 C 124 74, 130 66, 132 56 Z'),
    eyes([105, 94], [135, 94]),
    line('M101 124 Q120 116 139 124'),
    dot(112, 135, 3.4), dot(128, 135, 3.4),
  ),

  // Goat: ridged horns, drooping ears, beard, woolly coat
  group('wag', '160 178', shape('M160 176 C 174 168, 182 172, 180 182 C 174 184, 166 184, 160 180 Z'))
  + BODY
  + line('M92 174 q9 -9 18 0 q10 -9 20 0 q9 -9 18 0 M98 192 q8 -8 16 0 q6 -8 12 0 q8 -8 16 0')
  + FEET
  + head(
    shape('M102 60 C 96 34, 78 20, 58 22 C 71 30, 79 44, 83 66 Z'),
    shape('M138 60 C 144 34, 162 20, 182 22 C 169 30, 161 44, 157 66 Z'),
    line('M91 46 l9 -4 M82 35 l8 -6 M149 46 l-9 -4 M158 35 l-8 -6'),
    shape('M80 84 C 62 82, 48 92, 46 108 C 60 110, 73 103, 82 94 Z'),
    shape('M160 84 C 178 82, 192 92, 194 108 C 180 110, 167 103, 158 94 Z'),
    shape('M110 136 C 112 150, 116 160, 120 170 C 124 160, 128 150, 130 136 Z'),
    shape('M120 52 C 150 52, 164 74, 160 100 C 157 124, 140 140, 120 140 C 100 140, 83 124, 80 100 C 76 74, 90 52, 120 52 Z'),
    line('M104 66 q8 -9 16 0 q8 -9 16 0'),
    eyes([104, 92], [136, 92]),
    shape('M114 108 h12 l-6 7 Z'),
    mouth(115),
  ),

  // Monkey: face mask, round ears, curled tail, holding a peach
  group('sway', '152 196', line('M152 196 C 204 198, 222 150, 198 126 C 178 108, 154 126, 168 144 C 177 154, 190 146, 186 136'))
  + group('wave', '90 170',
    line('M90 170 C 70 168, 54 160, 48 146'),
    circle(44, 128, 15),
    shape('M43 114 C 39 103, 27 101, 21 105 C 25 115, 35 117, 43 114 Z'))
  + BODY + BELLY + line('M152 168 C 164 178, 166 192, 160 204') + FEET
  + head(
    circle(70, 92, 20), circle(70, 92, 10), circle(170, 92, 20), circle(170, 92, 10),
    HEAD,
    shape('M118 52 C 110 38, 122 30, 128 34 C 122 40, 126 46, 130 52 Z'),
    shape('M120 72 C 104 56, 80 70, 85 94 C 79 114, 98 132, 120 132 C 142 132, 161 114, 155 94 C 160 70, 136 56, 120 72 Z'),
    eyes([104, 94], [136, 94]),
    line('M115 107 q5 4 10 0'),
    line('M106 116 Q120 128 134 116'),
  ),

  // Rooster: side on, comb and wattle, fanned tail
  group('fan', '162 146',
    shape('M158 134 C 156 92, 174 58, 200 42 C 198 76, 188 110, 174 146 Z'),
    shape('M160 138 C 172 96, 202 70, 230 64 C 216 94, 198 126, 178 152 Z'),
    shape('M162 142 C 186 110, 216 102, 236 108 C 220 128, 202 146, 180 158 Z'),
    shape('M166 150 C 190 138, 214 140, 232 152 C 212 162, 192 168, 174 164 Z'))
  + line('M112 190 L110 218 M110 218 l-14 4 M110 218 l-2 8 M110 218 l12 5')
  + line('M138 190 L140 218 M140 218 l-14 4 M140 218 l-2 8 M140 218 l12 5')
  + group('bob', '125 218',
    shape('M88 60 C 80 44, 94 36, 99 50 C 98 32, 116 32, 113 50 C 122 40, 132 50, 121 64 Z'),
    shape('M84 70 C 84 52, 118 50, 122 74 C 124 96, 128 116, 150 122 C 178 126, 188 152, 172 174 C 158 196, 112 200, 92 182 C 68 164, 72 128, 84 104 C 86 92, 84 82, 84 70 Z'),
    shape('M85 68 L60 77 L86 84 Z'),
    shape('M88 86 C 78 96, 82 112, 92 106 C 97 100, 94 92, 88 86 Z'),
    shape('M110 138 C 130 126, 162 132, 168 152 C 150 170, 122 166, 110 138 Z'),
    line('M124 142 C 136 140, 148 144, 156 152 M122 150 C 132 150, 142 154, 148 160'),
    eyes([98, 70, 4]),
  ),

  // Dog: floppy ears, big nose, tongue out, collar, wagging tail
  group('wag', '160 182', line('M160 182 C 186 174, 198 152, 190 134'))
  + BODY + BELLY + FEET
  + head(
    HEAD,
    shape('M86 60 C 64 60, 52 84, 58 114 C 72 112, 86 98, 92 76 Z'),
    shape('M154 60 C 176 60, 188 84, 182 114 C 168 112, 154 98, 148 76 Z'),
    eyes([104, 90], [136, 90]),
    ellipse(120, 116, 24, 18),
    dot(120, 107, 7),
    line('M120 114 v5 M120 119 q-7 7 -14 1 M120 119 q7 7 14 1'),
    shape('M116 124 v8 a6 6 0 0 0 12 0 v-8'),
    line('M92 138 Q120 156 148 138'),
    circle(120, 153, 6),
  ),

  // Pig: wide head, forward ears, big snout, curly tail
  group('sway', '164 186', line('M164 186 C 186 186, 198 172, 190 160 C 182 150, 168 158, 174 168 C 180 176, 194 172, 200 160'))
  + BODY + BELLY + FEET
  + head(
    shape('M84 72 C 70 62, 64 46, 70 34 C 86 36, 102 46, 108 60 Z'),
    shape('M156 72 C 170 62, 176 46, 170 34 C 154 36, 138 46, 132 60 Z'),
    ellipse(120, 98, 51, 44),
    eyes([97, 86], [143, 86]),
    ellipse(120, 106, 25, 18),
    dot(112, 106, 4), dot(128, 106, 4),
    line('M106 129 Q120 139 134 129'),
  ),
];

/* ---------- Output --------------------------------------------------------- */

/**
 * SVG markup for a sign (0 = Rat ... 11 = Pig).
 * `size` adds width/height and the xmlns, which the share card needs to load it as an image.
 */
export function artSvg(animalIndex, { size = null, strokeWidth = 3 } = {}) {
  const standalone = size ? ` xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"` : '';
  return `<svg${standalone} viewBox="0 0 240 240" aria-hidden="true" focusable="false">`
    + `<g fill="${FILL}" stroke="${GOLD}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">`
    + ART[animalIndex]
    + '</g></svg>';
}

/** Puts a sign's drawing into `container` and sets the pivot of each moving part. */
export function mountArt(container, animalIndex) {
  container.innerHTML = artSvg(animalIndex);
  for (const part of container.querySelectorAll('[data-origin]')) {
    // Set from script, not a style attribute, so the Content Security Policy allows it.
    const [x, y] = part.dataset.origin.split(' ');
    part.style.transformOrigin = `${x}px ${y}px`;
  }
}

/** The drawing as an image the share card can paint onto its canvas. */
export function artImage(animalIndex, size) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artSvg(animalIndex, { size, strokeWidth: 3.2 }))}`;
  });
}
