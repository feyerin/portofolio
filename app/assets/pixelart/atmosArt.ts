/**
 * atmosArt.ts — pixel art untuk dasbor cuaca Atmos.
 * - Jendela observatorium: langit, matahari/bulan, awan, gunung, tanah (bereaksi pada
 *   suhu, kondisi cuaca, dan siang/malam)
 * - Ikon cuaca berwarna (sprite 16x16) dan glyph kecil (CSS mask)
 * - Tile hujan / salju yang jatuh (digeser lewat CSS)
 */
import { Grid, bayer, blit, glow, hash, outline, rgb, sprite, toURL } from './pixelKit';

export type TempTheme = 'frozen' | 'cold' | 'mild' | 'warm' | 'hot' | 'extreme';
export type Mood = 'clear' | 'cloudy' | 'rain' | 'snow';
export type WeatherIconName = 'sun' | 'moon' | 'partly-cloudy' | 'cloud' | 'rain' | 'snow' | 'storm';

export interface SceneInput {
  theme: TempTheme;
  mood: Mood;
  isDay: boolean;
  cols: number;
  rows: number;
}

/* ───────── Warna ───────── */

const hexToRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = ([r, g, b]: number[]) => `#${[r, g, b].map((v) => Math.round(v ?? 0).toString(16).padStart(2, '0')).join('')}`;
const mixHex = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return toHex(A.map((v, i) => v + ((B[i] ?? 0) - v) * t));
};

const SKY: Record<TempTheme, string[]> = {
  frozen: ['#8fb8d6', '#a8c9e0', '#bfd7e8', '#d4e5f0', '#e6f0f7', '#f2f8fb'],
  cold: ['#8fa5b0', '#a6b8c0', '#bccacf', '#cfd9db', '#e0e6e4', '#ecefea'],
  mild: ['#8ec3d4', '#a8d2d8', '#c1dfd2', '#d8eac8', '#e9f0c6', '#f4f2c8'],
  warm: ['#a9c8cc', '#cdd9bd', '#ecdfa6', '#f6d391', '#f6c283', '#f2b078'],
  hot: ['#e8cc94', '#f3c486', '#f4b576', '#f2a468', '#ee9460', '#ea8456'],
  extreme: ['#eeb28a', '#ee9c70', '#e88a5e', '#e07852', '#d66a4a', '#cc5e46'],
};
const NIGHT = ['#0b0f1e', '#111833', '#182148', '#222c5c', '#34396c', '#4c4478'];
const GROUND: Record<TempTheme, [string, string, string]> = {
  frozen: ['#f4f9fc', '#dcebf4', '#b9d3e3'],
  cold: ['#a3b49a', '#8fa186', '#7a8d73'],
  mild: ['#9bb96c', '#82a05a', '#68844a'],
  warm: ['#b8b46a', '#a2a05a', '#8a8850'],
  hot: ['#d2b66c', '#c0a25c', '#a88c4c'],
  extreme: ['#c78a58', '#b57848', '#9c6640'],
};
const INK = rgb('#2e261f');

const skyPalette = (i: SceneInput): string[] => {
  const base = i.isDay ? SKY[i.theme] : NIGHT;
  const gray = i.isDay ? '#8e9ba4' : '#2a3040';
  const t = i.mood === 'rain' ? 0.62 : i.mood === 'snow' ? 0.5 : i.mood === 'cloudy' ? 0.36 : 0;
  return base.map((c) => mixHex(c, gray, t));
};

/* ───────── Pemandangan ───────── */

function pine(g: Grid, x: number, base: number, h: number, snow: boolean, night: boolean) {
  const dark = rgb(night ? '#16261f' : '#2f4a35');
  const light = rgb(night ? '#22392d' : '#4f7a5a');
  const cap = rgb('#f4f9fc');
  for (let r = 0; r < h; r++) {
    const half = ((r / 2) | 0) + 1;
    for (let dx = -half; dx <= half; dx++) g.set(x + dx, base - h + r, snow && r % 3 === 0 && Math.abs(dx) < half ? cap : dx > 0 ? light : dark);
  }
  g.rect(x, base, 1, 2, rgb('#3a2c22'));
}

function cloud(g: Grid, cx: number, cy: number, w: number, h: number, tones: [string, string, string]) {
  const [hi, mid, lo] = tones.map(rgb) as [number, number, number];
  for (let dx = -w / 2; dx < w / 2; dx++) {
    const t = dx / (w / 2);
    const hp = Math.round(h * Math.pow(Math.max(0, 1 - t * t), 0.65) * (0.72 + 0.28 * Math.sin(dx * 0.7 + cx)));
    for (let k = -hp; k <= Math.ceil(hp * 0.28); k++) g.set(cx + dx, cy + k, k <= -hp + 1 ? hi : k > hp * 0.1 ? lo : mid);
  }
}

function observatory(g: Grid, x: number, base: number, night: boolean) {
  const t = new Grid(g.w, g.h);
  const stone = [rgb('#8f7f64'), rgb('#b3a283'), rgb('#cdbd9a')] as [number, number, number];
  for (let y = base - 14; y < base; y++)
    for (let dx = -4; dx <= 4; dx++) t.set(x + dx, y, (y + (dx > 0 ? 1 : 0)) % 4 === 0 ? stone[0] : dx > 1 ? stone[2] : stone[1]);
  for (let y = base - 22; y < base - 14; y++)
    for (let dx = -6; dx <= 6; dx++) if (Math.hypot(dx, (y - (base - 14)) * 1.15) <= 6.4) t.set(x + dx, y, dx > 1 ? rgb('#7f3e47') : rgb('#5f2a34'));
  t.rect(x, base - 22, 1, 7, rgb('#a85860')); // celah kubah
  t.rect(x, base - 28, 1, 6, rgb('#5a524a')); // tiang
  t.rect(x + 1, base - 28, 4, 2, rgb('#9b5359')); // bendera
  t.rect(x - 1, base - 9, 3, 4, night ? rgb('#ffd56a') : rgb('#46657a'));
  outline(t, INK);
  g.draw(t);
}

export function buildScene(i: SceneInput): Grid {
  const { cols, rows, theme, mood, isDay } = i;
  const g = new Grid(cols, rows);
  const groundY = rows - 9;
  const pal = skyPalette(i);
  const n = pal.length - 1;

  // langit (dithering)
  for (let y = 0; y < rows; y++) {
    const t = Math.min(y / (groundY - 2), 1) * n;
    const k = Math.floor(t);
    const f = Math.max(0, (t - k - 0.45) * 1.8);
    for (let x = 0; x < cols; x++) g.data[y * cols + x] = rgb(k < n && f > bayer(x, y) ? (pal[k + 1] as string) : (pal[k] as string));
  }

  const sx = Math.round(cols * 0.72);
  const sy = 12;

  // bintang (malam)
  if (!isDay) {
    const stars = Math.floor((cols * rows) / (mood === 'clear' ? 70 : 220));
    for (let s = 0; s < stars; s++) {
      const x = Math.floor(hash(s, 1) * cols);
      const y = Math.floor(hash(s, 2) * (groundY - 8));
      g.set(x, y, rgb(hash(s, 3) > 0.7 ? '#fff2b0' : '#dfe6ff'));
    }
  }

  // matahari / bulan
  if (isDay) {
    const cover = mood === 'clear' ? 1 : mood === 'cloudy' ? 0.55 : 0;
    if (cover > 0) {
      glow(g, sx, sy, 22 * cover + 6, rgb('#fff3b8'), 0.3 * cover);
      for (let y = sy - 7; y <= sy + 7; y++)
        for (let x = sx - 7; x <= sx + 7; x++) {
          const d = Math.hypot(x + 0.5 - sx, y + 0.5 - sy);
          if (d <= 5.6) g.set(x, y, rgb(d > 4.4 ? '#f5d98c' : d < 2 ? '#fffbe4' : '#fff1bb'));
        }
    }
  } else if (mood === 'clear' || mood === 'cloudy') {
    glow(g, sx, sy, 16, rgb('#c9d4ff'), 0.12);
    for (let y = sy - 8; y <= sy + 8; y++)
      for (let x = sx - 8; x <= sx + 8; x++) {
        const a = Math.hypot(x + 0.5 - sx, y + 0.5 - sy);
        const b = Math.hypot(x + 0.5 - (sx + 3), y + 0.5 - (sy - 2));
        if (a <= 6 && b > 5.2) g.set(x, y, rgb('#f8ebc0'));
      }
  }

  // gunung & bukit
  const farC = mixHex(pal[n] as string, isDay ? '#6a7a8a' : '#10142a', 0.45);
  const hillC = mixHex((GROUND[theme][1] as string), isDay ? '#5a6a5a' : '#0f1a18', isDay ? 0.25 : 0.7);
  const farY = (x: number) => groundY - 12 - 9 * Math.abs(Math.sin(x * 0.045 + 0.6)) - 4 * Math.abs(Math.sin(x * 0.12 + 2));
  const hillY = (x: number) => groundY - 4 - 3 * Math.sin(x * 0.07 + 1) - 1.5 * Math.sin(x * 0.19);
  for (let x = 0; x < cols; x++) {
    for (let y = Math.round(farY(x)); y < groundY; y++) g.set(x, y, rgb(farC));
    for (let y = Math.round(hillY(x)); y < groundY; y++) g.set(x, y, rgb(hillC));
  }

  // awan
  const count = mood === 'clear' ? 2 : mood === 'snow' ? 5 : mood === 'cloudy' ? 6 : 7;
  const tones: [string, string, string] = !isDay
    ? ['#5b6485', '#3f4768', '#2c3350']
    : mood === 'rain' ? ['#b4bec6', '#8e9aa4', '#6f7c87']
    : mood === 'snow' ? ['#f4f6f8', '#dde3e8', '#bcc6cf']
    : ['#fffaf0', '#f0ebdd', '#d4cbb6'];
  for (let c = 0; c < count; c++) {
    const w = (mood === 'clear' ? 22 : 34) + Math.floor(hash(c, 4) * 20);
    cloud(g, Math.floor(hash(c, 5) * (cols + 10)) - 5, 8 + Math.floor(hash(c, 6) * 16), w, mood === 'clear' ? 4 : 6, tones);
  }

  // tanah
  const gr = GROUND[theme].map((c) => (isDay ? c : mixHex(c, '#0f1a18', 0.65)));
  for (let y = groundY; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const r = hash(x, y + 50);
      g.set(x, y, rgb(y === groundY ? (gr[2] as string) : r < 0.16 ? (gr[2] as string) : r > 0.9 ? (gr[0] as string) : (gr[1] as string)));
    }

  // pohon & observatorium
  const snowy = theme === 'frozen' || theme === 'cold' || mood === 'snow';
  for (let x = 6; x < cols - 4; x += 9 + Math.floor(hash(x, 8) * 9)) {
    if (Math.abs(x - cols * 0.18) < 8) continue;
    pine(g, x, groundY + 1, 7 + Math.floor(hash(x, 9) * 5), snowy, !isDay);
  }
  observatory(g, Math.round(cols * 0.18), groundY + 1, !isDay);
  return g;
}

export function renderScene(canvas: HTMLCanvasElement, input: SceneInput): void {
  blit(buildScene(input), canvas);
}

/* ───────── Tile hujan / salju ───────── */

export const FALL = 32;

export function buildFallTile(mood: Mood, seed: number): Grid | null {
  if (mood !== 'rain' && mood !== 'snow') return null;
  const g = new Grid(FALL, FALL);
  const count = mood === 'rain' ? 10 : 12;
  for (let i = 0; i < count; i++) {
    const x = Math.floor(hash(i + seed * 40, 1) * FALL);
    const y = Math.floor(hash(i + seed * 40, 2) * FALL);
    if (mood === 'rain') {
      const c = rgb(seed ? '#9bb8d2' : '#6f94b6');
      [[0, 0], [0, 1], [1, 2], [1, 3]].forEach(([dx, dy]) => g.set((x + (dx as number)) % FALL, (y + (dy as number)) % FALL, c));
    } else {
      const c = rgb('#ffffff');
      g.set(x, y, c);
      if (seed && i % 3 === 0) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => g.set((x + FALL + (dx as number)) % FALL, (y + FALL + (dy as number)) % FALL, c));
    }
  }
  return g;
}

/* ───────── Ikon cuaca berwarna (16x16) ───────── */

const ICON = 16;

function sunDisc(g: Grid, cx: number, cy: number, r: number, rays: boolean) {
  for (let y = 0; y < ICON; y++)
    for (let x = 0; x < ICON; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d <= r) g.set(x, y, rgb(d > r - 1.1 ? '#e0a63c' : d < r * 0.45 ? '#fff3b8' : '#ffd56a'));
    }
  if (!rays) return;
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    for (const dist of [r + 1.6, r + 2.6]) g.set(Math.round(cx + Math.cos(a) * dist - 0.5), Math.round(cy + Math.sin(a) * dist - 0.5), rgb('#e0a63c'));
  }
}

function cloudIcon(g: Grid, ox: number, oy: number, dark = false) {
  const hi = rgb(dark ? '#8a929c' : '#ffffff');
  const mid = rgb(dark ? '#6a727e' : '#e6ece8');
  const lo = rgb(dark ? '#4c5360' : '#bcc9cc');
  const lumps: [number, number, number][] = [[4, 9, 3.4], [8, 6.5, 4.4], [12, 9, 3.6]];
  for (let y = 0; y < 14; y++)
    for (let x = 0; x < 16; x++) {
      const inLump = lumps.some(([cx, cy, r]) => Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r) || (y >= 8 && y <= 11 && x >= 3 && x <= 13);
      if (inLump) g.set(x + ox, y + oy, y < 7 ? hi : y > 9 ? lo : mid);
    }
}

function weatherIcon(name: WeatherIconName): Grid {
  const g = new Grid(ICON, ICON, 0, 0);
  if (name === 'sun') sunDisc(g, 8, 8, 4.2, true);
  else if (name === 'moon') {
    for (let y = 0; y < ICON; y++)
      for (let x = 0; x < ICON; x++) {
        const a = Math.hypot(x + 0.5 - 8, y + 0.5 - 8);
        const b = Math.hypot(x + 0.5 - 11, y + 0.5 - 6);
        if (a <= 5.4 && b > 4.6) g.set(x, y, rgb(a > 4.3 ? '#d9c48c' : '#f8ebc0'));
      }
    [[12, 12], [3, 3], [13, 3]].forEach(([x, y]) => g.set(x as number, y as number, rgb('#fff2b0')));
  }
  else if (name === 'partly-cloudy') {
    sunDisc(g, 10.5, 5, 3, true);
    cloudIcon(g, -1, 3);
  } else if (name === 'cloud') cloudIcon(g, 0, 1);
  else if (name === 'rain') {
    cloudIcon(g, 0, -2);
    [[4, 11], [8, 12], [12, 11]].forEach(([x, y]) => { g.rect(x as number, y as number, 1, 3, rgb('#4f7fb0')); g.set((x as number) - 1, (y as number) + 3, rgb('#4f7fb0')); });
  } else if (name === 'snow') {
    cloudIcon(g, 0, -2);
    [[4, 12], [8, 13], [12, 12]].forEach(([x, y]) => { const c = rgb('#ffffff'); g.set(x as number, y as number, c); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => g.set((x as number) + (dx as number), (y as number) + (dy as number), rgb('#bcd3e6'))); });
  } else {
    cloudIcon(g, 0, -2, true);
    [[9, 9], [8, 10], [7, 11], [8, 11], [9, 12], [8, 13], [7, 14]].forEach(([x, y]) => g.set(x as number, y as number, rgb('#ffd56a')));
    g.set(9, 11, rgb('#fff3b8'));
  }
  const big = new Grid(ICON, ICON, 0, 0);
  big.draw(g);
  outline(big, INK);
  return big;
}

export const ICON_NAMES: WeatherIconName[] = ['sun', 'moon', 'partly-cloudy', 'cloud', 'rain', 'snow', 'storm'];

/* ───────── Glyph kecil (hitam; diwarnai lewat CSS mask) ───────── */

export const GLYPHS = {
  drop: ['...k...', '...k...', '..kkk..', '..kkk..', '.kkkkk.', 'kkkkkkk', 'kkkkkkk', '.kkkkk.', '..kkk..'],
  flag: ['kkkkkkkk.', 'kkkkkkkkk', 'kkkkkkkk.', 'kkkkkk...', 'kkkk.....', 'k........', 'k........', 'k........', 'k........', 'k........', 'k........'],
  umbrella: ['...kkkkk...', '.kkkkkkkkk.', 'kkkkkkkkkkk', 'kk.kk.kk.kk', '.....k.....', '.....k.....', '.....k.....', '.....k.....', '..k..k.....', '...kkk.....'],
  search: ['.kkkkk...', 'k.....k..', 'k.....k..', 'k.....k..', 'k.....k..', '.kkkkkk..', '.......kk', '........k'],
  arrowLeft: ['...k...', '..kk...', '.kkkkkk', 'kkkkkkk', '.kkkkkk', '..kk...', '...k...'],
  arrowRight: ['...k...', '...kk..', 'kkkkkk.', 'kkkkkkk', 'kkkkkk.', '...kk..', '...k...'],
} as const;
export type GlyphName = keyof typeof GLYPHS;

/* ───────── Render ───────── */

export function renderAtmosIcons(root: HTMLElement): void {
  ICON_NAMES.forEach((n) => root.style.setProperty(`--wi-${n}`, toURL(weatherIcon(n))));
  (Object.keys(GLYPHS) as GlyphName[]).forEach((n) => root.style.setProperty(`--ag-${n}`, toURL(sprite([...GLYPHS[n]], { k: '#000000' }))));
}

export function renderFall(root: HTMLElement, mood: Mood): void {
  (['a', 'b'] as const).forEach((id, seed) => {
    const t = buildFallTile(mood, seed);
    root.style.setProperty(`--fall-${id}`, t ? toURL(t) : 'none');
  });
}

export const __test = { weatherIcon };