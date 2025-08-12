<script setup lang="ts">
import { computed, watch } from 'vue'
import type { UiState } from '@/types/ui/types'

const props = defineProps<{ ui?: UiState }>()

function ensureSkills(){
  if (!props.ui) return
  // @ts-ignore
  if (!props.ui.skills) props.ui.skills = {}
  const s: any = props.ui.skills
  s.chipVariant   ??= 'text'
  s.chipColor     ??= props.ui.accent ?? '#b88b6a'
  s.chipDensity   ??= 'compact'
  s.editable      ??= true
  s.draggable     ??= true
  // ➕ nouveaux réglages
  s.columns       ??= 2
  s.groupLine     ??= 'underline'     // 'underline' | 'none'
  s.groupLineWidth??= 100             // %
  s.groupLineStyle??= 'solid'         // 'solid' | 'dashed' | 'dotted'
  s.groupLineColor??= props.ui.accent ?? '#b88b6a'
}
function ensureLanguages(){
  if (!props.ui) return
  // @ts-ignore
  if (!props.ui.languages) props.ui.languages = {}
  const l: any = props.ui.languages
  l.variant   ??= 'stars'
  l.maxLevel  ??= 5
  l.sizePx    ??= 18
  l.accent    ??= props.ui.accent ?? '#b88b6a'
  l.editable  ??= true
  l.draggable ??= true
}
ensureSkills()
ensureLanguages()

/* === Proxys SKILLS === */
const chipVariants = ['text','outlined','elevated','flat','tonal','plain'] as const
const chipDensities = ['compact','comfortable','default'] as const
const lineStyles   = ['solid','dashed','dotted'] as const

const skillColumns = computed<1|2>({
  get: () => (props.ui?.skills?.columns ?? 2) as 1|2,
  set: v => { ensureSkills(); if (props.ui?.skills) (props.ui.skills as any).columns = v }
})
const skillGroupLine = computed<'underline'|'none'>({
  get: () => (props.ui?.skills?.groupLine ?? 'underline') as any,
  set: v => { ensureSkills(); if (props.ui?.skills) (props.ui.skills as any).groupLine = v }
})
const skillGroupLineWidth = computed<number>({
  get: () => props.ui?.skills?.groupLineWidth ?? 100,
  set: v => { ensureSkills(); if (props.ui?.skills) (props.ui.skills as any).groupLineWidth = v }
})
const skillGroupLineStyle = computed({
  get: () => props.ui?.skills?.groupLineStyle ?? 'solid',
  set: v => { ensureSkills(); if (props.ui?.skills) (props.ui.skills as any).groupLineStyle = v as any }
})
const skillGroupLineColor = computed<string>({
  get: () => props.ui?.skills?.groupLineColor ?? (props.ui?.accent ?? '#b88b6a'),
  set: v => { ensureSkills(); if (props.ui?.skills) (props.ui.skills as any).groupLineColor = v }
})

const skillChipVariant = computed<string>({
  get: () => props.ui?.skills?.chipVariant ?? 'text',
  set: v => { ensureSkills(); if (props.ui?.skills) props.ui.skills.chipVariant = v as any }
})
const skillChipColor = computed<string>({
  get: () => props.ui?.skills?.chipColor ?? (props.ui?.accent ?? '#b88b6a'),
  set: v => { ensureSkills(); if (props.ui?.skills) props.ui.skills.chipColor = v }
})
const skillChipDensity = computed<string>({
  get: () => props.ui?.skills?.chipDensity ?? 'compact',
  set: v => { ensureSkills(); if (props.ui?.skills) props.ui.skills.chipDensity = v as any }
})
const skillEditable = computed<boolean>({
  get: () => props.ui?.skills?.editable ?? true,
  set: v => { ensureSkills(); if (props.ui?.skills) props.ui.skills.editable = v }
})
const skillDraggable = computed<boolean>({
  get: () => props.ui?.skills?.draggable ?? true,
  set: v => { ensureSkills(); if (props.ui?.skills) props.ui.skills.draggable = v }
})

/* === Proxys LANGUAGES (inchangé) === */
const langVariants = ['stars','bars','dots'] as const
const langVariant = computed<string>({
  get: () => props.ui?.languages?.variant ?? 'stars',
  set: v => { ensureLanguages(); if (props.ui?.languages) props.ui.languages.variant = v as any }
})
const langMaxLevel = computed<number>({
  get: () => props.ui?.languages?.maxLevel ?? 5,
  set: v => { ensureLanguages(); if (props.ui?.languages) props.ui.languages.maxLevel = Math.max(1, Math.min(10, Number(v)||1)) }
})
const langSizePx = computed<number>({
  get: () => props.ui?.languages?.sizePx ?? 18,
  set: v => { ensureLanguages(); if (props.ui?.languages) props.ui.languages.sizePx = Math.max(8, Math.min(32, Number(v)||8)) }
})
const langAccent = computed<string>({
  get: () => props.ui?.languages?.accent ?? (props.ui?.accent ?? '#b88b6a'),
  set: v => { ensureLanguages(); if (props.ui?.languages) props.ui.languages.accent = v }
})
const langEditable = computed<boolean>({
  get: () => props.ui?.languages?.editable ?? true,
  set: v => { ensureLanguages(); if (props.ui?.languages) props.ui.languages.editable = v }
})
const langDraggable = computed<boolean>({
  get: () => props.ui?.languages?.draggable ?? true,
  set: v => { ensureLanguages(); if (props.ui?.languages) props.ui.languages.draggable = v }
})

/* Preview */
const previewChips = ['Vue.js','Nuxt','TypeScript']
const previewLangs = [
  { name: 'English', level: 4 },
  { name: 'Deutsch', level: 5 },
  { name: 'Français', level: 3 },
]

watch(() => props.ui?.languages?.maxLevel, v => { if (v!=null) langMaxLevel.value = v })
watch(() => props.ui?.languages?.sizePx,   v => { if (v!=null) langSizePx.value   = v })
</script>

<template>
  <div class="pa-3">
    <div class="text-center mb-4">
      <h3 class="text-h6 font-weight-bold">Skills & Languages Settings</h3>
      <p class="text-body-2 text-medium-emphasis">Ajuste l’affichage des compétences et des langues.</p>
    </div>

    <v-row>
      <!-- SKILLS -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="pa-4">
          <div class="text-subtitle-1 font-weight-700 mb-1">Skills</div>
          <div class="text-caption text-medium-emphasis mb-4">Layout, ligne et chips</div>

          <!-- Colonnes -->
          <div class="mb-3">
            <div class="text-subtitle-2 mb-1">Colonnes</div>
            <v-btn-toggle v-model="skillColumns" mandatory divided density="comfortable">
              <v-btn :value="1">1</v-btn>
              <v-btn :value="2">2</v-btn>
            </v-btn-toggle>
          </div>

          <!-- Ligne sous le label -->
          <div class="mb-2 d-flex align-center justify-space-between">
            <div class="text-subtitle-2">Ligne sous le label de groupe</div>
            <v-switch v-model="(skillGroupLine as any)" true-value="underline" false-value="none" inset />
          </div>

          <div class="mt-2" v-if="skillGroupLine === 'underline'">
            <v-select
              v-model="(skillGroupLineStyle as any)"
              :items="(['solid','dashed','dotted'] as any)"
              label="Style de ligne"
              density="compact"
              class="mb-3"
            />
            <v-slider
              v-model="skillGroupLineWidth"
              min="0" max="100" step="1"
              label="Largeur (%)"
              thumb-label
              class="mb-3"
            />
            <div>
              <div class="text-caption mb-1">Couleur de ligne</div>
              <v-color-picker v-model="skillGroupLineColor" hide-inputs mode="hex" elevation="0" width="100%" />
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Chips -->
          <div class="text-subtitle-2 mb-2">Chips</div>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="skillChipVariant"
                :items="chipVariants"
                label="Chip variant"
                density="compact"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="skillChipDensity"
                :items="chipDensities"
                label="Chip density"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <div class="text-caption mb-1">Chip color</div>
              <v-color-picker v-model="skillChipColor" hide-inputs mode="hex" elevation="0" width="100%" />
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="text-caption">Editable</div>
              <v-switch v-model="skillEditable" inset />
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="text-caption">Draggable</div>
              <v-switch v-model="skillDraggable" inset />
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          <div class="text-caption text-medium-emphasis mb-2">Aperçu</div>
          <div class="d-flex flex-wrap">
            <v-chip
              v-for="(c,i) in previewChips"
              :key="i"
              class="ma-1"
              :variant="skillChipVariant"
              :color="skillChipColor"
              :density="skillChipDensity"
            >
              {{ c }}
            </v-chip>
          </div>
        </v-card>
      </v-col>

      <!-- LANGUAGES (inchangé) -->
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="0" class="pa-4">
          <div class="text-subtitle-1 font-weight-700 mb-1">Languages</div>
          <div class="text-caption text-medium-emphasis mb-4">Type d’indicateur et options</div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select v-model="langVariant" :items="langVariants" label="Variant" density="compact" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="langMaxLevel" type="number" label="Max level" density="compact" hint="1 à 10" persistent-hint />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="langSizePx" type="number" label="Size (px)" density="compact" hint="8 à 32" persistent-hint />
            </v-col>
            <v-col cols="12">
              <div class="text-caption mb-1">Accent color</div>
              <v-color-picker v-model="langAccent" hide-inputs mode="hex" elevation="0" width="100%" />
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="text-caption">Editable</div>
              <v-switch v-model="langEditable" inset />
            </v-col>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="text-caption">Draggable</div>
              <v-switch v-model="langDraggable" inset />
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          <div class="text-caption text-medium-emphasis mb-2">Aperçu</div>
          <div class="lang-preview">
            <div v-for="(l,i) in previewLangs" :key="i" class="lang-row">
              <div class="lang-name">{{ l.name }}</div>

              <div v-if="langVariant === 'stars'" class="lang-meter">
                <svg v-for="n in langMaxLevel" :key="n" viewBox="0 0 24 24" class="star" :style="{ width: langSizePx + 'px', height: langSizePx + 'px' }" :class="{ on: n <= l.level }">
                  <path d="M12 2.5 14.9 9l7.1.6-5.4 4.4 1.8 6.9L12 17.7 5.6 20.9l1.8-6.9-5.4-4.4L9.1 9 12 2.5Z"/>
                </svg>
              </div>

              <div v-else-if="langVariant === 'bars'" class="lang-meter bars">
                <span v-for="n in langMaxLevel" :key="n" class="bar" :class="{ on: n <= l.level }" :style="{ height: langSizePx + 'px' }" />
              </div>

              <div v-else class="lang-meter dots">
                <span v-for="n in langMaxLevel" :key="n" class="dot" :class="{ on: n <= l.level }" :style="{ width: langSizePx + 'px', height: langSizePx + 'px' }" />
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.lang-preview { display: grid; gap: 10px; }
.lang-row { display: grid; grid-template-columns: 120px 1fr; align-items: center; gap: 10px; }
.lang-name { font-weight: 700; }
.lang-meter { display: flex; gap: 6px; align-items: center; }

/* Stars */
.star { fill: #d2d2d2; }
.star.on { fill: v-bind(langAccent); }

/* Bars */
.bars .bar { width: 10px; background: #d2d2d2; border-radius: 4px; display: inline-block; }
.bars .bar.on { background: v-bind(langAccent); }

/* Dots */
.dots .dot { display: inline-block; border-radius: 50%; background: #d2d2d2; }
.dots .dot.on { background: v-bind(langAccent); }
</style>
