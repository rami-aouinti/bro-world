<script setup lang="ts">
import type { UiState, UiCornerType, UiCornerAnchor } from '@/types/ui/types'
const props = defineProps<{ ui: UiState }>()

const types: UiCornerType[] = ['quarter','diagonal','notch','ribbon','dual-slope']
const anchors: UiCornerAnchor[] = ['top-left','top-right','bottom-left','bottom-right']
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
    <h3 class="text-h6 font-weight-bold">Corner Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv corner</p>
  </div>

  <!-- Mode: Light / Dark -->
  <div>
    <div class="d-flex align-center justify-center mx-6">
      <p>Enable</p>
      <v-spacer></v-spacer>
      <v-switch v-model="props.ui.corner.enabled" inset></v-switch>
    </div>

    <div class="d-flex align-center gap-2 mx-6">
      <v-text-field v-model.number="props.ui.corner.sizeMm" type="number" label="Size (mm)" density="compact" class="mx-1" />
      <v-select v-model="props.ui.corner.type" :items="types" label="Type" density="compact" class="mx-1" />
      <v-select v-model="props.ui.corner.anchor" :items="anchors" label="Anchor" density="compact" class="mx-1" />
    </div>

    <div class="d-flex align-center justify-center">
      <div class="mx-1">
        <div class="text-caption mb-1">Primary color (quarter/diagonal)</div>
        <v-color-picker v-model="props.ui.corner.color" hide-inputs mode="hex" elevation="0" width="100%"/>

      </div
      ><div class="mx-1">
      <div class="text-caption mb-1">Secondary color (ribbon/dual-slope)</div>
      <v-color-picker v-model="props.ui.corner.color2" hide-inputs mode="hex" elevation="0" width="100%"/>

    </div>
    </div>

  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
