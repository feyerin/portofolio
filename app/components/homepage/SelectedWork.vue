<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { projects } from "~/data/project";
import { renderQuestArt, type IconName, type TileName } from "~/assets/pixelart/questArt";

/* ───────── Dekorasi latar (sprite digambar di questArt.ts) ───────── */

const decorations: { icon: IconName; class: string }[] = [
  { icon: "potion", class: "deco-potion" },
  { icon: "staff", class: "deco-staff" },
  { icon: "dragon", class: "deco-dragon" },
  { icon: "sword", class: "deco-sword" },
  { icon: "shield", class: "deco-shield" },
  { icon: "crystal", class: "deco-crystal" },
  { icon: "coin", class: "deco-coin" },
  { icon: "potion", class: "deco-potion-two" },
  { icon: "dragon", class: "deco-dragon-two" },
  { icon: "crystal", class: "deco-crystal-two" },
];

/* ───────── Tema per proyek ───────── */

type Theme = { img: string; icon: IconName; tile: TileName };

const themes: Record<string, Theme> = {
  "project-bookingtogo": { img: "/images/projects/bookingtogo.png", icon: "map", tile: "sea" },
  "project-caroline": { img: "/images/projects/caroline.png", icon: "sword", tile: "hills" },
  "project-kalbe": { img: "/images/projects/kalbe.png", icon: "potion", tile: "pines" },
};
const fallbackTheme: Theme = { img: "/images/projects/kalbe.png", icon: "crystal", tile: "pines" };
const themeOf = (className: string) => themes[className] ?? fallbackTheme;

const pad = (n: number) => String(n).padStart(2, "0");

/* ───────── Muncul saat di-scroll ───────── */

const root = ref<HTMLElement | null>(null);
let io: IntersectionObserver | undefined;

onMounted(() => {
  const el = root.value;
  if (!el) return;
  renderQuestArt(el);

  const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }

  el.classList.add("is-armed"); // sebelum ini semua konten terlihat (aman untuk SSR / tanpa JS)
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io?.unobserve(e.target);
      }),
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((t) => io?.observe(t));
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section
    id="work"
    ref="root"
    class="quest-section work-bg relative isolate scroll-mt-24 overflow-hidden py-24 text-ink sm:py-32 lg:py-40"
    aria-labelledby="work-title"
  >
    <!-- Latar: tekstur perkamen + grid pixel -->
    <div aria-hidden="true" class="work-parchment pointer-events-none absolute inset-0 -z-20 opacity-30" />
    <div aria-hidden="true" class="work-grid pointer-events-none absolute inset-0 -z-20 opacity-[0.14]" />

    <!-- Dekorasi pixel art -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <i
        v-for="item in decorations"
        :key="item.class"
        class="deco select-none"
        :class="item.class"
        :data-icon="item.icon"
      />

      <span class="pixel-particle particle-one" />
      <span class="pixel-particle particle-two" />
      <span class="pixel-particle particle-three" />
      <span class="pixel-particle particle-four" />

      <div class="rune-divider rune-one">✦ ━━━ ✧ ━━━ ✦</div>
      <div class="rune-divider rune-two">✧ ━━━ ✦ ━━━ ✧</div>
    </div>

    <AppContainer>
      <div class="relative px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Heading -->
        <header
          data-reveal
          class="relative mb-14 flex flex-col items-start justify-between gap-7 border-b border-gold/40 pb-8 sm:mb-20 lg:mb-24 lg:flex-row lg:items-end"
        >
          <div>
            <p class="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-label-muted sm:text-[11px]">
              <span class="text-wine">II</span>
              <span aria-hidden="true">✦</span>
              ADVENTURER'S JOURNAL
            </p>

            <h2
              id="work-title"
              class="font-display text-[clamp(3.8rem,9vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.07em] text-ink"
            >
              Quest
              <span class="block pl-8 text-wine sm:pl-16 lg:pl-24">
                board<span class="text-gold">.</span>
              </span>
            </h2>
          </div>

          <div class="w-full max-w-[300px]">
            <p class="mb-3 font-mono text-[10px] tracking-[0.13em] text-label">✧ THE CHRONICLES ✧</p>
            <p class="m-0 text-sm leading-7 text-muted">
              Every project is a new quest. Explore the challenges, the tools, and the worlds built along the way.
            </p>

            <!-- Progres quest -->
            <div class="mt-5">
              <p class="m-0 flex items-center justify-between font-mono text-[10px] tracking-[0.1em] text-label">
                <span>QUESTS COMPLETED</span>
                <span class="text-wine">{{ pad(projects.length) }}/{{ pad(projects.length) }}</span>
              </p>
              <div class="qxp mt-2" aria-hidden="true"><span class="qxp__fill" /></div>
            </div>
          </div>

          <div
            aria-hidden="true"
            class="absolute right-0 top-0 hidden size-16 items-center justify-center border border-gold/45 text-3xl text-gold xl:flex"
          >
            ⚜
          </div>
        </header>

        <!-- Project cards -->
        <div class="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2">
          <article
            v-for="(project, index) in projects"
            :key="project.number"
            data-reveal
            class="quest-card group relative min-w-0"
            :style="{ '--quest-delay': `${index * 120}ms` }"
          >
            <i class="pin" aria-hidden="true" />

            <div class="card-frame relative h-full border-2 border-shadow bg-paper p-2">
              <div class="relative flex h-full flex-col border border-gold/55">
                <!-- Card header -->
                <div class="flex items-center justify-between gap-3 border-b border-gold/40 bg-paper-raised px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="grid size-7 place-items-center border border-gold/60 bg-paper font-mono text-[11px] text-wine">
                      {{ pad(index + 1) }}
                    </span>
                    <span class="font-mono text-[10px] tracking-[0.12em] text-label-muted">QUEST LOG</span>
                  </div>

                  <span class="border border-gold/50 px-2 py-1 font-mono text-[10px] tracking-wider text-wine">
                    {{ project.year }}
                  </span>
                </div>

                <!-- Artwork -->
                <div
                  class="scene relative isolate flex min-h-[250px] flex-col justify-between overflow-hidden p-5 sm:min-h-[290px] sm:p-7"
                  :class="`scene--${themeOf(project.className).tile}`"
                >
                  <div aria-hidden="true" class="scene-pixels">
                    <span class="scene-pixel scene-pixel-a" />
                    <span class="scene-pixel scene-pixel-b" />
                    <span class="scene-pixel scene-pixel-c" />
                    <span class="scene-pixel scene-pixel-d" />
                    <span class="scene-pixel scene-pixel-e" />
                    <span class="scene-pixel scene-pixel-f" />
                  </div>
                  <div aria-hidden="true" class="scene-tile" />

                  <div class="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <p class="mb-2 font-mono text-[10px] tracking-[0.14em] text-white/80">
                        {{ project.category }}
                      </p>
                      <h3 class="m-0 font-display text-3xl font-semibold leading-none tracking-tight text-[#fff8e9] sm:text-4xl">
                        {{ project.name }}
                      </h3>
                    </div>

                    <span
                      aria-hidden="true"
                      class="badge grid size-11 shrink-0 place-items-center border border-white/30 bg-black/15"
                    >
                      <i class="badge__icon" :data-icon="themeOf(project.className).icon" />
                    </span>
                  </div>

                  <div class="relative z-10 flex flex-1 items-center justify-center py-5">
                    <div class="shot w-full max-w-md">
                      <img
                        :src="themeOf(project.className).img"
                        :alt="`${project.name} website preview`"
                        class="aspect-video w-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                      <i class="shot__scan" aria-hidden="true" />
                      <span class="stamp" aria-hidden="true">QUEST CLEARED</span>
                    </div>
                  </div>

                  <div class="relative z-10 flex items-center justify-between gap-3 border-t border-white/25 pt-3">
                    <span class="font-mono text-[10px] tracking-widest text-white/85">
                      {{ project.stack.slice(0, 2).join(" / ") }}
                    </span>
                    <span class="font-mono text-[10px] tracking-widest text-[#f3dfaa]">
                      QUEST {{ project.number }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div class="flex flex-1 flex-col p-5 sm:p-7">
                  <div class="mb-4 flex items-center gap-2">
                    <span class="text-xs text-gold" aria-hidden="true">✦</span>
                    <span class="font-mono text-[10px] tracking-[0.13em] text-label">QUEST DESCRIPTION</span>
                  </div>

                  <p class="m-0 text-sm leading-7 text-muted">{{ project.description }}</p>

                  <div class="mt-6">
                    <p class="mb-3 font-mono text-[10px] tracking-[0.13em] text-label">REWARD / SKILLS USED</p>
                    <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
                      <li
                        v-for="technology in project.stack"
                        :key="technology"
                        class="skill border border-gold/45 bg-paper-raised/60 px-2.5 py-1.5 font-mono text-[11px] text-label-muted"
                      >
                        {{ technology }}
                      </li>
                    </ul>
                  </div>

                  <div class="mt-7 flex items-center justify-between border-t border-gold/35 pt-4">
                    <span class="font-mono text-[10px] tracking-[0.12em] text-label-muted">COMPLETED QUEST</span>
                    <span class="font-mono text-[11px] text-wine" aria-hidden="true">★ ★ ★</span>
                  </div>
                </div>
              </div>

              <span class="pixel-corner pixel-corner-tl" aria-hidden="true" />
              <span class="pixel-corner pixel-corner-tr" aria-hidden="true" />
              <span class="pixel-corner pixel-corner-bl" aria-hidden="true" />
              <span class="pixel-corner pixel-corner-br" aria-hidden="true" />
            </div>
          </article>
        </div>

        <!-- Closing message -->
        <footer
          data-reveal
          class="mt-24 flex flex-col gap-5 border-t border-gold/40 pt-6 sm:mt-32 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl text-gold" aria-hidden="true">✧</span>
            <p class="m-0 font-display text-xl italic text-label-muted sm:text-2xl">
              The adventure continues...
            </p>
          </div>

          <span class="font-mono text-[10px] tracking-[0.12em] text-label">MORE QUESTS AWAIT</span>
        </footer>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped src="~/assets/css/selectedWork.css"></style>