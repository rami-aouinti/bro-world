<script setup lang="ts">
const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Georgia', 'Times New Roman']
const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px']

import type { UiState } from '@/types/ui/types'
const props = defineProps<{ ui: UiState }>()
const sides = ['left','right']

</script>

<template>
  <div class="text-center mb-4">
    <h3 class="text-h6 font-weight-bold">Sidbar Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv sidbar</p>
  </div>

  <!-- Mode: Light / Dark -->
  <div>
    <div class="d-flex align-center justify-space-between">
      <div class="text-subtitle-2">Enable sidebar</div>
      <v-switch v-model="props.ui.sidebar.enabled" inset />
    </div>

    <v-select v-model="props.ui.sidebar.side" :items="sides" label="Side" density="compact" class="mt-2" />

    <div class="mt-4">
      <div class="text-caption mb-1">Background</div>
      <v-color-picker v-model="props.ui.sidebar.background" hide-inputs mode="hex" elevation="0" width="100%"/>
    </div>

    <div class="mt-4">
      <div class="text-caption mb-1">Text color</div>
      <v-color-picker v-model="props.ui.sidebar.text" hide-inputs mode="hex" elevation="0" width="100%"/>
    </div>

    <div class="mt-4">
      <div class="text-caption mb-1">Border color</div>
      <v-color-picker v-model="props.ui.sidebar.borderColor" hide-inputs mode="hex" elevation="0" width="100%"/>
    </div>
  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
