
<script setup lang="ts">
import AppContainer from "~/components/layout/AppContainer.vue";

const route = useRoute();

const footerLinks = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Works", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "" },
  { label: "LinkedIn", href: "" },
];

function backToTop() {
  if (route.path !== "/") {
    return navigateTo("/#top");
  }

  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
}
</script>

<template>
  <footer class="kingdom-footer relative overflow-hidden lg:px-8">
    <!-- Pixel grid texture -->
    <div class="footer-grid pointer-events-none absolute inset-0" aria-hidden="true" />

    <!-- Top ornament -->
    <div class="footer-top-rule relative flex h-2 items-center justify-center" aria-hidden="true">
      <span class="h-[2px] w-full bg-[#a1844e]/60" />
      <span class="absolute grid size-5 place-items-center border border-[#a1844e] bg-[#40252b] text-[10px] text-[#d7bb7d]">
        ✦
      </span>
    </div>

    <AppContainer>
      <!-- Main footer -->
      <div class="relative grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <!-- Brand / kingdom -->
        <div class="lg:col-span-5">
          <div class="flex items-start gap-4">
            <!-- CSS / SVG castle emblem -->
            <div class="footer-emblem grid size-[58px] shrink-0 place-items-center border border-[#a1844e]/70 bg-[#563039]">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                class="size-11"
                aria-hidden="true"
              >
                <path
                  d="M7 40V17H14V10H20V17H28V10H34V17H41V40H7Z"
                  fill="#d7bb7d"
                  stroke="#e7d6ae"
                  stroke-width="1.5"
                  stroke-linejoin="miter"
                />
                <path
                  d="M18 40V29H30V40M10 22H15V27H10ZM33 22H38V27H33ZM21 19H27V24H21Z"
                  fill="#563039"
                  stroke="#563039"
                  stroke-width="1"
                />
                <path
                  d="M22 12V6H26V12M4 40H44"
                  stroke="#d7bb7d"
                  stroke-width="2"
                  stroke-linecap="square"
                />
              </svg>
            </div>

            <div class="pt-1">
              <NuxtLink
                to="/#top"
                aria-label="Postman — return to home"
                class="footer-brand font-[Cormorant_Garamond,Georgia,serif] text-3xl font-semibold tracking-wide text-[#fbf2df]"
              >
                postman<span class="text-[#d7bb7d]">.</span>
              </NuxtLink>

              <p class="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#d7bb7d]">
                THE KINGDOM OF DRAGONSTONE
              </p>
            </div>
          </div>

          <p class="mt-6 max-w-sm text-sm leading-7 text-[#d0bdad]/80">
            Crafting digital experiences, one line of code at a time.
            Every great adventure begins with curiosity.
          </p>

          <div class="mt-6 flex items-center gap-3">
            <span class="h-px w-8 bg-[#a1844e]" />
            <span class="font-mono text-[9px] tracking-[0.16em] text-[#d7bb7d]">
              CLASS: FRONTEND MAGE
            </span>
          </div>
        </div>

        <!-- Navigation -->
        <div class="lg:col-span-3 lg:col-start-7">
          <h2 class="footer-heading font-mono text-[10px] tracking-[0.18em] text-[#d7bb7d]">
            THE KINGDOM
          </h2>

          <ul class="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-1">
            <li v-for="link in footerLinks" :key="link.label">
              <NuxtLink
                :to="link.href"
                class="footer-link inline-flex min-h-8 items-center gap-2 text-sm text-[#d0bdad]/80"
              >
                <span class="text-[10px] text-[#a1844e]" aria-hidden="true">◆</span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social / return -->
        <div class="lg:col-span-3">
          <h2 class="footer-heading font-mono text-[10px] tracking-[0.18em] text-[#d7bb7d]">
            FIND THE ADVENTURER
          </h2>

          <ul class="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            <li v-for="social in socialLinks.filter((item) => item.href)" :key="social.label">
              <a
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link inline-flex min-h-8 items-center gap-2 text-sm text-[#d0bdad]/80"
              >
                {{ social.label }}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>

          <p v-if="!socialLinks.some((item) => item.href)" class="mt-4 text-xs leading-6 text-[#d0bdad]/50">
            Your next connection awaits.
          </p>

          <button
            type="button"
            class="return-button mt-7 inline-flex min-h-11 items-center gap-3 border border-[#a1844e]/70 bg-[#563039] px-4 py-3 font-mono text-[9px] tracking-[0.12em] text-[#f5e8cb] transition-colors hover:bg-[#69404a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7bb7d]"
            @click="backToTop"
          >
            <span aria-hidden="true">↑</span>
            RETURN TO THE KINGDOM
          </button>
        </div>
      </div>

      <!-- Bottom credits -->
      <div class="footer-credits relative flex flex-col gap-3 border-t border-[#a1844e]/35 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p class="font-mono text-[9px] leading-5 tracking-[0.1em] text-[#d0bdad]/60">
          © {{ new Date().getFullYear() }} POSTMAN. ALL RIGHTS RESERVED.
        </p>

        <div class="flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-[#d7bb7d]/80">
          <span aria-hidden="true">✦</span>
          <span>BUILT WITH NUXT & CURIOSITY</span>
          <span aria-hidden="true">✦</span>
        </div>

        <p class="font-mono text-[9px] tracking-[0.1em] text-[#d0bdad]/45">
          END OF CHAPTER
        </p>
      </div>
    </AppContainer>

    <!-- Bottom gold line -->
    <div class="h-[3px] bg-gradient-to-r from-transparent via-[#a1844e] to-transparent" aria-hidden="true" />
  </footer>
</template>

<style scoped>
.kingdom-footer {
  isolation: isolate;
  color: #fbf2df;
  background:
    radial-gradient(ellipse at 14% 0%, rgba(161, 132, 78, 0.13), transparent 36%),
    linear-gradient(145deg, #40252b 0%, #352127 52%, #2d2023 100%);
}

.footer-grid {
  opacity: 0.18;
  background-image:
    linear-gradient(rgba(215, 187, 125, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(215, 187, 125, 0.12) 1px, transparent 1px);
  background-size: 16px 16px;
  mask-image: linear-gradient(to bottom, black, transparent 95%);
}

.footer-top-rule {
  background: rgba(161, 132, 78, 0.12);
}

.footer-emblem {
  box-shadow:
    inset 0 0 0 3px rgba(215, 187, 125, 0.08),
    4px 4px 0 rgba(20, 12, 14, 0.2);
}

.footer-brand {
  text-decoration: none;
  transition: color 180ms ease;
}

.footer-brand:hover {
  color: #e6d2a5;
}

.footer-heading {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.footer-heading::after {
  width: 20px;
  height: 1px;
  background: rgba(161, 132, 78, 0.8);
  content: "";
}

.footer-link {
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.footer-link:hover {
  color: #f5e8cb;
  transform: translateX(3px);
}

.return-button {
  box-shadow: 3px 3px 0 rgba(15, 9, 10, 0.3);
}

.return-button:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 rgba(15, 9, 10, 0.3);
}

.footer-credits {
  border-top-style: dashed;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
