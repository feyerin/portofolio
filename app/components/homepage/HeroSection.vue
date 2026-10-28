<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { renderHeroScene, SCENE_W, SPOTS } from "~/assets/pixelart/heroscene";

/* ───────── Konten ───────── */

const roles = ["FRONTEND MAGE", "UI ALCHEMIST", "BUG SLAYER"];
const technologies = ["React", "Next.js", "Vue", "Nuxt", "TypeScript"];

const stats = [
  { to: 6, suffix: "+", pad: 2, label: "YEARS EXP", xp: 60 },
  { to: 20, suffix: "+", pad: 2, label: "QUEST", xp: 80 },
  { to: 0, suffix: "", pad: 0, label: "CURIOSITY", xp: 100 }, // ∞
];

/**
 * Area interaktif di kastil (koordinat pixel game, lihat heroScene.ts).
 * Ubah `to` kalau id section-mu berbeda.
 */
const spots = [
  { key: "gate", to: "/#work", x: 70, y: 74, w: 20, h: 26, walk: SPOTS.gate, title: "THE GATE", hint: "EXPLORE QUESTS" },
  { key: "left", to: "/#about", x: 24, y: 38, w: 24, h: 62, walk: SPOTS.left, title: "THE TOWER", hint: "CHARACTER INFO" },
  { key: "right", to: "/#contact", x: 112, y: 38, w: 24, h: 62, walk: SPOTS.right, title: "RAVEN POST", hint: "SEND A MESSAGE" },
];
type Spot = (typeof spots)[number];

/* ───────── State ───────── */

const outerEl = ref<HTMLElement | null>(null);
const sceneEl = ref<HTMLElement | null>(null);
const statsEl = ref<HTMLElement | null>(null);

const scale = ref(3); // 1 pixel game = scale px layar (bilangan bulat -> tetap tajam)
const typed = ref(roles[0] as string);
const progress = ref(0); // 0..1, stepped
const counting = ref(false);
const active = ref<Spot | null>(null);
const gateOpen = ref(false);
const adv = reactive({ x: SPOTS.home as number, face: 1, walking: false, ms: 0, steps: 1 });
const par = reactive({ sky: 0, far: 0, castle: 0, fore: 0 });

let reduced = false;
let roleTimer = 0;
let walkTimer = 0;
let homeTimer = 0;
let raf = 0;
let parRaf = 0;
let ro: ResizeObserver | undefined;
let io: IntersectionObserver | undefined;

const sceneStyle = computed(() => ({
  "--s": `${scale.value}px`,
  "--par-sky": par.sky,
  "--par-far": par.far,
  "--par-castle": par.castle,
  "--par-fore": par.fore,
}));

const advStyle = computed(() => ({
  "--adv-x": adv.x,
  "--walk-ms": `${adv.ms}ms`,
  "--walk-steps": adv.steps,
}));

const pad3 = (n: number) => String(Math.round(n)).padStart(3, "0");
const tipStyle = computed(() => {
  const s = active.value;
  if (!s) return {};
  const cx = Math.min(Math.max(s.x + s.w / 2, 30), SCENE_W - 30);
  return { left: `calc(var(--s) * ${cx})`, top: `calc(var(--s) * ${Math.max(s.y - 4, 18)})` };
});

function shown(i: number) {
  const st = stats[i]!;
  if (i === 2) return "∞";
  return String(Math.round(st.to * progress.value)).padStart(st.pad, "0") + st.suffix;
}

/* ───────── Petualang berjalan & gerbang ───────── */

function walkTo(x: number) {
  const steps = Math.abs(x - adv.x);
  if (!steps) return;
  adv.face = x > adv.x ? 1 : -1;
  adv.steps = steps;
  adv.ms = reduced ? 0 : steps * 28;
  adv.x = x;
  adv.walking = !reduced;
  clearTimeout(walkTimer);
  walkTimer = window.setTimeout(() => (adv.walking = false), adv.ms);
}

function enter(s: Spot) {
  clearTimeout(homeTimer);
  active.value = s;
  gateOpen.value = s.key === "gate";
  walkTo(s.walk);
}

function leave() {
  active.value = null;
  gateOpen.value = false;
  clearTimeout(homeTimer);
  homeTimer = window.setTimeout(() => walkTo(SPOTS.home), 900);
}

/* ───────── Parallax ───────── */

function onMove(e: PointerEvent) {
  if (reduced || e.pointerType === "touch" || !sceneEl.value) return;
  const r = sceneEl.value.getBoundingClientRect();
  const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
  cancelAnimationFrame(parRaf);
  parRaf = requestAnimationFrame(() => {
    par.sky = Math.round(-nx * 0.5);
    par.far = Math.round(-nx * 1);
    par.castle = Math.round(-nx * 2);
    par.fore = Math.round(-nx * 4);
  });
}

function onLeaveScene() {
  par.sky = par.far = par.castle = par.fore = 0;
}

/* ───────── Efek teks & angka ───────── */

function cycleRoles() {
  let ri = 0;
  const later = (fn: () => void, ms: number) => (roleTimer = window.setTimeout(fn, ms));
  const step = (word: string, n: number, deleting: boolean) => {
    typed.value = word.slice(0, n);
    if (!deleting && n === word.length) return later(() => step(word, n - 1, true), 1800);
    if (deleting && n === 0) {
      ri = (ri + 1) % roles.length;
      return later(() => step(roles[ri] as string, 1, false), 250);
    }
    later(() => step(word, n + (deleting ? -1 : 1), deleting), deleting ? 40 : 80);
  };
  const first = roles[0] as string;
  later(() => step(first, first.length - 1, true), 2600);
}

function countUp() {
  counting.value = true;
  if (reduced) {
    progress.value = 1;
    return;
  }
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / 1100);
    progress.value = Math.floor(p * 12) / 12; // 12 langkah = terasa retro
    if (p < 1) raf = requestAnimationFrame(tick);
    else progress.value = 1;
  };
  raf = requestAnimationFrame(tick);
}

/* ───────── Lifecycle ───────── */

onMounted(async () => {
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  ro = new ResizeObserver(([entry]) => {
    if (!entry) return;
    // lebar tersedia dikurangi padding & border bingkai (≈ 28px)
    scale.value = Math.min(4, Math.max(1, Math.floor((entry.contentRect.width - 28) / SCENE_W)));
  });
  if (outerEl.value) ro.observe(outerEl.value);

  await nextTick();
  if (sceneEl.value) renderHeroScene(sceneEl.value);

  if (!reduced) cycleRoles();

  io = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        io?.disconnect();
        window.setTimeout(countUp, 500);
      }
    },
    { threshold: 0.4 },
  );
  if (statsEl.value) io.observe(statsEl.value);
});

onBeforeUnmount(() => {
  clearTimeout(roleTimer);
  clearTimeout(walkTimer);
  clearTimeout(homeTimer);
  cancelAnimationFrame(raf);
  cancelAnimationFrame(parRaf);
  ro?.disconnect();
  io?.disconnect();
});
</script>

<template>
  <section
    id="top"
    class="relative isolate overflow-hidden bg-background text-ink"
    aria-labelledby="hero-title"
  >
    <!-- Background grid -->
    <div
      aria-hidden="true"
      class="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.22]"
    />

    <!-- Background decorative pixels -->
    <div
      aria-hidden="true"
      class="hero-blink pointer-events-none absolute left-[7%] top-24 hidden size-2 bg-gold md:block"
    />
    <div
      aria-hidden="true"
      class="hero-blink hero-blink--late pointer-events-none absolute right-[9%] top-40 hidden size-2 bg-wine md:block"
    />
    <div
      aria-hidden="true"
      class="hero-bob pointer-events-none absolute bottom-28 left-[12%] hidden size-1.5 bg-gold md:block"
    />

    <AppContainer>
      <div class="px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Chapter header -->
        <div
          class="hero-reveal flex items-center justify-between gap-4 border-b border-gold/40 py-5 sm:py-6"
          style="--reveal-delay: 0ms"
        >
          <div class="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              class="grid size-6 place-items-center border border-gold/60 bg-paper-raised text-[11px] text-wine"
            >
              ✳
            </span>
            <span class="font-mono text-[10px] tracking-[0.14em] text-label sm:text-[11px]">
              THE ROYAL ARCHIVE
            </span>
          </div>
          <span class="font-mono text-[10px] tracking-[0.12em] text-label sm:text-[11px]">
            FOLIO 001 / 006
          </span>
        </div>

        <!-- Hero main layout -->
        <div
          class="grid items-center gap-10 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-12 xl:gap-14"
        >
          <!-- Text column -->
          <div class="relative z-10 max-w-2xl">
            <!-- Eyebrow: role yang mengetik sendiri -->
            <div
              class="hero-reveal mb-6 flex flex-wrap items-center gap-3"
              style="--reveal-delay: 100ms"
            >
              <span class="inline-flex min-w-[27ch] items-center gap-2 border border-gold/55 bg-paper-raised px-3 py-2">
                <span aria-hidden="true" class="hero-blink size-1.5 bg-wine" />
                <span class="sr-only">Class: Frontend developer</span>
                <span
                  aria-hidden="true"
                  class="font-mono text-[10px] tracking-[0.12em] text-label"
                >
                  CLASS: {{ typed }}<i class="hero-caret" />
                </span>
              </span>

              <span class="font-mono text-[10px] tracking-[0.12em] text-label-muted">
                LV. 06+
              </span>
            </div>

            <!-- Main headline -->
            <h1
              id="hero-title"
              class="hero-reveal m-0 font-display text-[clamp(3.6rem,9vw,6.8rem)] font-medium leading-[0.88] tracking-[-0.055em] text-ink"
              style="--reveal-delay: 200ms"
            >
              Crafting
              <br />
              <span class="relative inline-block pt-2 text-wine">
                digital worlds<span class="text-gold">.</span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 13"
                  fill="none"
                  class="mt-2 block w-[min(100%,320px)] text-gold"
                  shape-rendering="crispEdges"
                >
                  <path d="M2 6H105M115 6H205M215 6H318" stroke="currentColor" stroke-width="2" />
                  <path d="M105 2L111 6L105 10M205 2L211 6L205 10" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </span>
            </h1>

            <!-- Description -->
            <p
              class="hero-reveal mt-7 max-w-lg font-sans text-[14px] leading-7 text-muted sm:text-base sm:leading-8"
              style="--reveal-delay: 320ms"
            >
              Beyond every realm lies a story waiting to unfold. I wander between ideas and imagination, shaping them into meaningful digital experiences, one spell — and one line of code — at a time.
            </p>

            <!-- Technology inventory -->
            <div class="hero-reveal mt-6" style="--reveal-delay: 400ms">
              <p class="mb-3 font-mono text-[10px] tracking-[0.15em] text-label">
                <span aria-hidden="true">▸</span>
                SPELLS &amp; ABILITIES
              </p>

              <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
                <li
                  v-for="tech in technologies"
                  :key="tech"
                  class="hero-chip flex items-center gap-2 border border-gold/45 bg-paper px-2.5 py-1.5 font-mono text-[11px] text-label-muted"
                >
                  <i aria-hidden="true" class="hero-gem" />
                  {{ tech }}
                </li>
              </ul>
            </div>

            <!-- CTA -->
            <div
              class="hero-reveal mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
              style="--reveal-delay: 500ms"
            >
              <NuxtLink
                to="/#work"
                class="group inline-flex min-h-12 items-center justify-center gap-3 border-2 border-shadow bg-wine px-5 py-3 text-paper shadow-[4px_4px_0_var(--color-pixel-shadow)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-wine-hover hover:shadow-[6px_6px_0_var(--color-pixel-shadow)] active:translate-y-0.5 active:shadow-[2px_2px_0_var(--color-pixel-shadow)]"
                @pointerenter="enter(spots[0]!)"
                @pointerleave="leave"
                @focus="enter(spots[0]!)"
                @blur="leave"
              >
                <span aria-hidden="true" class="font-mono text-xs text-highlight">▶</span>
                <span class="font-mono text-[11px] tracking-widest text-highlight">EXPLORE QUESTS</span>
                <span
                  aria-hidden="true"
                  class="transition-transform duration-200 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </NuxtLink>

              <NuxtLink
                to="/#about"
                class="group inline-flex min-h-12 items-center gap-2 px-3 py-3 font-mono text-[11px] tracking-[0.08em] text-label-muted transition-colors hover:text-wine"
                @pointerenter="enter(spots[1]!)"
                @pointerleave="leave"
                @focus="enter(spots[1]!)"
                @blur="leave"
              >
                <span
                  class="grid size-5 place-items-center border border-gold/55 transition-colors group-hover:bg-gold-soft"
                >
                  +
                </span>
                CHARACTER INFO
              </NuxtLink>
            </div>

            <!-- Stats: angka menghitung naik + bar XP -->
            <div
              ref="statsEl"
              class="hero-reveal mt-10 grid max-w-lg grid-cols-3 border-y border-gold/40 py-4"
              :class="{ 'is-counting': counting }"
              style="--reveal-delay: 600ms"
            >
              <div
                v-for="(stat, index) in stats"
                :key="stat.label"
                class="px-2 first:pl-0 last:pr-0 sm:px-4"
                :class="index !== 0 ? 'border-l border-gold/35' : ''"
              >
                <p class="m-0 font-display text-3xl font-semibold leading-none text-ink sm:text-4xl">
                  {{ shown(index) }}
                </p>
                <p class="mb-0 mt-2 font-mono text-[10px] tracking-[0.08em] text-label">
                  {{ stat.label }}
                </p>
                <div aria-hidden="true" class="hero-xp mt-2" :style="{ '--xp': stat.xp + '%' }">
                  <span class="hero-xp__fill" :class="{ 'hero-xp__fill--inf': index === 2 }" />
                </div>
              </div>
            </div>
          </div>

          <!-- Pixel-art castle: interaktif -->
          <div
            ref="outerEl"
            class="hero-reveal relative mx-auto w-full max-w-[640px] lg:ml-auto lg:mr-0"
            style="--reveal-delay: 250ms"
          >
            <div class="relative ml-auto mr-auto w-fit border-2 border-shadow bg-paper-raised p-2 shadow-[6px_6px_0_var(--color-highlight)] sm:p-3 lg:mr-0">
              <div class="relative overflow-hidden border border-gold/70 bg-gold-soft">
                <!-- Scene -->
                <div
                  ref="sceneEl"
                  class="scene"
                  role="group"
                  aria-label="Interactive pixel-art castle. Hover the gate or towers to explore."
                  :style="sceneStyle"
                  @pointermove="onMove"
                  @pointerleave="onLeaveScene"
                >
                  <div class="scene__layer scene__layer--sky" aria-hidden="true">
                    <canvas data-layer="sky" class="scene__cv" />
                    <canvas data-layer="sunrays" class="scene__cv scene__rays" />
                    <div class="scene__cv scene__clouds" />
                    <span class="bird" style="--y: 14; --d: 0s" />
                    <span class="bird" style="--y: 38; --d: -13s" />
                  </div>

                  <div class="scene__layer scene__layer--far" aria-hidden="true">
                    <canvas data-layer="far" class="scene__cv" />
                  </div>

                  <div class="scene__layer scene__layer--castle">
                    <canvas data-layer="castle" class="scene__cv" aria-hidden="true" />

                    <div class="doors" :class="{ 'is-open': gateOpen }" aria-hidden="true">
                      <i class="door door--l" />
                      <i class="door door--r" />
                    </div>
                    <i class="flag" style="--x: 37; --y: 28" aria-hidden="true" />
                    <i class="flag flag--b" style="--x: 81; --y: 33" aria-hidden="true" />
                    <i class="flag flag--c" style="--x: 125; --y: 28" aria-hidden="true" />

                    <NuxtLink
                      v-for="s in spots"
                      :key="s.key"
                      :to="s.to"
                      class="spot"
                      :aria-label="`${s.title}: ${s.hint}`"
                      :style="{ '--x': s.x, '--y': s.y, '--w': s.w, '--h': s.h }"
                      @pointerenter="enter(s)"
                      @pointerleave="leave"
                      @focus="enter(s)"
                      @blur="leave"
                    />

                    <i
                      class="adv"
                      :class="{ 'is-walking': adv.walking, 'is-left': adv.face < 0 }"
                      :style="advStyle"
                      aria-hidden="true"
                    />
                  </div>

                  <div class="scene__layer scene__layer--fore" aria-hidden="true">
                    <canvas data-layer="fore" class="scene__cv" />
                  </div>

                  <!-- Tooltip ala game -->
                  <div v-if="active" class="tip" :style="tipStyle" aria-hidden="true">
                    <p class="tip__title">{{ active.title }}</p>
                    <p class="tip__hint"><span>▶</span> {{ active.hint }}</p>
                  </div>

                  <!-- HUD -->
                  <div
                    class="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-2 border-b border-gold/50 bg-paper/90 px-3 py-2"
                  >
                    <span class="font-mono text-[10px] tracking-[0.12em] text-label">WORLD MAP / 001</span>
                    <span class="font-mono text-[10px] tracking-[0.12em] text-wine">THE OLD KINGDOM</span>
                  </div>

                  <div
                    class="absolute bottom-2 left-2 z-20 flex items-center gap-2 border border-gold/60 bg-paper/90 px-2 py-1.5"
                  >
                    <span aria-hidden="true" class="hero-blink size-1.5 bg-wine" />
                    <span class="font-mono text-[10px] tracking-[0.08em] text-label-muted">
                      {{ active ? active.title : "KINGDOM OF DRAGONSTONE" }}
                    </span>
                  </div>

                  <div class="absolute bottom-2 right-2 z-20 border border-gold/60 bg-paper/90 px-2 py-1.5">
                    <span class="font-mono text-[10px] tracking-[0.08em] text-label-muted">
                      X: {{ pad3(adv.x) }} / Y: 016
                    </span>
                  </div>
                </div>
              </div>

              <!-- Bottom status bar -->
              <div
                class="mt-2 flex items-center justify-between gap-3 border border-gold/45 bg-paper-raised px-3 py-2.5"
              >
                <div class="flex min-w-0 items-center gap-2">
                  <span class="font-mono text-[10px] text-wine" aria-hidden="true">♥</span>
                  <span class="truncate font-mono text-[10px] tracking-[0.08em] text-label-muted">
                    QUEST STATUS
                  </span>
                </div>
                <span class="shrink-0 font-mono text-[10px] tracking-[0.08em] text-wine">
                  READY TO BUILD
                </span>
              </div>

              <!-- Decorative pixel markers -->
              <span
                aria-hidden="true"
                class="absolute -left-3 top-[20%] hidden size-4 border-2 border-gold bg-paper sm:block"
              />
              <span
                aria-hidden="true"
                class="absolute -right-3 bottom-[17%] hidden size-4 border-2 border-wine bg-paper sm:block"
              />

              <!-- Floating side label -->
              <div
                class="hero-float absolute -right-1 top-[16%] z-30 hidden border border-gold/60 bg-paper px-3 py-2 shadow-[3px_3px_0_var(--color-accent-soft)] sm:block lg:-right-5"
              >
                <p class="m-0 font-mono text-[10px] tracking-[0.1em] text-label">PLAYER ONE</p>
                <p class="mb-0 mt-1 font-display text-base italic leading-none text-wine">
                  The Developer
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom chapter divider -->
        <div
          class="hero-reveal flex items-center gap-4 border-t border-gold/40 py-5"
          style="--reveal-delay: 700ms"
        >
          <span aria-hidden="true" class="font-serif text-sm text-label">✳</span>
          <span class="font-mono text-[10px] tracking-[0.13em] text-label">
            EVERY GREAT ADVENTURE BEGINS WITH A SINGLE LINE OF CODE
          </span>
          <span
            aria-hidden="true"
            class="ml-auto hidden font-mono text-[10px] tracking-widest text-label sm:block"
          >
            SCROLL TO CONTINUE ↓
          </span>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped src="~/assets/css/HeroSection.css"></style>