
<script setup lang="ts">
import { computed, ref } from "vue";
import AppContainer from "~/components/layout/AppContainer.vue";

// Ganti dengan informasi profesional kamu.
const email = "";
const linkedInUrl = "https://www.linkedin.com/in/aditia-nugraha-postman";
const githubUrl = "https://github.com/feyerin";

const copied = ref(false);

const emailHref = computed(() =>
  email
    ? `mailto:${email}?subject=${encodeURIComponent("Let's work together")}`
    : "",
);

const socialLinks = computed(() =>
  [
    { label: "LinkedIn", href: linkedInUrl, symbol: "↗" },
    { label: "GitHub", href: githubUrl, symbol: "↗" },
  ].filter((social) => social.href),
);

async function copyEmail() {
  if (!email || !import.meta.client || !navigator.clipboard) return;

  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;

    window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <section
    id="contact"
    class="final-quest relative overflow-hidden border-t border-[#d7c8a8] bg-[#f4eddf] py-24 text-[#40382d] sm:py-32 lg:py-40"
    aria-labelledby="contact-title"
  >
    <div class="contact-grid pointer-events-none absolute inset-0" aria-hidden="true" />

    <AppContainer>
      <div class="relative mx-auto max-w-6xl">
        <!-- Section heading -->
        <div class="mb-10 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-[#94713a] sm:text-xs">
            <span class="h-px w-7 bg-[#a1844e]" />
            <span>05 / THE FINAL QUEST</span>
          </div>

          <span class="hidden font-mono text-[10px] tracking-[0.14em] text-[#94866d] sm:block">
            QUEST STATUS: AVAILABLE
          </span>
        </div>

        <!-- Main parchment panel -->
        <div class="quest-frame relative">
          <div class="quest-inner relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <!-- Decorative magic circles -->
            <div class="magic-circle magic-circle-one" aria-hidden="true">
              <div />
              <div />
              <span>✦</span>
            </div>

            <div class="magic-circle magic-circle-two" aria-hidden="true">
              <div />
              <div />
            </div>

            <!-- Corner ornaments -->
            <span class="corner corner-tl" aria-hidden="true">✦</span>
            <span class="corner corner-tr" aria-hidden="true">✦</span>
            <span class="corner corner-bl" aria-hidden="true">✦</span>
            <span class="corner corner-br" aria-hidden="true">✦</span>

            <div class="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end lg:gap-10">
              <div class="max-w-3xl">
                <div class="mb-7 inline-flex items-center gap-3 border border-[#d5c29b] bg-[#eee2c8] px-3 py-2">
                  <span class="status-dot" aria-hidden="true" />
                  <span class="font-mono text-[10px] tracking-[0.16em] text-[#78613b]">
                    A NEW ADVENTURE AWAITS
                  </span>
                </div>

                <h2
                  id="contact-title"
                  class="font-display text-5xl font-medium leading-[0.98] tracking-[-0.045em] text-[#40382d] sm:text-6xl lg:text-8xl"
                >
                  Every great
                  <span class="block italic text-[#94713a]">quest starts</span>
                  with a message.
                </h2>

                <p class="mt-7 max-w-xl text-sm leading-7 text-[#786d5b] sm:text-base sm:leading-8">
                  Have a project to build, an opportunity to share, or a
                  difficult problem waiting to be solved? Let's turn your next
                  idea into something worth remembering.
                </p>

                <!-- Actions -->
                <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    v-if="emailHref"
                    :href="emailHref"
                    class="pixel-button inline-flex min-h-12 items-center justify-center gap-4 px-6 py-3 font-mono text-xs tracking-[0.08em]"
                  >
                    <span aria-hidden="true">✉</span>
                    <span>ACCEPT THE QUEST</span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  <button
                    v-if="email"
                    type="button"
                    class="pixel-secondary inline-flex min-h-12 items-center justify-center gap-3 px-5 py-3 font-mono text-xs tracking-[0.08em]"
                    @click="copyEmail"
                  >
                    <span aria-hidden="true">{{ copied ? "✓" : "▣" }}</span>
                    {{ copied ? "EMAIL COPIED" : "COPY EMAIL" }}
                  </button>

                  <p v-if="!email" class="text-xs leading-6 text-[#94866d]">
                    Set your email in
                    <code class="text-[#94713a]">ContactSection.vue</code>
                    to activate the quest.
                  </p>
                </div>
              </div>

              <!-- Pixel-art guild seal -->
              <div class="guild-seal mx-auto w-full max-w-[190px] lg:mx-0">
                <div class="seal-label">ROYAL GUILD</div>

                <div class="seal-art" aria-hidden="true">
                  <svg viewBox="0 0 96 112" fill="none">
                    <path
                      d="M48 5 83 19V53C83 76 67 94 48 106 29 94 13 76 13 53V19L48 5Z"
                      fill="#e8d7b3"
                      stroke="#94713a"
                      stroke-width="3"
                      stroke-linejoin="miter"
                    />
                    <path
                      d="M48 13 75 24V52C75 70 63 85 48 95 33 85 21 70 21 52V24L48 13Z"
                      fill="#783f46"
                      stroke="#40382d"
                      stroke-width="2"
                    />
                    <path
                      d="M34 34H43V43H52V34H61V52H52V61H43V52H34V34Z"
                      fill="#f4eddf"
                    />
                    <path
                      d="M43 61H52V70H61V79H34V70H43V61Z"
                      fill="#a1844e"
                    />
                    <path
                      d="M48 21V28M28 48H35M61 48H68M48 82V89"
                      stroke="#e8d7b3"
                      stroke-width="2"
                    />
                  </svg>
                </div>

                <div class="seal-divider">
                  <span />
                  <span>✦</span>
                  <span />
                </div>

                <p class="seal-caption">BUILT WITH CURIOSITY</p>
                <p class="seal-subcaption">SEALED WITH CODE</p>
              </div>
            </div>

            <!-- Bottom information -->
            <div class="relative z-10 mt-12 border-t border-[#d7c8a8] pt-6 sm:mt-16">
              <div class="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p class="font-mono text-[10px] tracking-[0.18em] text-[#94713a]">
                    FIND THE ADVENTURER
                  </p>

                  <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                    <li v-for="social in socialLinks" :key="social.label">
                      <a
                        :href="social.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="social-link inline-flex min-h-8 items-center gap-2 text-sm text-[#786d5b]"
                      >
                        {{ social.label }}
                        <span aria-hidden="true">{{ social.symbol }}</span>
                      </a>
                    </li>
                  </ul>

                  <p v-if="!socialLinks.length" class="mt-3 text-xs text-[#94866d]">
                    Add your LinkedIn and GitHub URLs to reveal your profiles.
                  </p>
                </div>

                <div class="font-mono text-[10px] leading-6 tracking-[0.1em] text-[#94866d] sm:text-right">
                  <p>NO DRAGONS REQUIRED</p>
                  <p>JUST GOOD IDEAS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- End of the journey -->
        <div class="mt-8 flex flex-col items-center justify-between gap-3 font-mono text-[9px] tracking-[0.16em] text-[#94866d] sm:flex-row">
          <span>END OF CHAPTER FIVE</span>

          <a href="#home" class="back-to-top inline-flex items-center gap-2 py-2">
            RETURN TO THE KINGDOM
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped>
.final-quest {
  isolation: isolate;
}

.contact-grid {
  background-image:
    linear-gradient(rgba(148, 113, 58, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 113, 58, 0.055) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}

.quest-frame {
  padding: 5px;
  background: #a1844e;
  box-shadow:
    0 0 0 1px #94713a,
    0 0 0 7px #e4d5b7,
    0 0 0 8px #c3aa7d,
    8px 8px 0 8px rgba(64, 56, 45, 0.12);
}

.quest-inner {
  min-height: 480px;
  background:
    radial-gradient(ellipse at 90% 10%, rgba(193, 170, 125, 0.22), transparent 38%),
    linear-gradient(135deg, #fbf8f1, #f4eddf 72%, #eee2c8);
  border: 1px solid rgba(148, 113, 58, 0.4);
}

.corner {
  position: absolute;
  z-index: 2;
  color: #a1844e;
  font-size: 15px;
}

.corner-tl {
  top: 12px;
  left: 12px;
}

.corner-tr {
  top: 12px;
  right: 12px;
}

.corner-bl {
  bottom: 12px;
  left: 12px;
}

.corner-br {
  right: 12px;
  bottom: 12px;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: #58734f;
  box-shadow: 0 0 0 3px rgba(88, 115, 79, 0.12);
  animation: pulse-status 2s ease-in-out infinite;
}

.pixel-button {
  color: #fbf8f1;
  background: #783f46;
  border: 2px solid #593037;
  box-shadow: 4px 4px 0 #c5b18a;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.pixel-button:hover {
  background: #64343a;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #c5b18a;
}

.pixel-button:focus-visible,
.pixel-secondary:focus-visible,
.social-link:focus-visible,
.back-to-top:focus-visible {
  outline: 2px solid #94713a;
  outline-offset: 4px;
}

.pixel-secondary {
  color: #665338;
  border: 1px solid #c5b18a;
  background: rgba(251, 248, 241, 0.65);
  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease;
}

.pixel-secondary:hover {
  color: #783f46;
  border-color: #94713a;
  background: #fbf8f1;
}

.guild-seal {
  position: relative;
  z-index: 1;
  padding: 18px 14px;
  border: 1px solid #d7c8a8;
  background: rgba(251, 248, 241, 0.58);
  text-align: center;
  animation: seal-float 5s ease-in-out infinite;
}

.seal-label,
.seal-caption,
.seal-subcaption {
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
}

.seal-label {
  color: #94713a;
}

.seal-art {
  display: flex;
  justify-content: center;
  margin: 14px auto;
}

.seal-art svg {
  width: 94px;
  image-rendering: pixelated;
  filter: drop-shadow(3px 3px 0 rgba(64, 56, 45, 0.12));
}

.seal-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #a1844e;
  font-size: 10px;
}

.seal-divider span:first-child,
.seal-divider span:last-child {
  width: 24px;
  height: 1px;
  background: #d7c8a8;
}

.seal-caption {
  margin-top: 12px;
  color: #786d5b;
}

.seal-subcaption {
  margin-top: 5px;
  color: #a1844e;
}

.magic-circle {
  position: absolute;
  pointer-events: none;
  display: grid;
  place-items: center;
  opacity: 0.42;
}

.magic-circle-one {
  top: -70px;
  right: -65px;
  width: 290px;
  height: 290px;
  animation: rotate-circle 70s linear infinite;
}

.magic-circle-two {
  right: 40px;
  bottom: -125px;
  width: 240px;
  height: 240px;
  animation: rotate-circle 90s linear infinite reverse;
}

.magic-circle div {
  position: absolute;
  inset: 0;
  border: 1px solid #c5b18a;
  border-radius: 50%;
}

.magic-circle div:nth-child(2) {
  inset: 22px;
  border-style: dashed;
}

.magic-circle-one div:nth-child(2) {
  border-radius: 0;
  transform: rotate(45deg);
}

.magic-circle span {
  color: #a1844e;
  font-size: 25px;
}

.social-link,
.back-to-top {
  transition: color 180ms ease;
}

.social-link:hover,
.back-to-top:hover {
  color: #783f46;
}

@keyframes pulse-status {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

@keyframes seal-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes rotate-circle {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .quest-frame {
    box-shadow:
      0 0 0 1px #94713a,
      0 0 0 4px #e4d5b7,
      0 0 0 5px #c3aa7d,
      4px 4px 0 5px rgba(64, 56, 45, 0.1);
  }

  .quest-inner {
    min-height: auto;
  }

  .magic-circle-one {
    top: -45px;
    right: -125px;
    width: 230px;
    height: 230px;
  }

  .magic-circle-two {
    right: -100px;
    bottom: -100px;
    width: 180px;
    height: 180px;
  }
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
