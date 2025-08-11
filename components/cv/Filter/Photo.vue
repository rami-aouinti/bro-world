<script setup lang="ts">
const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Georgia', 'Times New Roman']
const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px']

import type { UiState } from '@/types/ui/types'

const props = defineProps<{
  ui: UiState
}>()

const shapes = ['square','circle']
const positions = ['left','right','top']
</script>

<template>
  <div class="text-center mb-4">
    <h3 class="text-h6 font-weight-bold">Photo Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv photo</p>
  </div>

  <!-- Mode: Light / Dark -->
  <div>
    <v-switch v-model="props.ui.photo.show" label="Show photo" inset />

    <div class="d-flex gap-2 mt-2">
      <v-select v-model="props.ui.photo.shape" :items="shapes" label="Shape" density="compact" class="flex-1" />
      <v-select v-model="props.ui.photo.position" :items="positions" label="Position" density="compact" class="flex-1" />
    </div>

    <div class="d-flex gap-2 mt-2">
      <v-text-field v-model.number="props.ui.photo.widthMm"  type="number" label="Width (mm)"  density="compact" class="flex-1" />
      <v-text-field v-model.number="props.ui.photo.heightMm" type="number" label="Height (mm)" density="compact" class="flex-1" />
    </div>
  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
