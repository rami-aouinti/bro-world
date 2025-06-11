<script setup lang="ts">
import { mergeProps, ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useStorage } from '@vueuse/core'

const theme = useTheme()
const primary = useStorage('theme-primary', '#E91E63')

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

const colors = [
  ['#1697f6', '#ff9800'],
  ['#4CAF50', '#FF5252'],
  ['#9C27b0', '#E91E63'],
  ['#304156', '#3f51b5'],
  ['#002FA7', '#492d22'],
]

const menuShow = ref(false)
</script>

<template>
  <v-tooltip text="Open theme palette" location="bottom">
    <template #activator="{ props: tooltip }">
      <v-menu
        v-model="menuShow"
        :close-on-content-click="false"
        location="top right"
        offset="15"
      >
        <template #activator="{ props: menu }">
          <v-btn
            icon="mdi-palette-outline"
            v-bind="mergeProps(menu, tooltip)"
            :rounded="0"
            aria-label="Theme palette"
            title="Theme palette"
          />
        </template>

        <v-card width="320" aria-labelledby="themePaletteLabel">
          <v-card-text class="text-center">
            <label id="themePaletteLabel" class="text-subtitle-1 font-weight-medium mb-3 d-block">
              Theme Palette
            </label>
            <v-color-picker
              v-model="color"
              show-swatches
              elevation="0"
              width="288"
              mode="rgb"
              :modes="['rgb', 'hex', 'hsl']"
              :swatches="colors"
              aria-label="Select primary theme color"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-tooltip>
</template>
