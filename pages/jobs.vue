<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <JobCreateButtons
          @create-job="showCreateJobModal = true"
          @create-applicant="showCreateApplicantModal = true"
        />
        <JobFilters
          :experience-options="[0.5, 1, 2, 3, 5, 10]"
          :companies="companies"
          @update:experience="selectedExperience = $event"
          @update:company="selectedCompany = $event"
          @update:salaryRange="salaryRange = $event"
          @update:skills="selectedSkills = $event"
          @update:work="selectedWork = $event"
          @update:contract="selectedContract = $event"
        />
      </teleport>
    </client-only>
    <JobTopFilters
      @update:search="search = $event"
      @update:location="selectedLocations = $event"
    />
    <div v-if="pending">
      <v-col cols="12" md="12" lg="12" v-for="n in 6" :key="n">
        <v-skeleton-loader
          type="card"
          class="pa-4 rounded-xl"
          height="200"
          rounded="xl"
        />
      </v-col>
    </div>
    <JobList
      v-else
      :jobs="jobStore.jobs"
      :filtered="jobStore.loaded"
      @apply="openApplyModal"
      @loaded="jobStore.setJobs"
    />
    <v-pagination
      rounded="circle"
      color="primary"
      v-model="currentPage"
      :length="totalPages"
      class="mt-4"
    />
    <!-- Create Job Modal -->
    <CreateJob v-if="loggedIn" v-model="showCreateJobModal" @job-created="refreshJobs" />
    <!-- Create Applicant Modal -->
    <CreateApplicant
      v-if="loggedIn"
      v-model="showCreateApplicantModal"
      :selected-job-id="selectedJobId"
      @applicant-created="onApplicantCreated"
    />
  </v-container>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'default',
  description: 'Job page',
  breadcrumb: 'disabled',
  title: 'Jobs',
  meta: [
    { name: 'description', content: 'Browse and apply for jobs, or create new job listings.' },
    { name: 'keywords', content: 'jobs, employment, careers, job listings' },
  ],
  head: {
    title: 'Jobs',
    meta: [
      { name: 'description', content: 'Browse and apply for jobs, or create new job listings.' },
      { name: 'keywords', content: 'jobs, employment, careers, job listings' },
    ],
  },
  scrollToTop: true,
})

import { ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJobStore } from '~/stores/useJobStore'
const pending = ref(false)
import JobFilters from '~/components/Job/JobFilters.vue'
import JobList from '~/components/Job/JobList.vue'
import JobCreateButtons from '~/components/Job/JobCreateButtons.vue'
import JobTopFilters from '~/components/Job/JobTopFilters.vue'
import CreateJob from '~/components/Job/CreateJob.vue'
import CreateApplicant from '~/components/Job/CreateApplicant.vue'
const canTeleport = ref(false)

const { t } = useI18n()
const jobStore = useJobStore()
const { user, loggedIn } = await useUserSession()
const search = ref('')
const selectedCompany = ref('')
const selectedExperience = ref<number | null>(null)
const salaryRange = ref<number>(5)
const selectedSkills= ref<string[]>([])
const selectedWork = ref<string[]>([])
const selectedContract = ref<string[]>([])
const selectedLocations = ref('')
const currentPage = ref(1)
const limit = ref(5)
const totalPages = ref(1)

const showCreateJobModal = ref(false)
const showCreateApplicantModal = ref(false)
const selectedJobId = ref<string | null>(null)

const companies = ref<any[]>([])
const fetchCompanies = async () => {
  let data

  if (loggedIn.value) {
    data = await $fetch(`/api/job/companies`)
  } else {
    data = await $fetch(`/api/job/public-companies`)
  }

  if (data) companies.value = data
}
watch(!companies.value, () => {
  fetchCompanies()
}, { immediate: true })


onMounted(async () => {
  window.scrollTo({ top: 0 })
  await fetchCompanies
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
// Call API with filters and pagination
const fetchJobs = async () => {
  pending.value = true
  const query = new URLSearchParams()
  if (search.value) query.set('title', search.value)
  if (selectedCompany.value) query.set('company', selectedCompany.value)
  if (selectedExperience.value) query.set('experience', selectedExperience.value.toString())
  if (selectedSkills.value.length) {
    selectedSkills.value.forEach(skill => query.append('skills[]', skill))
  }
  if (selectedWork.value.length)
  {
    selectedWork.value.forEach(work => {
      query.append('works[]', work)
    })
  }
  if (selectedContract.value.length) selectedContract.value.forEach(contract => {
    query.append('contracts[]', contract)
  })
  if (selectedLocations.value.length) query.set('location', selectedLocations.value)
  query.set('salaryMin', (salaryRange.value * 1000).toString())
  query.set('page', currentPage.value.toString())
  query.set('limit', limit.value.toString())

  let data

  if (loggedIn.value) {
    data = await jobStore.fetchJobs(currentPage.value.toString(),limit.value.toString(),search.value,selectedCompany.value,  selectedLocations.value, query)
  } else {
    data = await jobStore.fetchPublicJobs(currentPage.value.toString(),limit.value.toString(),search.value,selectedCompany.value,  selectedLocations.value, query)
  }

  if (data) {
    jobStore.setJobs(data)
    jobStore.setPage(currentPage.value.toString())
    jobStore.setLimit(limit.value.toString())
    jobStore.setLoaded(true)
    totalPages.value = Math.ceil(data.length / limit.value)
    jobStore.setTotal(totalPages)
  }
  pending.value = false
}


watch([
  search,
  selectedCompany,
  selectedExperience,
  salaryRange,
  selectedSkills,
  selectedWork,
  selectedContract,
  selectedLocations,
  currentPage
], fetchJobs, { immediate: true })

// Apply modal
const openApplyModal = (jobId: string) => {
  selectedJobId.value = jobId
  showCreateApplicantModal.value = true
}

// After creation
const refreshJobs = async () => {
  pending.value = true
  await fetchJobs()
  Notify.success(t('job.createdSuccess'))
  pending.value = false
}

const onApplicantCreated = () => {
  Notify.success(t('applicant.createdSuccess'))
  showCreateApplicantModal.value = false
}
</script>
