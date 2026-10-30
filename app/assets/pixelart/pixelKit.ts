/**
 * pixelKit.ts — alat gambar pixel art yang dipakai bersama (intro + hero).
 * Grid kecil -> di-upscale CSS (image-rendering: pixelated).
 */

export const rgb = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  return (0xff000000 | ((n & 0xff) << 16) | (n & 0xff00) | (n >> 16)) >>> 0; // ABGR (little-endian)
};
/** Ramp warna: dipanggil seperti fungsi, indeks di-clamp (aman untuk noUncheckedIndexedAccess). */
export type Ramp = { (i: number): number; readonly size: number };
export const ramp = (list: string[]): Ramp => {
  const c = list.map(rgb);
  return Object.assign((i: number) => c[Math.max(0, Math.min(c.length - 1, Math.round(i)))] as number, { size: c.length });
};
export const pick = (r: Ramp, i: number) => r(i);

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer = (x: number, y: number) => ((BAYER[((y & 3) << 2) | (x & 3)] ?? 0) + 0.5) / 16;

export const hash = (a: number, b = 0): number => {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export function over(dst: number, src: number, a: number): number {
  const da = (dst >>> 24) / 255;
  const oa = a + da * (1 - a);
  const ch = (s: number) => {
    const sc = (src >>> s) & 255;
    const dc = (dst >>> s) & 255;
    return Math.round((sc * a + dc * da * (1 - a)) / oa);
  };
  return ((Math.round(oa * 255) << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)) >>> 0;
}

export class Grid {
  readonly data: Uint32Array;
  constructor(
    readonly w: number,
    readonly h: number,
    readonly ox = 0,
    readonly oy = 0,
  ) {
    this.data = new Uint32Array(w * h);
  }
  private i(x: number, y: number) {
    const X = Math.floor(x) + this.ox;
    const Y = Math.floor(y) + this.oy;
    return X < 0 || Y < 0 || X >= this.w || Y >= this.h ? -1 : Y * this.w + X;
  }
  set(x: number, y: number, c: number) {
    const i = this.i(x, y);
    if (i >= 0) this.data[i] = c;
  }
  get(x: number, y: number) {
    const i = this.i(x, y);
    return i >= 0 ? this.data[i] : 0;
  }
  rect(x: number, y: number, w: number, h: number, c: number) {
    for (let j = 0; j < h; j++) for (let k = 0; k < w; k++) this.set(x + k, y + j, c);
  }
  blend(x: number, y: number, c: number, a: number) {
    const i = this.i(x, y);
    if (i >= 0) this.data[i] = over(this.data[i] ?? 0, c, a);
  }
  dither(x: number, y: number) {
    return bayer(Math.floor(x) + this.ox, Math.floor(y) + this.oy);
  }
  /** tempel grid lain (ukuran & origin sama), piksel transparan dilewati */
  draw(src: Grid) {
    for (let i = 0; i < this.data.length; i++) {
      const p = src.data[i] ?? 0;
      if (p >>> 24) this.data[i] = p;
    }
  }
}

/** Garis tepi 1px di sekeliling bentuk (piksel transparan yang menempel piksel terisi). */
export function outline(g: Grid, color: number) {
  const hit: number[] = [];
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < g.w && y < g.h && ((g.data[y * g.w + x] ?? 0) >>> 24);
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++)
      if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) hit.push(y * g.w + x);
  hit.forEach((i) => (g.data[i] = color));
}

export function sprite(rows: string[], pal: Record<string, string>): Grid {
  const g = new Grid((rows[0] ?? '').length, rows.length);
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (pal[ch]) g.set(x, y, rgb(pal[ch]));
    }),
  );
  return g;
}

/** Cahaya berpendar dengan tepi dithering (ala pixel art). */
export function glow(g: Grid, cx: number, cy: number, r: number, color: number, a: number) {
  for (let y = Math.floor(cy - r); y <= cy + r; y++)
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d >= r) continue;
      const s = 1 - d / r;
      if (s > 0.55) g.blend(x, y, color, a);
      else if (s * 1.9 > g.dither(x, y) * 1.05) g.blend(x, y, color, a * 0.55);
    }
}

/** Isi poligon (even-odd) dengan satu warna. */
export function poly(g: Grid, pts: [number, number][], color: number): void {
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

/** Salin grid ke <canvas> (ukuran canvas mengikuti grid). */
export function blit(g: Grid, c: HTMLCanvasElement): void {
  c.width = g.w;
  c.height = g.h;
  c.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(g.data.buffer as ArrayBuffer), g.w, g.h), 0, 0);
}

/** Grid -> CSS `url("data:...")` untuk sprite sheet. */
export function toURL(g: Grid): string {
  const c = document.createElement('canvas');
  blit(g, c);
  return `url("${c.toDataURL()}")`;
}