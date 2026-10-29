/**
 * aboutArt.ts — pixel art untuk section About.
 * Ikon, prangko, segel lilin, dan peta dunia (digambar dari kode, tanpa file gambar).
 * Hasilnya jadi CSS variable `--ab-*` berisi data-URL sprite.
 */
import { Grid, bayer, blit, hash, outline, rgb, sprite, toURL } from './pixelKit';

const PAL: Record<string, string> = {
  k: '#493927', g: '#94713a', G: '#d3b875', h: '#f3dfaa', w: '#fff6db',
  r: '#783f46', R: '#a85860', b: '#c9bd93', s: '#a9a595', S: '#d9d3c0', q: '#e8e2d4',
};
const c = (k: string) => rgb(PAL[k] as string);

/* ───────── Ikon kecil ───────── */

const ASCII: Record<string, string[]> = {
  // kaca pembesar -> "little details"
  loupe: [
    '..kkkkk....', '.kbbbbbk...', 'kbhwhhhbk..', 'kbwhhhhbk..', 'kbhhhhhbk..', 'kbhhhhhbk..',
    '.kbbbbbkk..', '..kkkkk.kg.', '.......kGgk', '........kGk', '........kkk',
  ],
  // palu -> "learning by making"
  hammer: [
    'kkkkkkkkk', 'kSwSSSSsk', 'kSSSSSSsk', 'kkkkkkkkk', '...kgk...', '...kGk...', '...kgk...',
    '...kGk...', '...kgk...', '...kGk...', '...kkk...',
  ],
  // cangkir teh -> "take a step back"
  cup: [
    '..q....q...', '...q....q..', '.kkkkkkkkk.', '.kbbbbbbbkk', '.kbggggggbk', '.kbggggggbk', '..kbbbbbbk.', '...kkkkkk..',
  ].map((r) => r.padEnd(11, '.').slice(0, 11)),
};

export const ICON_SIZES: Record<string, [number, number]> = {
  loupe: [11, 11], hammer: [9, 11], cup: [11, 8], tower: [11, 14], compass: [11, 11],
  envelope: [17, 12], seal: [13, 13], stamp: [15, 18], postmark: [23, 13], spark: [7, 7],
};

function tower(): Grid {
  const g = new Grid(11, 14, 0, 0);
  g.rect(2, 4, 7, 10, c('S'));
  for (let y = 4; y < 14; y++) for (let x = 2; x < 9; x++) if ((y % 3 === 0 && x % 2 === 0) || (y % 3 === 1 && x % 2 === 1)) g.set(x, y, c('b'));
  g.rect(7, 4, 2, 10, c('s'));
  [1, 4, 7].forEach((x) => g.rect(x, 2, 3, 3, c('S')));
  g.rect(4, 7, 3, 4, c('k')); g.rect(5, 8, 1, 2, c('G'));
  g.rect(5, 0, 1, 2, c('k')); g.rect(6, 0, 3, 2, c('R'));
  outline(g, c('k'));
  return g;
}

function compass(): Grid {
  const g = new Grid(11, 11);
  for (let y = 0; y < 11; y++)
    for (let x = 0; x < 11; x++) {
      const d = Math.hypot(x - 5, y - 5);
      if (d <= 5.2 && d > 4) g.set(x, y, c('g'));
      else if (d <= 4) g.set(x, y, c('h'));
    }
  for (let k = 1; k <= 3; k++) { g.set(5, 5 - k, c('R')); g.set(5, 5 + k, c('k')); g.set(5 - k, 5, c('b')); g.set(5 + k, 5, c('b')); }
  g.set(5, 5, c('r'));
  outline(g, c('k'));
  return g;
}

function envelope(): Grid {
  const g = new Grid(17, 12);
  g.rect(0, 0, 17, 12, c('k'));
  g.rect(1, 1, 15, 10, c('h'));
  for (let i = 0; i < 8; i++) { g.set(1 + i, 1 + i, c('g')); g.set(15 - i, 1 + i, c('g')); }
  g.rect(1, 10, 15, 1, c('G'));
  return g;
}

function seal(): Grid {
  const g = new Grid(13, 13);
  for (let y = 0; y < 13; y++)
    for (let x = 0; x < 13; x++) {
      const a = Math.atan2(y - 6, x - 6);
      const wob = 5.6 + 0.6 * Math.sin(a * 7) + 0.3 * Math.sin(a * 3 + 1);
      const d = Math.hypot(x - 6, y - 6);
      if (d <= wob) g.set(x, y, d > wob - 1.2 ? c('r') : c('R'));
    }
  // huruf "P" dari piksel (gelap di atas lilin terang)
  ['kkk.', 'k..k', 'kkk.', 'k...', 'k...'].forEach((row, j) => [...row].forEach((ch, i) => ch === 'k' && g.set(4 + i, 4 + j, rgb('#4a2228'))));
  g.set(3, 3, rgb('#d98a92')); g.set(4, 2, rgb('#d98a92'));
  outline(g, rgb('#4a2228'));
  return g;
}

function stamp(): Grid {
  const g = new Grid(15, 18);
  g.rect(0, 0, 15, 18, c('w'));
  for (let i = 0; i < 15; i += 2) { g.set(i, 0, 0); g.set(i, 17, 0); }
  for (let j = 0; j < 18; j += 2) { g.set(0, j, 0); g.set(14, j, 0); }
  g.rect(2, 2, 11, 14, c('g'));
  g.rect(3, 3, 9, 12, c('h'));
  g.rect(3, 12, 9, 3, c('G'));
  const k = c('r');
  g.rect(5, 8, 5, 6, k); g.rect(4, 7, 2, 7, k); g.rect(9, 7, 2, 7, k);
  [4, 6, 8, 10].forEach((x) => g.set(x, 6, k));
  g.rect(7, 4, 1, 4, c('k')); g.rect(8, 4, 2, 1, c('R'));
  g.rect(7, 11, 1, 3, c('h'));
  return g;
}

function postmark(): Grid {
  const g = new Grid(23, 13);
  const col = rgb('#783f46');
  for (let y = 0; y < 13; y++)
    for (let x = 0; x < 13; x++) {
      const d = Math.hypot(x - 6, y - 6);
      if (d <= 6.3 && d > 5) g.set(x, y, col);
    }
  [3, 6, 9].forEach((y, i) => { for (let x = 13; x < 23; x++) if ((x + i) % 2 === 0) g.set(x, y, col); });
  [[4, 6], [5, 6], [7, 6], [8, 6], [6, 4], [6, 8]].forEach(([x, y]) => g.set(x as number, y as number, col));
  return g;
}

function spark(): Grid {
  return sprite(['...k...', '...k...', '..kwk..', 'kkwhwkk', '..kwk..', '...k...', '...k...'], PAL);
}

function buildIcon(name: string): Grid {
  switch (name) {
    case 'tower': return tower();
    case 'compass': return compass();
    case 'envelope': return envelope();
    case 'seal': return seal();
    case 'stamp': return stamp();
    case 'postmark': return postmark();
    case 'spark': return spark();
    default: return sprite(ASCII[name] ?? [], PAL);
  }
}

/* ───────── Peta dunia ───────── */

export const MAP_W = 112;
export const MAP_H = 64;

/** Titik tiap lokasi (pixel peta) — dipakai Vue untuk menaruh penanda. */
export const PLACE_XY = {
  shire: { x: 20, y: 36 },
  codehaven: { x: 50, y: 28 },
  peaks: { x: 79, y: 36 },
  isles: { x: 95, y: 51 },
} as const;

type Blob = { x: number; y: number; rx: number; ry: number };
const BLOBS: Blob[] = [
  { x: 20, y: 35, rx: 14, ry: 10 }, // the shire
  { x: 50, y: 25, rx: 15, ry: 10 }, // codehaven
  { x: 79, y: 36, rx: 17, ry: 12 }, // iron peaks
  { x: 95, y: 51, rx: 6, ry: 4.5 }, // lost isles
  { x: 105, y: 44, rx: 4, ry: 3.5 },
  { x: 86, y: 57, rx: 4.5, ry: 3 },
  { x: 47, y: 50, rx: 7, ry: 4.5 }, // pulau tengah
  { x: 8, y: 12, rx: 5, ry: 3.5 },
];

const land = (x: number, y: number): number => {
  let best = -9;
  for (const b of BLOBS) best = Math.max(best, 1 - Math.hypot((x - b.x) / b.rx, (y - b.y) / b.ry));
  const n = 0.13 * Math.sin(x * 0.9 + y * 0.5) + 0.1 * Math.sin(x * 0.4 - y * 0.8 + 2) + 0.09 * (hash(x >> 1, y >> 1) - 0.5);
  return best + n - 0.08;
};

function pine(g: Grid, x: number, base: number, h: number) {
  const dark = rgb('#2f4a35');
  const light = rgb('#4f7a5a');
  for (let r = 0; r < h; r++) {
    const half = ((r / 2) | 0) + (r % 2 === 0 ? 0 : 0);
    for (let dx = -half; dx <= half; dx++) g.set(x + dx, base - h + r, dx > 0 ? light : dark);
  }
  g.set(x, base, rgb('#3a2c22'));
}

function mountain(g: Grid, cx: number, base: number, h: number) {
  const m = new Grid(h * 2 + 3, h + 2, 1, 1);
  for (let r = 0; r < h; r++)
    for (let dx = -r; dx <= r; dx++) {
      const snow = r < Math.round(h * 0.38) + (dx % 2 === 0 ? 0 : -1);
      m.set(h + dx, r, snow ? rgb(dx > 0 ? '#f4f1e6' : '#cfcbbd') : rgb(dx > 0 ? '#a39d8a' : '#7d7767'));
    }
  outline(m, rgb('#4a4339'));
  const ox = cx - h - 1;
  const oy = base - h - 1;
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) { const p = m.data[y * m.w + x] ?? 0; if (p >>> 24) g.set(ox + x, oy + y, p); }
}

function castle(g: Grid, cx: number, base: number) {
  const k = new Grid(19, 17, 0, 0);
  const wall = (x: number, y: number, w: number, h: number) => {
    k.rect(x, y, w, h, c('S'));
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if ((j % 3 === 2) || ((i + (j / 3 | 0) * 2) % 4 === 3)) k.set(x + i, y + j, c('b'));
    k.rect(x + w - 2, y, 2, h, c('s'));
  };
  wall(5, 7, 9, 10);
  wall(0, 4, 5, 13);
  wall(14, 4, 5, 13);
  for (const x of [5, 8, 11]) k.rect(x, 5, 3, 2, c('S'));
  for (const cx of [2, 16]) for (let r = 0; r < 4; r++) k.rect(cx - Math.min(r, 2), r, Math.min(r, 2) * 2 + 1, 1, c(r % 2 ? 'r' : 'R')); // atap kerucut
  k.rect(8, 10, 3, 7, c('k')); k.rect(9, 10, 1, 1, c('k'));
  k.rect(2, 8, 1, 2, c('G')); k.rect(16, 8, 1, 2, c('G'));
  k.rect(9, 1, 1, 4, c('k')); k.rect(10, 1, 3, 2, c('r'));
  outline(k, c('k'));
  const ox = cx - 9;
  const oy = base - 17;
  for (let y = 0; y < k.h; y++) for (let x = 0; x < k.w; x++) { const p = k.data[y * k.w + x] ?? 0; if (p >>> 24) g.set(ox + x, oy + y, p); }
}

function ship(g: Grid, x: number, y: number) {
  const s = new Grid(11, 10, 1, 1);
  s.rect(4, 0, 1, 6, c('k'));
  [[5, 1, 4], [5, 2, 4], [5, 3, 3], [5, 4, 3]].forEach(([sx, sy, w]) => s.rect(sx as number, sy as number, w as number, 1, c('w')));
  [[0, 6, 9], [1, 7, 7]].forEach(([sx, sy, w]) => s.rect(sx as number, sy as number, w as number, 1, c('r')));
  s.rect(2, 7, 5, 1, c('R'));
  outline(s, c('k'));
  for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) { const p = s.data[j * s.w + i] ?? 0; if (p >>> 24) g.set(x + i, y + j, p); }
}

function route(g: Grid, pts: [number, number][]) {
  const col = rgb('#783f46');
  let step = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i] as [number, number];
    const [x1, y1] = pts[i + 1] as [number, number];
    const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2 + (i % 2 === 0 ? -5 : 5)];
    for (let t = 0; t <= 1; t += 0.01) {
      const x = Math.round((1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1);
      const y = Math.round((1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1);
      if (Math.floor(step++ / 3) % 2 === 0) g.set(x, y, col);
    }
  }
}

export function buildMap(): Grid {
  const g = new Grid(MAP_W, MAP_H);
  const deep = rgb('#5b8f9a');
  const sea = rgb('#6fa3a8');
  const shallow = rgb('#8fc0bd');
  const foam = rgb('#d9efe6');
  const sand = rgb('#e6d3a0');
  const grass = [rgb('#6f8f4e'), rgb('#82a05a'), rgb('#97b46a')] as [number, number, number];

  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) {
      const l = land(x, y);
      const edge = Math.min(x, y, MAP_W - 1 - x, MAP_H - 1 - y);
      let col: number;
      if (l > 0.14) col = hash(x, y) < 0.1 ? grass[0] : hash(x + 7, y + 3) > 0.82 ? grass[2] : grass[1];
      else if (l > 0.02) col = sand;
      else if (l > -0.02) col = foam;
      else if (l > -0.2) col = l > -0.12 || bayer(x, y) > (-0.12 - l) / 0.08 ? shallow : sea;
      else {
        const d = edge < 5 && bayer(x, y) > edge / 5 ? deep : sea;
        col = d === sea && hash(x >> 2, y) > 0.93 && x % 4 < 2 ? shallow : d;
      }
      g.set(x, y, col);
    }

  // hutan di Shire
  for (let y = 26; y < 46; y += 4)
    for (let x = 6; x < 36; x += 4) {
      const px = x + Math.floor(hash(x, y) * 3);
      const py = y + Math.floor(hash(y, x) * 3);
      if (land(px, py) > 0.3 && hash(px, py) > 0.3) pine(g, px, py, 4 + Math.floor(hash(py, px) * 3));
    }
  // gunung di Iron Peaks
  [[71, 31, 6], [87, 30, 6], [79, 40, 7], [66, 42, 4], [92, 41, 4]].forEach(([x, y, h]) => mountain(g, x as number, y as number, h as number));
  castle(g, 50, 29);
  // pohon di pulau kecil
  [[95, 49], [97, 52], [105, 45], [86, 57], [47, 50]].forEach(([x, y]) => pine(g, x as number, y as number, 4));
  ship(g, 36, 49);

  route(g, [
    [PLACE_XY.shire.x, PLACE_XY.shire.y],
    [PLACE_XY.codehaven.x, PLACE_XY.codehaven.y],
    [PLACE_XY.peaks.x, PLACE_XY.peaks.y],
    [PLACE_XY.isles.x, PLACE_XY.isles.y],
  ]);

  // mawar angin
  const comp = compass();
  for (let y = 0; y < comp.h; y++) for (let x = 0; x < comp.w; x++) { const p = comp.data[y * comp.w + x] ?? 0; if (p >>> 24) g.set(4 + x, MAP_H - 15 + y, p); }
  return g;
}

/* ───────── Render ───────── */

export function renderAboutArt(root: HTMLElement): void {
  Object.keys(ICON_SIZES).forEach((n) => root.style.setProperty(`--ab-${n}`, toURL(buildIcon(n))));
  const cv = root.querySelector<HTMLCanvasElement>('canvas[data-layer="map"]');
  if (cv) blit(buildMap(), cv);
}

export const __test = { buildIcon };