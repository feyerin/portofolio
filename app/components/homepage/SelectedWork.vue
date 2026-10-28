
<script setup lang="ts">
import AppContainer from "~/components/layout/AppContainer.vue";
import { projects } from "~/data/project";

const decorations = [
  { icon: "potion", class: "deco-potion", label: "Magic potion" },
  { icon: "staff", class: "deco-staff", label: "Wizard staff" },
  { icon: "dragon", class: "deco-dragon", label: "Dragon" },
  { icon: "sword", class: "deco-sword", label: "Sword" },
  { icon: "shield", class: "deco-shield", label: "Shield" },
  { icon: "crystal", class: "deco-crystal", label: "Magic crystal" },
  { icon: "coin", class: "deco-coin", label: "Gold coin" },
  { icon: "potion", class: "deco-potion-two", label: "Healing potion" },
  { icon: "dragon", class: "deco-dragon-two", label: "Dragon emblem" },
  { icon: "crystal", class: "deco-crystal-two", label: "Magic crystal" },
];
</script>

<template>
  <section
    id="work"
    class="quest-section relative isolate scroll-mt-24 overflow-hidden bg-[#f4eddf] py-24 text-[#40382d] sm:py-32 lg:py-40"
    aria-labelledby="work-title"
  >
    <!-- Parchment texture -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-20 opacity-30"
      style="
        background-image:
          radial-gradient(ellipse at 15% 20%, #d8c79f 0%, transparent 42%),
          radial-gradient(ellipse at 85% 70%, #e3d2b2 0%, transparent 40%),
          linear-gradient(90deg, transparent 49.8%, #c6b28b 50%, transparent 50.2%);
      "
    />

    <!-- Subtle pixel grid -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-20 opacity-[0.14]"
      style="
        background-image:
          linear-gradient(#94713a 1px, transparent 1px),
          linear-gradient(90deg, #94713a 1px, transparent 1px);
        background-size: 24px 24px;
        mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
      "
    />

    <!-- Medieval pixel-art background decorations -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        v-for="item in decorations"
        :key="item.class"
        class="medieval-deco absolute select-none"
        :class="item.class"
      >
        <svg
          v-if="item.icon === 'potion'"
          viewBox="0 0 48 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M18 3H30V7H18Z" fill="#493927" />
          <path d="M16 7H32V11H16Z" fill="#94713a" />
          <path d="M19 11H29V19H34V23H38V39H34V43H14V39H10V23H14V19H19Z" fill="#493927" />
          <path d="M19 15H29V23H34V39H14V23H19Z" fill="#b5a16e" />
          <path d="M14 27H34V39H14Z" fill="#783f46" />
          <path d="M18 27H22V31H18Z" fill="#f3dfaa" />
          <path d="M10 23H14V39H10Z" fill="#493927" />
          <path d="M34 23H38V39H34Z" fill="#493927" />
          <path d="M14 39H34V43H14Z" fill="#493927" />
          <path d="M18 19H22V23H18Z" fill="#f3dfaa" />
          <path d="M24 31H30V35H24Z" fill="#d3b875" />
        </svg>

        <svg
          v-else-if="item.icon === 'staff'"
          viewBox="0 0 48 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M21 16H27V44H21Z" fill="#493927" />
          <path d="M23 18H25V42H23Z" fill="#94713a" />
          <path d="M19 7H29V11H19Z" fill="#493927" />
          <path d="M15 11H33V15H15Z" fill="#493927" />
          <path d="M19 15H29V19H19Z" fill="#493927" />
          <path d="M19 3H29V7H19Z" fill="#94713a" />
          <path d="M23 7H25V15H23Z" fill="#f3dfaa" />
          <path d="M7 11H11V15H7Z" fill="#94713a" />
          <path d="M11 7H15V11H11Z" fill="#94713a" />
          <path d="M33 7H37V11H33Z" fill="#94713a" />
          <path d="M37 11H41V15H37Z" fill="#94713a" />
          <path d="M17 23H21V27H17Z" fill="#783f46" />
          <path d="M27 31H31V35H27Z" fill="#783f46" />
        </svg>

        <svg
          v-else-if="item.icon === 'dragon'"
          viewBox="0 0 64 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M6 7H22V11H30V15H38V19H46V15H54V19H62V27H54V31H46V35H34V31H26V27H18V23H10V19H6Z" fill="#783f46" />
          <path d="M10 11H18V15H26V19H34V23H42V27H50V23H58V27H50V31H38V27H30V23H22V19H14V15H10Z" fill="#94713a" />
          <path d="M18 15H26V19H18Z" fill="#493927" />
          <path d="M26 19H34V23H26Z" fill="#493927" />
          <path d="M34 23H42V27H34Z" fill="#493927" />
          <path d="M46 19H50V23H46Z" fill="#f3dfaa" />
          <path d="M50 23H54V27H50Z" fill="#f3dfaa" />
          <path d="M14 23H22V27H14Z" fill="#493927" />
          <path d="M10 27H18V31H10Z" fill="#493927" />
          <path d="M22 31H30V35H22Z" fill="#493927" />
          <path d="M34 31H42V35H34Z" fill="#493927" />
          <path d="M42 35H50V39H42Z" fill="#493927" />
          <path d="M30 11H38V15H30Z" fill="#493927" />
        </svg>

        <svg
          v-else-if="item.icon === 'sword'"
          viewBox="0 0 48 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M31 3H39V15H35V23H31V31H27V35H19V31H23V23H27V15H31Z" fill="#493927" />
          <path d="M35 7H39V15H35Z" fill="#f3dfaa" />
          <path d="M31 15H35V23H31Z" fill="#d3b875" />
          <path d="M27 23H31V31H27Z" fill="#d3b875" />
          <path d="M15 31H31V35H15Z" fill="#783f46" />
          <path d="M19 35H27V39H19Z" fill="#493927" />
          <path d="M19 39H27V43H19Z" fill="#94713a" />
        </svg>

        <svg
          v-else-if="item.icon === 'shield'"
          viewBox="0 0 48 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M8 5H40V29L36 37L24 45L12 37L8 29Z" fill="#493927" />
          <path d="M12 9H36V29L32 33L24 39L16 33L12 29Z" fill="#783f46" />
          <path d="M20 9H28V39L24 42L20 39Z" fill="#d3b875" />
          <path d="M12 17H36V25H12Z" fill="#d3b875" />
          <path d="M20 17H28V25H20Z" fill="#f3dfaa" />
        </svg>

        <svg
          v-else-if="item.icon === 'crystal'"
          viewBox="0 0 48 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M16 3H32V7H40V15H44V31H36V39H28V45H20V39H12V31H4V15H8V7H16Z" fill="#493927" />
          <path d="M16 7H32V11H36V19H40V27H32V35H24V39H16V31H8V19H12V11H16Z" fill="#94713a" />
          <path d="M20 11H28V19H32V27H24V35H20V27H16V19H20Z" fill="#e5d7b1" />
          <path d="M16 11H20V19H16Z" fill="#f3ead8" />
          <path d="M8 3H12V7H8Z" fill="#d3b875" />
          <path d="M36 7H40V11H36Z" fill="#d3b875" />
          <path d="M4 27H8V31H4Z" fill="#d3b875" />
        </svg>

        <svg
          v-else
          viewBox="0 0 48 48"
          fill="none"
          shape-rendering="crispEdges"
          class="h-full w-full"
        >
          <path d="M16 3H32V7H36V11H40V27H36V35H28V43H20V35H12V27H8V11H12V7H16Z" fill="#493927" />
          <path d="M16 7H32V11H36V27H32V35H24V39H20V31H12V23H12V11H16Z" fill="#d3b875" />
          <path d="M20 11H28V19H32V27H24V35H20V27H16V19H20Z" fill="#f3dfaa" />
          <path d="M20 19H24V23H20Z" fill="#fff6db" />
        </svg>
      </div>

      <!-- Small pixel particles -->
      <span class="pixel-particle particle-one" />
      <span class="pixel-particle particle-two" />
      <span class="pixel-particle particle-three" />
      <span class="pixel-particle particle-four" />

      <!-- Decorative horizontal rune -->
      <div class="rune-divider rune-one">
        ✦ ━━━ ✧ ━━━ ✦
      </div>
      <div class="rune-divider rune-two">
        ✧ ━━━ ✦ ━━━ ✧
      </div>
    </div>

    <AppContainer>
      <div class="relative px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Section heading -->
        <header
          class="quest-reveal relative mb-14 flex flex-col items-start justify-between gap-7 border-b border-[#a1844e]/40 pb-8 sm:mb-20 lg:mb-24 lg:flex-row lg:items-end"
        >
          <div>
            <p class="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-[#827765]">
              <span class="text-[#783f46]">II</span>
              <span aria-hidden="true">✦</span>
              ADVENTURER'S JOURNAL
            </p>

            <h2
              id="work-title"
              class="font-[Cormorant_Garamond,Georgia,serif] text-[clamp(3.8rem,9vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.07em] text-[#493927]"
            >
              Quest
              <span class="block pl-8 text-[#783f46] sm:pl-16 lg:pl-24">
                board<span class="text-[#94713a]">.</span>
              </span>
            </h2>
          </div>

          <div class="max-w-[300px]">
            <p class="mb-3 font-mono text-[9px] tracking-[0.13em] text-[#94713a]">
              ✧ THE CHRONICLES ✧
            </p>
            <p class="text-sm leading-7 text-[#716552]">
              Every project is a new quest. Explore the challenges, the
              tools, and the worlds built along the way.
            </p>
          </div>

          <!-- Decorative mini crest -->
          <div
            aria-hidden="true"
            class="absolute right-0 top-0 hidden size-16 items-center justify-center border border-[#a1844e]/45 text-3xl text-[#94713a] xl:flex"
          >
            ⚜
          </div>
        </header>

        <!-- Project cards -->
        <div class="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
          <article
            v-for="(project, index) in projects"
            :key="project.number"
            class="quest-reveal group relative min-w-0"
            :style="{ '--quest-delay': `${index * 120}ms` }"
          >
            <!-- Card frame -->
            <div
              class="relative h-full border-2 border-[#493927] bg-[#fbf8f1] p-2 shadow-[5px_5px_0_#c6b28b] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_#c6b28b] motion-reduce:transition-none"
            >
              <!-- Inner border -->
              <div class="relative flex h-full flex-col border border-[#a1844e]/55">
                <!-- Card header -->
                <div class="flex items-center justify-between gap-3 border-b border-[#a1844e]/40 bg-[#eee3cf] px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="grid size-7 place-items-center border border-[#a1844e]/60 bg-[#fbf8f1] font-mono text-[10px] text-[#783f46]">
                      {{ String(index + 1).padStart(2, "0") }}
                    </span>
                    <span class="font-mono text-[9px] tracking-[0.12em] text-[#655641]">
                      QUEST LOG
                    </span>
                  </div>

                  <span class="border border-[#a1844e]/50 px-2 py-1 font-mono text-[8px] tracking-wider text-[#783f46]">
                    {{ project.year }}
                  </span>
                </div>

                <!-- RPG artwork panel -->
                <div
                  class="project-scene relative isolate flex min-h-62.5 flex-col justify-between overflow-hidden p-5 sm:min-h-72.5 sm:p-7"
                  :class="{
                    'scene-booking': project.className === 'project-bookingtogo',
                    'scene-caroline': project.className === 'project-caroline',
                    'scene-kalbe': project.className === 'project-kalbe',
                  }"
                >
                  <!-- Pixel background scenery -->
                  <div aria-hidden="true" class="scene-pixels">
                    <span class="scene-pixel scene-pixel-a" />
                    <span class="scene-pixel scene-pixel-b" />
                    <span class="scene-pixel scene-pixel-c" />
                    <span class="scene-pixel scene-pixel-d" />
                    <span class="scene-pixel scene-pixel-e" />
                    <span class="scene-pixel scene-pixel-f" />
                  </div>

                  <div class="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <p class="mb-2 font-mono text-[8px] tracking-[0.14em] text-white/65">
                        {{ project.category }}
                      </p>
                      <h3 class="font-[Cormorant_Garamond,Georgia,serif] text-3xl font-semibold leading-none tracking-tight text-[#fff8e9] sm:text-4xl">
                        {{ project.name }}
                      </h3>
                    </div>

                    <span class="grid size-10 shrink-0 place-items-center border border-white/30 bg-black/10 text-xl text-[#f3dfaa] transition-transform duration-300 group-hover:rotate-12 motion-reduce:transition-none">
                      <span v-if="project.className === 'project-bookingtogo'">✧</span>
                      <span v-else-if="project.className === 'project-caroline'">⚔</span>
                      <span v-else>✦</span>
                    </span>
                  </div>

                  <!-- Custom project emblem -->
                  <div
                    class="relative z-10 flex flex-1 items-center justify-center py-5"
                  >
                    <div
                      class="w-full max-w-md overflow-hidden border-2 border-[#d3b875]/70 bg-[#493927] p-1 shadow-[5px_5px_0_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover:-translate-y-1"
                    >
                      <img
                        :src="
                          project.className === 'project-bookingtogo'
                            ? '/images/projects/bookingtogo.png'
                            : project.className === 'project-caroline'
                              ? '/images/projects/caroline.png'
                              : '/images/projects/kalbe.png'
                        "
                        :alt="`${project.name} website preview`"
                        class="aspect-video w-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  <div class="relative z-10 flex items-center justify-between gap-3 border-t border-white/25 pt-3">
                    <span class="font-mono text-[8px] tracking-widest text-white/70">
                      {{ project.stack.slice(0, 2).join(" / ") }}
                    </span>
                    <span class="font-mono text-[8px] tracking-widest text-[#f3dfaa]">
                      QUEST {{ project.number }}
                    </span>
                  </div>
                </div>

                <!-- Quest description -->
                <div class="flex flex-1 flex-col p-5 sm:p-7">
                  <div class="mb-4 flex items-center gap-2">
                    <span class="text-xs text-[#94713a]" aria-hidden="true">✦</span>
                    <span class="font-mono text-[9px] tracking-[0.13em] text-[#94713a]">
                      QUEST DESCRIPTION
                    </span>
                  </div>

                  <p class="mb-0 text-sm leading-7 text-[#716552]">
                    {{ project.description }}
                  </p>

                  <!-- Skills -->
                  <div class="mt-6">
                    <p class="mb-3 font-mono text-[8px] tracking-[0.13em] text-[#94713a]">
                      REWARD / SKILLS USED
                    </p>
                    <ul class="flex flex-wrap gap-2">
                      <li
                        v-for="technology in project.stack"
                        :key="technology"
                        class="border border-[#a1844e]/45 bg-[#f3ead8] px-2.5 py-1.5 font-mono text-[9px] text-[#655641] transition-colors duration-200 group-hover:border-[#783f46]/50 group-hover:text-[#783f46]"
                      >
                        {{ technology }}
                      </li>
                    </ul>
                  </div>

                  <div class="mt-7 flex items-center justify-between border-t border-[#a1844e]/35 pt-4">
                    <span class="font-mono text-[8px] tracking-[0.12em] text-[#827765]">
                      COMPLETED QUEST
                    </span>
                    <span class="font-mono text-[10px] text-[#783f46]">
                      ★ ★ ★
                    </span>
                  </div>
                </div>
              </div>

              <!-- Pixel corners -->
              <span class="pixel-corner pixel-corner-tl" aria-hidden="true" />
              <span class="pixel-corner pixel-corner-tr" aria-hidden="true" />
              <span class="pixel-corner pixel-corner-bl" aria-hidden="true" />
              <span class="pixel-corner pixel-corner-br" aria-hidden="true" />
            </div>
          </article>
        </div>

        <!-- Closing message -->
        <footer
          class="quest-reveal mt-24 flex flex-col gap-5 border-t border-[#a1844e]/40 pt-6 sm:mt-32 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl text-[#94713a]" aria-hidden="true">✧</span>
            <p class="m-0 font-[Cormorant_Garamond,Georgia,serif] text-xl italic text-[#655641] sm:text-2xl">
              The adventure continues...
            </p>
          </div>

          <span class="font-mono text-[9px] tracking-[0.12em] text-[#94713a]">
            MORE QUESTS AWAIT
          </span>
        </footer>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped>
.quest-section {
  --parchment-ink: #493927;
}

/* Background icon placement */
.medieval-deco {
  color: #94713a;
  opacity: 0.18;
  image-rendering: pixelated;
  will-change: transform;
}

.medieval-deco svg {
  image-rendering: pixelated;
}

.deco-potion {
  left: 3%;
  top: 12%;
  width: 54px;
  animation: deco-float 6s ease-in-out infinite;
}

.deco-staff {
  right: 5%;
  top: 8%;
  width: 62px;
  transform: rotate(12deg);
  animation: deco-float 7s ease-in-out infinite reverse;
}

.deco-dragon {
  right: -14px;
  top: 31%;
  width: clamp(90px, 15vw, 180px);
  opacity: 0.09;
  animation: dragon-drift 12s ease-in-out infinite;
}

.deco-sword {
  left: 7%;
  top: 52%;
  width: 50px;
  transform: rotate(-18deg);
  animation: deco-float 5s ease-in-out infinite;
}

.deco-shield {
  right: 8%;
  top: 61%;
  width: 64px;
  animation: deco-float 6.5s ease-in-out infinite reverse;
}

.deco-crystal {
  left: 43%;
  top: 7%;
  width: 38px;
  opacity: 0.14;
  animation: crystal-glow 3s steps(2, end) infinite;
}

.deco-coin {
  left: 45%;
  bottom: 12%;
  width: 40px;
  animation: coin-bob 4s ease-in-out infinite;
}

.deco-potion-two {
  right: 22%;
  bottom: 6%;
  width: 42px;
  opacity: 0.12;
  animation: deco-float 5.5s ease-in-out infinite reverse;
}

.deco-dragon-two {
  left: -25px;
  bottom: 20%;
  width: 105px;
  opacity: 0.08;
  transform: scaleX(-1);
  animation: dragon-drift 15s ease-in-out infinite reverse;
}

.deco-crystal-two {
  right: 36%;
  bottom: 4%;
  width: 30px;
  opacity: 0.14;
  animation: crystal-glow 4s steps(2, end) infinite;
}

/* Tiny pixel particles */
.pixel-particle {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #94713a;
  opacity: 0.55;
  animation: particle-twinkle 3s steps(2, end) infinite;
}

.particle-one {
  left: 22%;
  top: 24%;
}

.particle-two {
  right: 23%;
  top: 44%;
  animation-delay: 700ms;
}

.particle-three {
  left: 33%;
  bottom: 23%;
  animation-delay: 1.2s;
}

.particle-four {
  right: 12%;
  bottom: 13%;
  animation-delay: 1.8s;
}

.rune-divider {
  position: absolute;
  color: #94713a;
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  opacity: 0.28;
  white-space: nowrap;
}

.rune-one {
  left: 3%;
  top: 42%;
}

.rune-two {
  right: 3%;
  bottom: 34%;
}

/* Reveal animation */
.quest-reveal {
  animation: quest-enter 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

article.quest-reveal {
  animation-delay: var(--quest-delay, 0ms);
}

/* RPG project scene colors */
.project-scene {
  background-color: #626b4b;
  background-image:
    linear-gradient(to bottom, transparent 75%, rgb(34 43 30 / 22%) 75%),
    linear-gradient(90deg, rgb(255 255 255 / 3%) 1px, transparent 1px);
  background-size: 100% 100%, 8px 8px;
}

.scene-booking {
  background-color: #1551C3;
  background-image:
    linear-gradient(to bottom, #7D8DA8 0%, #4775C5 42%, #1551C3 100%),
    linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
}

.scene-caroline {
  background-color: #6b5749;
  background-image:
    linear-gradient(to bottom, #b8a08a 0%, #856d5c 42%, #473b34 100%),
    linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
}

.scene-kalbe {
  background-color: #476654;
  background-image:
    linear-gradient(to bottom, #9daf91 0%, #66866e 42%, #395646 100%),
    linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
}

/* Pixel terrain in project artwork */
.scene-pixels {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.5;
}

.scene-pixel {
  position: absolute;
  display: block;
  width: 32px;
  height: 32px;
  background: #f3dfaa;
  opacity: 0.25;
}

.scene-pixel-a {
  top: 22%;
  left: 12%;
  width: 24px;
  height: 8px;
  box-shadow: 8px -8px 0 #f3dfaa;
}

.scene-pixel-b {
  right: 12%;
  top: 36%;
  width: 8px;
  height: 32px;
  box-shadow: 8px -8px 0 #f3dfaa, 16px 0 0 #f3dfaa;
}

.scene-pixel-c {
  left: 22%;
  bottom: 16%;
  width: 48px;
  height: 8px;
  background: #493927;
  opacity: 0.2;
}

.scene-pixel-d {
  right: 28%;
  bottom: 20%;
  width: 8px;
  height: 8px;
  background: #493927;
  box-shadow: 8px -8px 0 #493927, 16px 0 0 #493927;
  opacity: 0.3;
}

.scene-pixel-e {
  left: 54%;
  top: 15%;
  width: 8px;
  height: 8px;
}

.scene-pixel-f {
  left: 6%;
  bottom: 30%;
  width: 8px;
  height: 8px;
  box-shadow: 8px 8px 0 #f3dfaa;
}

.scene-emblem {
  display: grid;
  place-items: center;
  filter: drop-shadow(4px 4px 0 rgb(45 36 26 / 28%));
  transition: transform 400ms steps(4, end);
}

.group:hover .scene-emblem {
  transform: translateY(-4px);
}

.pixel-corner {
  position: absolute;
  z-index: 2;
  width: 9px;
  height: 9px;
  border: 2px solid #94713a;
  background: #f4eddf;
}

.pixel-corner-tl {
  left: -2px;
  top: -2px;
}

.pixel-corner-tr {
  right: -2px;
  top: -2px;
}

.pixel-corner-bl {
  bottom: -2px;
  left: -2px;
}

.pixel-corner-br {
  bottom: -2px;
  right: -2px;
}

@keyframes quest-enter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes deco-float {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -10px;
  }
}

@keyframes dragon-drift {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: -10px -5px;
  }
}

@keyframes coin-bob {
  0%,
  100% {
    transform: rotate(0deg) translateY(0);
  }

  50% {
    transform: rotate(12deg) translateY(-6px);
  }
}

@keyframes crystal-glow {
  0%,
  100% {
    opacity: 0.1;
  }

  50% {
    opacity: 0.28;
  }
}

@keyframes particle-twinkle {
  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.8;
  }
}

@media (max-width: 640px) {
  .deco-dragon {
    right: -36px;
    width: 100px;
  }

  .deco-dragon-two {
    left: -40px;
    width: 76px;
  }

  .deco-staff {
    right: 2%;
    width: 42px;
  }

  .deco-shield {
    right: 2%;
    width: 44px;
  }

  .deco-potion {
    left: 1%;
    width: 38px;
  }

  .deco-sword {
    left: 2%;
    width: 34px;
  }

  .rune-divider {
    font-size: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quest-reveal {
    animation: none;
  }

  .medieval-deco,
  .pixel-particle,
  .scene-emblem {
    animation: none;
    transition: none;
  }

  .group:hover .scene-emblem {
    transform: none;
  }
}
</style>
