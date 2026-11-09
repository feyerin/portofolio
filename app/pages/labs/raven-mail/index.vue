<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { renderLabsArt } from "~/assets/pixelart/labsArt";
import { GAME_H, GAME_W, RavenMailGame, renderRavenUi, type GameState } from "~/composables/labs/ravenMailGame";

const BEST_KEY = "raven-mail-best";

const rootEl = ref<HTMLElement | null>(null);
const frameEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const againBtn = ref<HTMLButtonElement | null>(null);

const state = ref<GameState>("ready");
const score = ref(0);
const best = ref(0);
const isNewBest = ref(false);
const scale = ref(4); // 1 pixel game = scale px layar (bilangan bulat -> tajam)
const liveMessage = ref("");

let game: RavenMailGame | undefined;
let resizeObserver: ResizeObserver | undefined;
let io: IntersectionObserver | undefined;

function loadBest(): number {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0; // localStorage tidak tersedia: rekor hanya berlaku selama halaman terbuka
  }
}

function saveBest(value: number) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    /* abaikan */
  }
}

function flap() {
  game?.flap();
}

function togglePause() {
  if (!game) return;
  if (state.value === "playing") game.pause();
  else if (state.value === "paused") game.flap();
}

/** Abaikan tombol saat pengguna mengetik / menekan tombol fokus (biar aktivasi native tidak ganda). */
function isInteractive(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(el?.closest?.("input, textarea, select, button, a, [contenteditable='true']"));
}

function onKeydown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.code === "Escape") {
    togglePause();
    return;
  }

  const flapKey = event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW";
  const restartKey = event.code === "Enter" && state.value === "over";

  if (!flapKey && !restartKey) return;
  if (isInteractive(event.target)) return;

  event.preventDefault();
  if (!event.repeat) flap();
}

function pauseIfPlaying() {
  if (state.value === "playing") game?.pause();
}

function onVisibility() {
  if (document.hidden) pauseIfPlaying();
}

onMounted(() => {
  const root = rootEl.value;
  const canvas = canvasEl.value;
  if (!root || !canvas) return;

  renderLabsArt(root);
  renderRavenUi(root);
  best.value = loadBest();

  game = new RavenMailGame(
    canvas,
    {
      onScore: (value) => (score.value = value),
      onState: (next) => {
        state.value = next;
        if (next === "ready") isNewBest.value = false;
        if (next === "ready") liveMessage.value = "Ready. Press space or tap to fly.";
        if (next === "paused") liveMessage.value = "Paused.";
      },
      onOver: (finalScore, newBest) => {
        isNewBest.value = finalScore > 0 && finalScore === newBest && newBest > best.value;
        if (newBest > best.value) {
          best.value = newBest;
          saveBest(newBest);
        }
        liveMessage.value = `The letter was lost. You delivered ${finalScore} ${finalScore === 1 ? "letter" : "letters"}. Best: ${best.value}.`;
        void nextTick(() => againBtn.value?.focus({ preventScroll: true }));
      },
    },
    best.value,
  );
  game.start();

  resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    // lebar tersedia dikurangi padding & border bingkai (≈ 36px); skala bilangan bulat = pixel tajam
    scale.value = Math.min(6, Math.max(2, Math.floor((entry.contentRect.width - 36) / GAME_W)));
  });
  if (frameEl.value) resizeObserver.observe(frameEl.value);

  window.addEventListener("keydown", onKeydown);
  window.addEventListener("blur", pauseIfPlaying);
  document.addEventListener("visibilitychange", onVisibility);

  const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.setAttribute("data-in", ""));
    return;
  }
  root.setAttribute("data-armed", ""); // atribut data-*, bukan class: aman dari :class milik Vue
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-in", "");
        io?.unobserve(e.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((t) => io?.observe(t));
});

onBeforeUnmount(() => {
  game?.destroy();
  resizeObserver?.disconnect();
  io?.disconnect();
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("blur", pauseIfPlaying);
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<template>
  <main ref="rootEl" class="labs-theme relative min-h-screen">
    <div class="labs-parchment" aria-hidden="true" />
    <div class="labs-grid" aria-hidden="true" />

    <AppContainer>
      <div class="relative z-10 px-4 sm:px-6 lg:px-8">
        <!-- Navigation -->
        <header class="flex items-center justify-between gap-4 border-b border-gold/40 py-5 sm:py-6">
          <NuxtLink to="/labs" class="labs-brand group inline-flex items-center gap-3" aria-label="Back to the workshop">
            <span class="labs-brand__mark" aria-hidden="true"><i class="glyph" data-glyph="arrowLeft" /></span>
            <span class="flex flex-col gap-1">
              <span class="font-display text-2xl font-semibold leading-none tracking-tight">
                labs<span class="text-gold">.</span>
              </span>
              <span class="font-mono text-[10px] tracking-[0.16em] text-label-muted">BACK TO THE WORKSHOP</span>
            </span>
          </NuxtLink>

          <span class="labs-chip">
            <span class="labs-dot" aria-hidden="true" /> LAB 02 · MINI GAME
          </span>
        </header>

        <!-- Intro -->
        <section data-reveal class="max-w-3xl pb-8 pt-10 sm:pb-10 sm:pt-14">
          <h1 class="m-0 font-display text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Raven
            <span class="block italic text-wine">Mail Run.</span>
          </h1>

          <p class="mt-5 max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
            Postman's raven has letters to deliver. Fly between the castle towers — every tower you pass is one
            letter delivered. The closer the towers get, the faster the raven flies.
          </p>
        </section>

        <!-- Game -->
        <section data-reveal class="pb-10" aria-label="Game">
          <div ref="frameEl" class="flex justify-center">
            <div class="game-frame">
              <div class="game-frame__inner">
                <div
                  class="game-stage"
                  :style="{ '--gs': scale + 'px', '--gw': GAME_W, '--gh': GAME_H }"
                  @pointerdown.prevent="flap"
                >
                  <canvas
                    ref="canvasEl"
                    class="game-canvas"
                    role="img"
                    aria-label="Raven Mail Run game. Press space, the up arrow, or tap to flap the raven's wings and fly between the towers."
                  />

                  <!-- HUD -->
                  <div class="hud hud--left" aria-hidden="true">
                    <i class="hud__icon" />
                    <span class="hud__value">{{ String(score).padStart(2, "0") }}</span>
                  </div>
                  <div class="hud hud--right" aria-hidden="true">
                    <span class="hud__label">BEST</span>
                    <span class="hud__value">{{ String(best).padStart(2, "0") }}</span>
                  </div>

                  <!-- Siap -->
                  <div v-if="state === 'ready'" class="game-overlay game-overlay--ready">
                    <p class="game-hint">
                      <span class="game-hint__key">SPACE</span> / TAP TO FLY
                    </p>
                  </div>

                  <!-- Jeda -->
                  <div v-else-if="state === 'paused'" class="game-overlay">
                    <div class="game-dialog">
                      <p class="m-0 font-display text-3xl font-semibold">Paused</p>
                      <p class="mb-0 mt-2 font-mono text-[10px] tracking-[0.12em] text-label-muted">PRESS SPACE OR TAP TO CONTINUE</p>
                    </div>
                  </div>

                  <!-- Kalah -->
                  <div v-else-if="state === 'over'" class="game-overlay" @pointerdown.stop>
                    <div class="game-dialog" role="dialog" aria-label="Game over">
                      <p class="m-0 font-mono text-[10px] tracking-[0.16em] text-label">THE LETTER WAS LOST…</p>
                      <p class="mb-0 mt-2 font-display text-5xl font-semibold leading-none text-wine">
                        {{ score }}
                      </p>
                      <p class="mb-0 mt-2 font-mono text-[10px] tracking-[0.12em] text-label-muted">
                        {{ score === 1 ? "LETTER" : "LETTERS" }} DELIVERED · BEST {{ best }}
                      </p>
                      <p v-if="isNewBest" class="mb-0 mt-3 inline-block border border-wine/50 bg-wine-soft px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-wine">
                        ★ NEW BEST!
                      </p>
                      <button ref="againBtn" type="button" class="labs-button mt-5" @click="flap">
                        FLY AGAIN
                        <i class="glyph" data-glyph="arrowRight" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="sr-only" aria-live="polite">{{ liveMessage }}</p>
        </section>

        <!-- Cara bermain -->
        <section data-reveal class="pb-16" aria-label="How to play">
          <ul class="m-0 grid list-none gap-4 p-0 sm:grid-cols-3">
            <li class="labs-panel p-5">
              <p class="m-0 font-mono text-[10px] tracking-[0.14em] text-label">FLY</p>
              <p class="mb-0 mt-3 text-sm leading-7 text-muted">
                <span class="key">SPACE</span> <span class="key">↑</span> <span class="key">W</span> or tap the screen to flap.
              </p>
            </li>
            <li class="labs-panel p-5">
              <p class="m-0 font-mono text-[10px] tracking-[0.14em] text-label">DELIVER</p>
              <p class="mb-0 mt-3 text-sm leading-7 text-muted">
                Pass between two towers to deliver a letter. Touching a tower or the ground loses it.
              </p>
            </li>
            <li class="labs-panel p-5">
              <p class="m-0 font-mono text-[10px] tracking-[0.14em] text-label">PAUSE</p>
              <p class="mb-0 mt-3 text-sm leading-7 text-muted">
                <span class="key">ESC</span> pauses. The game also pauses by itself when you switch tabs.
              </p>
            </li>
          </ul>
        </section>

        <footer class="flex flex-col gap-3 border-t border-gold/40 py-6 font-mono text-[10px] tracking-[0.1em] text-label-muted sm:flex-row sm:items-center sm:justify-between">
          <p class="m-0">YOUR BEST SCORE IS SAVED ONLY IN THIS BROWSER.</p>
          <p class="m-0">RAVEN MAIL RUN — A LAB EXPERIMENT.</p>
        </footer>
      </div>
    </AppContainer>
  </main>
</template>

<style scoped src="~/assets/css/labs.css"></style>