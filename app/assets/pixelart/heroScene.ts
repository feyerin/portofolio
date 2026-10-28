/**
 * heroScene.ts — pixel art scene hero (kastil di siang hari).
 * Digambar ke beberapa layer supaya bisa parallax: langit, gunung, kastil, depan.
 * Warna ikut token tema (parchment, burgundy, emas tua).
 */
import { Grid, bayer, blit, glow, hash, outline, ramp, rgb, sprite, toURL, type Ramp } from './pixelKit';

export const SCENE_W = 160;
export const SCENE_H = 132;
export const MARGIN = 4; // layer digambar lebih lebar 4px tiap sisi untuk ruang parallax
const GY = 100; // garis tanah
const CX = 80;

/** Area interaktif & titik jalan si petualang (koordinat pixel game). */
export const GATE = { x: 70, y: 74, w: 20, h: 26 } as const;
export const TOWER_L = 36;
export const TOWER_R = 124;
export const SPOTS = { gate: 80, left: 36, right: 124, home: 30 } as const;
const SUN = { x: 140, y: 22 };

/* ───────────── Palet siang ───────────── */

const SKY = ramp(['#b9d5d0', '#c6dcd3', '#d5e5d3', '#e4ebd0', '#f0eccb', '#f7e9bf', '#f8e0b0']);
const STONE = ramp(['#6d5f4c', '#8f7f64', '#b3a283', '#cdbd9a', '#e6d9b8']);
const ROOF = ramp(['#3d1c24', '#5f2a34', '#7f3e47', '#9b5359', '#b9716f']);
const WOOD = ramp(['#2e261f', '#4f3a2a', '#6f5238', '#8f6c47', '#b08a5a']);
const GOLD = ramp(['#8b6a35', '#b48a42', '#d4b062', '#ecd08a', '#fff0c0']);
const IRON = ramp(['#3a3430', '#5a524a', '#7e756a', '#a39a8c']);
const GRASS = ramp(['#4f6a3c', '#68844a', '#82a05a', '#9bb96c', '#b9d27e']);
const PATH = ramp(['#8a7a5c', '#a89874', '#c4b48c', '#d9caa2', '#ece0bc']);
const GLASS = ramp(['#46657a', '#5f7f96', '#7fa0b4', '#a9c5d3']);
const INK = rgb('#2e261f');
const LEAF_INK = rgb('#2f3f27');

const layer = (extra = 0) => new Grid(SCENE_W + MARGIN * 2, SCENE_H + extra, MARGIN, 0);

/* ───────────── Langit, matahari, awan ───────────── */

export function buildSky(): Grid {
  const g = layer();
  const n = SKY.size - 1;
  for (let y = 0; y < g.h; y++) {
    const t = Math.min(y / (GY - 4), 1) * n;
    const i = Math.min(Math.floor(t), n);
    const k = Math.max(0, (t - i - 0.5) * 2);
    for (let x = 0; x < g.w; x++) g.data[y * g.w + x] = i < n && k > bayer(x, y) ? SKY(i + 1) : SKY(i);
  }
  const { x: sx, y: sy } = SUN;
  glow(g, sx, sy, 22, rgb('#fff3b8'), 0.32);
  for (let y = sy - 8; y <= sy + 8; y++)
    for (let x = sx - 8; x <= sx + 8; x++) {
      const d = Math.hypot(x + 0.5 - sx, y + 0.5 - sy);
      if (d <= 7) g.set(x, y, rgb(d > 5.6 ? '#f5d98c' : d < 2.5 ? '#fffbe4' : '#fff1bb'));
    }
  return g;
}

/** Sinar matahari (berkedip lewat CSS). */
export function buildSunRays(): Grid {
  const g = layer();
  const c = rgb('#f5d98c');
  const { x: sx, y: sy } = SUN;
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]] as [number, number][])
    for (let k = 10; k <= 13; k++) g.rect(sx + dx * k - (dy ? 0 : 0), sy + dy * k, 1, 1, c);
  for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]] as [number, number][])
    for (let k = 8; k <= 9; k++) g.set(sx + dx * k, sy + dy * k, c);
  return g;
}

/** Awan yang bisa di-tile horizontal (lebar = lebar layer). */
export function buildClouds(): Grid {
  const g = layer();
  const body = [rgb('#fffaf0'), rgb('#f3ecdb'), rgb('#dccfb4')] as [number, number, number];
  const cloud = (cx: number, cy: number, w: number, h: number, seed: number) => {
    for (let dx = -w / 2; dx < w / 2; dx++) {
      const t = dx / (w / 2);
      const hp = Math.round(h * Math.pow(Math.max(0, 1 - t * t), 0.7) * (0.75 + 0.25 * Math.sin(dx * 0.6 + seed)));
      for (let k = -hp; k <= Math.ceil(hp * 0.3); k++) {
        const x = (((Math.floor(cx + dx) + MARGIN) % g.w) + g.w) % g.w;
        g.data[(cy + k) * g.w + x] = k <= -hp + 1 ? body[0] : k > hp * 0.12 ? body[2] : body[1];
      }
    }
  };
  cloud(26, 30, 34, 5, 1);
  cloud(86, 46, 46, 6, 4);
  cloud(140, 20, 26, 4, 2);
  cloud(60, 14, 22, 3, 7);
  return g;
}

/* ───────────── Gunung & hutan jauh ───────────── */

export function buildFar(): Grid {
  const g = layer();
  const x0 = -MARGIN;
  const x1 = SCENE_W + MARGIN;
  const far = [rgb('#c2d1b6'), rgb('#b3c4a8'), rgb('#a8bb9e')] as [number, number, number];
  const hill = [rgb('#a2b78d'), rgb('#8fa77a')] as [number, number];
  const tree = [rgb('#6f8a5c'), rgb('#86a06c')] as [number, number];
  const farY = (x: number) => 60 + 14 * Math.abs(Math.sin(x * 0.05 + 0.6)) + 5 * Math.abs(Math.sin(x * 0.13 + 2));
  const hillY = (x: number) => 78 + 5 * Math.sin(x * 0.08 + 1) + 3 * Math.sin(x * 0.21);

  for (let x = x0; x < x1; x++) {
    const fy = Math.round(farY(x));
    for (let y = fy; y < GY; y++) {
      const d = y - fy;
      g.set(x, y, d === 0 ? far[0] : d < 4 && g.dither(x, y) > d / 4 ? far[1] : far[2]);
    }
    const hy = Math.round(hillY(x));
    for (let y = hy; y < GY; y++) g.set(x, y, y === hy ? hill[0] : hill[1]);
  }
  for (let x = x0 + 2; x < x1; x += 5 + Math.floor(hash(x, 3) * 6)) {
    const h = 7 + Math.floor(hash(x, 4) * 5);
    const base = Math.round(hillY(x)) + 2;
    for (let r = 0; r < h; r++) {
      const half = ((r / 3) | 0) + (r % 3 === 0 ? 0 : 1);
      for (let dx = -half; dx <= half; dx++) g.set(x + dx, base - h + r, dx >= half && half > 0 ? tree[1] : tree[0]);
    }
  }
  return g;
}

/* ───────────── Kastil ───────────── */

const round = (tx: number, _ty: number, i: number, j: number) => {
  const d = bayer(i, j);
  if (tx < 0.14) return -1;
  if (tx < 0.28) return d > (tx - 0.14) / 0.14 ? -1 : 0;
  if (tx > 0.88) return 1;
  if (tx > 0.72) return d < (tx - 0.72) / 0.16 ? 1 : 0;
  return 0;
};

function stone(
  g: Grid, R: Ramp, x: number, y: number, w: number, h: number,
  shade: (tx: number, ty: number, i: number, j: number) => number = () => 0, seed = 0,
) {
  for (let j = 0; j < h; j++) {
    const course = j >> 2;
    const off = (course & 1) * 4;
    for (let i = 0; i < w; i++) {
      const bx = i + off;
      const r = hash((bx >> 3) + seed, course + seed * 7);
      const tone = r < 0.16 ? -1 : r > 0.9 ? 1 : 0;
      let idx = 2 + tone;
      if ((j & 3) === 3 || (bx & 7) === 7) idx = 1;
      else if ((j & 3) === 0) idx = 3 + tone;
      g.set(x + i, y + j, R(idx + shade(i / w, j / h, i, j)));
    }
  }
}

function cone(g: Grid, cx: number, top: number, h: number, baseW: number) {
  for (let r = 0; r < h; r++) {
    const half = Math.max(1, Math.round((r / (h - 1)) * (baseW / 2)));
    for (let dx = -half; dx < half; dx++) {
      let idx = dx >= 0 ? 3 : 2; // cahaya dari matahari di kanan atas
      if (r % 4 === 3) idx -= 1;
      else if (((dx + (r >> 2) * 2) & 3) === 0) idx -= 1;
      if (dx === half - 1 && dx > 1) idx = 4;
      g.set(cx + dx, top + r, ROOF(idx));
    }
  }
  g.rect(cx - baseW / 2 - 1, top + h - 1, baseW + 2, 2, ROOF(1));
  g.rect(cx - baseW / 2 - 1, top + h + 1, baseW + 2, 1, ROOF(0));
}

function tower(g: Grid, cx: number) {
  const x0 = cx - 11;
  stone(g, STONE, x0, 62, 22, 38, round, cx);
  stone(g, STONE, x0 - 2, 57, 26, 5, round, cx + 1);
  g.rect(x0 - 2, 62, 26, 1, STONE(0));
  cone(g, cx, 38, 19, 26);
  g.rect(cx, 28, 1, 10, IRON(1)); // tiang bendera
}

function keep(g: Grid) {
  stone(g, STONE, 62, 52, 36, 48, (tx) => (tx < 0.1 ? -1 : tx > 0.9 ? 1 : 0), 3);
  stone(g, STONE, 60, 47, 40, 5, () => 0, 5);
  g.rect(60, 52, 40, 1, STONE(0));
  for (let i = 0; i < 6; i++) stone(g, STONE, 60 + Math.round((i * 36) / 5), 44, 4, 3, () => 0, i);
  g.rect(CX, 33, 1, 11, IRON(1));
}

function wall(g: Grid, x0: number, x1: number) {
  stone(g, STONE, x0, 84, x1 - x0, 16, (_tx, ty) => (ty > 0.75 ? -1 : 0), 9);
  for (let x = x0; x < x1; x += 8) stone(g, STONE, x, 81, 5, 3, () => 0, 2);
}

const ARCH_R = 8;
const ARCH_CY = 84;

function gateFrame(g: Grid) {
  const dist = (x: number, y: number) => Math.hypot(x + 0.5 - CX, y + 0.5 - ARCH_CY);
  const inside = (x: number, y: number, r: number) => (y < ARCH_CY ? dist(x, y) <= r : Math.abs(x + 0.5 - CX) <= r);
  const interior = ramp(['#3a2a2e', '#5a3e36', '#8a5e3c', '#c8924a', '#f0c070']);
  for (let y = ARCH_CY - ARCH_R - 2; y < GY; y++)
    for (let x = CX - ARCH_R - 2; x < CX + ARCH_R + 2; x++) {
      if (!inside(x, y, ARCH_R + 2)) continue;
      if (inside(x, y, ARCH_R)) {
        const t = ((y - 76) / 24) * 4;
        g.set(x, y, interior(Math.floor(t) + (t - Math.floor(t) > bayer(x, y) ? 1 : 0)));
        continue;
      }
      let idx = 3;
      if (y < ARCH_CY) {
        const u = (Math.atan2(y + 0.5 - ARCH_CY, x + 0.5 - CX) + Math.PI) / (Math.PI / 7);
        const f = u - Math.floor(u);
        if (Math.min(f, 1 - f) * (Math.PI / 7) * dist(x, y) < 0.55) idx = 1;
      } else if ((y - ARCH_CY) % 4 === 3) idx = 1;
      g.set(x, y, STONE(idx));
    }
  stone(g, STONE, 78, 74, 4, 4, () => 1, 11); // batu kunci
}

function banners(g: Grid) {
  for (const x of [63, 93]) {
    g.rect(x - 1, 69, 7, 1, WOOD(1));
    g.rect(x, 70, 5, 14, ROOF(2));
    g.rect(x, 70, 5, 1, GOLD(2));
    g.rect(x, 70, 1, 14, ROOF(1));
    g.rect(x + 4, 70, 1, 14, ROOF(3));
    g.rect(x + 2, 74, 1, 5, GOLD(3));
    g.rect(x + 1, 76, 3, 1, GOLD(3));
    for (const dx of [0, 1, 3, 4]) g.set(x + dx, 84, ROOF(2));
    for (const dx of [0, 4]) g.set(x + dx, 85, ROOF(2));
  }
}

const WINDOWS: [number, number, number, number][] = [
  [TOWER_L - 2, 68, 4, 8], [TOWER_L - 2, 86, 4, 8],
  [TOWER_R - 2, 68, 4, 8], [TOWER_R - 2, 86, 4, 8],
  [77, 57, 6, 10], [65, 58, 4, 8], [91, 58, 4, 8],
];

function windowShape(g: Grid, [x, y, w, h]: readonly [number, number, number, number]) {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      if (j === 0 && (i === 0 || i === w - 1)) continue;
      const border = i === 0 || i === w - 1 || j === 0 || j === h - 1;
      g.set(x + i, y + j, border ? STONE(0) : GLASS(i === 1 ? 3 - (j > h / 2 ? 1 : 0) : 1 + (j > h / 2 ? 0 : 1)));
    }
  g.set(x + 1, y + 2, rgb('#f0f6f6')); // pantulan cahaya
}

function sign(g: Grid, x: number, y: number) {
  g.rect(x, y, 2, 16, WOOD(2));
  g.rect(x, y, 1, 16, WOOD(1));
  const plank = (py: number, dir: 1 | -1, px: number) => {
    g.rect(px, py, 11, 5, WOOD(3));
    g.rect(px, py, 11, 1, WOOD(4));
    g.rect(px, py + 4, 11, 1, WOOD(1));
    for (let k = 0; k < 3; k++) g.rect(dir > 0 ? px + 11 + k : px - 1 - k, py + 1 + k, 1, 3 - k * 1 > 0 ? 3 - k : 1, WOOD(3));
    g.set(px + (dir > 0 ? 2 : 8), py + 2, IRON(0));
  };
  plank(y + 1, 1, x - 4);
  plank(y + 8, -1, x - 1);
}

function ground(g: Grid, x0: number, x1: number) {
  for (let y = GY; y < SCENE_H; y++) {
    const j = y - GY;
    const hw = ARCH_R + j * 0.45;
    for (let x = x0; x < x1; x++) {
      const d = Math.abs(x + 0.5 - CX);
      let c: number;
      if (d <= hw) {
        const row = j >> 2;
        const bx = x - CX + 300 + Math.floor(hash(row, 5) * 6) + (row & 1) * 3;
        const r = hash(Math.floor(bx / 6), row);
        let idx = 3 + (r < 0.2 ? -1 : r > 0.85 ? 1 : 0);
        if ((j & 3) === 3 || bx % 6 === 5) idx = 1;
        else if ((j & 3) === 0) idx += 1;
        if (hw - d < 1.5) idx = 0;
        c = PATH(j < 2 ? Math.min(idx, 1) : idx);
      } else {
        const r = hash(x, y);
        let idx = r < 0.14 ? 1 : r > 0.9 ? 3 : 2;
        if (j === 0) idx = 0;
        else if (j === 1) idx = Math.min(idx, 1);
        if (d - hw < 1.5) idx = Math.min(idx, 1);
        c = GRASS(idx);
        const t = hash(x + 999, y + 777);
        if (j > 3 && t > 0.985) {
          g.set(x, y - 1, GRASS(4));
          c = GRASS(3);
        } else if (j > 5 && t < 0.004) c = rgb(t < 0.002 ? '#cf6f7c' : '#f0c65a');
      }
      g.set(x, y, c);
    }
  }
}

/** Layer kastil + tanah + jalan. */
export function buildCastle(): Grid {
  const g = layer();
  const x0 = -MARGIN;
  const x1 = SCENE_W + MARGIN;
  const c = layer();
  wall(c, x0, x1);
  tower(c, TOWER_L);
  tower(c, TOWER_R);
  keep(c);
  gateFrame(c);
  banners(c);
  WINDOWS.forEach((w) => windowShape(c, w));
  outline(c, INK);
  g.draw(c);
  ground(g, x0, x1);
  sign(g, 108, 104);
  return g;
}

/* ───────────── Depan: pohon, semak, rumput ───────────── */

function tree(g: Grid, cx: number, cy: number, r: number, trunkH: number) {
  g.rect(cx - 1, cy + r - 3, 3, trunkH + 3, WOOD(2));
  g.rect(cx - 1, cy + r - 3, 1, trunkH + 3, WOOD(1));
  g.rect(cx + 1, cy + r - 3, 1, trunkH + 3, WOOD(3));
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) {
      if (Math.hypot(x + 0.5 - cx, (y + 0.5 - cy) * 1.05) > r) continue;
      const t = ((x - cx) * 0.55 - (y - cy) * 0.65) / r;
      let idx = 2 + (t > 0.3 ? 1 : 0) + (t > 0.7 ? 1 : 0) - (t < -0.3 ? 1 : 0) - (t < -0.7 ? 1 : 0);
      const n = hash(x >> 1, y >> 1);
      if (n < 0.18) idx -= 1;
      else if (n > 0.9) idx += 1;
      g.set(x, y, GRASS(idx));
    }
}

function bush(g: Grid, cx: number, cy: number, w: number, h: number) {
  for (let y = cy - h; y <= cy; y++)
    for (let x = cx - w; x <= cx + w; x++) {
      if (Math.hypot((x + 0.5 - cx) / w, (y + 0.5 - cy) / h) > 1) continue;
      const t = ((x - cx) / w) * 0.6 - ((y - cy + h / 2) / h) * 0.7;
      g.set(x, y, GRASS(2 + (t > 0.25 ? 1 : 0) - (t < -0.35 ? 1 : 0) + (hash(x, y) > 0.92 ? 1 : 0)));
    }
}

export function buildFore(): Grid {
  const g = layer();
  tree(g, 10, 88, 13, 18);
  tree(g, 152, 94, 11, 14);
  bush(g, 24, SCENE_H - 1, 11, 7);
  bush(g, 142, SCENE_H - 1, 13, 8);
  bush(g, 4, SCENE_H - 1, 8, 5);
  outline(g, LEAF_INK);
  for (let x = -MARGIN; x < SCENE_W + MARGIN; x++) {
    const r = hash(x, 41);
    if (r < 0.45) g.rect(x, SCENE_H - 2 - Math.floor(hash(x, 42) * 4), 1, 6, GRASS(r < 0.2 ? 1 : 0));
    if (r > 0.96) g.set(x, SCENE_H - 3, rgb(hash(x, 43) > 0.5 ? '#cf6f7c' : '#fbf1d8'));
  }
  return g;
}

/* ───────────── Sprite sheet ───────────── */

const DW = 8;
const DH = 24;
export const DOOR_FRAMES = 6;

function doorLeaf(): Grid {
  const g = new Grid(DW, DH);
  const inside = (x: number, y: number) => x >= 0 && x < DW && y >= 0 && y < DH && (y >= 8 || Math.hypot(x + 0.5 - 8, y + 0.5 - 8) <= 8);
  const put = (x: number, y: number, c: number) => inside(x, y) && g.set(x, y, c);
  for (let y = 0; y < DH; y++)
    for (let x = 0; x < DW; x++) {
      const col = x & 3;
      put(x, y, WOOD(col === 3 ? 0 : col === 0 ? 3 : col === 1 ? 2 : 1));
    }
  for (const sy of [6, 17]) {
    for (let x = 0; x < 7; x++) {
      put(x, sy, IRON(2));
      put(x, sy + 1, IRON(0));
    }
    put(1, sy, GOLD(3));
    put(5, sy, GOLD(3));
  }
  put(5, 12, GOLD(3));
  put(5, 13, GOLD(2));
  const edge: [number, number][] = [];
  for (let y = 0; y < DH; y++)
    for (let x = 0; x < DW; x++)
      if (inside(x, y) && (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1))) edge.push([x, y]);
  edge.forEach(([x, y]) => g.set(x, y, WOOD(0)));
  return g;
}

/** Sprite sheet pintu: daun kiri dengan engsel di kiri, makin terbuka tiap frame. */
export function buildDoorSheet(): Grid {
  const leaf = doorLeaf();
  const sheet = new Grid(DW * DOOR_FRAMES, DH);
  const cy = DH / 2;
  for (let f = 0; f < DOOR_FRAMES; f++) {
    const th = (f / (DOOR_FRAMES - 1)) * (72 * Math.PI) / 180;
    const w = f === 0 ? DW : Math.max(2, Math.round(DW * Math.cos(th)));
    const shade = 1 - 0.45 * Math.sin(th);
    for (let c = 0; c < w; c++) {
      const t = (c + 0.5) / w;
      const sx = Math.min(DW - 1, Math.floor(t * DW));
      const v = 1 - 0.18 * Math.sin(th) * t;
      for (let r = 0; r < DH; r++) {
        const sy = Math.floor(cy + (r + 0.5 - cy) / v);
        if (sy < 0 || sy >= DH) continue;
        const px = leaf.data[sy * DW + sx] ?? 0;
        if (!(px >>> 24)) continue;
        const d = (s: number) => Math.round(((px >>> s) & 255) * shade);
        sheet.data[r * sheet.w + f * DW + c] = (0xff000000 | (d(16) << 16) | (d(8) << 8) | d(0)) >>> 0;
      }
    }
  }
  return sheet;
}

export const ADV_W = 9;
export const ADV_H = 13;
export const ADV_FRAMES = 6;

const ADV_PAL = { k: '#2e261f', h: '#6f4a2e', s: '#f0c9a0', e: '#2e261f', r: '#713840', R: '#9b5359', t: '#5d4a3a', g: '#d4b062', b: '#4f3a2a' };
const ADV_BODY = ['...kkkk..', '..khhhhk.', '..khhhhk.', '..khssek.', '..ksssk..', '...kkk...', '.krtttk..', 'krRtttk..', 'krRtgtk..', 'krRtttk..', '.krtttk..'];
const ADV_LEGS = {
  stand: ['..kbkbk..', '..kk.kk..'],
  apart: ['.kb...bk.', '.kk...kk.'],
  together: ['...kbbk..', '...kkkk..'],
  apart2: ['..kb..bk.', '..kk..kk.'],
};

function advFrame(legs: string[], breathe: boolean): string[] {
  const body = breathe ? ['.........', ...ADV_BODY.slice(0, 9), ADV_BODY[10] as string] : ADV_BODY;
  return [...body, ...legs];
}

/** frame 0-1: diam, 2-5: jalan. */
export function buildAdventurerSheet(): Grid {
  const frames = [
    advFrame(ADV_LEGS.stand, false),
    advFrame(ADV_LEGS.stand, true),
    advFrame(ADV_LEGS.apart, false),
    advFrame(ADV_LEGS.together, true),
    advFrame(ADV_LEGS.apart2, false),
    advFrame(ADV_LEGS.together, true),
  ];
  const sheet = new Grid(ADV_W * ADV_FRAMES, ADV_H);
  frames.forEach((rows, f) => {
    const s = sprite(rows, ADV_PAL);
    for (let y = 0; y < ADV_H; y++) for (let x = 0; x < ADV_W; x++) sheet.data[y * sheet.w + f * ADV_W + x] = s.data[y * ADV_W + x] ?? 0;
  });
  return sheet;
}

export function buildFlagSheet(): Grid {
  const pal = { r: '#713840', R: '#9b5359', g: '#d4b062' };
  const frames = [
    ['RRRRRRg', '.rrrrrg', '..rrr..'],
    ['.RRRRRg', 'rrrrrr.', '...rr..'],
    ['RRRRRg.', '.rrrrrg', '..rrrr.'],
  ];
  const sheet = new Grid(7 * frames.length, 3);
  frames.forEach((rows, f) => {
    const s = sprite(rows, pal);
    for (let y = 0; y < 3; y++) for (let x = 0; x < 7; x++) sheet.data[y * sheet.w + f * 7 + x] = s.data[y * 7 + x] ?? 0;
  });
  return sheet;
}

export function buildBirdSheet(): Grid {
  const pal = { k: '#4f5a48' };
  const frames = [
    ['k.....k', '.k...k.', '..kkk..', '.......'],
    ['.......', '..kkk..', '.k...k.', 'k.....k'],
  ];
  const sheet = new Grid(7 * frames.length, 4);
  frames.forEach((rows, f) => {
    const s = sprite(rows, pal);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 7; x++) sheet.data[y * sheet.w + f * 7 + x] = s.data[y * 7 + x] ?? 0;
  });
  return sheet;
}

/* ───────────── Render ke DOM ───────────── */

export function renderHeroScene(root: HTMLElement): void {
  const layers: Record<string, () => Grid> = {
    sky: buildSky,
    sunrays: buildSunRays,
    far: buildFar,
    castle: buildCastle,
    fore: buildFore,
  };
  root.querySelectorAll<HTMLCanvasElement>('canvas[data-layer]').forEach((c) => {
    const g = layers[c.dataset.layer ?? '']?.();
    if (g) blit(g, c);
  });
  const s = root.style;
  s.setProperty('--hs-clouds', toURL(buildClouds()));
  s.setProperty('--hs-door', toURL(buildDoorSheet()));
  s.setProperty('--hs-adv', toURL(buildAdventurerSheet()));
  s.setProperty('--hs-flag', toURL(buildFlagSheet()));
  s.setProperty('--hs-bird', toURL(buildBirdSheet()));
}