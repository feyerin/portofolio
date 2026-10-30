/**
 * contactArt.ts — pixel art untuk section Contact.
 * Gagak pembawa pesan (sprite sheet 3 frame), lingkaran sihir (2 frame),
 * dan ikon kecil (dipakai sebagai CSS mask supaya ikut warna teks).
 */
import { Grid, blit, outline, poly, rgb, sprite, toURL } from './pixelKit';

/* ───────── Gagak ───────── */

export const RAVEN_W = 26;
export const RAVEN_H = 22;
export const RAVEN_FRAMES = 3; // 0 bertengger, 1 sayap terangkat, 2 membawa surat

const BODY = rgb('#3a3340');
const BACK = rgb('#5a5064');
const BELLY = rgb('#4a4252');
const BEAK = rgb('#d3b875');
const LEG = rgb('#8a6a3a');
const INK = rgb('#1f1a24');

function raven(frame: 0 | 1 | 2): Grid {
  const g = new Grid(RAVEN_W, RAVEN_H, 1, 1);
  const dx = 5; // geser kanan supaya ada ruang untuk surat di paruh
  const P = (pts: [number, number][]) => pts.map(([x, y]) => [x + dx, y] as [number, number]);
  // dahan
  g.rect(dx - 1, 18, 21, 2, rgb('#6f5238'));
  g.rect(dx - 1, 18, 21, 1, rgb('#8f6c47'));
  g.rect(dx + 14, 16, 2, 2, rgb('#82a05a')); // daun kecil
  // kaki
  g.rect(dx + 9, 14, 1, 4, LEG);
  g.rect(dx + 13, 14, 1, 4, LEG);
  // ekor
  poly(g, P([[14, 10], [21, 15], [19, 17], [12, 13]]), INK);
  // badan + perut
  for (let y = 5; y <= 15; y++)
    for (let x = 4; x <= 18; x++) {
      const e = ((x - 11) / 7) ** 2 + ((y - 10.5) / 4.8) ** 2;
      if (e <= 1) g.set(x + dx, y, y >= 12 ? BELLY : BODY);
    }
  // kepala
  for (let y = 3; y <= 11; y++)
    for (let x = 2; x <= 10; x++) if (Math.hypot(x - 6.5, y - 7) <= 3.9) g.set(x + dx, y, BODY);
  // paruh
  poly(g, P([[1, 6.5], [4, 6], [4, 9], [1, 8]]), BEAK);
  g.set(5 + dx, 6, rgb('#fff6db')); // mata
  // sayap
  if (frame === 1) {
    poly(g, P([[8, 9], [4, 0], [10, 3], [13, 0], [17, 4], [18, 10]]), BACK);
    g.rect(10 + dx, 3, 1, 6, BODY);
    g.rect(14 + dx, 3, 1, 6, BODY);
  } else {
    poly(g, P([[8, 9], [16, 8], [20, 14], [10, 13]]), BACK);
    g.rect(11 + dx, 10, 7, 1, BODY);
  }
  // surat di paruh
  if (frame === 2) {
    g.rect(-1 + 0, 8, 8, 6, rgb('#f3dfaa'));
    g.rect(-1, 8, 8, 1, rgb('#d3b875'));
    for (let i = 0; i < 4; i++) { g.set(i, 9 + i, rgb('#94713a')); g.set(6 - i, 9 + i, rgb('#94713a')); }
    g.set(3, 12, rgb('#783f46'));
  }
  outline(g, INK);
  return g;
}

export function buildRavenSheet(): Grid {
  const sheet = new Grid(RAVEN_W * RAVEN_FRAMES, RAVEN_H);
  ([0, 1, 2] as const).forEach((f) => {
    const g = raven(f);
    for (let y = 0; y < RAVEN_H; y++) for (let x = 0; x < RAVEN_W; x++) sheet.data[y * sheet.w + f * RAVEN_W + x] = g.data[y * RAVEN_W + x] ?? 0;
  });
  return sheet;
}

/* ───────── Lingkaran sihir (2 frame: kotak lurus & kotak miring) ───────── */

export const RUNE = 41;

function runeFrame(diamond: boolean): Grid {
  const g = new Grid(RUNE, RUNE);
  const line = rgb('#c5b18a');
  const gold = rgb('#a1844e');
  const mid = 20;
  for (let y = 0; y < RUNE; y++)
    for (let x = 0; x < RUNE; x++) {
      const dx = x - mid;
      const dy = y - mid;
      const d = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      if (d <= 19.6 && d > 18.4) g.set(x, y, line);
      else if (d <= 16 && d > 15 && Math.floor(((a + Math.PI) / (Math.PI * 2)) * 32) % 2 === 0) g.set(x, y, line);
      const sq = diamond ? Math.abs(dx) + Math.abs(dy) <= 14 && Math.abs(dx) + Math.abs(dy) > 13 : Math.max(Math.abs(dx), Math.abs(dy)) <= 10 && Math.max(Math.abs(dx), Math.abs(dy)) > 9;
      if (sq) g.set(x, y, gold);
    }
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4 + (diamond ? Math.PI / 8 : 0);
    g.set(Math.round(mid + Math.cos(a) * 22.5 - 0.5), Math.round(mid + Math.sin(a) * 22.5 - 0.5), gold);
  }
  [[0, -2], [-1, -1], [0, -1], [1, -1], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]].forEach(([x, y]) => g.set(mid + (x as number), mid + (y as number), gold));
  return g;
}

export function buildRuneSheet(): Grid {
  const sheet = new Grid(RUNE * 2, RUNE);
  [false, true].forEach((d, f) => {
    const g = runeFrame(d);
    for (let y = 0; y < RUNE; y++) for (let x = 0; x < RUNE; x++) sheet.data[y * sheet.w + f * RUNE + x] = g.data[y * RUNE + x] ?? 0;
  });
  return sheet;
}

/* ───────── Ikon kecil (hitam; diwarnai lewat CSS mask) ───────── */

export const GLYPHS = {
  mail: ['kkkkkkkkkkk', 'kk.......kk', 'k.k.....k.k', 'k..k...k..k', 'k...k.k...k', 'k....k....k', 'k.........k', 'kkkkkkkkkkk'],
  copy: ['..kkkkkk.', '..k....k.', 'kkkkkk.k.', 'k....k.k.', 'k....k.k.', 'k....kkk.', 'k....k...', 'kkkkkk...'],
  check: ['.......kk', '......kk.', 'k....kk..', 'kk..kk...', '.kkkk....', '..kk.....'],
  arrowUp: ['...k...', '..kkk..', '.kkkkk.', 'kk.k.kk', '...k...', '...k...', '...k...'],
  arrowOut: ['..kkkkk', '...kkkk', '....kkk', '...k.kk', '..k...k', '.k.....', 'k......'],
} as const;
export type GlyphName = keyof typeof GLYPHS;

export function buildGlyph(name: GlyphName): Grid {
  return sprite([...GLYPHS[name]], { k: '#000000' });
}

/* ───────── Render ───────── */

export function renderContactArt(root: HTMLElement): void {
  root.style.setProperty('--ct-raven', toURL(buildRavenSheet()));
  root.style.setProperty('--ct-rune', toURL(buildRuneSheet()));
  (Object.keys(GLYPHS) as GlyphName[]).forEach((n) => root.style.setProperty(`--ct-${n}`, toURL(buildGlyph(n))));
}

export { blit };