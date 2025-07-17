<script setup lang="ts">
import { computed } from 'vue'
defineProps<{ title?: string, description: string }>()
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
</script>

<template>
  <section class="my-20">
    <h2 class="text-2xl font-semibold" :class="isDark ? 'text-white' : 'text-default'">
      {{ title }}
    </h2>
  </section>
</template>
