<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { computeLayout, renderIntroArt } from "~/assets/pixelart/pixelArt";

type Phase = "loading" | "ready" | "opening" | "entering";

const SESSION_KEY = "portfolio-manuscript-intro-seen";
const LOAD_MS = 1800; // loading bar minimum
const OPEN_MS = 2000; // guncangan + pintu terbuka
const ENTER_MS = 2200; // kamera masuk ke gerbang + flash

const root = ref<HTMLElement | null>(null);
const startBtn = ref<HTMLButtonElement | null>(null);
const visible = ref(true);
const phase = ref<Phase>("loading");
const started = computed(() => phase.value === "opening" || phase.value === "entering");

const timing = {
  "--load-ms": `${LOAD_MS}ms`,
  "--open-ms": `${OPEN_MS}ms`,
  "--enter-ms": `${ENTER_MS}ms`,
};

// kunang-kunang di padang rumput (posisi deterministik, biar SSR aman)
const fireflies = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + ((i * 37) % 84)}%`,
  top: `${48 + ((i * 53) % 42)}%`,
  animationDelay: `${((i * 0.73) % 5).toFixed(2)}s`,
}));

let timers: number[] = [];
let resizeTimer = 0;
let motionQuery: MediaQueryList | undefined;
let prevOverflow = "";

const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

function draw() {
  if (root.value) renderIntroArt(root.value, computeLayout(window.innerWidth, window.innerHeight));
}

function start() {
  if (phase.value !== "ready") return;
  phase.value = "opening";
  later(() => (phase.value = "entering"), OPEN_MS);
  later(closeIntro, OPEN_MS + ENTER_MS);
}

function closeIntro() {
  if (!visible.value) return;
  visible.value = false;
  timers.forEach(clearTimeout);
  timers = [];
  document.documentElement.style.overflow = prevOverflow;
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    /* sessionStorage tidak tersedia: intro tetap jalan seperti biasa */
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeIntro();
  else if ((e.key === "Enter" || e.key === " ") && phase.value === "ready") {
    e.preventDefault();
    start();
  }
}

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    if (phase.value === "loading" || phase.value === "ready") draw();
  }, 120);
}

onMounted(async () => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionQuery.addEventListener("change", onMotionChange);
  if (motionQuery.matches) {
    visible.value = false;
    return;
  }
  try {
    if (sessionStorage.getItem(SESSION_KEY)) {
      visible.value = false;
      return;
    }
  } catch {
    /* abaikan */
  }

  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize);

  await nextTick();
  draw();

  // "loading" nyata: tunggu font pixel siap + durasi minimum biar bar sempat terisi
  await Promise.all([
    new Promise<void>((resolve) => later(resolve, LOAD_MS)),
    document.fonts?.ready ?? Promise.resolve(),
  ]);
  if (!visible.value) return;
  phase.value = "ready";
  await nextTick();
  startBtn.value?.focus({ preventScroll: true });
});

function onMotionChange() {
  if (motionQuery?.matches) closeIntro();
}

onBeforeUnmount(() => {
  timers.forEach(clearTimeout);
  clearTimeout(resizeTimer);
  motionQuery?.removeEventListener("change", onMotionChange);
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("resize", onResize);
  if (visible.value) document.documentElement.style.overflow = prevOverflow;
});
</script>

<template>
  <Teleport to="body">
    <Transition name="intro-exit">
      <div
        v-if="visible"
        ref="root"
        class="intro"
        :class="[`is-${phase}`, { 'is-started': started }]"
        :style="timing"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to the Kingdom of Code"
        @click="start"
      >
        <!-- Dunia: semua layer digambar oleh pixelArt.ts -->
        <div class="camera" aria-hidden="true">
          <canvas class="layer" data-layer="sky" />
          <canvas class="layer layer--stars-a" data-layer="stars-a" />
          <canvas class="layer layer--stars-b" data-layer="stars-b" />
          <div class="layer layer--clouds" />
          <canvas class="layer" data-layer="scene" />
          <canvas class="layer layer--lights" data-layer="lights" />

          <div class="stage">
            <div class="rays" />
            <div class="gate">
              <canvas data-layer="interior" />
              <div class="door door--left" />
              <div class="door door--right" />
            </div>
            <span class="flame flame--left" />
            <span class="flame flame--right" />
            <span v-for="(f, i) in fireflies" :key="i" class="firefly" :style="f" />
          </div>
        </div>

        <div class="vignette" aria-hidden="true" />

        <!-- UI -->
        <div class="stage stage--ui">
          <div class="copy">
            <p class="eyebrow">A NEW ADVENTURE AWAITS</p>
            <h1 class="title">THE KINGDOM <span>OF DRAGONSTONE</span></h1>
            <div class="divider" aria-hidden="true"><span /><i /><span /></div>
            <div class="dialog">
              <p class="dialog__chapter"><b>CHAPTER I</b> - THE BEGINNING</p>
              <p class="dialog__text">CRAFTING DIGITAL WORLDS, ONE LINE AT A TIME.</p>
            </div>
          </div>

          <div class="loader" aria-hidden="true">
            <p class="loader__label">LOADING</p>
            <div class="loader__bar"><span class="loader__fill" /></div>
          </div>

          <button
            ref="startBtn"
            type="button"
            class="start mb-8"
            :disabled="phase !== 'ready'"
            @click.stop="start"
          >
            <i class="start__arrow" aria-hidden="true" />
            <span class="start__label">PRESS START</span>
          </button>
        </div>

        <div class="hearts" aria-hidden="true"><i /><i /><i /></div>

        <div class="flash" aria-hidden="true" />
        <p class="sr-only" aria-live="polite">
          {{ phase === "loading" ? "Loading" : "Ready. Press start to enter." }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped src="/assets/css/pageIntro.css"></style>