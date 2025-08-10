<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type LangItem = { name?: string; level?: string } | string

const props = defineProps<{
  job: {
    title: string
    company?: { name?: string; description?: string }
    workLocation: string
    salaryRange?: string | number
    workType?: string
    domain?: string
    experience?: string | number
    contractType?: string
    requirements?: string[]
    skills?: string[]
    languages?: LangItem[] | Record<string, LangItem> | string | null
    description?: string
    requiredSkills?: string[]
    benefits?: string[]
  }
}>()

// Table de correspondance langue → drapeau CSS class
const languageFlags: Record<string, string> = {
  English: 'fi-gb gb',
  Français: 'fi-fr fr',
  French: 'fi-fr fr',
  Deutsch: 'fi-de de',
  German: 'fi-de de',
  العربية: 'fi-tn tn',
  Arabic: 'fi-tn tn',
  Español: 'fi-es es',
  Spanish: 'fi-es es',
}

// Langues formatées (robuste aux formats null/objet/JSON/array)
const displayLanguages = computed(() => {
  const raw = props?.job?.languages
  if (!raw) return []

  let arr: any = raw

  if (typeof arr === 'string') {
    try {
      arr = JSON.parse(arr)
    } catch {
      return []
    }
  }

  if (!Array.isArray(arr)) {
    if (typeof arr === 'object') {
      arr = Object.values(arr)
    } else {
      return []
    }
  }

  return arr
    .filter(Boolean)
    .map((lang: any) => {
      const name = typeof lang === 'string' ? lang : (lang?.name ?? '')
      const level = typeof lang === 'string' ? null : (lang?.level ?? null)
      return {
        name,
        level,
        icon: languageFlags[name] ?? ''
      }
    })
})

// Présence des sections
const hasRequirements = computed(() => Array.isArray(props.job?.requirements) && props.job.requirements.length > 0)
const hasSkills = computed(() => {
  const s = props.job?.requiredSkills ?? props.job?.skills
  return Array.isArray(s) && s.length > 0
})
const hasLanguages = computed(() => displayLanguages.value.length > 0)

// Nombre de sections visibles et largeur dynamique
const visibleSectionsCount = computed(() => {
  let c = 0
  if (hasRequirements.value) c++
  if (hasSkills.value) c++
  if (hasLanguages.value) c++
  return c
})

const mdCols = computed(() => {
  const c = visibleSectionsCount.value
  if (c <= 0) return 12
  return Math.floor(12 / c) // 3→4, 2→6, 1→12
})
</script>

<template>
  <v-row>
    <!-- Stack / Requirements -->
    <v-col v-if="hasRequirements" cols="12" :md="mdCols">
      <v-sheet
        class="mx-auto mb-2"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="xl"
        color="secondary"
      >
        <div class="text-h7 font-weight-bold d-flex justify-center">
          {{ t('job.techStack') }}
        </div>
      </v-sheet>

      <v-card rounded="xl" variant="text" class="pa-2 mb-2" style="height: 120px">
        <v-chip-group column>
          <v-chip
            v-for="tech in job.requirements || []"
            :key="tech"
            class="ma-1"
            color="primary"
            variant="outlined"
          >
            {{ tech }}
          </v-chip>
        </v-chip-group>
      </v-card>
    </v-col>

    <!-- Skills -->
    <v-col v-if="hasSkills" cols="12" :md="mdCols">
      <v-sheet
        class="mx-auto mb-2"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="xl"
        color="secondary"
      >
        <div class="text-h7 font-weight-bold d-flex justify-center">
          {{ t('job.skills') }}
        </div>
      </v-sheet>

      <v-card rounded="xl" variant="text" class="pa-2 mb-2" style="height: 120px">
        <v-chip-group column>
          <v-chip
            v-for="skill in (job.requiredSkills || job.skills || [])"
            :key="skill"
            class="ma-1"
            color="secondary"
            variant="outlined"
          >
            {{ skill }}
          </v-chip>
        </v-chip-group>
      </v-card>
    </v-col>

    <!-- Languages -->
    <v-col v-if="hasLanguages" cols="12" :md="mdCols">
      <v-sheet
        class="mx-auto mb-2"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="xl"
        color="secondary"
      >
        <div class="text-h7 font-weight-bold d-flex justify-center">
          {{ t('job.languages') }}
        </div>
      </v-sheet>

      <v-card rounded="xl" variant="text" class="pa-2 mb-2" style="height: 120px">
        <div class="mt-2 d-flex flex-column gap-2">
          <div
            v-for="(lang, i) in displayLanguages"
            :key="`${lang.name}-${i}`"
            class="d-flex align-center gap-2 mb-2"
          >
            <span v-if="lang.icon" :class="`fi ${lang.icon}`" style="font-size: 20px" />
            <span class="text-body-2 px-2">
              {{ lang.name }}
              <span v-if="lang.level" class="text-caption text-grey">({{ lang.level }})</span>
            </span>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
