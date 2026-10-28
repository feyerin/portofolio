
<script setup lang="ts">
import { computed } from "vue"
import AppContainer from "~/components/layout/AppContainer.vue"
import { experiences } from "~/data/experience"

const totalRecords = computed(() => String(experiences.length).padStart(2, "0"))
</script>

<template>
  <section
    id="experience"
    class="guild-records lg:px-8"
    aria-labelledby="experience-title"
  >
    <div class="guild-records__texture" aria-hidden="true" />

    <AppContainer>
      <div class="guild-layout">
        <!-- Left introduction -->
        <header class="guild-intro">
          <div class="guild-eyebrow">
            <span class="guild-eyebrow__line" />
            <span>04 / GUILD RECORDS</span>
          </div>

          <p class="guild-intro__chapter">
            CHRONICLES OF AN ADVENTURER
          </p>

          <h2 id="experience-title" class="guild-intro__title">
            A journey forged through
            <em>experience.</em>
          </h2>

          <p class="guild-intro__description">
            Every quest leaves behind a lesson. A record of the teams,
            challenges, and digital worlds that shaped my craft.
          </p>

          <!-- Career stats -->
          <div class="guild-stats">
            <div class="guild-stat">
              <span class="guild-stat__value">{{ totalRecords }}</span>
              <span class="guild-stat__label">GUILD RECORDS</span>
            </div>

            <div class="guild-stat__divider" />

            <div class="guild-stat">
              <span class="guild-stat__value">LV. 06+</span>
              <span class="guild-stat__label">YEARS OF CRAFT</span>
            </div>
          </div>

          <!-- Decorative seal -->
          <div class="guild-seal" aria-hidden="true">
            <div class="guild-seal__inner">
              <svg viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 4L54 16V43L32 59L10 43V16L32 4Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M23 43V20L32 33L41 20V43"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="square"
                />
                <path
                  d="M22 20H42"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </div>
            <span>EST. IN CODE</span>
          </div>
        </header>

        <!-- Right timeline -->
        <div class="guild-timeline">
          <div class="guild-timeline__heading">
            <span class="guild-timeline__heading-icon">✦</span>
            <span>THE ADVENTURER'S JOURNAL</span>
            <span class="guild-timeline__heading-count">
              {{ totalRecords }} ENTRIES
            </span>
          </div>

          <article
            v-for="(experience, index) in experiences"
            :key="`${experience.company}-${experience.role}`"
            class="guild-entry"
            :class="{ 'guild-entry--current': experience.current }"
            :style="{ '--entry-index': index }"
          >
            <!-- Timeline rail -->
            <div class="guild-entry__rail">
              <div class="guild-entry__marker">
                <span v-if="experience.current" class="guild-entry__marker-core" />
                <span v-else class="guild-entry__marker-number">
                  {{ String(index + 1).padStart(2, "0") }}
                </span>
              </div>

              <span
                v-if="index !== experiences.length - 1"
                class="guild-entry__connector"
                aria-hidden="true"
              />
            </div>

            <!-- Record card -->
            <div class="guild-entry__card">
              <div class="guild-entry__topline">
                <span class="guild-entry__record">
                  RECORD NO. {{ String(index + 1).padStart(3, "0") }}
                </span>

                <span
                  v-if="experience.current"
                  class="guild-entry__status"
                >
                  <span class="guild-entry__status-dot" />
                  CURRENT QUEST
                </span>

                <span v-else class="guild-entry__completed">
                  ✦ QUEST RECORDED
                </span>
              </div>

              <div class="guild-entry__heading">
                <div class="guild-entry__title-group">
                  <h3>{{ experience.role }}</h3>
                  <p class="guild-entry__company">
                    <span aria-hidden="true">⌖</span>
                    {{ experience.company }}
                  </p>
                </div>

                <span class="guild-entry__period">
                  {{ experience.period }}
                </span>
              </div>

              <div class="guild-entry__divider">
                <span>FIELD REPORT</span>
              </div>

              <p class="guild-entry__summary">
                {{ experience.summary }}
              </p>

              <ul
                v-if="experience.contributions?.length"
                class="guild-entry__contributions"
              >
                <li
                  v-for="contribution in experience.contributions"
                  :key="contribution"
                >
                  <span class="guild-entry__bullet" aria-hidden="true">↗</span>
                  <span>{{ contribution }}</span>
                </li>
              </ul>

              <div v-if="experience.type" class="guild-entry__footer">
                <span class="guild-entry__footer-icon" aria-hidden="true">
                  ◈
                </span>
                <span>{{ experience.type.toUpperCase() }}</span>
              </div>

              <span class="guild-entry__corner" aria-hidden="true">✧</span>
            </div>
          </article>

          <!-- End of records -->
          <div class="guild-end">
            <span class="guild-end__symbol">✦</span>
            <p>THE CHRONICLE CONTINUES</p>
            <span class="guild-end__subtext">
              Every new quest begins with a new challenge.
            </span>
          </div>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<style scoped>
.guild-records {
  --guild-paper: #f4eddf;
  --guild-paper-light: #fbf8f1;
  --guild-ink: #40382d;
  --guild-muted: #8d806b;
  --guild-gold: #a1844e;
  --guild-gold-dark: #806536;
  --guild-burgundy: #783f46;
  --guild-border: #d7c8ac;

  position: relative;
  overflow: hidden;
  padding-block: 112px 104px;
  color: var(--guild-ink);
  background:
    radial-gradient(
      ellipse at 15% 35%,
      rgb(255 255 255 / 55%),
      transparent 45%
    ),
    var(--guild-paper);
}

.guild-records__texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.15;
  background-image:
    linear-gradient(rgb(128 101 54 / 12%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(128 101 54 / 12%) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

.guild-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: start;
  gap: clamp(40px, 7vw, 100px);
}

/* Introduction */

.guild-intro {
  position: sticky;
  top: 90px;
}

.guild-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--guild-gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
}

.guild-eyebrow__line {
  width: 25px;
  height: 1px;
  background: var(--guild-gold);
}

.guild-intro__chapter {
  margin: 28px 0 12px;
  color: var(--guild-muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.13em;
  line-height: 1.8;
}

.guild-intro__title {
  max-width: 480px;
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(42px, 5vw, 65px);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.08;
}

.guild-intro__title em {
  color: var(--guild-burgundy);
  font-weight: 500;
}

.guild-intro__description {
  max-width: 410px;
  margin-top: 24px;
  color: #766a58;
  font-size: 14px;
  line-height: 2;
}

/* Stats */

.guild-stats {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--guild-border);
}

.guild-stat {
  display: grid;
  gap: 7px;
}

.guild-stat__value {
  color: var(--guild-ink);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 27px;
  font-weight: 600;
  line-height: 1;
}

.guild-stat__label {
  color: var(--guild-muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
}

.guild-stat__divider {
  width: 1px;
  height: 38px;
  background: var(--guild-border);
}

/* Guild seal */

.guild-seal {
  display: flex;
  width: 126px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 42px;
  color: var(--guild-gold-dark);
}

.guild-seal__inner {
  display: grid;
  width: 100px;
  height: 100px;
  place-items: center;
  border: 1px solid var(--guild-gold);
  background: rgb(251 248 241 / 65%);
  box-shadow:
    5px 5px 0 rgb(128 101 54 / 10%),
    inset 0 0 0 5px var(--guild-paper),
    inset 0 0 0 6px rgb(161 132 78 / 35%);
  animation: guild-seal-float 5s ease-in-out infinite;
}

.guild-seal__inner svg {
  width: 62px;
  height: 62px;
}

.guild-seal > span {
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.15em;
}

/* Journal */

.guild-timeline {
  min-width: 0;
}

.guild-timeline__heading {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 11px;
  padding: 12px 15px;
  color: var(--guild-gold-dark);
  border: 1px solid var(--guild-border);
  background: rgb(251 248 241 / 75%);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.guild-timeline__heading-icon {
  font-size: 15px;
}

.guild-timeline__heading-count {
  margin-left: auto;
  color: var(--guild-muted);
  font-size: 8px;
}

/* Entry timeline */

.guild-entry {
  position: relative;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 14px;
  padding-top: 24px;
  animation: guild-entry-appear 650ms both;
  animation-delay: calc(var(--entry-index) * 110ms);
}

.guild-entry__rail {
  position: relative;
  display: flex;
  justify-content: center;
}

.guild-entry__marker {
  position: relative;
  z-index: 2;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  color: var(--guild-gold-dark);
  border: 1px solid var(--guild-gold);
  background: var(--guild-paper-light);
  box-shadow: 2px 2px 0 rgb(128 101 54 / 10%);
}

.guild-entry__marker-number {
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
}

.guild-entry--current .guild-entry__marker {
  border-color: var(--guild-burgundy);
  background: #f2e2d8;
}

.guild-entry__marker-core {
  width: 8px;
  height: 8px;
  background: var(--guild-burgundy);
  box-shadow: 0 0 0 4px rgb(120 63 70 / 12%);
  animation: guild-marker-pulse 2.4s ease-in-out infinite;
}

.guild-entry__connector {
  position: absolute;
  top: 28px;
  bottom: -25px;
  left: 50%;
  border-left: 1px dashed var(--guild-border);
}

/* Entry card */

.guild-entry__card {
  position: relative;
  min-width: 0;
  padding: 22px;
  border: 1px solid var(--guild-border);
  background: rgb(251 248 241 / 90%);
  box-shadow:
    4px 4px 0 rgb(128 101 54 / 8%),
    inset 0 0 0 3px rgb(244 237 223 / 65%);
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 200ms ease;
}

.guild-entry__card:hover {
  border-color: var(--guild-gold);
  box-shadow:
    5px 5px 0 rgb(128 101 54 / 12%),
    inset 0 0 0 3px rgb(244 237 223 / 65%);
  transform: translateY(-2px);
}

.guild-entry--current .guild-entry__card {
  border-color: #c7ad83;
  background: #fcf8ee;
}

.guild-entry__topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.guild-entry__record {
  color: var(--guild-muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.1em;
}

.guild-entry__status,
.guild-entry__completed {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.06em;
}

.guild-entry__status {
  color: var(--guild-burgundy);
}

.guild-entry__status-dot {
  width: 6px;
  height: 6px;
  background: var(--guild-burgundy);
  animation: guild-marker-pulse 2.4s ease-in-out infinite;
}

.guild-entry__completed {
  color: var(--guild-gold-dark);
}

.guild-entry__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-top: 20px;
}

.guild-entry__title-group {
  min-width: 0;
}

.guild-entry__title-group h3 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(22px, 2.5vw, 29px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.guild-entry__company {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  color: var(--guild-burgundy);
  font-size: 12px;
}

.guild-entry__company span {
  color: var(--guild-gold-dark);
}

.guild-entry__period {
  flex-shrink: 0;
  padding: 7px 9px;
  color: var(--guild-muted);
  border: 1px solid var(--guild-border);
  background: #f7f0e3;
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  line-height: 1.5;
}

.guild-entry__divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0 12px;
  color: var(--guild-gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.13em;
}

.guild-entry__divider::after {
  height: 1px;
  flex: 1;
  content: "";
  background: var(--guild-border);
}

.guild-entry__summary {
  margin: 0;
  color: #766a58;
  font-size: 13px;
  line-height: 1.9;
}

.guild-entry__contributions {
  display: grid;
  gap: 10px;
  margin-top: 17px;
  padding: 0;
  list-style: none;
}

.guild-entry__contributions li {
  display: grid;
  grid-template-columns: 13px minmax(0, 1fr);
  gap: 9px;
  color: #766a58;
  font-size: 12px;
  line-height: 1.85;
}

.guild-entry__bullet {
  padding-top: 1px;
  color: var(--guild-gold-dark);
}

.guild-entry__footer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
  padding-top: 14px;
  color: var(--guild-muted);
  border-top: 1px dashed var(--guild-border);
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
  line-height: 1.8;
}

.guild-entry__footer-icon {
  color: var(--guild-gold-dark);
}

.guild-entry__corner {
  position: absolute;
  right: 10px;
  bottom: 7px;
  color: rgb(161 132 78 / 55%);
  font-size: 13px;
}

/* Journal ending */

.guild-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 34px;
  padding-left: 44px;
  text-align: center;
}

.guild-end__symbol {
  color: var(--guild-gold);
  font-size: 19px;
  animation: guild-seal-float 4s ease-in-out infinite;
}

.guild-end > p {
  margin: 11px 0 0;
  color: var(--guild-gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
}

.guild-end__subtext {
  margin-top: 7px;
  color: var(--guild-muted);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 17px;
  font-style: italic;
}

/* Animations */

@keyframes guild-entry-appear {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes guild-seal-float {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

@keyframes guild-marker-pulse {
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

/* Tablet */

@media (max-width: 1023px) {
  .guild-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }

  .guild-intro {
    position: relative;
    top: auto;
    max-width: 680px;
  }

  .guild-seal {
    display: none;
  }

  .guild-intro__title {
    max-width: 580px;
  }
}

/* Mobile */

@media (max-width: 560px) {
  .guild-records {
    padding-block: 72px;
  }

  .guild-layout {
    gap: 34px;
  }

  .guild-intro__title {
    font-size: clamp(40px, 11vw, 54px);
  }

  .guild-intro__description {
    font-size: 13px;
    line-height: 1.9;
  }

  .guild-stats {
    gap: 18px;
  }

  .guild-stat__value {
    font-size: 24px;
  }

  .guild-stat__label {
    font-size: 7px;
  }

  .guild-timeline__heading {
    gap: 8px;
    padding-inline: 10px;
    font-size: 8px;
  }

  .guild-timeline__heading-count {
    font-size: 7px;
  }

  .guild-entry {
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 9px;
    padding-top: 18px;
  }

  .guild-entry__marker {
    width: 22px;
    height: 22px;
  }

  .guild-entry__marker-number {
    font-size: 8px;
  }

  .guild-entry__connector {
    top: 22px;
  }

  .guild-entry__card {
    padding: 17px 14px;
  }

  .guild-entry__heading {
    flex-direction: column;
    gap: 12px;
    margin-top: 17px;
  }

  .guild-entry__title-group h3 {
    font-size: 25px;
  }

  .guild-entry__period {
    font-size: 8px;
  }

  .guild-entry__summary {
    font-size: 12px;
  }

  .guild-entry__contributions li {
    font-size: 11px;
  }

  .guild-entry__status,
  .guild-entry__completed,
  .guild-entry__record {
    font-size: 7px;
  }

  .guild-end {
    padding-left: 29px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .guild-records *,
  .guild-records *::before,
  .guild-records *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
