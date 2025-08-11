<script setup lang="ts">
import { computed } from 'vue'
import type { UiState } from '@/types/ui/types'

const props = defineProps<{ ui?: UiState }>()
const sides = ['sidebar-left', 'sidebar-right']

/** Initialise ui.vbar si absent (utile au SSR / 1er rendu) */
function ensureVbar() {
  if (!props.ui) return
  // @ts-ignore : on autorise l'initialisation dynamique
  if (!props.ui.vbar) {
    // valeur par défaut raisonnable
    // @ts-ignore
    props.ui.vbar = {
      show: false,
      side: 'sidebar-left',
      widthMm: 0,
      offsetMm: 0,
      color: props.ui.primary ?? '#000000',
    }
  }
}

/** Proxys réactifs pour v-model (safe même si vbar est absent au début) */
const vbarShow = computed<boolean>({
  get: () => props.ui?.vbar?.show ?? false,
  set: (val) => { ensureVbar(); if (props.ui?.vbar) props.ui.vbar.show = val },
})

const vbarSide = computed<'sidebar-left'|'sidebar-right'>({
  get: () => props.ui?.vbar?.side ?? 'sidebar-left',
  set: (val) => { ensureVbar(); if (props.ui?.vbar) props.ui.vbar.side = val },
})

const vbarWidth = computed<number>({
  get: () => props.ui?.vbar?.widthMm ?? 0,
  set: (val) => { ensureVbar(); if (props.ui?.vbar) props.ui.vbar.widthMm = Number.isFinite(val) ? val : 0 },
})

const vbarOffset = computed<number>({
  get: () => props.ui?.vbar?.offsetMm ?? 0,
  set: (val) => { ensureVbar(); if (props.ui?.vbar) props.ui.vbar.offsetMm = Number.isFinite(val) ? val : 0 },
})

const vbarColor = computed<string>({
  get: () => props.ui?.vbar?.color ?? (props.ui?.primary ?? '#000000'),
  set: (val) => { ensureVbar(); if (props.ui?.vbar) props.ui.vbar.color = val },
})
</script>

<template>
  <div class="text-center mb-4">
    <h3 class="text-h6 font-weight-bold">Skill Settings</h3>
    <p class="text-body-2 text-medium-emphasis">Customize your cv skill</p>
  </div>

  <div>
    <div class="d-flex align-center justify-space-between">
      <div class="text-subtitle-2">Vertical bar</div>
      <!-- ✅ plus d’accès direct à props.ui.vbar.show -->
      <v-switch v-model="vbarShow" inset />
    </div>

    <v-select
      v-model="vbarSide"
      :items="sides"
      label="Side"
      density="compact"
      class="mt-2"
    />
    <v-text-field
      v-model.number="vbarWidth"
      type="number"
      label="Width (mm)"
      density="compact"
      class="mt-2"
    />
    <v-text-field
      v-model.number="vbarOffset"
      type="number"
      label="Offset (mm)"
      density="compact"
      class="mt-2"
    />
    <div class="mt-3">
      <div class="text-caption mb-1">Color</div>
      <v-color-picker
        v-model="vbarColor"
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
