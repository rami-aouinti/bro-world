<script setup lang="ts">
defineProps<{ title?: string, description: string }>()
</script>

<template>
  <section class="my-20">
    <h2 class="text-2xl font-semibold">
      {{ title }}
    </h2>
  </section>
</template>
