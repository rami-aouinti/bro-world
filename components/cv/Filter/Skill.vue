<script setup lang="ts">

import type { UiState } from '@/types/ui/types'
const props = defineProps<{ ui: UiState }>()
const sides = ['left','right']
</script>

<template>
  <div class="text-center mb-4">
    <h3 class="text-h6 font-weight-bold">Skill Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv skill</p>
  </div>

  <!-- Mode: Light / Dark -->
  <div>
    <div class="d-flex align-center justify-space-between">
      <div class="text-subtitle-2">Vertical bar</div>
      <v-switch v-model="props.ui.vbar.show" inset />
    </div>

    <v-select v-model="props.ui.vbar.side" :items="sides" label="Side" density="compact" class="mt-2" />
    <v-text-field v-model.number="props.ui.vbar.widthMm" type="number" label="Width (mm)" density="compact" class="mt-2" />
    <v-text-field v-model.number="props.ui.vbar.offsetMm" type="number" label="Offset (mm)" density="compact" class="mt-2" />
    <div class="mt-3">
      <div class="text-caption mb-1">Color</div>
      <v-color-picker v-model="props.ui.vbar.color" hide-inputs mode="hex" elevation="0" width="100%"/>
    </div>
  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
