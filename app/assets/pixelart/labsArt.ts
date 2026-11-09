/**
 * labsArt.ts — botol ramuan pixel art untuk halaman Labs.
 * Dua bentuk (potion, flask) x beberapa warna cairan -> CSS variable `--bt-<nama>`.
 */
import { Grid, sprite, toURL } from './pixelKit';

const SHAPES = {
  potion: [
    '....kkk....', '....kgk....', '...kgggk...', '....kbk....', '....kbk....', '...kbbbk...', '..kbbbbbk..',
    '.kbrrrrrbk.', '.krrRrrrrk.', '.krRrrrrrk.', '.krrrrrrrk.', '.krrrrrrrk.', '..krrrrrk..', '...kkkkk...',
  ],
  flask: [
    '.....kkk.....', '.....kgk.....', '....kbbbk....', '.....kbk.....', '....kbbbk....', '...kbbbbbk...', '..kbrrrrrbk..',
    '.kbrRrrrrrbk.', '.krRrrrrrrrk.', '.krrrrrrrrrk.', '.krrrrrrrrrk.', '..krrrrrrrk..', '...kkkkkkk...',
  ],
} as const;

const LIQUID = {
  wine: { r: '#783f46', R: '#a85860' },
  green: { r: '#4f7a3e', R: '#82a05a' },
  blue: { r: '#3f6f96', R: '#7fa8cf' },
  gold: { r: '#b8742a', R: '#f0c060' },
} as const;

export type BottleShape = keyof typeof SHAPES;
export type Liquid = keyof typeof LIQUID;
export const BOTTLE_SIZES: Record<BottleShape, [number, number]> = { potion: [11, 14], flask: [13, 13] };

export function buildBottle(shape: BottleShape, liquid: Liquid): Grid {
  const rows = [...SHAPES[shape]];
  const [w, h] = BOTTLE_SIZES[shape];
  if (rows.some((r) => r.length !== w) || rows.length !== h) throw new Error(`botol ${shape}: ukuran sprite tidak sesuai ${w}x${h}`);
  return sprite(rows, { k: '#493927', g: '#94713a', b: '#e6dfc8', ...LIQUID[liquid] });
}

export const BOTTLES: [BottleShape, Liquid][] = [
  ['potion', 'wine'],
  ['potion', 'green'],
  ['flask', 'blue'],
  ['flask', 'gold'],
];

/** Ikon panah kecil (CSS mask, ikut warna teks). */
export const GLYPHS = {
  arrowLeft: ['...k...', '..kk...', '.kkkkkk', 'kkkkkkk', '.kkkkkk', '..kk...', '...k...'],
  arrowRight: ['...k...', '...kk..', 'kkkkkk.', 'kkkkkkk', 'kkkkkk.', '...kk..', '...k...'],
} as const;

export function renderLabsArt(root: HTMLElement): void {
  (Object.keys(GLYPHS) as (keyof typeof GLYPHS)[]).forEach((n) => root.style.setProperty(`--lg-${n}`, toURL(sprite([...GLYPHS[n]], { k: '#000000' }))));
  BOTTLES.forEach(([shape, liquid]) => root.style.setProperty(`--bt-${shape}-${liquid}`, toURL(buildBottle(shape, liquid))));
}