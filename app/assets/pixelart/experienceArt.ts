/**
 * experienceArt.ts — pixel art untuk section "Guild Records".
 * Lambang guild, pin lokasi, permata, dan api obor (sprite sheet animasi).
 * Hasilnya jadi CSS variable `--ex-*` berisi data-URL sprite.
 */
import { Grid, outline, rgb, sprite, toURL } from './pixelKit';

const PAL: Record<string, string> = {
  k: '#493927', g: '#94713a', G: '#d3b875', h: '#f3dfaa', w: '#fff6db',
  r: '#783f46', R: '#a85860', P: '#e3a3a8',
};
const c = (k: string) => rgb(PAL[k] as string);

export const SIZES = {
  crest: [23, 25],
  pin: [7, 8],
  gem: [9, 9],
  gemRed: [9, 9],
  flame: [28, 9], // 4 frame @ 7x9
} as const;
export type SpriteName = keyof typeof SIZES;

function poly(g: Grid, pts: [number, number][], color: number) {
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      let inside = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i] as [number, number];
        const [xj, yj] = pts[j] as [number, number];
        if (yi > y + 0.5 !== yj > y + 0.5 && x + 0.5 < ((xj - xi) * (y + 0.5 - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) g.set(x, y, color);
    }
}

/** Lambang guild: perisai emas + burgundy dengan simbol </> di tengah. */
function crest(): Grid {
  const g = new Grid(23, 25, 1, 1); // margin 1px supaya outline tidak terpotong
  poly(g, [[0, 0], [21, 0], [21, 14], [10.5, 23], [0, 14]], c('g'));
  poly(g, [[2, 2], [19, 2], [19, 13], [10.5, 20.5], [2, 13]], c('r'));
  g.rect(2, 2, 17, 1, c('R')); // sorot atas
  const glyph = c('w');
  [[7, 7], [6, 8], [5, 9], [6, 10], [7, 11], [14, 7], [15, 8], [16, 9], [15, 10], [14, 11], [11, 6], [11, 7], [10, 8], [10, 9], [9, 10], [9, 11]].forEach(([x, y]) => g.set(x as number, y as number, glyph));
  g.rect(8, 15, 5, 1, c('G')); // hiasan bawah
  g.rect(9, 16, 3, 1, c('G'));
  outline(g, c('k'));
  return g;
}

function gem(light: string, mid: string, dark: string): Grid {
  const g = new Grid(9, 9, 1, 1);
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 7; x++) {
      if (Math.abs(x - 3) + Math.abs(y - 3) > 3) continue;
      const lit = x + y < 5 && x <= 3;
      g.set(x, y, rgb(lit ? light : x + y > 6 ? dark : mid));
    }
  g.set(2, 2, rgb('#ffffff'));
  outline(g, c('k'));
  return g;
}

const FLAME = [
  ['...o...', '...o...', '..ooo..', '..oyo..', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
  ['..o....', '..oo...', '..ooo..', '.ooyo..', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
  ['...o...', '...oo..', '..ooo..', '..oyo..', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
  ['....o..', '...oo..', '..ooo..', '..oyoo.', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
];

function flameSheet(): Grid {
  const pal = { o: '#f0762c', y: '#ffc24a', w: '#fff2b0', r: '#b8402a' };
  const sheet = new Grid(7 * FLAME.length, 9);
  FLAME.forEach((rows, f) => {
    const s = sprite(rows, pal);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 7; x++) sheet.data[y * sheet.w + f * 7 + x] = s.data[y * 7 + x] ?? 0;
  });
  return sheet;
}

export function buildSprite(name: SpriteName): Grid {
  switch (name) {
    case 'crest': return crest();
    case 'gem': return gem('#f3dfaa', '#d3b875', '#94713a');
    case 'gemRed': return gem('#e3a3a8', '#a85860', '#783f46');
    case 'flame': return flameSheet();
    default: return sprite(['..kkk..', '.krrrk.', 'krRrrrk', 'krrwrrk', 'krrrrrk', '.krrrk.', '..krk..', '...k...'], PAL);
  }
}

export function renderExperienceArt(root: HTMLElement): void {
  (Object.keys(SIZES) as SpriteName[]).forEach((n) => root.style.setProperty(`--ex-${n}`, toURL(buildSprite(n))));
}