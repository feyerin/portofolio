<script setup lang="ts">
import PageIntro from './components/layout/PageIntro.vue';
import Audio from './components/ui/audio.vue';

useHead({
  meta: [
    { 
      name: 'google-site-verification', 
      content: 'google0931112a09701bf5'
    }
  ]
})
</script>


<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <PageIntro />
  <Audio />
</template>
