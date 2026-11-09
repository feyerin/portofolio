<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, resolveComponent } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { renderLabsArt } from "~/assets/pixelart/labsArt";

/* ═══════════════════════════════════════════════════════════════
   DAFTAR EKSPERIMEN — tambah/ubah di sini. Status:
   stable = sudah matang · new = baru dirilis · brewing = sedang dibuat · soon = belum bisa dibuka
   ═══════════════════════════════════════════════════════════════ */

type LabStatus = "stable" | "new" | "brewing" | "soon";

interface Lab {
  key: string;
  title: string;
  kind: string;
  description: string;
  to: string;
  status: LabStatus;
  bottle: "potion-wine" | "potion-green" | "flask-blue" | "flask-gold";
  tags: string[];
  cta: string;
}

const labs: Lab[] = [
  {
    key: "atmos",
    title: "Atmos",
    kind: "WEATHER OBSERVATORY",
    description:
      "A living snapshot of the sky. Search any city and watch the scene change with its temperature, weather, and time of day.",
    to: "/labs/atmos",
    status: "stable",
    bottle: "flask-blue",
    tags: ["Open-Meteo", "Canvas art"],
    cta: "OPEN THE OBSERVATORY",
  },
  {
    key: "raven-mail",
    title: "Raven Mail Run",
    kind: "MINI GAME",
    description:
      "Postman's raven has letters to deliver. Flap between the towers, deliver as many as you can, and beat your best.",
    to: "/labs/raven-mail",
    status: "new",
    bottle: "potion-wine",
    tags: ["Game loop", "Pixel art"],
    cta: "PLAY NOW",
  },
  {
    key: "postcards",
    title: "Postcards from Atmos",
    kind: "SHAREABLE ART",
    description:
      "Turn any city's sky into a pixel-art postcard you can download and send to a friend.",
    to: "/labs/postcards",
    status: "brewing",
    bottle: "flask-gold",
    tags: ["Canvas", "PNG export"],
    cta: "STILL BREWING",
  },
  {
    key: "steps",
    title: "Steps() Lab",
    kind: "CSS PLAYGROUND",
    description:
      "Drag a slider and see how steps() changes a sprite animation, frame by frame.",
    to: "/labs/steps",
    status: "soon",
    bottle: "potion-green",
    tags: ["CSS", "Animation"],
    cta: "COMING SOON",
  },
];

const statusLabel: Record<LabStatus, string> = {
  stable: "STABLE",
  new: "NEW BREW",
  brewing: "BREWING",
  soon: "COMING SOON",
};

const NuxtLinkComponent = resolveComponent("NuxtLink");
const isOpen = (lab: Lab) => lab.status === "stable" || lab.status === "new";

/** Rekor Raven Mail Run (disimpan di browser pengunjung). */
const ravenBest = ref<number | null>(null);

/* ───────── Muncul saat di-scroll ───────── */

const rootEl = ref<HTMLElement | null>(null);
let io: IntersectionObserver | undefined;

onMounted(() => {
  const root = rootEl.value;
  if (!root) return;
  renderLabsArt(root);

  try {
    const best = Number(localStorage.getItem("raven-mail-best"));
    if (Number.isFinite(best) && best > 0) ravenBest.value = best;
  } catch {
    /* localStorage tidak tersedia: abaikan */
  }

  const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.setAttribute("data-in", ""));
    return;
  }
  // atribut data-*, bukan class: aman dari :class milik Vue
  root.setAttribute("data-armed", "");
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

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <main ref="rootEl" class="labs-theme relative min-h-screen">
    <div class="labs-parchment" aria-hidden="true" />
    <div class="labs-grid" aria-hidden="true" />

    <AppContainer>
      <div class="relative z-10 px-4 sm:px-6 lg:px-8">
        <!-- Navigation -->
        <header class="flex items-center justify-between gap-4 border-b border-gold/40 py-5 sm:py-6">
          <NuxtLink to="/" class="labs-brand group inline-flex items-center gap-3" aria-label="Return to portfolio homepage">
            <span class="labs-brand__mark" aria-hidden="true"><i class="glyph" data-glyph="arrowLeft" /></span>
            <span class="flex flex-col gap-1">
              <span class="font-display text-2xl font-semibold leading-none tracking-tight">
                labs<span class="text-gold">.</span>
              </span>
              <span class="font-mono text-[10px] tracking-[0.16em] text-label-muted">RETURN TO THE KINGDOM</span>
            </span>
          </NuxtLink>

          <span class="hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-label-muted sm:inline-flex">
            <span class="labs-dot" aria-hidden="true" /> EXPERIMENTS IN PROGRESS
          </span>
        </header>

        <!-- Intro -->
        <section data-reveal class="max-w-3xl pb-10 pt-12 sm:pb-14 sm:pt-16">
          <p class="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-label sm:text-[11px]">
            <span aria-hidden="true" class="h-[3px] w-6 bg-gold" />
            THE ALCHEMIST'S WORKSHOP
          </p>

          <h1 class="m-0 font-display text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Small experiments,
            <span class="block italic text-wine">brewed for fun.</span>
          </h1>

          <p class="mt-6 max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
            Side quests that don't belong on a resume — mini games, odd little tools, and ideas I wanted to see
            working. Pick a bottle from the shelf.
          </p>
        </section>

        <!-- Rak ramuan -->
        <ul class="m-0 grid list-none gap-x-6 gap-y-12 p-0 pb-16 sm:grid-cols-2 lg:grid-cols-4" aria-label="Experiments">
          <li v-for="(lab, index) in labs" :key="lab.key" data-reveal class="min-w-0" :style="{ '--lab-delay': `${index * 90}ms` }">
            <component
              :is="isOpen(lab) ? NuxtLinkComponent : 'div'"
              :to="isOpen(lab) ? lab.to : undefined"
              class="lab-card"
              :class="[`lab-card--${lab.status}`]"
              :aria-disabled="isOpen(lab) ? undefined : 'true'"
            >
              <span class="lab-status" :class="`lab-status--${lab.status}`">
                <span class="lab-status__dot" aria-hidden="true" />
                {{ statusLabel[lab.status] }}
              </span>

              <span class="bottle-stage" aria-hidden="true">
                <i class="bottle" :data-bottle="lab.bottle" />
                <i class="bubble bubble-a" />
                <i class="bubble bubble-b" />
                <i class="bubble bubble-c" />
              </span>

              <span class="mt-5 block font-mono text-[10px] tracking-[0.14em] text-label">{{ lab.kind }}</span>
              <span class="mt-2 block font-display text-3xl font-semibold leading-none tracking-tight">{{ lab.title }}</span>
              <span class="mt-3 block text-sm leading-7 text-muted">{{ lab.description }}</span>

              <span class="mt-4 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in lab.tags"
                  :key="tag"
                  class="border border-gold/45 bg-paper-raised/60 px-2 py-1 font-mono text-[10px] text-label-muted"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="lab.key === 'raven-mail' && ravenBest"
                  class="border border-wine/50 bg-wine-soft px-2 py-1 font-mono text-[10px] text-wine"
                >
                  YOUR BEST: {{ ravenBest }}
                </span>
              </span>

              <span class="lab-card__cta">
                {{ lab.cta }}
                <i v-if="isOpen(lab)" class="glyph" data-glyph="arrowRight" aria-hidden="true" />
              </span>
            </component>
          </li>
        </ul>

        <footer class="flex flex-col gap-3 border-t border-gold/40 py-6 font-mono text-[10px] tracking-[0.1em] text-label-muted sm:flex-row sm:items-center sm:justify-between">
          <p class="m-0">MORE POTIONS ARE ALWAYS BREWING.</p>
          <p class="m-0">NOTHING HERE IS PRODUCTION-READY — AND THAT'S THE POINT.</p>
        </footer>
      </div>
    </AppContainer>
  </main>
</template>

<style scoped src="~/assets/css/labs.css"></style>