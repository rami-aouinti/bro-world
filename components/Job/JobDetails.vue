<template>
  <v-container class="py-4">
    <Header :job="props.job" />

    <v-expand-transition>
      <div v-if="expanded">
        <Skills :job="props.job" />
        <Content :job="props.job" />
      </div>
    </v-expand-transition>

    <v-row justify="center">
      <v-btn
        class="mt-4"
        color="primary"
        variant="text"
        prepend-icon="mdi-chevron-down"
        @click="expanded = !expanded"
      >
        {{ expanded ? t('buttons.less') : t('buttons.more') }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Skills from "~/components/Job/Details/Skills.vue";
import Content from "~/components/Job/Details/Content.vue";
import Header from "~/components/Job/Details/Header.vue";

const props = defineProps<{
  job: {
    title: string
    company?: { name?: string; description?: string }
    workLocation: string
    salaryRange?: string | number
    workType?: string
    work?: string
    domain?: string
    experience?: string | number
    contractType?: string
    requirements: [],
    skills?: string[]
    languages?: any[]
    description?: string
    requiredSkills?: string
    benefits?: string[]
  }
}>()

const { t } = useI18n()
const expanded = ref(false)
</script>
