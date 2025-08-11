<script setup lang="ts">
const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Georgia', 'Times New Roman']
const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px']

import type { UiState } from '@/types/ui'

const props = defineProps<{
  ui: UiState
}>()


// Swatches
const colors = [
  ['#1697f6', '#ff9800'],
  ['#4CAF50', '#FF5252'],
  ['#9C27b0', '#E91E63'],
  ['#304156', '#3f51b5'],
  ['#002FA7', '#492d22'],
]
</script>

<template>
  <div class="text-center mb-4">
    <h3 class="text-h6 font-weight-bold">Experience Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv experience</p>
  </div>

  <!-- Mode: Light / Dark -->
  <div>
    <div class="d-flex gap-2 align-center">
      <v-select
        class="mx-1"
        v-model="props.ui.fontFamily"
        :items="fonts"
        label="Theme"
        density="compact"
      />
      <v-select
        class="mx-1"
        v-model="props.ui.fontSize"
        :items="fontSizes"
        label="Size"
        density="compact"
      />
    </div>

  <!-- Color Picker -->
  <div class="pa-1 mx-auto">
    <v-color-picker
      v-model="props.ui.accent"
      show-swatches
      elevation="0"
      width="80%"
      mode="rgb"
      :modes="['rgb', 'hex', 'hsl']"
      :swatches="colors"
      hide-inputs
      class="mx-auto"
    />
  </div>
  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
