<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";
import { MAP_H, MAP_W, PLACE_XY, renderAboutArt } from "~/assets/pixelart/aboutArt";

/* ═══════════════════════════════════════════════════════════════
   KONTEN — edit di sini. Teks surat ada di <template> (cari "Dear traveler").
   ═══════════════════════════════════════════════════════════════ */

const profile = {
  name: "Aditia Nugraha",
  alias: "Postman",
  role: "Frontend Mage",
  home: "Whiterun & Solitude",
  status: "Still growing",
  weapons: ["React", "Next.js", "Vue", "Nuxt"],
};

// Hanya hiasan karakter. Ubah angkanya (0–100) sesuka hati.
const attributes = [
  { label: "CURIOSITY", value: 95 },
  { label: "EYE FOR DETAIL", value: 88 },
  { label: "LEARNING BY MAKING", value: 90 },
];

const interests = [
  {
    title: "Little details",
    icon: "loupe",
    description:
      "I like noticing the small things that make an experience feel thoughtful — spacing, motion, colors, and the way everything comes together.",
  },
  {
    title: "Imaginary worlds",
    icon: "tower",
    description:
      "I’m drawn to worlds with their own atmosphere, stories, and details. That sense of discovery is something I like bringing into the things I create.",
  },
  {
    title: "Learning by making",
    icon: "hammer",
    description:
      "I enjoy following my curiosity, trying an idea out, and learning along the way instead of waiting until I know everything.",
  },
];

const dailyActivities = [
  {
    number: "01",
    title: "Explore a new idea",
    subtitle: "FOLLOW THE CURIOSITY",
    icon: "compass",
    description:
      "I usually start by looking around, collecting inspiration, or wondering how something works. One small question can turn into a new thing to learn.",
  },
  {
    number: "02",
    title: "Make it feel right",
    subtitle: "TINKER AND CREATE",
    icon: "hammer",
    description:
      "When I build something, I like experimenting with the details, trying different approaches, and shaping the pieces until they feel right together.",
  },
  {
    number: "03",
    title: "Take a step back",
    subtitle: "PAUSE, NOTICE, REPEAT",
    icon: "cup",
    description:
      "Not every moment has to be productive. I make room to pause, reset, and return with a clearer head and fresh perspective.",
  },
];

/** Lokasi di peta = bagian dari cara kerja & pikiranku. Koordinat ada di aboutArt.ts. */
const places = [
  {
    key: "shire",
    name: "THE SHIRE",
    title: "Where I recharge",
    text: "Quiet, green, and unhurried. This is where I pause, notice small things, and let ideas settle before they turn into work.",
  },
  {
    key: "codehaven",
    name: "CODEHAVEN",
    title: "Where I build",
    text: "My workshop. Components get shaped here, details get nudged a pixel at a time, and rough ideas become something you can click.",
  },
  {
    key: "peaks",
    name: "THE IRON PEAKS",
    title: "Where the hard problems live",
    text: "Tricky bugs, tangled state, and performance puzzles. Steep climbs — but the view from the top is always worth it.",
  },
  {
    key: "isles",
    name: "THE LOST ISLES",
    title: "Ideas not yet explored",
    text: "A scatter of small, curious islands: experiments, side projects, and questions I haven’t had time to chase. Yet.",
  },
] as const;
type PlaceKey = (typeof places)[number]["key"];

/* ═══════════════════════════════════════════════════════════════ */

const root = ref<HTMLElement | null>(null);
const mapWrap = ref<HTMLElement | null>(null);
const mapScale = ref(4);
const selected = ref<PlaceKey>("codehaven");

const current = () => places.find((p) => p.key === selected.value) ?? places[0];
const posStyle = (key: PlaceKey) => ({
  left: `${(PLACE_XY[key].x / MAP_W) * 100}%`,
  top: `${(PLACE_XY[key].y / MAP_H) * 100}%`,
});

let io: IntersectionObserver | undefined;
let ro: ResizeObserver | undefined;

onMounted(() => {
  const el = root.value;
  if (!el) return;

  ro = new ResizeObserver(([entry]) => {
    if (!entry) return;
    // lebar tersedia dikurangi padding & border bingkai (≈ 36px); skala bilangan bulat = pixel tajam
    mapScale.value = Math.min(9, Math.max(2, Math.floor((entry.contentRect.width - 36) / MAP_W)));
  });
  if (mapWrap.value) ro.observe(mapWrap.value);

  renderAboutArt(el);

  const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }
  el.classList.add("is-armed");
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

onBeforeUnmount(() => {
  io?.disconnect();
  ro?.disconnect();
});
</script>

<template>
  <section
    id="about"
    ref="root"
    class="about-section about-bg relative isolate scroll-mt-24 overflow-hidden py-16 text-ink sm:py-24 lg:py-28"
    aria-labelledby="about-title"
  >
    <!-- Latar: perkamen + grid pixel -->
    <div aria-hidden="true" class="about-parchment pointer-events-none absolute inset-0 -z-20 opacity-40" />
    <div aria-hidden="true" class="about-grid pointer-events-none absolute inset-0 -z-20 opacity-[0.13]" />

    <!-- Dekorasi sprite -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <i class="deco deco-tower" data-icon="tower" />
      <i class="deco deco-loupe" data-icon="loupe" />
      <i class="deco deco-hammer" data-icon="hammer" />
      <i class="deco deco-compass" data-icon="compass" />
      <i class="deco deco-spark" data-icon="spark" />
    </div>

    <AppContainer>
      <div class="relative px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Heading -->
        <header
          data-reveal
          class="mb-14 flex flex-col justify-between gap-6 border-b border-gold/40 pb-8 sm:mb-20 sm:flex-row sm:items-end"
        >
          <div>
            <p class="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.16em] text-label-muted sm:text-[11px]">
              <span class="text-wine">III</span>
              <span aria-hidden="true">✦</span>
              CHARACTER PROFILE
            </p>

            <h2
              id="about-title"
              class="font-display text-6xl font-medium leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl"
            >
              The adventurer
              <span class="block pl-8 text-wine sm:pl-16">
                behind the code<span class="text-gold">.</span>
              </span>
            </h2>
          </div>

          <div class="max-w-[230px]">
            <p class="mb-2 font-mono text-[10px] tracking-[0.15em] text-label">GUILD RECORD / 001</p>
            <p class="text-sm leading-7 text-muted">
              Every great digital world begins with a curious mind and a willingness to explore.
            </p>
          </div>
        </header>

        <!-- Kartu karakter + surat perkenalan -->
        <div class="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <!-- Character sheet -->
          <div data-reveal class="lg:sticky lg:top-24 lg:col-span-5">
            <div class="sheet mx-auto max-w-[420px] lg:mx-0">
              <div class="sheet__frame relative border-2 border-shadow bg-paper p-2">
                <div class="relative border border-gold/70 p-3">
                  <div class="mb-3 flex items-center justify-between border-b border-gold/40 pb-3">
                    <span class="font-mono text-[10px] tracking-[0.13em] text-wine">CHARACTER SHEET</span>
                    <span class="font-mono text-[10px] tracking-[0.1em] text-label-muted">No. 001</span>
                  </div>

                  <!-- Portrait: taruh foto di public/images/profile/profile.JPG -->
                  <div class="portrait-stage relative aspect-[4/5] overflow-hidden border border-gold/45 bg-paper-raised">
                    <img
                      src="/images/profile/profile.JPG"
                      alt="Portrait of Aditia Nugraha"
                      class="absolute inset-0 h-full w-full object-cover object-center"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />

                    <div class="portrait-placeholder absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                      <div class="portrait-silhouette relative flex h-32 w-28 items-end justify-center">
                        <div class="absolute top-2 h-14 w-14 border-4 border-shadow bg-[#c5a77b]" />
                        <div class="absolute bottom-0 h-16 w-24 border-4 border-shadow bg-wine" />
                        <div class="absolute bottom-9 h-6 w-16 bg-[#d8bd91]" />
                      </div>
                      <span class="font-mono text-[10px] tracking-[0.14em] text-label-muted">YOUR PORTRAIT GOES HERE</span>
                      <span class="text-xs text-label">Add /public/images/profile/profile.JPG</span>
                    </div>

                    <span class="portrait-corner left-0 top-0" />
                    <span class="portrait-corner right-0 top-0" />
                    <span class="portrait-corner bottom-0 left-0" />
                    <span class="portrait-corner bottom-0 right-0" />

                    <!-- Papan nama -->
                    <div class="nameplate absolute inset-x-0 bottom-0 px-4 pb-4 pt-16">
                      <p class="m-0 font-mono text-[10px] tracking-[0.16em] text-[#e6cf9b]">
                        A.K.A. “{{ profile.alias.toUpperCase() }}”
                      </p>
                      <p class="m-0 mt-1 font-display text-3xl font-semibold leading-none text-[#fff8e9]">
                        {{ profile.name }}
                      </p>
                    </div>
                  </div>

                  <!-- Data karakter -->
                  <dl class="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-mono text-[11px]">
                    <dt class="tracking-[0.1em] text-label">CLASS</dt>
                    <dd class="m-0 text-ink">{{ profile.role }}</dd>
                    <dt class="tracking-[0.1em] text-label">ALIAS</dt>
                    <dd class="m-0 text-wine">{{ profile.alias }}</dd>
                    <dt class="tracking-[0.1em] text-label">HOME</dt>
                    <dd class="m-0 text-ink">{{ profile.home }}</dd>
                    <dt class="tracking-[0.1em] text-label">STATUS</dt>
                    <dd class="m-0 text-ink">{{ profile.status }}</dd>
                  </dl>

                  <div class="mt-4 border-t border-gold/40 pt-4">
                    <p class="mb-2 font-mono text-[10px] tracking-[0.13em] text-label">SPELLS & ABILITIES</p>
                    <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
                      <li
                        v-for="w in profile.weapons"
                        :key="w"
                        class="border border-gold/45 bg-paper-raised/60 px-2 py-1 font-mono text-[11px] text-label-muted"
                      >
                        {{ w }}
                      </li>
                    </ul>
                  </div>
                </div>

                <span class="frame-corner frame-corner-tl" />
                <span class="frame-corner frame-corner-tr" />
                <span class="frame-corner frame-corner-bl" />
                <span class="frame-corner frame-corner-br" />
              </div>
            </div>
          </div>

          <!-- Surat perkenalan -->
          <div class="min-w-0 lg:col-span-7">
            <article data-reveal class="letter relative">

              <div class="mb-8 flex items-start justify-between gap-4">
                <div class="flex items-center gap-3">
                  <i class="sprite" data-icon="envelope" aria-hidden="true" style="--k: 3" />
                  <div>
                    <p class="m-0 font-mono text-[10px] tracking-[0.15em] text-wine">A LETTER FROM POSTMAN</p>
                    <p class="m-0 mt-1 font-mono text-[10px] tracking-[0.12em] text-label-muted">TO: YOU, KIND TRAVELER</p>
                  </div>
                </div>

                <div class="stamps relative shrink-0" aria-hidden="true">
                  <i class="sprite" data-icon="stamp" />
                  <i class="sprite postmark" data-icon="postmark" />
                </div>
              </div>

              <p class="m-0 font-display text-2xl italic text-label-muted">Dear traveler,</p>

              <h3 class="letter__hello m-0 mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                Hi, my name is
                <span class="whitespace-nowrap text-wine">{{ profile.name }}</span> —
                you can call me <span class="postman">{{ profile.alias }}</span>.
              </h3>

              <div class="letter__body mt-7 space-y-5 text-[15px] leading-8 text-muted sm:text-base sm:leading-8">
                <p class="m-0">
                  The name I bear, <mark class="hl">Postman</mark>, holds a tale of its own —
                  one best told over a quiet evening by the hearth. For now, know me as a
                  <mark class="hl">frontend mage</mark>, a craftsman who turns ideas
                  into living interfaces for others to explore, interact with, and enjoy.
                </p>

                <p class="m-0">
                  My craft is forged with
                  <mark class="hl">React, Next.js, Vue, Nuxt, and TypeScript</mark>.
                  Yet beyond the tools of my trade, I hold great regard for the finer details:
                  the balance of space, the rhythm of motion, the harmony of color, and the
                  quiet workings that bring an interface to life. For it is often the smallest
                  details that make a creation truly memorable.
                </p>

                <p class="m-0">
                  Beyond the walls of my workshop, I am ever a curious soul, drawn to the
                  wonders of the world and the tales it holds. I find inspiration in unexpected
                  places — in forgotten realms, distant lands, and stories woven with
                  imagination. Perhaps this is why my portfolio resembles a world waiting
                  to be explored, rather than a mere collection of works.
                </p>

                <p class="m-0">
                  I have learned that the surest path to mastery lies in
                  <mark class="hl">making</mark>. Every question is a trail to follow,
                  every experiment a lesson to be earned, and every challenge another quest
                  worth undertaking. Should you have a project to bring to life, a question
                  to ponder, or an idea worth sharing, my workshop doors — and my inbox —
                  shall always remain open.
                </p>
              </div>

              <div class="mt-9 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p class="m-0 font-display text-xl italic text-label-muted">Yours curiously,</p>
                  <p class="m-0 mt-1 font-display text-3xl font-semibold tracking-tight text-wine sm:text-4xl">
                    Aditia “Postman” Nugraha
                  </p>
                </div>
                <i class="sprite seal" data-icon="seal" aria-hidden="true" style="--k: 5" />
              </div>

              <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-gold/50 pt-5">
                <p class="m-0 max-w-sm font-mono text-[11px] leading-6 tracking-[0.04em] text-label-muted">
                  P.S. Thanks for scrolling this far. Most good adventures start with one more scroll.
                </p>

                <NuxtLink
                  to="/#contact"
                  class="reply group inline-flex min-h-11 items-center gap-3 border-2 border-shadow bg-wine px-4 py-2.5 text-paper"
                >
                  <span aria-hidden="true" class="font-mono text-xs text-highlight">▶</span>
                  <span class="font-mono text-[11px] tracking-widest text-highlight">WRITE BACK</span>
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>

        <!-- Things I like -->
        <div data-reveal class="mt-24 sm:mt-28">
          <header class="mb-6 flex flex-col justify-between gap-3 border-b border-gold/50 pb-4 sm:flex-row sm:items-end">
            <div>
              <p class="mb-2 font-mono text-[10px] tracking-[0.15em] text-label">INVENTORY</p>
              <h3 class="m-0 font-display text-4xl tracking-tight sm:text-5xl">Things I like</h3>
            </div>
            <span class="font-mono text-[10px] tracking-widest text-label-muted">LITTLE JOYS / 001—003</span>
          </header>

          <div class="grid gap-5 sm:grid-cols-3 sm:gap-4">
            <article v-for="interest in interests" :key="interest.title" class="interest-card">
              <span class="slot mb-4" aria-hidden="true">
                <i class="sprite" :data-icon="interest.icon" style="--k: 3" />
              </span>
              <h4 class="m-0 mb-2 font-display text-2xl text-ink">{{ interest.title }}</h4>
              <p class="m-0 text-sm leading-7 text-muted">{{ interest.description }}</p>
            </article>
          </div>
        </div>

        <!-- What I usually do -->
        <div data-reveal class="mt-24 sm:mt-28">
          <header class="mb-10 flex flex-col justify-between gap-3 border-b border-gold/50 pb-4 sm:flex-row sm:items-end">
            <div>
              <p class="mb-2 font-mono text-[10px] tracking-[0.15em] text-label">A FEW NOTES FROM MY EVERYDAY</p>
              <h3 class="m-0 font-display text-4xl tracking-tight sm:text-5xl">What I usually do</h3>
            </div>
            <span class="font-mono text-[10px] tracking-widest text-label-muted">DAILY ROUTE / 001—003</span>
          </header>

          <ol class="route m-0 grid list-none gap-10 p-0 lg:grid-cols-3 lg:gap-8">
            <li v-for="step in dailyActivities" :key="step.number" class="route__step">
              <span class="route__node" aria-hidden="true">
                <i class="sprite" :data-icon="step.icon" style="--k: 3" />
              </span>
              <p class="m-0 mb-2 font-mono text-[10px] tracking-[0.12em] text-label">
                <span class="text-wine">{{ step.number }}</span> · {{ step.subtitle }}
              </p>
              <h4 class="m-0 mb-3 font-display text-3xl tracking-tight">{{ step.title }}</h4>
              <p class="m-0 text-sm leading-7 text-muted sm:text-base">{{ step.description }}</p>
            </li>
          </ol>
        </div>

        <!-- Peta -->
        <div data-reveal class="mt-24 sm:mt-28">
          <div class="mb-7">
            <p class="mb-3 font-mono text-[10px] tracking-[0.15em] text-label">A LITTLE MAP OF MY MIND</p>
            <h3 class="m-0 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              A world of <span class="text-wine">little curiosities.</span>
            </h3>
          </div>

          <div class="grid items-start gap-8 lg:grid-cols-12">
            <div ref="mapWrap" class="min-w-0 lg:col-span-8">
              <div class="map-frame relative w-fit max-w-full border-2 border-shadow bg-[#d9d0ae] p-2">
                <div class="relative border border-gold/60">
                  <div class="flex items-center justify-between gap-3 border-b border-gold/40 bg-paper-raised px-3 py-2.5 sm:px-4">
                    <span class="font-mono text-[10px] tracking-widest text-label-muted">A MAP OF IDEAS &amp; CURIOSITY</span>
                    <span class="font-mono text-[10px] tracking-widest text-wine">ALWAYS IN PROGRESS</span>
                  </div>

                  <div class="map-canvas relative" :style="{ '--ms': mapScale + 'px' }">
                    <canvas data-layer="map" class="map-canvas__cv" role="img" aria-label="Pixel art fantasy world map with a forest, a castle, mountains, small islands, and a dotted travel route" />

                    <button
                      v-for="p in places"
                      :key="p.key"
                      type="button"
                      class="pin"
                      :class="{ 'is-active': selected === p.key }"
                      :style="posStyle(p.key)"
                      :aria-pressed="selected === p.key"
                      @click="selected = p.key"
                      @pointerenter="selected = p.key"
                      @focus="selected = p.key"
                    >
                      <span class="pin__dot" aria-hidden="true" />
                      <span class="pin__label">{{ p.name }}</span>
                    </button>

                    <i class="spark spark-a" data-icon="spark" aria-hidden="true" />
                    <i class="spark spark-b" data-icon="spark" aria-hidden="true" />
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gold/40 bg-paper-raised px-3 py-2.5 sm:px-4">
                    <span class="flex items-center gap-4 font-mono text-[10px] tracking-widest text-label-muted">
                      <span class="inline-flex items-center gap-1.5"><i class="legend-dot" /> QUEST LOCATION</span>
                      <span class="inline-flex items-center gap-1.5"><i class="legend-path" /> PATH OF DISCOVERY</span>
                    </span>
                    <span class="font-mono text-[10px] tracking-widest text-wine">EXPLORE / CREATE / REFINE</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Catatan lokasi -->
            <div class="lg:col-span-4">
              <ul class="m-0 list-none space-y-2 p-0">
                <li v-for="(p, i) in places" :key="p.key">
                  <button
                    type="button"
                    class="place w-full text-left"
                    :class="{ 'is-active': selected === p.key }"
                    :aria-pressed="selected === p.key"
                    @click="selected = p.key"
                    @pointerenter="selected = p.key"
                  >
                    <span class="font-mono text-[10px] tracking-[0.12em] text-wine">0{{ i + 1 }}</span>
                    <span class="font-display text-xl text-ink">{{ p.title }}</span>
                    <span class="ml-auto font-mono text-[10px] tracking-widest text-label-muted">{{ p.name }}</span>
                  </button>
                </li>
              </ul>

              <div class="place-detail mt-4" aria-live="polite">
                <p class="m-0 mb-2 font-mono text-[10px] tracking-[0.13em] text-label">▶ {{ current()?.name }}</p>
                <p class="m-0 text-sm leading-7 text-muted">{{ current()?.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Closing note -->
        <div data-reveal class="mt-20 flex flex-col items-center justify-center gap-3 text-center sm:mt-24">
          <span class="slot" aria-hidden="true"><i class="sprite" data-icon="seal" style="--k: 3" /></span>
          <p class="m-0 font-mono text-[10px] tracking-[0.16em] text-label">THAT’S A LITTLE BIT OF ME</p>
          <p class="m-0 font-display text-xl italic text-label-muted">Still curious. Still figuring things out.</p>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped src="~/assets/css/about.css"></style>