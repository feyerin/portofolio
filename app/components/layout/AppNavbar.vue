
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import AppContainer from "./AppContainer.vue";

const route = useRoute();
const menuOpen = ref(false);
const scrolled = ref(false);

const navigation = [
  { label: "Home", href: "/#top", number: "I", symbol: "⌂" },
  { label: "Works", href: "/#work", number: "II", symbol: "⚔" },
  { label: "About", href: "/#about", number: "III", symbol: "♙" },
  { label: "Experience", href: "/#experience", number: "IV", symbol: "♜" },
  { label: "ATMOS", href: "/lab/atmos", number: "V", symbol: "✧" },
  { label: "Contact", href: "/#contact", number: "VI", symbol: "✉" },
];

function closeMenu() {
  menuOpen.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeMenu();
}

function handleScroll() {
  scrolled.value = window.scrollY > 12;
}

function isActive(href: string) {
  if (href === "/#top") {
    return route.path === "/" && (!route.hash || route.hash === "#top");
  }

  if (href === "/lab/atmos") {
    return route.path === "/lab/atmos";
  }

  if (href.startsWith("/#")) {
    return route.path === "/" && route.hash === href.slice(1);
  }

  return route.path === href;
}

watch(
  () => route.fullPath,
  () => closeMenu(),
);

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <header
    class="rpg-navbar lg:px-8 sticky top-0 z-50 border-b border-[#a1844e]/50 bg-[#fbf8f1]/95 text-[#40382d] backdrop-blur-md transition-all duration-300"
    :class="scrolled
      ? 'shadow-[0_5px_0_rgba(148,113,58,0.12),0_10px_28px_rgba(64,56,45,0.08)]'
      : ''"
  >
    <!-- Ornamental top rule -->
    <div class="relative h-0.75 bg-[#e9dfca]" aria-hidden="true">
      <div
        class="mx-auto h-full max-w-7xl bg-linear-to-r from-transparent via-[#a1844e] to-transparent"
      />
    </div>

    <AppContainer>
      <div
        class="relative flex min-h-20.5 items-center justify-between gap-4 py-3 max-md:min-h-17.5"
      >
        <!-- Brand / guild emblem -->
        <NuxtLink
          to="/#top"
          aria-label="Postman — home"
          class="group flex min-w-0 items-center gap-3"
          @click="closeMenu"
        >
          <span
            class="guild-emblem relative grid size-11 shrink-0 place-items-center border-2 border-[#94713a] bg-[#eee2c8] transition-colors duration-200 group-hover:bg-[#e4d2ad] max-md:size-10"
            aria-hidden="true"
          >
            <span class="absolute inset-0.75 border border-[#a1844e]/60" />
            <span class="absolute left-0 top-0 text-[8px] text-[#94713a]">✦</span>
            <span class="absolute right-0 top-0 text-[8px] text-[#94713a]">✦</span>
            <span class="absolute bottom-0 left-0 text-[8px] text-[#94713a]">✦</span>
            <span class="absolute bottom-0 right-0 text-[8px] text-[#94713a]">✦</span>

            <span
              class="relative font-[Cormorant_Garamond,Georgia,serif] text-[29px] font-bold leading-none tracking-[-0.08em] text-[#493927] max-md:text-[26px]"
            >
              P<span class="text-[#783f46]">.</span>
            </span>
          </span>

          <span class="flex min-w-0 flex-col gap-1">
            <span
              class="truncate font-[Cormorant_Garamond,Georgia,serif] text-[23px] font-semibold leading-none tracking-wide text-[#493927] transition-colors group-hover:text-[#783f46] sm:text-[26px]"
            >
              postman
            </span>

            <span
              class="hidden font-mono text-[8px] tracking-[0.17em] text-[#94713a] sm:block"
            >
              KINGDOM OF DRAGONSTONE
            </span>
          </span>
        </NuxtLink>

        <!-- Desktop navigation -->
        <div class="hidden items-center gap-5 lg:flex xl:gap-7">
          <nav aria-label="Main navigation">
            <ul class="flex items-center gap-4 xl:gap-6">
              <li v-for="item in navigation" :key="item.number">
                <NuxtLink
                  :to="item.href"
                  :aria-current="isActive(item.href) ? 'page' : undefined"
                  class="nav-link group relative flex min-h-12 flex-col items-center justify-center gap-1 px-1"
                  :class="isActive(item.href) ? 'is-active' : ''"
                >
                  <span
                    class="font-mono text-[8px] leading-none tracking-[0.12em]"
                    :class="isActive(item.href)
                      ? 'text-[#783f46]'
                      : 'text-[#a1844e]'"
                  >
                    {{ item.number }}.
                  </span>

                  <span
                    class="font-[Cormorant_Garamond,Georgia,serif] text-[16px] leading-none tracking-wide transition-colors duration-200 xl:text-[17px]"
                    :class="isActive(item.href)
                      ? 'font-semibold text-[#783f46]'
                      : 'text-[#655641] group-hover:text-[#783f46]'"
                  >
                    {{ item.label }}
                  </span>

                  <span
                    class="nav-underline absolute bottom-0 left-0 h-[2px] w-full bg-[#94713a]"
                    :class="isActive(item.href)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'"
                    aria-hidden="true"
                  />
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <!-- Adventurer status -->
          <div class="guild-status flex items-center gap-3 border-l border-[#a1844e]/40 pl-5 xl:pl-6">
            <span
              class="relative grid size-9 shrink-0 place-items-center border border-[#94713a]/60 bg-[#eee2c8] text-[#783f46]"
              aria-hidden="true"
            >
              <span class="absolute inset-[3px] border border-[#a1844e]/30" />
              <svg viewBox="0 0 24 24" fill="none" class="relative size-5">
                <path
                  d="M12 3 14.5 8.5 20 9 16 13 17 19 12 16 7 19 8 13 4 9 9.5 8.5 12 3Z"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linejoin="miter"
                />
              </svg>
            </span>

            <span class="flex flex-col gap-1">
              <span class="font-mono text-[8px] tracking-[0.1em] text-[#94713a]">
                QUEST STATUS
              </span>
              <span
                class="whitespace-nowrap font-[Cormorant_Garamond,Georgia,serif] text-[15px] font-semibold leading-none text-[#783f46]"
              >
                Open to work
              </span>
            </span>
          </div>
        </div>

        <!-- Mobile toggle -->
        <button
          type="button"
          class="pixel-toggle relative grid size-11 shrink-0 place-items-center border-2 border-[#94713a] bg-[#eee2c8] transition-colors hover:bg-[#e4d2ad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#94713a] lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="menuOpen = !menuOpen"
        >
          <span class="absolute inset-[3px] border border-[#a1844e]/40" />
          <span class="relative flex flex-col items-center gap-[5px]">
            <span
              class="h-[2px] w-[17px] bg-[#493927] transition-transform duration-200"
              :class="menuOpen ? 'translate-y-[3.5px] rotate-45' : ''"
            />
            <span
              class="h-[2px] w-[17px] bg-[#493927] transition-transform duration-200"
              :class="menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''"
            />
          </span>
        </button>
      </div>

      <!-- Mobile navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="translate-y-[-6px] opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-[-6px] opacity-0"
      >
        <nav
          v-if="menuOpen"
          id="mobile-navigation"
          aria-label="Mobile navigation"
          class="border-t-2 border-dashed border-[#a1844e]/40 pb-5 pt-4 lg:hidden"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <p class="m-0 font-mono text-[9px] tracking-[0.17em] text-[#94713a]">
              <span aria-hidden="true">✦ </span>
              ADVENTURER'S JOURNAL
            </p>
            <span class="font-mono text-[9px] text-[#a1844e]">I — VI</span>
          </div>

          <ul class="flex flex-col">
            <li
              v-for="item in navigation"
              :key="item.number"
              class="border-b border-dashed border-[#a1844e]/30 last:border-b-0"
            >
              <NuxtLink
                :to="item.href"
                :aria-current="isActive(item.href) ? 'page' : undefined"
                class="mobile-nav-link group flex min-h-[56px] items-center gap-4 py-3"
                @click="closeMenu"
              >
                <span
                  class="grid size-9 shrink-0 place-items-center border border-[#a1844e]/50 bg-[#f4eddf] font-mono text-[10px]"
                  :class="isActive(item.href)
                    ? 'border-[#783f46] bg-[#783f46] text-[#fbf8f1]'
                    : 'text-[#94713a]'"
                >
                  {{ item.number }}
                </span>

                <span
                  class="flex-1 font-[Cormorant_Garamond,Georgia,serif] text-[23px] leading-none transition-colors duration-200"
                  :class="isActive(item.href)
                    ? 'font-semibold text-[#783f46]'
                    : 'text-[#493927] group-hover:text-[#783f46]'"
                >
                  {{ item.label }}
                </span>

                <span
                  class="font-serif text-lg text-[#a1844e] transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-5 border-2 border-[#a1844e]/50 bg-[#f4eddf] p-3">
            <div class="flex items-center gap-3">
              <span
                class="grid size-9 shrink-0 place-items-center border border-[#a1844e]/50 bg-[#eee2c8] text-[#783f46]"
                aria-hidden="true"
              >
                ✦
              </span>

              <div class="flex min-w-0 flex-col gap-1">
                <span class="font-mono text-[8px] tracking-[0.12em] text-[#94713a]">
                  CURRENT QUEST
                </span>
                <span class="font-[Cormorant_Garamond,Georgia,serif] text-base italic text-[#783f46]">
                  Open to work
                </span>
              </div>

              <span class="ml-auto font-mono text-[8px] text-[#94713a]">
                LV. 06+
              </span>
            </div>
          </div>

          <div
            class="mt-5 flex items-center justify-between gap-3 font-mono text-[8px] tracking-[0.12em] text-[#94713a]"
          >
            <span>THE KINGDOM OF DRAGONSTONE</span>
            <span>✦ EST. MMXXVI ✦</span>
          </div>
        </nav>
      </Transition>
    </AppContainer>

    <!-- Pixel-inspired bottom border -->
    <div class="pointer-events-none absolute bottom-0 left-0 flex h-[3px] w-full" aria-hidden="true">
      <span class="w-1/4 bg-[#a1844e]/20" />
      <span class="w-1/2 bg-[#a1844e]/70" />
      <span class="w-1/4 bg-[#a1844e]/20" />
    </div>
  </header>
</template>

<style scoped>
.rpg-navbar {
  isolation: isolate;
}

.guild-emblem {
  box-shadow: 3px 3px 0 rgba(148, 113, 58, 0.22);
}

.nav-link {
  transition: color 180ms ease;
}

.nav-underline {
  transform-origin: center;
  transition: transform 200ms ease;
}

.nav-link.is-active {
  color: #783f46;
}

.pixel-toggle {
  box-shadow: 3px 3px 0 rgba(148, 113, 58, 0.2);
}

.pixel-toggle:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 rgba(148, 113, 58, 0.2);
}

.mobile-nav-link {
  transition: background-color 180ms ease;
}

.mobile-nav-link:hover {
  background: rgba(225, 210, 180, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
