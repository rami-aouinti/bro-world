<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CreateApplicant from "~/components/Job/CreateApplicant.vue";

const router = useRouter()
const { t } = useI18n()

const props = defineProps<{
  job: {
    id: string
    title: string
    company?: {
      name?: string
      description?: string
      logo?: string
      siteUrl?: string
    }
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

const selectedJobId = ref<string | null>(null)
const showCreateApplicantModal = ref(false)

const openApplyModal = (jobId: string) => {
  selectedJobId.value = jobId
  showCreateApplicantModal.value = true
}

const onApplicantCreated = () => {
  Notify.success(t('applicant.createdSuccess'))
  showCreateApplicantModal.value = false
}

// 🧠 Expérience formatée
const experienceLabel = computed(() => {
  const raw = props.job.experience
  if (!raw) return null
  const num = parseFloat(raw.toString())
  if (isNaN(num)) return raw
  if (num < 1) return '6 months experience'
  if (num === 1) return '1 year experience'
  return `${Math.floor(num)} years experience`
})

// 🧾 Infos affichées dans la carte
const jobInfos = computed(() => {
  const siteUrl = props.job?.company?.siteUrl
  return [
    { icon: 'mdi-map-marker', value: props.job.workLocation },
    { icon: 'mdi-currency-eur', value: props.job.salaryRange },
    { icon: 'mdi-laptop', value: props.job.workType },
    {
      icon: 'mdi-earth',
      value: siteUrl
        ? {
          text: `${props.job.company?.name}`,
          href: siteUrl
        }
        : null
    },
    { icon: 'mdi-briefcase', value: experienceLabel.value },
    { icon: 'mdi-clock', value: props.job.contractType },
  ]
})

</script>

<template>
  <v-card rounded="xl" variant="text" class="pa-4 mb-4">
    <v-row align="center">
      <!-- Logo entreprise -->
      <v-col cols="2" class="d-flex align-center justify-center">
        <v-avatar class="border-primary border-md rounded-circle" size="56" v-if="job.company?.logo">
          <v-img :src="job.company.logo" alt="Company Logo" />
        </v-avatar>
        <v-avatar class="border-primary border-md rounded-circle" size="56" v-else>
          <v-icon size="32">mdi-domain</v-icon>
        </v-avatar>
      </v-col>

      <!-- Titre + Entreprise -->
      <v-col cols="8">
        <v-card-title
          class="cursor-pointer text-primary text-h6 font-weight-medium pa-0"
          @click="router.push(`/job/${job.id}`)"
        >
          {{ job.title }}
        </v-card-title>
        <div class="text-subtitle-2 text-grey-darken-1">
          {{ job.company?.name }}
        </div>
      </v-col>
      <v-col cols="2" class="text-end">
        <v-btn v-if="!job.applied && !job.owner" variant="tonal" color="primary" size="small" @click="openApplyModal(job.id)">
          {{ t('applicant.submit') }}
        </v-btn>
        <v-btn v-if="job.applied && !job.owner" disabled variant="tonal" color="success" size="small" @click="openApplyModal(job.id)">
          {{ t('applicant.applied') }}
        </v-btn>
        <v-btn icon="mdi-edit" v-if="job.owner" variant="text" color="warning" size="small" @click="openApplyModal(job.id)">
        </v-btn>
        <v-btn icon="mdi-delete" v-if="job.owner"  variant="text" color="primary" size="small" @click="openApplyModal(job.id)">
        </v-btn>
      </v-col>
      <CreateApplicant
        v-model="showCreateApplicantModal"
        :selected-job-id="selectedJobId"
        @applicant-created="onApplicantCreated">
      </CreateApplicant>
    </v-row>

    <!-- Infos supplémentaires -->
    <v-row class="mt-3" dense>
      <v-col
        cols="6"
        md="4"
        v-for="(item, i) in jobInfos"
        :key="i"
        class="text-body-2 d-flex align-center"
      >
        <v-icon size="18" class="mr-1">{{ item.icon }}</v-icon>
        <span v-if="typeof item.value === 'string' || typeof item.value === 'number'">
      {{ item.value }}
    </span>
        <span v-else-if="item.value?.href">
      <a
        :href="item.value.href"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary text-decoration-none"
      >
        {{ item.value.text }}
      </a>
    </span>
      </v-col>
    </v-row>
  </v-card>
</template>
