<script setup lang="ts">
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
    tags: string[]
    skills?: string[]
    languages?: string[]
    description?: string
    requiredSkills?: string
    benefits?: string[]
  }
}>()
const formattedDescription = computed(() =>
  props.job.description?.replace(/\n/g, '<br>') || ''
)

const formattedJob = computed(() =>
  props.job.work?.replace(/\n/g, '<br>') || ''
)

const formattedCompanyDescription = computed(() =>
  props.job.company.description?.replace(/\n/g, '<br>') || ''
)

const formattedBenefits = computed(() =>
  props.job.benefits?.replace(/\n/g, '<br>') || ''
)
const tab = ref('details')
const { t } = useI18n()
</script>

<template>
  <!-- Tabs -->
  <v-card rounded="xl"
          variant="text">
    <v-tabs v-model="tab" bg-color="secondary" align-tabs="center" color="default" slider-color="primary">
      <v-tab value="details">{{ t('job.details') }}</v-tab>
      <v-tab value="requirements">{{ t('job.work') }}</v-tab>
      <v-tab value="company">{{ t('job.companyDetails') }}</v-tab>
      <v-tab value="benefits">{{ t('job.benefits') }}</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mb-6 mx-3 my-3">
      <v-window-item value="details">
        <p v-html="formattedDescription"></p>
      </v-window-item>
      <v-window-item value="requirements">
        <p v-html="formattedJob"></p>
      </v-window-item>
      <v-window-item value="company">
        <p v-html="formattedCompanyDescription"></p>
      </v-window-item>
      <v-window-item value="benefits">
        <p v-html="formattedBenefits"></p>
      </v-window-item>
    </v-window>
  </v-card>
</template>
