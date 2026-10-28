
<script setup lang="ts">
import { computed, ref } from "vue"
import SkillRootSeal from "~/components/icons/SkillRootSeal.vue"
import { skillTree, type Skill } from "~/data/skillTree"

const selectedSkill = ref<Skill>(skillTree[0]!.skills[0]!)

const totalSkills = computed(() =>
  skillTree.reduce((total, branch) => total + branch.skills.length, 0),
)

function selectSkill(skill: Skill) {
  selectedSkill.value = skill
}
</script>

<template>
  <section id="skills" class="skill-realm">
    <div class="skill-realm__texture" aria-hidden="true" />

    <div class="skill-realm__inner">
      <header class="skill-heading">
        <div class="skill-heading__eyebrow">
          <span />
          CHARACTER DEVELOPMENT
          <span />
        </div>

        <p class="skill-heading__chapter">
          CHAPTER III · THE ART OF MASTERY
        </p>

        <h2 class="skill-heading__title">
          The <em>skill tree.</em>
        </h2>

        <p class="skill-heading__description">
          Every great adventurer masters a craft.
          Explore the abilities gathered throughout my journey.
        </p>
      </header>

      <!-- Character root -->
      <div class="skill-root">
        <div class="skill-root__seal">
          <SkillRootSeal />
        </div>

        <div class="skill-root__copy">
          <span class="skill-root__label">PLAYER CLASS</span>
          <h3>Frontend Mage</h3>
          <p>Builder of digital worlds</p>
        </div>

        <div class="skill-root__level">
          <span>LV.</span>
          <strong>06+</strong>
        </div>
      </div>

      <!-- Branch connector -->
      <div class="skill-trunk" aria-hidden="true">
        <span class="skill-trunk__stem" />
        <span class="skill-trunk__horizontal" />
        <span class="skill-trunk__drop skill-trunk__drop--left" />
        <span class="skill-trunk__drop skill-trunk__drop--middle" />
        <span class="skill-trunk__drop skill-trunk__drop--right" />
      </div>

      <!-- Skill branches -->
      <div class="skill-branches">
        <article
          v-for="(branch, branchIndex) in skillTree"
          :key="branch.id"
          class="skill-branch"
          :style="{ '--branch-index': branchIndex }"
        >
          <header class="skill-branch__heading">
            <div class="skill-branch__emblem">
              {{ branch.emblem }}
            </div>

            <div class="skill-branch__heading-copy">
              <span>BRANCH {{ branch.number }}</span>
              <h3>{{ branch.title }}</h3>
              <p>{{ branch.subtitle }}</p>
            </div>

            <span class="skill-branch__count">
              {{ String(branch.skills.length).padStart(2, "0") }}
            </span>
          </header>

          <div class="skill-nodes">
            <button
              v-for="(skill, skillIndex) in branch.skills"
              :key="skill.id"
              type="button"
              class="skill-node"
              :class="{
                'skill-node--selected': selectedSkill.id === skill.id,
              }"
              :style="{ '--node-index': skillIndex }"
              :aria-pressed="selectedSkill.id === skill.id"
              @click="selectSkill(skill)"
            >
              <span class="skill-node__connector" aria-hidden="true" />

              <span class="skill-node__icon" aria-hidden="true">
                {{ skill.symbol }}
              </span>

              <span class="skill-node__copy">
                <span class="skill-node__name">{{ skill.name }}</span>
                <span class="skill-node__type">{{ skill.type }}</span>
              </span>

              <span class="skill-node__rune" aria-hidden="true">
                {{ selectedSkill.id === skill.id ? "✦" : "◇" }}
              </span>
            </button>
          </div>
        </article>
      </div>

      <!-- Selected skill details -->
      <Transition name="skill-inspect" mode="out-in">
        <section
          :key="selectedSkill.id"
          class="skill-detail"
          aria-live="polite"
        >
          <aside class="skill-detail__side">
            <span class="skill-detail__side-label">INSPECTING SKILL</span>

            <div class="skill-detail__seal">
              {{ selectedSkill.symbol }}
            </div>

            <span class="skill-detail__type">
              {{ selectedSkill.type }}
            </span>
          </aside>

          <div class="skill-detail__main">
            <div class="skill-detail__heading">
              <div>
                <span class="skill-detail__overline">
                  ADVENTURER'S KNOWLEDGE
                </span>
                <h3>{{ selectedSkill.name }}</h3>
              </div>

              <span class="skill-detail__star" aria-hidden="true">✧</span>
            </div>

            <p class="skill-detail__description">
              {{ selectedSkill.description }}
            </p>

            <div class="skill-detail__divider">
              <span>CRAFT & KNOWLEDGE</span>
            </div>

            <div class="skill-detail__tags">
              <span
                v-for="technology in selectedSkill.technologies"
                :key="technology"
              >
                {{ technology }}
              </span>
            </div>
          </div>
        </section>
      </Transition>

      <footer class="skill-footer">
        <span class="skill-footer__ornament">✧</span>
        <p>
          <strong>{{ String(totalSkills).padStart(2, "0") }}</strong>
          ABILITIES RECORDED IN THE GRIMOIRE
        </p>
        <span class="skill-footer__quote">
          A craft is never truly mastered.
        </span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.skill-realm {
  --paper: #f4eddf;
  --paper-light: #fbf8f1;
  --ink: #40382d;
  --muted: #8d806b;
  --gold: #a1844e;
  --gold-dark: #806536;
  --burgundy: #783f46;
  --border: #d7c8ac;

  position: relative;
  overflow: hidden;
  padding: 112px 0 96px;
  color: var(--ink);
  background:
    radial-gradient(ellipse at 50% 25%, rgb(255 255 255 / 65%), transparent 62%),
    var(--paper);
}

.skill-realm__texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.17;
  background-image:
    linear-gradient(rgb(128 101 54 / 13%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(128 101 54 / 13%) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
}

.skill-realm__inner {
  position: relative;
  z-index: 1;
  width: min(100% - 48px, 1160px);
  margin-inline: auto;
}

/* Heading */

.skill-heading {
  max-width: 650px;
  margin: 0 auto 52px;
  text-align: center;
}

.skill-heading__eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.19em;
}

.skill-heading__eyebrow > span {
  width: 35px;
  height: 1px;
  background: var(--gold);
}

.skill-heading__chapter {
  margin: 26px 0 10px;
  color: var(--muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
}

.skill-heading__title {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(48px, 7vw, 78px);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.skill-heading__title em {
  color: var(--burgundy);
  font-weight: 500;
}

.skill-heading__description {
  max-width: 440px;
  margin: 18px auto 0;
  color: #766a58;
  font-size: 14px;
  line-height: 1.9;
}

/* Root */

.skill-root {
  position: relative;
  display: flex;
  width: fit-content;
  min-width: 320px;
  align-items: center;
  gap: 18px;
  margin: 0 auto;
  padding: 17px 24px;
  border: 1px solid var(--gold);
  background: var(--paper-light);
  box-shadow:
    5px 5px 0 rgb(128 101 54 / 13%),
    inset 0 0 0 4px var(--paper-light),
    inset 0 0 0 5px rgb(161 132 78 / 30%);
}

.skill-root::before,
.skill-root::after {
  position: absolute;
  width: 7px;
  height: 7px;
  content: "";
  background: var(--gold);
}

.skill-root::before {
  top: -3px;
  left: -3px;
}

.skill-root::after {
  right: -3px;
  bottom: -3px;
}

.skill-root__seal {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  color: var(--gold-dark);
  border: 1px solid var(--border);
  background: #f5edda;
}

.skill-root__seal svg {
  width: 36px;
  height: 36px;
}

.skill-root__label,
.skill-root__level > span {
  color: var(--muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.13em;
}

.skill-root__copy h3 {
  margin: 3px 0 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.1;
}

.skill-root__copy p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.skill-root__level {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  padding-left: 17px;
  border-left: 1px solid var(--border);
}

.skill-root__level strong {
  color: var(--burgundy);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 25px;
}

/* Connectors */

.skill-trunk {
  position: relative;
  width: 66.666%;
  height: 68px;
  margin: 0 auto;
}

.skill-trunk__stem {
  position: absolute;
  top: 0;
  left: 50%;
  height: 25px;
  border-left: 1px solid var(--gold);
}

.skill-trunk__horizontal {
  position: absolute;
  top: 25px;
  right: 0;
  left: 0;
  border-top: 1px solid var(--gold);
}

.skill-trunk__drop {
  position: absolute;
  top: 25px;
  height: 43px;
  border-left: 1px solid var(--gold);
}

.skill-trunk__drop::after {
  position: absolute;
  bottom: -2px;
  left: -3px;
  width: 5px;
  height: 5px;
  content: "";
  background: var(--gold);
}

.skill-trunk__drop--left {
  left: 0;
}

.skill-trunk__drop--middle {
  left: 50%;
}

.skill-trunk__drop--right {
  right: 0;
}

/* Branch cards */

.skill-branches {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  align-items: start;
}

.skill-branch {
  min-width: 0;
  animation: branch-appear 650ms both;
  animation-delay: calc(var(--branch-index) * 130ms);
}

.skill-branch__heading {
  position: relative;
  display: flex;
  min-height: 88px;
  align-items: center;
  gap: 12px;
  padding: 15px 12px;
  border: 1px solid var(--border);
  background: rgb(251 248 241 / 88%);
  box-shadow: 3px 3px 0 rgb(128 101 54 / 8%);
}

.skill-branch__emblem {
  display: grid;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  place-items: center;
  color: var(--gold-dark);
  border: 1px solid var(--border);
  background: #f4ead5;
  font-size: 19px;
}

.skill-branch__heading-copy {
  min-width: 0;
}

.skill-branch__heading-copy > span {
  color: var(--gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.12em;
}

.skill-branch__heading-copy h3 {
  margin: 4px 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(16px, 1.8vw, 21px);
  font-weight: 600;
  line-height: 1.1;
}

.skill-branch__heading-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
}

.skill-branch__count {
  align-self: flex-start;
  margin-left: auto;
  color: #b6a78c;
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
}

/* Nodes */

.skill-nodes {
  position: relative;
  display: grid;
  gap: 9px;
  padding: 16px 0 0 13px;
}

.skill-nodes::before {
  position: absolute;
  top: 0;
  bottom: 22px;
  left: 0;
  content: "";
  border-left: 1px solid var(--border);
}

.skill-node {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 65px;
  align-items: center;
  gap: 11px;
  padding: 10px;
  color: var(--ink);
  text-align: left;
  border: 1px solid #dfd3be;
  background: rgb(251 248 241 / 85%);
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
  animation: node-appear 450ms both;
  animation-delay: calc(var(--node-index) * 65ms + 180ms);
}

.skill-node:hover,
.skill-node:focus-visible {
  z-index: 2;
  border-color: var(--gold);
  background: #fffdf7;
  box-shadow: 3px 3px 0 rgb(128 101 54 / 12%);
  transform: translateX(3px);
}

.skill-node:focus-visible {
  outline: 2px solid var(--burgundy);
  outline-offset: 3px;
}

.skill-node--selected {
  border-color: var(--gold-dark);
  background: #f3e8d0;
  box-shadow:
    inset 3px 0 0 var(--gold-dark),
    3px 3px 0 rgb(128 101 54 / 10%);
}

.skill-node__connector {
  position: absolute;
  top: 50%;
  left: -14px;
  width: 14px;
  border-top: 1px solid var(--border);
}

.skill-node__icon {
  display: grid;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  place-items: center;
  color: var(--gold-dark);
  border: 1px solid #cbbb9d;
  background: #f8f0df;
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  font-weight: 600;
  transition:
    color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.skill-node--selected .skill-node__icon {
  color: #fff8e8;
  border-color: var(--gold-dark);
  background: var(--gold-dark);
  box-shadow: 0 0 0 3px rgb(161 132 78 / 12%);
}

.skill-node__copy {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.skill-node__name {
  overflow-wrap: anywhere;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
}

.skill-node__type {
  color: var(--muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.025em;
  line-height: 1.5;
}

.skill-node__rune {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--gold);
  font-size: 13px;
}

/* Inspector */

.skill-detail {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  margin-top: 52px;
  border: 1px solid var(--gold);
  background: var(--paper-light);
  box-shadow:
    6px 6px 0 rgb(128 101 54 / 10%),
    inset 0 0 0 4px var(--paper-light),
    inset 0 0 0 5px rgb(161 132 78 / 18%);
}

.skill-detail__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 18px;
  border-right: 1px solid var(--border);
  background: #f1e7d4;
  text-align: center;
}

.skill-detail__side-label,
.skill-detail__type,
.skill-detail__overline {
  color: var(--gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  line-height: 1.7;
}

.skill-detail__seal {
  display: grid;
  width: 65px;
  height: 65px;
  margin: 20px 0;
  place-items: center;
  color: var(--burgundy);
  border: 1px solid var(--gold);
  background: var(--paper-light);
  box-shadow:
    4px 4px 0 rgb(128 101 54 / 12%),
    inset 0 0 0 4px var(--paper-light),
    inset 0 0 0 5px var(--border);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 24px;
  font-weight: 600;
}

.skill-detail__main {
  min-width: 0;
  padding: 28px 32px;
}

.skill-detail__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.skill-detail__heading h3 {
  margin: 5px 0 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 34px;
  font-weight: 600;
  line-height: 1.1;
}

.skill-detail__star {
  color: var(--gold);
  font-size: 25px;
}

.skill-detail__description {
  margin: 17px 0 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.8;
}

.skill-detail__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 13px;
  color: var(--gold-dark);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.skill-detail__divider::after {
  height: 1px;
  flex: 1;
  content: "";
  background: var(--border);
}

.skill-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-detail__tags span {
  padding: 7px 10px;
  color: #675238;
  border: 1px solid #ded0b5;
  background: #f6efdf;
  font-size: 11px;
}

/* Footer */

.skill-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 46px;
  text-align: center;
}

.skill-footer__ornament {
  color: var(--gold);
  font-size: 21px;
  animation: rune-glow 3s ease-in-out infinite;
}

.skill-footer > p {
  margin: 12px 0 0;
  color: var(--muted);
  font-family: "IBM Plex Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
}

.skill-footer > p strong {
  color: var(--burgundy);
}

.skill-footer__quote {
  margin-top: 9px;
  color: #8c7c65;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 17px;
  font-style: italic;
}

/* Motion */

@keyframes branch-appear {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes node-appear {
  from {
    opacity: 0;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rune-glow {
  0%, 100% {
    opacity: 0.65;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}

.skill-inspect-enter-active,
.skill-inspect-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.skill-inspect-enter-from {
  opacity: 0;
  transform: translateY(7px);
}

.skill-inspect-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Tablet */

@media (max-width: 900px) {
  .skill-realm {
    padding-block: 84px;
  }

  .skill-realm__inner {
    width: min(100% - 36px, 720px);
  }

  .skill-trunk {
    width: 78%;
  }

  .skill-branches {
    grid-template-columns: 1fr;
    gap: 26px;
  }

  .skill-branch__heading {
    min-height: 76px;
    padding-inline: 18px;
  }

  .skill-branch__heading-copy h3 {
    font-size: 23px;
  }

  .skill-nodes {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 14px 0 0;
  }

  .skill-nodes::before,
  .skill-node__connector {
    display: none;
  }
}

/* Mobile */

@media (max-width: 560px) {
  .skill-realm {
    padding-block: 70px;
  }

  .skill-realm__inner {
    width: calc(100% - 32px);
  }

  .skill-heading {
    margin-bottom: 38px;
  }

  .skill-heading__eyebrow {
    gap: 8px;
    font-size: 8px;
  }

  .skill-heading__eyebrow > span {
    width: 20px;
  }

  .skill-heading__description {
    max-width: 320px;
    font-size: 13px;
  }

  .skill-root {
    min-width: 0;
    width: 100%;
    max-width: 340px;
    gap: 12px;
    padding: 16px 13px;
  }

  .skill-root__seal {
    width: 41px;
    height: 41px;
  }

  .skill-root__seal svg {
    width: 31px;
    height: 31px;
  }

  .skill-root__copy h3 {
    font-size: 23px;
  }

  .skill-root__level {
    margin-left: auto;
    padding-left: 10px;
  }

  .skill-trunk {
    width: 1px;
    height: 30px;
    margin-left: 50%;
    border-left: 1px solid var(--gold);
  }

  .skill-trunk__stem,
  .skill-trunk__horizontal,
  .skill-trunk__drop {
    display: none;
  }

  .skill-branches {
    gap: 25px;
  }

  .skill-branch__heading {
    padding: 13px 11px;
  }

  .skill-branch__heading-copy h3 {
    font-size: 20px;
  }

  .skill-nodes {
    grid-template-columns: 1fr;
    gap: 8px;
    padding-top: 10px;
  }

  .skill-node {
    min-height: 62px;
    padding: 9px 12px;
  }

  .skill-node__icon {
    width: 36px;
    height: 36px;
  }

  .skill-node__name {
    font-size: 13px;
  }

  .skill-detail {
    grid-template-columns: 1fr;
    margin-top: 30px;
  }

  .skill-detail__side {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 13px 17px;
    border-right: 0;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }

  .skill-detail__seal {
    width: 38px;
    height: 38px;
    margin: 0;
    font-size: 16px;
  }

  .skill-detail__side-label {
    margin-right: auto;
    font-size: 8px;
  }

  .skill-detail__type {
    max-width: 115px;
    text-align: right;
    font-size: 8px;
  }

  .skill-detail__main {
    padding: 22px 18px;
  }

  .skill-detail__heading h3 {
    font-size: 30px;
  }

  .skill-detail__description {
    font-size: 13px;
  }

  .skill-footer > p {
    font-size: 8px;
    letter-spacing: 0.06em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-realm *,
  .skill-realm *::before,
  .skill-realm *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
