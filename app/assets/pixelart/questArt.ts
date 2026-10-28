/**
 * questArt.ts — pixel art untuk section "Quest Board".
 * Ikon item (potion, pedang, perisai, ...) dan tile pemandangan per proyek.
 * Semua jadi CSS variable (`--ic-*`, `--tile-*`) berisi data-URL sprite.
 */
import { Grid, outline, rgb, sprite, toURL } from './pixelKit';

const PAL: Record<string, string> = {
  k: '#493927', // outline cokelat tinta
  K: '#2e261f',
  g: '#94713a', // emas tua
  G: '#d3b875', // emas
  h: '#f3dfaa', // sorot krem
  w: '#fff6db',
  r: '#783f46', // burgundy
  R: '#a85860',
  b: '#c9bd93', // kaca
  s: '#a9a595', // baja
  S: '#d9d3c0',
  P: '#75628f', // sihir
  p: '#b9a9d0',
  q: '#e4dcf0',
  d: '#6b4a4e', // naga
  m: '#c98b84',
  e: '#fff6db',
};

export const ICON_SIZES = {
  potion: [11, 14],
  staff: [9, 16],
  sword: [9, 16],
  shield: [11, 13],
  crystal: [9, 12],
  coin: [9, 9],
  map: [13, 11],
  dragon: [26, 17],
} as const;
export type IconName = keyof typeof ICON_SIZES;

const ICONS: Record<Exclude<IconName, 'map' | 'dragon'>, string[]> = {
  potion: [
    '....kkk....', '....kgk....', '...kgggk...', '....kbk....', '....kbk....', '...kbbbk...', '..kbbbbbk..',
    '.kbrrrrrbk.', '.krrRrrrrk.', '.krRrrrrrk.', '.krrrrrrrk.', '.krrrrrrrk.', '..krrrrrk..', '...kkkkk...',
  ],
  staff: [
    '..kkkkk..', '.kPPPPPk.', 'kPpqpPPPk', 'kPpqqpPPk', 'kPppqPPPk', '.kPPPPPk.', '..kkkkk..', '...kgk...',
    '...kgk...', '...kgk...', '...kgk...', '...kgk...', '...kgk...', '...kgk...', '...kgk...', '...kkk...',
  ],
  sword: [
    '....k....', '...kwk...', '...kSk...', '...kSk...', '...kSk...', '...kSk...', '...kSk...', '...kSk...',
    '.kkkkkkk.', 'kGGGGGGGk', '.kkkgkkk.', '...kgk...', '...kgk...', '...kRk...', '...kkk...', '.........',
  ],
  shield: [
    '.kkkkkkkkk.', 'kGGGGGGGGGk', 'kRrRrGrRrRk', 'kRrrrGrrrRk', 'kRrrrGrrrRk', 'kGGGGGGGGGk', 'kRrrrGrrrRk',
    '.kRrrGrrRk.', '.kRrrGrrRk.', '..kRrGrRk..', '...kRGRk...', '....kGk....', '.....k.....',
  ],
  crystal: [
    '....k....', '...kpk...', '..kpPPk..', '.kpPPPPk.', 'kpPqPPPPk', 'kpPPPPPPk', 'kPPPPPPPk', '.kPPPPPk.',
    '..kPPPk..', '...kPPk..', '....kk...', '.........',
  ].map((r) => r.slice(0, 9).padEnd(9, '.')),
  coin: [
    '..kkkkk..', '.kGGGGGk.', 'kGhhGGGgk', 'kGhGggGgk', 'kGGGggGgk', 'kGGGGGGgk', 'kGGGGGggk', '.kgggggk.', '..kkkkk..',
  ],
};

function buildIcon(name: IconName): Grid {
  const [w, h] = ICON_SIZES[name];
  if (name === 'map') return buildMap();
  if (name === 'dragon') return buildDragon();
  const g = sprite(ICONS[name], PAL);
  if (g.w !== w || g.h !== h) throw new Error(`ikon ${name}: ukuran ${g.w}x${g.h}, harusnya ${w}x${h}`);
  return g;
}


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

/** Naga terbang (sisi kanan): sayap, badan, leher + kepala bertanduk, ekor. */
function buildDragon(): Grid {
  const [w, h] = ICON_SIZES.dragon;
  const g = new Grid(w, h, 1, 1); // margin 1px supaya outline tidak terpotong
  const c = (k: string) => rgb(PAL[k] as string);
  poly(g, [[8, 8], [1, 2], [4.5, 3.5], [5.5, 0], [8.5, 3], [11.5, 0.5], [12.5, 4], [14, 8]], c('R')); // sayap
  poly(g, [[8, 7], [5, 4], [8, 5.5], [9.5, 4], [10, 7]], c('d')); // rusuk sayap
  for (let y = 7; y <= 11; y++)
    for (let x = 6; x <= 17; x++) {
      const e = ((x - 11.5) / 6.2) ** 2 + ((y - 9) / 2.8) ** 2;
      if (e <= 1) g.set(x, y, y >= 10 ? c('m') : c('d')); // badan + perut
    }
  poly(g, [[14, 9], [16, 4], [19.5, 3], [19.5, 6.5], [17.5, 10]], c('d')); // leher
  poly(g, [[17.5, 3], [21.5, 3], [23, 5], [21.5, 7], [18, 7]], c('d')); // kepala
  g.set(18, 1, c('G')); g.set(17, 2, c('G')); g.set(19, 2, c('G')); // tanduk
  g.set(20, 4, c('e'));
  for (let t = 0; t <= 1; t += 0.06) g.rect(Math.round(7 - t * 6.5), Math.round(9 + t * 3 + Math.sin(t * 3) * 0.8), 2, 2, c('d')); // ekor
  g.rect(0, 11, 2, 3, c('R')); // ujung ekor
  g.rect(9, 11, 2, 3, c('d')); g.rect(14, 11, 2, 3, c('d')); // kaki
  outline(g, c('k'));
  return g;
}

/** Peta harta karun: perkamen + jalur putus-putus + tanda X. */
function buildMap(): Grid {
  const [w, h] = ICON_SIZES.map;
  const g = new Grid(w, h);
  const c = (k: string) => rgb(PAL[k] as string);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1;
      if ((x === 0 || x === w - 1) && (y === 0 || y === h - 1)) continue;
      g.set(x, y, edge ? c('k') : x === 1 || y === 1 ? c('G') : x === w - 2 || y === h - 2 ? c('g') : c('h'));
    }
  [[2, 7], [3, 6], [5, 6], [6, 5], [8, 5], [9, 4]].forEach(([x, y]) => g.set(x as number, y as number, c('g')));
  [[9, 7], [11, 7], [10, 8], [9, 9], [11, 9]].forEach(([x, y]) => g.set(x as number, y as number, c('r')));
  return g;
}

/* ───────── Tile pemandangan (bisa di-tile horizontal, lebar 32) ───────── */

export const TILE_W = 32;
export const TILE_H = 12;
export type TileName = 'sea' | 'hills' | 'pines';

export function buildTile(kind: TileName): Grid {
  const g = new Grid(TILE_W, TILE_H);
  const fill = (x: number, from: number, body: string, rim: string) => {
    for (let y = from; y < TILE_H; y++) g.set(x, y, rgb(y === from ? rim : body));
  };
  const wave = (x: number) => (x / TILE_W) * Math.PI * 2;

  for (let x = 0; x < TILE_W; x++) {
    if (kind === 'sea') {
      const y = 4 + Math.round(1.6 * Math.sin(wave(x) * 2));
      fill(x, y, '#0f3f98', '#6f9be0');
      if ((x + y) % 4 === 0) g.set(x, y + 3, rgb('#3a6bc0'));
    } else if (kind === 'hills') {
      const y = 5 + Math.round(2.5 * Math.sin(wave(x)) + 1.5 * Math.sin(wave(x) * 2 + 1));
      fill(x, y, '#3a2f29', '#7a6454');
    } else {
      const local = x % 16;
      const tall = x % 32 < 16;
      const half = Math.abs(local - 7.5);
      const top = Math.round((tall ? 1 : 3) + half * (tall ? 0.9 : 0.8));
      fill(x, Math.min(top, 9), '#2c4638', '#6f9a7a');
      if (local === 7 || local === 8) g.rect(x, 9, 1, 3, rgb('#1f3328'));
    }
  }
  return g;
}

/* ───────── Render ───────── */

export function renderQuestArt(root: HTMLElement): void {
  (Object.keys(ICON_SIZES) as IconName[]).forEach((name) => root.style.setProperty(`--ic-${name}`, toURL(buildIcon(name))));
  (['sea', 'hills', 'pines'] as TileName[]).forEach((t) => root.style.setProperty(`--tile-${t}`, toURL(buildTile(t))));
}

/** Untuk preview/test di Node. */
export const __test = { buildIcon };