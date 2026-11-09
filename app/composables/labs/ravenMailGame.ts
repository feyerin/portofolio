/**
 * ravenMailGame.ts — Raven Mail Run.
 * Gagak Postman mengantar surat melewati menara. Tap / Space untuk mengepak.
 *
 * - `RavenSim`  : logika murni (tanpa DOM) -> mudah dites
 * - `RavenMailGame` : menggambar ke <canvas> resolusi rendah (160x96) dan menjalankan loop
 * Canvas di-upscale dengan bilangan bulat lewat CSS (image-rendering: pixelated).
 */
import { Grid, bayer, blit, hash, outline, poly, rgb, toURL } from '~/assets/pixelart/pixelKit';

export const GAME_W = 160;
export const GAME_H = 96;
const GROUND_H = 10;
const GROUND_Y = GAME_H - GROUND_H;

const RAVEN_X = 36;
const GRAVITY = 560; // px/s^2
const FLAP_V = -158; // px/s
const MAX_FALL = 230;
const TOWER_W = 22;
const TOWER_BODY_W = 18;
const SPACING = 78; // jarak antar menara (px)
const BASE_SPEED = 52;

export type GameState = 'ready' | 'playing' | 'paused' | 'over';

export interface Tower {
  x: number;
  gapTop: number;
  gap: number;
  passed: boolean;
}

export interface Effect {
  x: number;
  y: number;
  t: number;
}

/* ───────────────────────── Logika murni ───────────────────────── */

export class RavenSim {
  state: GameState = 'ready';
  score = 0;
  best: number;
  time = 0;
  overAt = 0;
  raven = { x: RAVEN_X, y: GAME_H / 2 - 9, vy: 0, frame: 0 };
  towers: Tower[] = [];
  effects: Effect[] = [];
  private pausedFrom: GameState = 'playing';

  constructor(
    best = 0,
    private readonly rng: () => number = Math.random,
  ) {
    this.best = best;
  }

  get speed() {
    return BASE_SPEED + Math.min(this.score, 24) * 1.4;
  }

  static gapFor(score: number) {
    return 46 - Math.min(score, 18) * 0.6;
  }

  reset() {
    this.state = 'ready';
    this.score = 0;
    this.towers = [];
    this.effects = [];
    this.raven = { x: RAVEN_X, y: GAME_H / 2 - 9, vy: 0, frame: 0 };
  }

  /** Tap / Space. Mengembalikan true kalau aksi diterima. */
  flap(): boolean {
    if (this.state === 'ready') {
      this.state = 'playing';
      this.raven.vy = FLAP_V;
      this.spawn(GAME_W + 12);
      return true;
    }
    if (this.state === 'playing') {
      this.raven.vy = FLAP_V;
      return true;
    }
    if (this.state === 'paused') {
      this.resume();
      return true;
    }
    if (this.state === 'over' && this.time - this.overAt > 0.45) {
      this.reset();
      return this.flap();
    }
    return false;
  }

  pause() {
    if (this.state !== 'playing') return;
    this.pausedFrom = this.state;
    this.state = 'paused';
  }

  resume() {
    if (this.state === 'paused') this.state = this.pausedFrom;
  }

  private spawn(x: number) {
    const gap = RavenSim.gapFor(this.score);
    const gapTop = 14 + this.rng() * (GROUND_Y - 28 - gap);
    this.towers.push({ x, gapTop, gap, passed: false });
  }

  step(dtRaw: number) {
    const dt = Math.min(dtRaw, 1 / 30);
    if (this.state === 'paused') return;
    this.time += dt;
    const r = this.raven;

    if (this.state === 'ready') {
      r.y = GAME_H / 2 - 9 + Math.sin(this.time * 3) * 3;
      r.frame = Math.floor(this.time * 5) % 2;
      return;
    }

    if (this.state === 'over') {
      if (r.y < GROUND_Y - 12) {
        r.vy = Math.min(r.vy + GRAVITY * dt, MAX_FALL);
        r.y += r.vy * dt;
      }
      return;
    }

    // playing
    r.vy = Math.min(r.vy + GRAVITY * dt, MAX_FALL);
    r.y += r.vy * dt;
    r.frame = r.vy < -20 ? 0 : Math.floor(this.time * 9) % 2;
    if (r.y < 0) {
      r.y = 0;
      r.vy = 0;
    }

    const move = this.speed * dt;
    for (const t of this.towers) t.x -= move;
    this.towers = this.towers.filter((t) => t.x > -TOWER_W - 2);
    const last = this.towers[this.towers.length - 1];
    if (!last || last.x < GAME_W - SPACING) this.spawn(last ? last.x + SPACING : GAME_W + 12);

    for (const t of this.towers) {
      if (!t.passed && t.x + TOWER_W < r.x + 2) {
        t.passed = true;
        this.score += 1;
        this.effects.push({ x: r.x + 4, y: r.y - 8, t: 0 });
      }
    }
    this.effects.forEach((e) => (e.t += dt));
    this.effects = this.effects.filter((e) => e.t < 0.6);

    if (this.collides()) this.die();
  }

  collides(): boolean {
    const r = this.raven;
    const rx0 = r.x + 5;
    const rx1 = r.x + 19;
    const ry0 = r.y + 5;
    const ry1 = r.y + 13;
    if (ry1 >= GROUND_Y) return true;
    for (const t of this.towers) {
      const tx0 = t.x + (TOWER_W - TOWER_BODY_W) / 2;
      const tx1 = tx0 + TOWER_BODY_W;
      if (rx1 > tx0 && rx0 < tx1 && (ry0 < t.gapTop || ry1 > t.gapTop + t.gap)) return true;
    }
    return false;
  }

  private die() {
    this.state = 'over';
    this.overAt = this.time;
    this.raven.vy = -60;
    if (this.score > this.best) this.best = this.score;
  }
}

/* ───────────────────────── Sprite ───────────────────────── */

const INK = rgb('#2e261f');

function buildSky(): Grid {
  const g = new Grid(GAME_W, GAME_H);
  const pal = ['#9fd0d8', '#b6dcd6', '#cfe6d0', '#e4efc8', '#f3f0c6', '#f8e6b8'].map(rgb);
  const n = pal.length - 1;
  for (let y = 0; y < GAME_H; y++) {
    const t = Math.min(y / GROUND_Y, 1) * n;
    const i = Math.min(Math.floor(t), n);
    const f = Math.max(0, (t - i - 0.45) * 1.8);
    for (let x = 0; x < GAME_W; x++) g.data[y * GAME_W + x] = f > bayer(x, y) && i < n ? (pal[i + 1] as number) : (pal[i] as number);
  }
  // matahari
  for (let y = 4; y < 24; y++)
    for (let x = 118; x < 140; x++) {
      const d = Math.hypot(x + 0.5 - 129, y + 0.5 - 14);
      if (d <= 5.4) g.set(x, y, rgb(d > 4.2 ? '#f5d98c' : '#fff1bb'));
    }
  return g;
}

/** Gunung jauh: periodik terhadap GAME_W supaya bisa di-tile. */
function buildFar(): Grid {
  const g = new Grid(GAME_W, GAME_H);
  const A = rgb('#c2d1b6');
  const B = rgb('#a8bb9e');
  for (let x = 0; x < GAME_W; x++) {
    const y = Math.round(GROUND_Y - 26 - 13 * Math.abs(Math.sin((Math.PI * 3 * x) / GAME_W + 0.4)) - 5 * Math.abs(Math.sin((Math.PI * 7 * x) / GAME_W)));
    for (let yy = y; yy < GROUND_Y; yy++) g.set(x, yy, yy === y ? A : B);
  }
  return g;
}

function buildNear(): Grid {
  const g = new Grid(GAME_W, GAME_H);
  const hill = [rgb('#9bb56a'), rgb('#82a05a')] as [number, number];
  const pine = [rgb('#2f4a35'), rgb('#4f7a5a')] as [number, number];
  const hy = (x: number) => Math.round(GROUND_Y - 9 - 4 * Math.sin((Math.PI * 2 * 2 * x) / GAME_W + 1));
  for (let x = 0; x < GAME_W; x++) for (let y = hy(x); y < GROUND_Y; y++) g.set(x, y, y === hy(x) ? hill[0] : hill[1]);
  for (let i = 0; i < 11; i++) {
    const x = Math.round((i * GAME_W) / 11 + hash(i, 2) * 8) % GAME_W;
    const h = 7 + Math.floor(hash(i, 3) * 4);
    const base = hy(x) + 1;
    for (let r = 0; r < h; r++) {
      const half = ((r / 2) | 0) + 1;
      for (let dx = -half; dx <= half; dx++) g.set((x + dx + GAME_W) % GAME_W, base - h + r, dx > 0 ? pine[1] : pine[0]);
    }
  }
  return g;
}

function buildClouds(): Grid {
  const g = new Grid(GAME_W, GAME_H);
  const body = [rgb('#fffaf0'), rgb('#f0ebdd'), rgb('#d4cbb6')] as [number, number, number];
  const cloud = (cx: number, cy: number, w: number, h: number, seed: number) => {
    for (let dx = -w / 2; dx < w / 2; dx++) {
      const t = dx / (w / 2);
      const hp = Math.round(h * Math.pow(Math.max(0, 1 - t * t), 0.7) * (0.75 + 0.25 * Math.sin(dx * 0.6 + seed)));
      for (let k = -hp; k <= Math.ceil(hp * 0.3); k++) {
        const x = (((Math.floor(cx + dx)) % GAME_W) + GAME_W) % GAME_W;
        g.set(x, cy + k, k <= -hp + 1 ? body[0] : k > hp * 0.12 ? body[2] : body[1]);
      }
    }
  };
  cloud(30, 18, 30, 4, 1);
  cloud(88, 34, 40, 5, 4);
  cloud(140, 12, 24, 3, 2);
  return g;
}

function buildGround(): Grid {
  const g = new Grid(16, GROUND_H);
  const gr = ['#4f6a3c', '#68844a', '#82a05a', '#9bb96c'].map(rgb);
  for (let y = 0; y < GROUND_H; y++)
    for (let x = 0; x < 16; x++) {
      const r = hash(x, y + 9);
      g.set(x, y, y === 0 ? (gr[3] as number) : y === 1 ? (gr[2] as number) : r < 0.2 ? (gr[0] as number) : r > 0.85 ? (gr[2] as number) : (gr[1] as number));
    }
  return g;
}

const STONE = ['#6d5f4c', '#8f7f64', '#b3a283', '#cdbd9a', '#e6d9b8'].map(rgb);

function buildTowerBody(): Grid {
  const g = new Grid(TOWER_BODY_W, 8);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < TOWER_BODY_W; x++) {
      const off = (y >> 2) & 1 ? 4 : 0;
      const bx = x + off;
      let idx = 2;
      if (y % 4 === 3 || bx % 8 === 7) idx = 1;
      else if (y % 4 === 0) idx = 3;
      if (x < 2) idx -= 1;
      else if (x >= TOWER_BODY_W - 3) idx += 1;
      g.set(x, y, STONE[Math.max(0, Math.min(4, idx))] as number);
    }
  return g;
}

/** Tutup menara dengan krenelasi. `down` = menara menggantung dari atas. */
function buildCap(down: boolean): Grid {
  const g = new Grid(TOWER_W, 8, 0, 0);
  const t = new Grid(TOWER_W, 8, 0, 0);
  const rows = down ? [0, 1, 2, 3, 4, 5] : [2, 3, 4, 5, 6, 7];
  // dasar topi
  for (const y of rows) for (let x = 0; x < TOWER_W; x++) t.set(x, y, STONE[x < 3 ? 1 : x > TOWER_W - 4 ? 3 : 2] as number);
  // krenelasi
  const merlonRows = down ? [6, 7] : [0, 1];
  for (const y of merlonRows) for (const x of [0, 1, 2, 3, 9, 10, 11, 12, 18, 19, 20, 21]) t.set(x, y, STONE[x > 10 ? 3 : 2] as number);
  outline(t, INK);
  g.draw(t);
  return g;
}

function buildRaven(frame: 0 | 1): Grid {
  const g = new Grid(26, 20, 2, 2);
  const BODY = rgb('#3a3340');
  const BACK = rgb('#5a5064');
  const BELLY = rgb('#4a4252');
  poly(g, [[6, 8], [0, 5], [0, 11], [6, 11]], rgb('#1f1a24')); // ekor
  for (let y = 4; y <= 14; y++)
    for (let x = 4; x <= 17; x++) {
      const e = ((x - 11) / 7) ** 2 + ((y - 9.5) / 4.2) ** 2;
      if (e <= 1) g.set(x, y, y >= 11 ? BELLY : BODY);
    }
  for (let y = 2; y <= 11; y++) for (let x = 14; x <= 21; x++) if (Math.hypot(x - 17.5, y - 7) <= 3.6) g.set(x, y, BODY);
  poly(g, [[20, 5.5], [24, 7], [20, 8.5]], rgb('#d3b875')); // paruh
  g.set(19, 6, rgb('#fff6db')); // mata
  if (frame === 0) poly(g, [[7, 8], [4, 0], [10, 2], [15, 8]], BACK);
  else poly(g, [[7, 10], [4, 18], [10, 16], [15, 10]], BACK);
  outline(g, INK);
  return g;
}

function buildEnvelope(): Grid {
  const g = new Grid(9, 7);
  g.rect(0, 0, 9, 7, INK);
  g.rect(1, 1, 7, 5, rgb('#f3dfaa'));
  for (let i = 0; i < 4; i++) { g.set(1 + i, 1 + i, rgb('#94713a')); g.set(7 - i, 1 + i, rgb('#94713a')); }
  return g;
}

export const __sprites = { buildSky, buildFar, buildNear, buildClouds, buildGround, buildTowerBody, buildCap, buildRaven, buildEnvelope };

/* ───────────────────────── Renderer + loop ───────────────────────── */

export interface GameEvents {
  onScore?: (score: number) => void;
  onState?: (state: GameState) => void;
  onOver?: (score: number, best: number) => void;
}

const asCanvas = (g: Grid) => {
  const c = document.createElement('canvas');
  blit(g, c);
  return c;
};

export class RavenMailGame {
  readonly sim: RavenSim;
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private prevState: GameState = 'ready';
  private prevScore = 0;
  private sprites: {
    sky: HTMLCanvasElement; far: HTMLCanvasElement; near: HTMLCanvasElement; clouds: HTMLCanvasElement; ground: HTMLCanvasElement;
    body: HTMLCanvasElement; capUp: HTMLCanvasElement; capDown: HTMLCanvasElement;
    raven: [HTMLCanvasElement, HTMLCanvasElement]; envelope: HTMLCanvasElement;
  };

  constructor(
    canvas: HTMLCanvasElement,
    private readonly events: GameEvents = {},
    best = 0,
  ) {
    canvas.width = GAME_W;
    canvas.height = GAME_H;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;
    this.sim = new RavenSim(best);
    this.sprites = {
      sky: asCanvas(buildSky()), far: asCanvas(buildFar()), near: asCanvas(buildNear()), clouds: asCanvas(buildClouds()),
      ground: asCanvas(buildGround()), body: asCanvas(buildTowerBody()), capUp: asCanvas(buildCap(false)), capDown: asCanvas(buildCap(true)),
      raven: [asCanvas(buildRaven(0)), asCanvas(buildRaven(1))], envelope: asCanvas(buildEnvelope()),
    };
  }

  start() {
    cancelAnimationFrame(this.raf);
    this.last = 0;
    const loop = (t: number) => {
      const dt = this.last ? (t - this.last) / 1000 : 0;
      this.last = t;
      this.sim.step(dt);
      this.emitChanges();
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
  }

  flap() {
    this.sim.flap();
    this.emitChanges();
  }

  pause() {
    this.sim.pause();
    this.emitChanges();
  }

  private emitChanges() {
    const { state, score, best } = this.sim;
    if (score !== this.prevScore) {
      this.prevScore = score;
      this.events.onScore?.(score);
    }
    if (state !== this.prevState) {
      const was = this.prevState;
      this.prevState = state;
      this.events.onState?.(state);
      if (state === 'over' && was !== 'over') this.events.onOver?.(score, best);
      if (state === 'ready') this.events.onScore?.(0);
    }
  }

  private tile(img: HTMLCanvasElement, factor: number) {
    const x = -Math.floor((this.sim.time * this.sim.speed * factor) % GAME_W);
    this.ctx.drawImage(img, x, 0);
    this.ctx.drawImage(img, x + GAME_W, 0);
  }

  draw() {
    const { ctx, sprites: s, sim } = this;
    ctx.clearRect(0, 0, GAME_W, GAME_H);
    ctx.drawImage(s.sky, 0, 0);
    this.tile(s.far, 0.08);
    this.tile(s.clouds, 0.16);
    this.tile(s.near, 0.35);

    // menara
    for (const t of sim.towers) {
      const x = Math.round(t.x);
      const bx = x + (TOWER_W - TOWER_BODY_W) / 2;
      const gapBottom = Math.round(t.gapTop + t.gap);
      const top = Math.round(t.gapTop);
      for (let y = top - 8 - 8; y > -8; y -= 8) ctx.drawImage(s.body, bx, y);
      ctx.drawImage(s.capDown, x, top - 8);
      ctx.drawImage(s.capUp, x, gapBottom);
      for (let y = gapBottom + 8; y < GROUND_Y; y += 8) ctx.drawImage(s.body, bx, y);
    }

    // tanah bergulir
    const gx = -Math.floor((sim.time * sim.speed) % 16);
    for (let x = gx; x < GAME_W; x += 16) ctx.drawImage(s.ground, x, GROUND_Y);

    // gagak (terbalik saat jatuh setelah kalah)
    const r = sim.raven;
    const sprite = s.raven[sim.state === 'over' ? 1 : (r.frame as 0 | 1)] as HTMLCanvasElement;
    if (sim.state === 'over') {
      ctx.save();
      ctx.translate(Math.round(r.x), Math.round(r.y) + 20);
      ctx.scale(1, -1);
      ctx.drawImage(sprite, 0, 0);
      ctx.restore();
    } else {
      ctx.drawImage(sprite, Math.round(r.x), Math.round(r.y));
    }

    // surat terkirim (+1)
    for (const e of sim.effects) ctx.drawImage(s.envelope, Math.round(e.x), Math.round(e.y - e.t * 18));
  }
}

/** Sprite untuk UI di luar canvas (ikon HUD) -> CSS variable. */
export function renderRavenUi(root: HTMLElement): void {
  root.style.setProperty('--rm-envelope', toURL(buildEnvelope()));
  root.style.setProperty('--rm-raven', toURL(buildRaven(0)));
}