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

<style scoped src="~/assets/css/skillsSection.css"></style>