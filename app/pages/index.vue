<script setup lang="ts">
import AboutSection from '~/components/homepage/AboutSection.vue';
import ContactSection from '~/components/homepage/ContactSection.vue';
import ExperienceSection from '~/components/homepage/ExperienceSection.vue';
import HeroSection from '~/components/homepage/HeroSection.vue';
import SelectedWork from '~/components/homepage/SelectedWork.vue';
import SkillsSection from '~/components/homepage/SkillsSection.vue';
import AppContainer from '~/components/layout/AppContainer.vue';

</script>


<template>
  <AppContainer>
    <HeroSection />
    <SelectedWork />
    <AboutSection />
    <SkillsSection />
    <ExperienceSection />
    <ContactSection />
  </AppContainer>
</template>
