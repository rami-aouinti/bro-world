<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useStorage } from '@vueuse/core'

const theme = useTheme()
const primary = useStorage('theme-primary', '#E91E63')

// Couleur primaire (reactive à la sélection)
const color = computed({
  get() {
    return theme.themes.value.light.colors.primary
  },
  set(val: string) {
    primary.value = val
    theme.themes.value.light.colors.primary = val
    theme.themes.value.dark.colors.primary = val
  },
})

// Light/Dark
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: (v: boolean) => theme.global.name.value = v ? 'dark' : 'light',
})

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
    <h3 class="text-h6 font-weight-bold">🎨 Theme Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your app appearance</p>
  </div>

  <!-- Mode: Light / Dark -->
  <v-row align="center" justify="center">
    <v-col cols="6" class="d-flex justify-center">
      <v-btn
        variant="flat"
        :color="!isDark ? 'secondary' : 'grey-lighten-2'"
        class="text-default"
        @click="isDark = false"
        rounded="lg"
        min-width="120"
      >
        ☀ Light
      </v-btn>
    </v-col>
    <v-col cols="6" class="d-flex justify-center">
      <v-btn
        variant="flat"
        :color="isDark ? 'secondary' : 'grey-lighten-2'"
        class="text-default"
        @click="isDark = true"
        rounded="lg"
        min-width="120"
      >
        🌙 Dark
      </v-btn>
    </v-col>
  </v-row>

  <!-- Color Picker -->
  <div class="pa-1 mx-auto">
    <h4 class="text-center text-h6 font-weight-bold">
      Primary Color
    </h4>
    <v-color-picker
      v-model="color"
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
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
