<script setup lang="ts">
import { computed } from 'vue'
import type { UiState } from '@/types/ui/types'

const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Georgia', 'Times New Roman']
const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px']

// ui est optionnel pour éviter tout accès direct en SSR
const props = defineProps<{ ui?: UiState }>()
const sides = ['left','right']

/** Assure l’existence de ui.sidebar avant toute écriture */
function ensureSidebar() {
  if (!props.ui) return
  // @ts-ignore — on initialise dynamiquement si absent
  if (!props.ui.sidebar) {
    // @ts-ignore
    props.ui.sidebar = {
      enabled: false,
      side: 'left',
      widthMm: 70,
      background: '#f7f8fa',
      text: 'inherit',
      borderColor: '#e6e8ec',
    }
  }
}

/** Proxys pour v-model (safe même si sidebar est absente au 1er render) */
const sbEnabled = computed<boolean>({
  get: () => props.ui?.sidebar?.enabled ?? false,
  set: (v) => { ensureSidebar(); if (props.ui?.sidebar) props.ui.sidebar.enabled = v },
})

const sbSide = computed<'left'|'right'>({
  get: () => props.ui?.sidebar?.side ?? 'left',
  set: (v) => { ensureSidebar(); if (props.ui?.sidebar) props.ui.sidebar.side = v },
})

const sbBackground = computed<string>({
  get: () => props.ui?.sidebar?.background ?? '#f7f8fa',
  set: (v) => { ensureSidebar(); if (props.ui?.sidebar) props.ui.sidebar.background = v },
})

const sbText = computed<string>({
  get: () => props.ui?.sidebar?.text ?? 'inherit',
  set: (v) => { ensureSidebar(); if (props.ui?.sidebar) props.ui.sidebar.text = v },
})

const sbBorderColor = computed<string>({
  get: () => props.ui?.sidebar?.borderColor ?? '#e6e8ec',
  set: (v) => { ensureSidebar(); if (props.ui?.sidebar) props.ui.sidebar.borderColor = v },
})
</script>

<template>
  <div class="text-center mb-4">
    <h3 class="text-h6 font-weight-bold">Sidbar Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv sidbar</p>
  </div>

  <div>
    <div class="d-flex align-center justify-space-between">
      <div class="text-subtitle-2">Enable sidebar</div>
      <!-- ✅ plus d’accès direct à props.ui.sidebar.enabled -->
      <v-switch v-model="sbEnabled" inset />
    </div>

    <v-select
      v-model="sbSide"
      :items="sides"
      label="Side"
      density="compact"
      class="mt-2"
    />

    <div class="mt-4">
      <div class="text-caption mb-1">Background</div>
      <v-color-picker
        v-model="sbBackground"
        hide-inputs
        mode="hex"
        elevation="0"
        width="100%"
      />
    </div>

    <div class="mt-4">
      <div class="text-caption mb-1">Text color</div>
      <v-color-picker
        v-model="sbText"
        hide-inputs
        mode="hex"
        elevation="0"
        width="100%"
      />
    </div>

    <div class="mt-4">
      <div class="text-caption mb-1">Border color</div>
      <v-color-picker
        v-model="sbBorderColor"
        hide-inputs
        mode="hex"
        elevation="0"
        width="100%"
      />
    </div>
  </div>
</template>

<style scoped>
.v-color-picker {
  border-radius: 12px;
}
</style>
