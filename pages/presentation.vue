<template>
  <v-container fluid class="pa-0">
    <SlidePresentation />
  </v-container>
</template>

<script setup>
import SlidePresentation from "~/components/App/SlidePresentation.vue";
definePageMeta({
  layout: 'default',
  description: 'Presentation page',
  title: 'Presentation',
  meta: [
    { name: 'description', content: 'Explore our project presentation and learn more about its features.' },
    { name: 'keywords', content: 'presentation, project, features' },
  ],
  head: {
    title: 'Presentation',
    meta: [
      { name: 'description', content: 'Explore our project presentation and learn more about its features.' },
      { name: 'keywords', content: 'presentation, project, features' },
    ],
  },
  scrollToTop: true,
})
</script>
