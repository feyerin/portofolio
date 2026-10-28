<script setup lang="ts">
import AboutSection from '~/components/homepage/AboutSection.vue';
import ContactSection from '~/components/homepage/ContactSection.vue';
import ExperienceSection from '~/components/homepage/ExperienceSection.vue';
import HeroSection from '~/components/homepage/HeroSection.vue';
import SelectedWork from '~/components/homepage/SelectedWork.vue';
import SkillsSection from '~/components/homepage/SkillsSection.vue';
import AppContainer from '~/components/layout/AppContainer.vue';


useSeoMeta({
  title: "Frontend Developer & Creative Engineer",
  description:
    "Explore selected projects, technical experiments, and digital experiences built by Postman.",

  ogTitle: "Postman — Frontend Developer",
  ogDescription:
    "Building thoughtful digital experiences with modern frontend technologies.",
  ogType: "website",
  ogImage: "/og-image.svg",
  ogImageAlt: "Aditia Nugraha — Frontend Developer",

  twitterCard: "summary_large_image",
  twitterTitle: "Postman — Frontend Developer",
  twitterDescription:
    "Building thoughtful digital experiences with modern frontend technologies.",
  twitterImage: "/og-image.svg",
});


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
