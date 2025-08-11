<script setup lang="ts">
import { computed } from 'vue'

type DateLineCfg = {
  enabled?: boolean
  color?: string
  widthPx?: number
  style?: 'solid'|'dashed'|'dotted'
  marginBottomPx?: number
  fullWidth?: boolean
  lineLengthPx?: number | undefined
}
type EducationUi = {
  variant?: 'two-col'|'stacked'
  dateLine?: DateLineCfg
}

const DEFAULTS: Required<EducationUi> = {
  variant: 'two-col',
  dateLine: {
    enabled: true,
    color: undefined,
    widthPx: 3,
    style: 'solid',
    marginBottomPx: 0,
    fullWidth: false,
    lineLengthPx: undefined,
  }
}

const props = defineProps<{ ui: any }>()

function ensureEdu() {
  if (!props.ui.education) props.ui.education = { ...DEFAULTS }
  if (!props.ui.education.dateLine) props.ui.education.dateLine = { ...DEFAULTS.dateLine }
}
function patchEdu(patch: Partial<EducationUi>) {
  ensureEdu()
  props.ui.education = { ...props.ui.education, ...patch }
}
function patchDateLine(patch: Partial<DateLineCfg>) {
  ensureEdu()
  props.ui.education.dateLine = { ...DEFAULTS.dateLine, ...props.ui.education.dateLine, ...patch }
}

const variant = computed({
  get: () => (props.ui.education?.variant ?? DEFAULTS.variant),
  set: (v: 'two-col'|'stacked') => patchEdu({ variant: v })
})

const dlEnabled = computed({
  get: () => (props.ui.education?.dateLine?.enabled ?? DEFAULTS.dateLine.enabled),
  set: v => patchDateLine({ enabled: v })
})
const dlColor = computed({
  get: () => (props.ui.education?.dateLine?.color ?? DEFAULTS.dateLine.color),
  set: v => patchDateLine({ color: v })
})
const dlWidth = computed({
  get: () => (props.ui.education?.dateLine?.widthPx ?? DEFAULTS.dateLine.widthPx),
  set: v => patchDateLine({ widthPx: Number(v) })
})
const dlStyle = computed({
  get: () => (props.ui.education?.dateLine?.style ?? DEFAULTS.dateLine.style),
  set: v => patchDateLine({ style: v as any })
})
const dlMargin = computed({
  get: () => (props.ui.education?.dateLine?.marginBottomPx ?? DEFAULTS.dateLine.marginBottomPx),
  set: v => patchDateLine({ marginBottomPx: Number(v) })
})
const dlFullWidth = computed({
  get: () => (props.ui.education?.dateLine?.fullWidth ?? DEFAULTS.dateLine.fullWidth),
  set: v => patchDateLine({ fullWidth: v })
})
const dlLenSlider = computed({
  get: () => (props.ui.education?.dateLine?.lineLengthPx ?? 0),
  set: (n: number) => patchDateLine({ lineLengthPx: n > 0 ? Number(n) : undefined })
})

function resetAll() {
  patchEdu({ ...DEFAULTS })
}
</script>

<template>
  <div>
    <div class="text-center mb-4">
      <h3 class="text-h6 font-weight-bold">Education Settings</h3>
      <p class="text-body-2 text-medium-emphasis">Variante & style de la ligne sous la période</p>
    </div>

    <v-select
      :items="['two-col','stacked']"
      v-model="variant"
      label="Disposition"
      density="compact"
      class="mb-4"
    />

    <v-card variant="tonal" class="pa-3 mb-4" rounded="xl">
      <div class="d-flex align-center justify-space-between">
        <div class="text-subtitle-2">Ligne sous la période</div>
        <v-switch v-model="dlEnabled" inset />
      </div>

      <div class="d-flex flex-wrap gap-3">
        <v-text-field
          v-model.number="dlWidth"
          type="number"
          min="1" max="12" step="1"
          label="Épaisseur (px)"
          density="compact"
          class="mt-2"
          style="max-width: 180px"
        />
        <v-select
          :items="['solid','dashed','dotted']"
          v-model="dlStyle"
          label="Style"
          density="compact"
          class="mt-2"
          style="max-width: 200px"
        />
        <v-text-field
          v-model.number="dlMargin"
          type="number"
          min="0" max="32" step="1"
          label="Marge dessous (px)"
          density="compact"
          class="mt-2"
          style="max-width: 200px"
        />
      </div>

      <div class="mt-4">
        <div class="text-caption mb-1">Couleur</div>
        <v-color-picker
          v-model="dlColor"
          hide-inputs
          mode="hex"
          elevation="0"
          width="100%"
        />
        <div class="text-caption mt-1">Laisse vide pour utiliser l’accent du thème.</div>
      </div>

      <div class="d-flex align-center justify-space-between mt-4">
        <div class="text-subtitle-2">Pleine largeur</div>
        <v-switch v-model="dlFullWidth" inset />
      </div>

      <div class="mt-4">
        <div class="d-flex align-center justify-space-between">
          <div class="text-subtitle-2">Longueur fixe</div>
          <div class="text-caption">0 = auto (suivant texte / pleine largeur)</div>
        </div>
        <v-slider
          v-model="dlLenSlider"
          :min="0" :max="240" :step="5"
          thumb-label
          class="mt-2"
        />
      </div>
    </v-card>

    <div class="d-flex justify-end">
      <v-btn size="small" variant="outlined" @click="resetAll">Reset</v-btn>
    </div>
  </div>
</template>

<style scoped>
.gap-3 { gap: 12px; }
</style>
