<script setup lang="ts">
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
    <div class="text-center mb-2">
      <v-switch v-model="props.ui.photo.show" label="Show photo" inset />
    </div>
      <v-row>
      <v-col cols="6">
        <v-select rounded="xl" v-model="props.ui.photo.shape" :items="shapes" label="Shape" density="compact" class="mx-1" />
      </v-col>
      <v-col cols="6">
        <v-select rounded="xl" v-model="props.ui.photo.position" :items="positions" label="Position" density="compact" class="mx-1" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
          rounded="xl"
          v-model.number="props.ui.photo.widthMm"
          type="number"
          label="Width (mm)"
          density="compact"
          class="mx-1"
          :min="0"
          :max="80"
        step="1"
        suffix="mm"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          rounded="xl"
          v-model.number="props.ui.photo.heightMm"
          type="number"
          label="Height (mm)"
          density="compact"
          class="mx-1"
          :min="0"
          :max="70"
          step="1"
          suffix="mm"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
