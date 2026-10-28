<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue';
import AppNavbar from '~/components/layout/AppNavbar.vue';

</script>


<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main-content"
      class="sr-only z-[100] rounded-md bg-accent p-3 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>

    <AppNavbar />

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
