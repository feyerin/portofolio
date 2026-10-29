<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { experiences } from "~/data/experience";
import { renderExperienceArt } from "~/assets/pixelart/experienceArt";

const totalRecords = computed(() => String(experiences.length).padStart(2, "0"));

/* ───────── Obor yang menyusuri timeline mengikuti scroll ───────── */

const root = ref<HTMLElement | null>(null);
const timelineEl = ref<HTMLElement | null>(null);
const reached = ref(0); // jumlah penanda yang sudah dilewati obor
const track = reactive({ top: 0, height: 0, fill: 0 });

let markerYs: number[] = [];
let reduced = false;
let raf = 0;
let io: IntersectionObserver | undefined;
let ro: ResizeObserver | undefined;

const trackStyle = computed(() => ({
  "--track-top": `${track.top}px`,
  "--track-h": `${track.height}px`,
  "--fill-h": `${track.fill}px`,
}));

/** Posisi tengah tiap penanda relatif ke timeline (offset tidak terpengaruh animasi transform). */
function measure() {
  const t = timelineEl.value;
  if (!t) return;
  markerYs = [...t.querySelectorAll<HTMLElement>(".entry__marker")].map((m) => {
    const entry = m.closest<HTMLElement>(".entry");
    return (entry?.offsetTop ?? 0) + m.offsetTop + m.offsetHeight / 2;
  });
  const first = markerYs[0] ?? 0;
  const last = markerYs[markerYs.length - 1] ?? first;
  track.top = first;
  track.height = Math.max(0, last - first);
  update();
}

function update() {
  const t = timelineEl.value;
  if (!t) return;
  const bottom = track.top + track.height;
  const probe = reduced ? bottom : window.innerHeight * 0.55 - t.getBoundingClientRect().top;
  const y = Math.min(bottom, Math.max(track.top, probe));
  track.fill = Math.round((y - track.top) / 4) * 4; // kelipatan 4px = gerak per-pixel
  reached.value = markerYs.filter((m) => m <= probe + 1).length;
}

const onScroll = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(update);
};

/* ───────── Muncul saat di-scroll ───────── */

onMounted(() => {
  const el = root.value;
  if (!el) return;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderExperienceArt(el);

  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  ro = new ResizeObserver(measure);
  if (timelineEl.value) ro.observe(timelineEl.value);

  const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.setAttribute("data-in", ""));
    return;
  }
  el.classList.add("is-armed"); // sebelum ini semua konten terlihat (aman untuk SSR / tanpa JS)
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-in", ""); // atribut data-*, bukan class: Vue menulis ulang `class` saat :class berubah
        io?.unobserve(e.target);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((t) => io?.observe(t));
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("scroll", onScroll);
  ro?.disconnect();
  io?.disconnect();
});
</script>

<template>
  <section
    id="experience"
    ref="root"
    class="exp-section relative isolate scroll-mt-24 overflow-hidden py-16 text-ink sm:py-24 lg:py-28"
    aria-labelledby="experience-title"
  >
    <!-- Latar: perkamen + grid pixel (memudar di atas & bawah) -->
    <div aria-hidden="true" class="exp-parchment pointer-events-none absolute inset-0 -z-20 opacity-40" />
    <div aria-hidden="true" class="exp-grid pointer-events-none absolute inset-0 -z-20 opacity-[0.13]" />

    <AppContainer>
      <div class="relative px-4 sm:px-6 lg:px-8 xl:px-10">
        <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <!-- Pengantar -->
          <header data-reveal class="lg:sticky lg:top-24">
            <p class="m-0 flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-label sm:text-[11px]">
              <span aria-hidden="true" class="h-[3px] w-6 bg-gold" />
              <span class="text-wine">04</span> / GUILD RECORDS
            </p>

            <p class="mb-3 mt-7 font-mono text-[10px] leading-7 tracking-[0.13em] text-label-muted">
              CHRONICLES OF AN ADVENTURER
            </p>

            <h2
              id="experience-title"
              class="m-0 max-w-[480px] font-display text-[clamp(2.8rem,5vw,4.2rem)] font-medium leading-[1.04] tracking-[-0.045em]"
            >
              A journey forged through
              <em class="not-italic text-wine">experience<span class="text-gold">.</span></em>
            </h2>

            <p class="mt-6 max-w-[410px] text-sm leading-8 text-muted">
              Every quest leaves behind a lesson. A record of the teams, challenges, and digital worlds that shaped my craft.
            </p>

            <!-- Statistik karier -->
            <dl class="m-0 mt-8 flex items-center gap-6 border-t border-gold/40 pt-6">
              <div class="grid gap-2">
                <dd class="m-0 font-display text-3xl font-semibold leading-none">{{ totalRecords }}</dd>
                <dt class="font-mono text-[10px] tracking-[0.08em] text-label">GUILD RECORDS</dt>
              </div>
              <span aria-hidden="true" class="h-10 w-px bg-gold/40" />
              <div class="grid gap-2">
                <dd class="m-0 font-display text-3xl font-semibold leading-none">LV. 06+</dd>
                <dt class="font-mono text-[10px] tracking-[0.08em] text-label">YEARS OF CRAFT</dt>
              </div>
            </dl>

            <!-- Lambang guild -->
            <div class="crest mt-10 hidden w-[132px] flex-col items-center gap-3 lg:flex" aria-hidden="true">
              <i class="sprite crest__img" data-icon="crest" />
              <span class="font-mono text-[10px] tracking-[0.15em] text-label">EST. IN CODE</span>
            </div>
          </header>

          <!-- Timeline -->
          <div ref="timelineEl" class="timeline relative min-w-0" :style="trackStyle">
            <div
              data-reveal
              class="flex min-h-12 items-center gap-3 border border-gold/45 bg-paper/80 px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-label sm:text-[11px]"
            >
              <span aria-hidden="true">✦</span>
              <h3 class="m-0 text-[inherit] font-normal tracking-[inherit]">THE ADVENTURER'S JOURNAL</h3>
              <span class="ml-auto text-label-muted">{{ totalRecords }} ENTRIES</span>
            </div>

            <!-- Jalur + api obor -->
            <div class="timeline__track" aria-hidden="true">
              <span class="timeline__fill" />
              <i class="sprite timeline__flame" data-icon="flame" />
            </div>

            <ol class="m-0 list-none p-0">
              <li
                v-for="(experience, index) in experiences"
                :key="`${experience.company}-${experience.role}`"
                data-reveal
                class="entry"
                :class="{ 'entry--current': experience.current, 'is-reached': index < reached }"
                :style="{ '--entry-index': index }"
              >
                <!-- Penanda di jalur -->
                <div class="entry__marker" aria-hidden="true">
                  <i v-if="experience.current" class="sprite entry__gem" data-icon="gemRed" />
                  <span v-else class="font-mono text-[11px]">{{ String(index + 1).padStart(2, "0") }}</span>
                </div>

                <!-- Kartu record -->
                <article class="entry__card">
                  <div class="flex flex-wrap items-center justify-between gap-2.5">
                    <span class="font-mono text-[10px] tracking-[0.1em] text-label-muted">
                      RECORD NO. {{ String(index + 1).padStart(3, "0") }}
                    </span>

                    <span
                      v-if="experience.current"
                      class="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] text-wine"
                    >
                      <span aria-hidden="true" class="entry__dot" />
                      CURRENT QUEST
                    </span>
                    <span v-else class="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] text-label">
                      <span aria-hidden="true">✦</span> QUEST RECORDED
                    </span>
                  </div>

                  <div class="mt-5 flex items-start justify-between gap-4 max-[560px]:flex-col max-[560px]:gap-3">
                    <div class="min-w-0">
                      <h4 class="m-0 font-display text-[clamp(1.5rem,2.5vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
                        {{ experience.role }}
                      </h4>
                      <p class="mb-0 mt-2 flex items-center gap-2 text-[13px] text-wine">
                        <i class="sprite" data-icon="pin" style="--k: 2" aria-hidden="true" />
                        {{ experience.company }}
                      </p>
                    </div>

                    <span class="shrink-0 border border-gold/45 bg-paper-raised/70 px-2.5 py-1.5 font-mono text-[10px] leading-6 text-label-muted">
                      {{ experience.period }}
                    </span>
                  </div>

                  <div class="entry__divider"><span>FIELD REPORT</span></div>

                  <p class="m-0 text-sm leading-8 text-muted">{{ experience.summary }}</p>

                  <ul v-if="experience.contributions?.length" class="m-0 mt-4 grid list-none gap-2.5 p-0">
                    <li
                      v-for="contribution in experience.contributions"
                      :key="contribution"
                      class="grid grid-cols-[18px_minmax(0,1fr)] gap-2.5 text-[13px] leading-7 text-muted"
                    >
                      <i class="sprite mt-2" data-icon="gem" style="--k: 2" aria-hidden="true" />
                      <span>{{ contribution }}</span>
                    </li>
                  </ul>

                  <p
                    v-if="experience.type"
                    class="m-0 mt-5 flex items-start gap-2 border-t border-dashed border-gold/45 pt-3.5 font-mono text-[10px] leading-7 tracking-[0.08em] text-label-muted"
                  >
                    <span aria-hidden="true" class="text-gold">◈</span>
                    {{ experience.type.toUpperCase() }}
                  </p>

                  <span class="card-corner card-corner-tl" aria-hidden="true" />
                  <span class="card-corner card-corner-br" aria-hidden="true" />
                </article>
              </li>
            </ol>

            <!-- Akhir catatan -->
            <div data-reveal class="mt-10 flex flex-col items-center pl-11 text-center max-[560px]:pl-7">
              <i class="sprite crest__img" data-icon="crest" style="--k: 2" aria-hidden="true" />
              <p class="m-0 mt-3 font-mono text-[10px] tracking-[0.14em] text-label">THE CHRONICLE CONTINUES</p>
              <p class="m-0 mt-2 font-display text-lg italic text-label-muted">
                Every new quest begins with a new challenge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped src="~/assets/css/experienceSection.css"></style>