<script setup lang="ts">
definePageMeta({
  title: 'Course',
  description: 'Course page',
  meta: [
    { name: 'description', content: 'Detailed information about the course.' },
    { name: 'keywords', content: 'course, education, learning' }
  ],
  head: {
    title: 'Course',
    meta: [
      { name: 'description', content: 'Detailed information about the course.' },
      { name: 'keywords', content: 'course, education, learning' }
    ]
  },
  breadcrumb: 'disabled',
  middleware: 'auth',
  scrollToTop: true,
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
})
</script>
<template>
  <NuxtPage />
</template>
