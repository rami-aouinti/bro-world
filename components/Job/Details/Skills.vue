<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Social from "~/components/Auth/Social.vue";

const { t } = useI18n()

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
    requirements: string[]
    skills?: string[]
    languages?: { name: string; level: string }[]
    description?: string
    requiredSkills?: string[]
    benefits?: string[]
  }
}>()

// Table de correspondance langue → drapeau CSS class (flag-icon-css)
const languageFlags = {
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

// Langues formatées
const displayLanguages = computed(() =>
  (props.job.languages || []).map(lang => ({
    name: lang.name,
    level: lang.level,
    icon: languageFlags[lang.name] || ''
  }))
)
</script>

<template>
  <v-row>
    <!-- Stack / Requirements -->
    <v-col cols="12" md="4">
      <v-sheet
        class="v-sheet--offset mx-auto mb-2"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="xl"
        color="secondary"
      >
        <div>
          <div class="text-h7 font-weight-bold d-flex justify-center">
            {{ t('job.techStack')}}
          </div>
        </div>
      </v-sheet>
      <v-card
        rounded="xl"
        variant="text"
        class="pa-2 mb-2"
        style="height: 120px"
      >
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
    <v-col cols="12" md="4">
      <v-sheet
        class="v-sheet--offset mx-auto mb-2"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="xl"
        color="secondary"
      >
        <div>
          <div class="text-h7 font-weight-bold d-flex justify-center">
            {{ t('job.skills') }}
          </div>
        </div>
      </v-sheet>
      <v-card
        rounded="xl"
        variant="text"
        class="pa-2 mb-2"
        style="height: 120px"
      >
        <v-chip-group column>
          <v-chip
            v-for="skill in job.requiredSkills || []"
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
    <v-col cols="12" md="4">
      <v-sheet
        class="v-sheet--offset mx-auto mb-2"
        elevation="12"
        max-width="calc(100% - 32px)"
        rounded="xl"
        color="secondary"
      >
        <div>
          <div class="text-h7 font-weight-bold d-flex justify-center">
            {{ t('job.languages') }}
          </div>
        </div>
      </v-sheet>
      <v-card
        rounded="xl"
        variant="text"
        class="pa-2 mb-2"
        style="height: 120px"
      >
        <div class="mt-2 d-flex flex-column gap-2">
          <div
            v-for="(lang, i) in displayLanguages"
            :key="i"
            class="d-flex align-center gap-2 mb-2"
          >
            <span
              v-if="lang.icon"
              :class="`fi ${lang.icon}`"
              style="font-size: 20px"
            />
            <span class="text-body-2 px-2">
              {{ lang.name }}
              <span class="text-caption text-grey">({{ lang.level }})</span>
            </span>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
