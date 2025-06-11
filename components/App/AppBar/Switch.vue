<script setup lang="ts">
import { computed } from 'vue'

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
  <v-switch
    aria-label="dark"
    title="dark"
    v-model="isDark"
    color="primary"
    hide-details
    density="compact"
    inset
    false-icon="mdi-white-balance-sunny"
    true-icon="mdi-weather-night"
    class="opacity-80"
  />
</template>
