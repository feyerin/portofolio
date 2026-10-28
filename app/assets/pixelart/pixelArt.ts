/**
 * pixelArt.ts
 *
 * Semua pixel art intro digambar di sini ke grid kecil (1 sel = 1 "pixel game"),
 * lalu di-upscale oleh CSS (`image-rendering: pixelated`) supaya tetap tajam.
 * Palet dibatasi + dithering, jadi hasilnya terasa seperti pixel art sungguhan.
 */

import { Grid, bayer, blit, glow, hash, outline, pick, ramp, rgb, sprite, toURL } from './pixelKit';

/* ───────────── Layout ───────────── */

export const STAGE_W = 176; // ukuran "panggung" dalam pixel game
export const STAGE_H = 176;
export const GATE = { x: 72, y: 100, w: 32, h: 44 } as const; // bukaan gerbang

const CX = 88; // tengah panggung
const GY = 144; // garis tanah
const ARCH_R = GATE.w / 2;
const ARCH_CY = GATE.y + ARCH_R;

export interface IntroLayout {
  u: number; // 1 pixel game = u pixel layar (bilangan bulat -> tajam)
  cols: number;
  rows: number;
  ox: number; // posisi panggung di dalam canvas
  oy: number;
  zoom: number; // skala kamera saat "masuk" ke gerbang
}

export function computeLayout(vw: number, vh: number): IntroLayout {
  const u = Math.max(2, Math.min(Math.floor(vw / STAGE_W), Math.floor(vh / STAGE_H), 8));
  const cols = Math.ceil(vw / u);
  const rows = Math.ceil(vh / u);
  const ox = Math.floor((cols - STAGE_W) / 2);
  const oy = Math.floor((rows - STAGE_H) / 2);
  const zoom = Math.min(Math.max(vw / (GATE.w * u), vh / (GATE.h * u)) * 1.15, 12);
  return { u, cols, rows, ox, oy, zoom };
}

/* ───────────── Palet ───────────── */

const SKY = ramp(['#080b19', '#0c1130', '#121944', '#1a2258', '#272d70', '#3d3784', '#65448e', '#a0568c', '#d6727e', '#f2a37a']);
const STONE = ramp(['#1b1e33', '#2d3152', '#434a6e', '#5e6690', '#8790b6']);
const ROOF = ramp(['#2e1428', '#51233a', '#7e3446', '#b04c56', '#d9707a']);
const WOOD = ramp(['#24161a', '#46281f', '#6a3f2c', '#8f5a39', '#b57c4c']);
const IRON = ramp(['#15151f', '#33334a', '#585a76', '#8a8da8']);
const GOLD = ramp(['#6e3f1c', '#b8742a', '#f0a83c', '#ffd56a', '#fff2b0']);
const GRASS = ramp(['#14231f', '#1f3a33', '#2f5240', '#47714a', '#6d9a5c']);
const PATH = ramp(['#2a222e', '#463a44', '#675a60', '#8a7b76', '#b09f90']);
const INK = rgb('#0b0e1e');

/* ───────────── Langit, bintang, bulan, awan ───────────── */

export function buildSky(L: IntroLayout): Grid {
  const g = new Grid(L.cols, L.rows, L.ox, L.oy);
  const horizon = L.oy + 118;
  const n = SKY.size - 1;
  for (let y = 0; y < L.rows; y++) {
    const t = Math.min(y / horizon, 1) * n;
    const i = Math.min(Math.floor(t), n);
    const k = Math.max(0, (t - i - 0.5) * 2); // dithering di separuh akhir tiap pita warna
    for (let x = 0; x < L.cols; x++) g.data[y * L.cols + x] = i < n && k > bayer(x, y) ? SKY(i + 1) : SKY(i);
  }
  moon(g);
  return g;
}

const MOON = { x: 165, y: 14 };

function moon(g: Grid) {
  const { x: cx, y: cy } = MOON;
  glow(g, cx, cy, 17, rgb('#c9d4ff'), 0.1);
  for (let y = cy - 9; y <= cy + 9; y++)
    for (let x = cx - 9; x <= cx + 9; x++) {
      const a = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const b = Math.hypot(x + 0.5 - (cx + 3), y + 0.5 - (cy - 2));
      if (a <= 7 && b > 6.2) g.set(x, y, rgb(b < 7.4 ? '#d9c48c' : '#f8ebc0'));
    }
}

export function buildStars(L: IntroLayout, layer: 0 | 1): Grid {
  const g = new Grid(L.cols, L.rows);
  const maxY = (L.oy + 118) * 0.78;
  const count = Math.floor((L.cols * L.rows) / 210);
  const tints = ['#dfe6ff', '#fff2b0', '#9fb0ff'].map(rgb);
  for (let i = 0; i < count; i++) {
    if (i % 2 !== layer) continue;
    const x = Math.floor(hash(i, 1) * L.cols);
    const y = Math.floor(hash(i, 2) * maxY);
    if (Math.hypot(x - (L.ox + MOON.x), y - (L.oy + MOON.y)) < 20) continue;
    const c = tints[Math.floor(hash(i, 3) * 3)] as number;
    g.set(x, y, c);
    if (hash(i, 4) > 0.88) {
      // kilau berbentuk plus
      ([[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][]).forEach(([dx, dy]) => g.blend(x + dx, y + dy, c, 0.55));
    }
  }
  return g;
}

/** Awan yang bisa di-tile horizontal (lebar = cols), digeser pakai CSS. */
export function buildClouds(L: IntroLayout): Grid {
  const g = new Grid(L.cols, L.rows, 0, 0);
  const body = [rgb('#7a62ae'), rgb('#52488e'), rgb('#37316b')] as [number, number, number];
  const cloud = (cx: number, cy: number, w: number, h: number, seed: number) => {
    for (let dx = -w / 2; dx < w / 2; dx++) {
      const t = dx / (w / 2);
      const hp = Math.round(h * Math.pow(Math.max(0, 1 - t * t), 0.7) * (0.75 + 0.25 * Math.sin(dx * 0.55 + seed)));
      for (let k = -hp; k <= Math.ceil(hp * 0.25); k++) {
        const x = (((Math.floor(cx + dx)) % L.cols) + L.cols) % L.cols;
        g.set(x, cy + k, k <= -hp + 1 ? body[0] : k > hp * 0.1 ? body[2] : body[1]);
      }
    }
  };
  cloud(L.cols * 0.2, L.oy + 80, 54, 7, 1);
  cloud(L.cols * 0.56, L.oy + 98, 72, 8, 4);
  cloud(L.cols * 0.86, L.oy + 72, 40, 5, 2);
  return g;
}

/* ───────────── Pemandangan: gunung, hutan, kastil, tanah ───────────── */

const farY = (x: number) => 74 + 24 * Math.abs(Math.sin(x * 0.034 + 0.4)) + 7 * Math.abs(Math.sin(x * 0.093 + 2));
const nearY = (x: number) => 102 + 5 * Math.sin(x * 0.066 + 2.1) + 3 * Math.sin(x * 0.17 + 0.7);

function mountains(g: Grid, x0: number, x1: number) {
  const far = [rgb('#6c5aa8'), rgb('#4f4388'), rgb('#3a3070')] as [number, number, number];
  const near = [rgb('#3a3a78'), rgb('#1f2050')] as [number, number];
  for (let x = x0; x < x1; x++) {
    const fy = Math.round(farY(x));
    for (let y = fy; y < 132; y++) {
      const d = y - fy;
      g.set(x, y, d === 0 ? far[0] : d < 5 && g.dither(x, y) > d / 5 ? far[1] : far[2]);
    }
    const ny = Math.round(nearY(x));
    for (let y = ny; y < 132; y++) g.set(x, y, y === ny ? near[0] : near[1]);
  }
  // pohon pinus di punggung bukit
  const pine = [rgb('#0e1630'), rgb('#1c2a52')] as [number, number];
  for (let x = x0 + 2; x < x1; x += 4 + Math.floor(hash(x, 7) * 5)) {
    const h = 9 + Math.floor(hash(x, 8) * 6);
    const base = Math.round(nearY(x)) + 1;
    for (let r = 0; r < h; r++) {
      const half = (r / 3 | 0) + (r % 3 === 0 ? 0 : 1);
      for (let dx = -half; dx <= half; dx++) g.set(x + dx, base - h + r, dx === half && half > 0 ? pine[1] : pine[0]);
    }
    g.rect(x, base, 1, 2, pine[0]);
  }
}

function stone(
  g: Grid, x: number, y: number, w: number, h: number,
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
      g.set(x + i, y + j, pick(STONE, idx + shade(i / w, j / h, i, j)));
    }
  }
}

/** bayangan silinder: sisi kiri gelap, sisi kanan terang (cahaya dari bulan di kanan atas) */
const round = (tx: number, _ty: number, i: number, j: number) => {
  const d = bayer(i, j);
  if (tx < 0.12) return -1;
  if (tx < 0.24) return d > (tx - 0.12) / 0.12 ? -1 : 0;
  if (tx > 0.9) return 1;
  if (tx > 0.78) return d < (tx - 0.78) / 0.12 ? 1 : 0;
  return 0;
};

function cone(g: Grid, cx: number, top: number, h: number, baseW: number) {
  for (let r = 0; r < h; r++) {
    const half = Math.max(1, Math.round((r / (h - 1)) * (baseW / 2)));
    for (let dx = -half; dx < half; dx++) {
      let idx = dx >= 0 ? 3 : 2;
      if (r % 4 === 3) idx -= 1;
      else if (((dx + (r >> 2) * 2) & 3) === 0) idx -= 1;
      if (dx === half - 1 && dx > 1) idx = 4;
      g.set(cx + dx, top + r, pick(ROOF, idx));
    }
  }
  g.rect(cx - baseW / 2 - 1, top + h - 1, baseW + 2, 2, ROOF(1));
  g.rect(cx - baseW / 2 - 1, top + h + 1, baseW + 2, 1, ROOF(0));
}

function tower(g: Grid, cx: number) {
  const x0 = cx - 14;
  stone(g, x0, 92, 28, 52, round, cx);
  stone(g, x0 - 2, 86, 32, 6, round, cx + 1);
  g.rect(x0 - 2, 92, 32, 1, STONE(0));
  cone(g, cx, 62, 24, 32);
  pole(g, cx, 52, 10, 6);
}

function pole(g: Grid, x: number, y: number, h: number, flagW: number) {
  g.rect(x, y, 1, h, IRON(2));
  for (let r = 0; r < Math.min(5, flagW); r++) {
    const w = Math.max(1, flagW - Math.round(r * 1.3));
    g.rect(x + 1, y + r, w, 1, ROOF(r < 2 ? 3 : 2));
  }
}

function keep(g: Grid) {
  stone(g, 62, 66, 52, 78, (tx) => (tx < 0.1 ? -1 : tx > 0.9 ? 1 : 0), 3);
  stone(g, 59, 60, 58, 6, () => 0, 5);
  g.rect(59, 66, 58, 1, STONE(0));
  for (let i = 0; i < 7; i++) stone(g, 59 + Math.round((i * 53) / 6), 55, 5, 5, () => 0, i);
  pole(g, CX, 44, 12, 9);
}

function wall(g: Grid, x0: number, x1: number) {
  stone(g, x0, 116, x1 - x0, 28, (_tx, ty) => (ty > 0.8 ? -1 : 0), 9);
  for (let x = x0; x < x1; x += 10) stone(g, x, 111, 6, 5, () => 0, 2);
  for (let x = x0 + 4; x < x1; x += 34) g.rect(x, 126, 1, 5, STONE(0)); // celah panah
}

function gateFrame(g: Grid) {
  const dist = (x: number, y: number) => Math.hypot(x + 0.5 - CX, y + 0.5 - ARCH_CY);
  const inside = (x: number, y: number, r: number) => (y < ARCH_CY ? dist(x, y) <= r : Math.abs(x + 0.5 - CX) <= r);
  for (let y = ARCH_CY - ARCH_R - 3; y < GY; y++)
    for (let x = CX - ARCH_R - 3; x < CX + ARCH_R + 3; x++) {
      if (!inside(x, y, ARCH_R + 3)) continue;
      if (inside(x, y, ARCH_R)) {
        g.set(x, y, STONE(0));
        continue;
      }
      let idx = 3;
      if (y < ARCH_CY) {
        const u = (Math.atan2(y + 0.5 - ARCH_CY, x + 0.5 - CX) + Math.PI) / (Math.PI / 9);
        const f = u - Math.floor(u);
        if (Math.min(f, 1 - f) * (Math.PI / 9) * dist(x, y) < 0.55) idx = 1;
      } else if ((y - ARCH_CY) % 5 === 4) idx = 1;
      g.set(x, y, pick(STONE, idx));
    }
  // batu kunci
  stone(g, 85, 97, 6, 7, () => 1, 11);
}

function sconce(g: Grid, x: number) {
  g.rect(x, 122, 1, 8, WOOD(2));
  g.rect(x - 2, 120, 5, 2, IRON(2));
  g.rect(x - 1, 122, 3, 1, IRON(1));
  g.rect(x - 1, 130, 3, 1, IRON(1));
}

const TORCH_X = [64, 112];

const WINDOWS: [number, number, number, number][] = [
  [24, 100, 5, 9], [24, 122, 5, 9], [148, 100, 5, 9], [148, 122, 5, 9],
  [84, 70, 8, 14], [69, 74, 5, 10], [106, 74, 5, 10],
];

function windowShape(g: Grid, win: readonly [number, number, number, number], fill: number, edge: number | null, innerOnly = false) {
  const [x, y, w, h] = win;
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      if (j === 0 && (i === 0 || i === w - 1)) continue;
      const border = i === 0 || i === w - 1 || j === 0;
      if (border) {
        if (!innerOnly && edge !== null) g.set(x + i, y + j, edge);
      } else g.set(x + i, y + j, innerOnly && i === Math.floor(w / 2) ? GOLD(4) : fill);
    }
}

function ground(g: Grid, x0: number, x1: number, yEnd: number) {
  for (let y = GY; y < yEnd; y++) {
    const j = y - GY;
    const hw = ARCH_R + j * 0.5;
    for (let x = x0; x < x1; x++) {
      const d = Math.abs(x + 0.5 - CX);
      let c: number;
      if (d <= hw) {
        // jalan berbatu
        const row = j >> 2;
        const bx = x - CX + 300 + Math.floor(hash(row, 5) * 7) + (row & 1) * 3;
        const s = Math.floor(bx / 7);
        const r = hash(s, row);
        let idx = 2 + (r < 0.2 ? -1 : r > 0.85 ? 1 : 0);
        if ((j & 3) === 3 || bx % 7 === 6) idx = 1;
        else if ((j & 3) === 0) idx += 1;
        if (hw - d < 1.5 || j < 2) idx = 1;
        c = pick(PATH, idx);
      } else {
        // rumput
        const r = hash(x, y);
        let idx = r < 0.14 ? 1 : r > 0.92 ? 3 : 2;
        if (j === 0) idx = 0;
        else if (j === 1) idx = Math.min(idx, 1);
        if (d - hw < 2) idx = Math.min(idx, 1);
        c = pick(GRASS, idx);
        const t = hash(x + 999, y + 777);
        if (j > 3 && t > 0.99) {
          g.set(x, y - 1, GRASS(3));
          c = GRASS(4);
        } else if (j > 5 && t < 0.0025) c = rgb(t < 0.00125 ? '#e0788a' : '#f2d36a');
      }
      g.set(x, y, c);
    }
  }
}

export function buildScene(L: IntroLayout): Grid {
  const x0 = -L.ox;
  const x1 = L.cols - L.ox;
  const base = new Grid(L.cols, L.rows, L.ox, L.oy);
  mountains(base, x0, x1);

  const castle = new Grid(L.cols, L.rows, L.ox, L.oy);
  wall(castle, x0, x1);
  tower(castle, 26);
  tower(castle, 150);
  keep(castle);
  gateFrame(castle);
  TORCH_X.forEach((x) => sconce(castle, x));
  WINDOWS.forEach((w) => windowShape(castle, w, STONE(0), STONE(0)));
  WINDOWS.forEach((w) => windowShape(castle, w, GOLD(0), null, true));
  outline(castle, INK);
  base.draw(castle);

  ground(base, x0, x1, L.rows - L.oy);
  return base;
}

/** Jendela menyala + cahaya obor (di-pulse lewat CSS). */
export function buildLights(L: IntroLayout): Grid {
  const g = new Grid(L.cols, L.rows, L.ox, L.oy);
  const warm = rgb('#ff7a1c');
  WINDOWS.forEach(([x, y, w, h]) => glow(g, x + w / 2, y + h / 2, w + 3, warm, 0.14));
  TORCH_X.forEach((x) => glow(g, x, 118, 15, warm, 0.22));
  WINDOWS.forEach((win) => windowShape(g, win, GOLD(3), null, true));
  return g;
}

/* ───────────── Dunia di balik gerbang ───────────── */

export function buildInterior(): Grid {
  const W = GATE.w;
  const H = GATE.h;
  const g = new Grid(W, H);
  const sky = ramp(['#5b3f8f', '#8a4f93', '#c76a86', '#ef9a78', '#ffcf7a']);
  const sunX = 16;
  const sunY = 27;

  for (let y = 0; y < 34; y++) {
    const t = (y / 33) * (sky.size - 1);
    const i = Math.min(Math.floor(t), sky.size - 2);
    for (let x = 0; x < W; x++) g.set(x, y, t - i - 0.35 > bayer(x, y) ? sky(i + 1) : sky(i));
  }
  glow(g, sunX, sunY, 13, rgb('#fff0a8'), 0.32);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) if (Math.hypot(x + 0.5 - sunX, y + 0.5 - sunY) <= 4.2) g.set(x, y, rgb('#fff6c8'));

  // bukit jauh
  for (let x = 0; x < W; x++) {
    const hy = 31 - Math.round(3 * Math.sin(x * 0.35 + 1) + 2 * Math.sin(x * 0.8));
    for (let y = hy; y < 36; y++) g.set(x, y, rgb(y === hy ? '#8a5a8a' : '#6a3f7e'));
  }

  // desa kecil (siluet) dengan jendela menyala
  const roof = rgb('#3a2548');
  const lit = rgb('#ffd56a');
  const house = (x: number, w: number, h: number) => {
    g.rect(x, 35 - h, w, h, roof);
    for (let r = 0; r < 3; r++) g.rect(x + r, 35 - h - 3 + r, w - r * 2, 1, roof);
    g.set(x + 1, 35 - h + 2, lit);
  };
  house(2, 6, 6); house(9, 5, 8); house(21, 6, 7); house(27, 5, 5);
  g.rect(18, 20, 3, 15, roof); // menara
  for (let r = 0; r < 4; r++) g.rect(18 + (r >> 1), 17 + r, 3 - (r >> 1) * 2, 1, roof);
  g.set(19, 24, lit);

  // tanah + jalan menuju matahari
  for (let y = 35; y < H; y++)
    for (let x = 0; x < W; x++) {
      const hw = 2 + (y - 34) * 1.15;
      const d = Math.abs(x + 0.5 - 16);
      if (d <= hw) {
        const s = hash(Math.floor((x + (y >> 1)) / 3), y >> 1);
        g.set(x, y, rgb(((y - 35) & 1) === 1 && s > 0.55 ? '#c98f5a' : s < 0.25 ? '#e8b878' : '#f0c47a'));
      } else g.set(x, y, rgb(g.dither(x, y) > (y - 35) / 12 ? '#7a4a62' : '#5a3556'));
    }

  // siluet pohon di sisi
  const tree = rgb('#26183a');
  ([[3, 36], [28, 37]] as [number, number][]).forEach(([tx, ty]) => {
    g.rect(tx, ty - 6, 2, 8, tree);
    for (let dy = -8; dy <= 2; dy++)
      for (let dx = -4; dx <= 5; dx++)
        if (Math.hypot(dx - 0.5, (dy + 3) * 1.15) < 5) g.set(tx + dx, ty - 9 + dy, tree);
  });

  // bentuk lengkung gerbang
  for (let y = 0; y < ARCH_R; y++)
    for (let x = 0; x < W; x++) if (Math.hypot(x + 0.5 - ARCH_R, y + 0.5 - ARCH_R) > ARCH_R) g.set(x, y, 0);
  return g;
}

/* ───────────── Pintu kayu + frame animasi buka ───────────── */

const DW = 16;
const DH = GATE.h;
export const DOOR_FRAMES = 8;

function doorLeaf(): Grid {
  const g = new Grid(DW, DH);
  const inside = (x: number, y: number) => x >= 0 && x < DW && y >= 0 && y < DH && (y >= ARCH_R || Math.hypot(x + 0.5 - ARCH_R, y + 0.5 - ARCH_R) <= ARCH_R);
  const put = (x: number, y: number, c: number) => inside(x, y) && g.set(x, y, c);

  for (let y = 0; y < DH; y++)
    for (let x = 0; x < DW; x++) {
      const col = x & 3;
      let idx = col === 3 ? 0 : col === 0 ? 3 : col === 1 ? 2 : 1;
      if (col !== 3 && hash(x, y >> 1) > 0.9) idx -= 1;
      put(x, y, WOOD(Math.max(0, idx)));
    }
  for (const sy of [9, 31]) {
    for (let x = 0; x < 15; x++) {
      put(x, sy, IRON(2));
      put(x, sy + 1, IRON(1));
      put(x, sy + 2, IRON(0));
    }
    for (let x = 0; x < 6; x++) for (let r = -1; r < 4; r++) if (r < 0 || r > 2) put(x, sy + r, IRON(1));
    [3, 7, 11].forEach((x) => put(x, sy + 1, GOLD(3)));
  }
  // gagang cincin
  ([[11, 21], [12, 21], [13, 21], [11, 22], [13, 22], [11, 23], [12, 23], [13, 23]] as [number, number][]).forEach(([x, y]) => put(x, y, GOLD(2)));
  put(12, 20, IRON(2));
  put(12, 22, WOOD(0));

  // tepi gelap
  const edge: [number, number][] = [];
  for (let y = 0; y < DH; y++)
    for (let x = 0; x < DW; x++)
      if (inside(x, y) && (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1))) edge.push([x, y]);
  edge.forEach(([x, y]) => g.set(x, y, WOOD(0)));
  return g;
}

/** Sprite sheet horizontal: tiap frame = daun pintu kiri pada sudut buka tertentu (engsel di kiri). */
export function buildDoorSheet(): Grid {
  const leaf = doorLeaf();
  const sheet = new Grid(DW * DOOR_FRAMES, DH);
  const cy = DH / 2;
  for (let f = 0; f < DOOR_FRAMES; f++) {
    const th = (f / (DOOR_FRAMES - 1)) * (84 * Math.PI) / 180;
    const w = f === 0 ? DW : Math.max(2, Math.round(DW * Math.cos(th)));
    const shadeF = 1 - 0.5 * Math.sin(th);
    for (let c = 0; c < w; c++) {
      const t = (c + 0.5) / w;
      const sx = Math.min(DW - 1, Math.floor(t * DW));
      const v = 1 - 0.2 * Math.sin(th) * t; // sisi bebas menjauh -> mengecil
      for (let r = 0; r < DH; r++) {
        const sy = Math.floor(cy + (r + 0.5 - cy) / v);
        if (sy < 0 || sy >= DH) continue;
        const px = leaf.data[sy * DW + sx] ?? 0;
        if (!(px >>> 24)) continue;
        const d = (s: number) => Math.round(((px >>> s) & 255) * shadeF);
        sheet.data[r * sheet.w + f * DW + c] = (0xff000000 | (d(16) << 16) | (d(8) << 8) | d(0)) >>> 0;
      }
    }
  }
  return sheet;
}

/* ───────────── Sprite kecil: api obor, hati, kursor ───────────── */

const FLAME = [
  ['...o...', '...o...', '..ooo..', '..oyo..', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
  ['..o....', '..oo...', '..ooo..', '.ooyo..', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
  ['...o...', '...oo..', '..ooo..', '..oyo..', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
  ['....o..', '...oo..', '..ooo..', '..oyoo.', '.oyyyo.', '.oywyo.', '.oywyo.', '..oyo..', '..rrr..'],
];

export function buildFlameSheet(): Grid {
  const pal = { o: '#f0762c', y: '#ffc24a', w: '#fff2b0', r: '#b8402a' };
  const sheet = new Grid(7 * FLAME.length, 9);
  FLAME.forEach((rows, f) => {
    const s = sprite(rows, pal);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 7; x++) sheet.data[y * sheet.w + f * 7 + x] = s.data[y * 7 + x] ?? 0;
  });
  return sheet;
}

export const buildHeart = () =>
  sprite(
    ['..oo.oo..', '.oRRoRRRo', 'oRwRRRRRo', 'oRRRRRRdo', '.oRRRRdo.', '..oRRdo..', '...odo...', '....o....'],
    { o: '#2a0f1e', R: '#e0384a', w: '#ff9aa0', d: '#a02038' },
  );

export const buildArrow = () =>
  sprite(['g....', 'gg...', 'ggg..', 'gggg.', 'ggggg', 'gggg.', 'ggg..', 'gg...', 'g....'], { g: '#ffd56a' });

/* ───────────── Render ke DOM ───────────── */

export function renderIntroArt(root: HTMLElement, L: IntroLayout): void {
  const s = root.style;
  s.setProperty('--u', `${L.u}px`);
  s.setProperty('--cols', String(L.cols));
  s.setProperty('--rows', String(L.rows));
  s.setProperty('--ox', String(L.ox));
  s.setProperty('--oy', String(L.oy));
  s.setProperty('--zoom', L.zoom.toFixed(2));

  const layers: Record<string, () => Grid> = {
    sky: () => buildSky(L),
    'stars-a': () => buildStars(L, 0),
    'stars-b': () => buildStars(L, 1),
    scene: () => buildScene(L),
    lights: () => buildLights(L),
    interior: buildInterior,
  };
  root.querySelectorAll<HTMLCanvasElement>('canvas[data-layer]').forEach((c) => {
    const g = layers[c.dataset.layer ?? '']?.();
    if (!g) return;
    blit(g, c);
  });

  s.setProperty('--sheet-clouds', toURL(buildClouds(L)));
  s.setProperty('--sheet-door', toURL(buildDoorSheet()));
  s.setProperty('--sheet-flame', toURL(buildFlameSheet()));
  s.setProperty('--sprite-heart', toURL(buildHeart()));
  s.setProperty('--sprite-arrow', toURL(buildArrow()));
}