<template>
  <v-container>
    <v-row class="align-center justify-space-between mb-2">
      <v-col cols="12" sm="12" class="text-sm-end text-start">
        <v-btn color="primary" :to="localePath('/job-app/job/create')" prepend-icon="mdi-plus">
          {{ t('job.create') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mt-10 mx-6">
      {{ t('job.error') }}
    </v-alert>

    <v-row v-if="loading">
      <LoaderRequest></LoaderRequest>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="job in jobs"
        :key="job.id"
        cols="12"
      >
        <v-card rounded="xl" variant="text" class="pa-4 mb-2">
          <Header :job="job" />
          <v-card-text>
            <Skills :job="job" />
            <v-expand-transition>
              <div v-if="showApplications[job.id]">
                <v-divider class="my-4" />
                <h4 class="text-subtitle-1 font-weight-bold mb-2">{{ t('job.applications') }}</h4>
                <v-list class="bg-transparent" elevation="0">
                  <v-list-item
                    v-for="application in job.applications"
                    :key="application.id"
                  >
                    <v-list-item-content>
                      <v-card rounded="xl" variant="text" class="pa-4 mb-4">
                        <v-row align="center" justify="center">
                          <v-col cols="12" md="4">
                            <div class="text-h6 font-weight-bold px-3">
                              {{ application.applicant.firstName }} {{ application.applicant.lastName }}
                            </div>
                          </v-col>

                          <v-col cols="12" md="4" class="d-flex flex-column align-center">
                            <h4 class="text-subtitle-2 font-weight-bold mb-2">Check</h4>
                            <v-progress-linear color="primary" model-value="50" :height="12" style="width: 100%"></v-progress-linear>
                          </v-col>

                          <v-col cols="12" md="4" class="d-flex justify-center align-center gap-2">
                            <v-btn variant="text" icon :href="application.applicant?.resume" target="_blank" download>
                              <v-icon color="primary">mdi-file-pdf-box</v-icon>
                            </v-btn>

                            <v-btn variant="text" icon @click="selectedApplicant = application.applicant; showApplicantDialog = true">
                              <v-icon color="secondary">mdi-eye</v-icon>
                            </v-btn>

                            <v-btn v-if="application.status !== 'Progress'" :disabled="loadingProgress" :loading="loadingProgress" variant="text" icon @click="updateStatus('progress', application.id)">
                              <v-icon color="warning">mdi-account-convert</v-icon>
                            </v-btn>
                            <v-btn v-if="application.status === 'Progress'" disabled variant="text" icon>
                              <v-icon color="warning">mdi-account-convert</v-icon>
                            </v-btn>
                            <v-btn v-if="application.status !== 'Accept'" :disabled="loadingAccept" :loading="loadingAccept" variant="text" icon @click="updateStatus('accept', application.id)">
                              <v-icon color="success">mdi-account-check</v-icon>
                            </v-btn>
                            <v-btn v-if="application.status === 'Accept'" disabled variant="text" icon>
                              <v-icon color="success">mdi-account-check</v-icon>
                            </v-btn>
                            <v-btn v-if="application.status !== 'Declined'" :disabled="loadingDeclined" :loading="loadingDeclined" variant="text" icon @click="updateStatus('declined', application.id)">
                              <v-icon color="error">mdi-account-remove</v-icon>
                            </v-btn>
                            <v-btn v-if="application.status === 'Declined'" disabled variant="text" icon>
                              <v-icon color="error">mdi-account-remove</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-expand-transition>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn @click="toggleApplications(job.id)" color="secondary" variant="text">
              {{ showApplications[job.id] ? t('job.hideApplications') : t('job.viewApplications') }}
            </v-btn>
            <v-btn :to="localePath(`/job/${job.id}`)" color="primary" variant="text">
              {{ t('job.view') }}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="showApplicantDialog" max-width="600px">
          <v-card>
            <v-card-title>
              {{ selectedApplicant?.firstName }} {{ selectedApplicant?.lastName }}
            </v-card-title>
            <v-card-text>
              <div class="text-body-2 mb-1 px-1">
                📧 <a :href="`mailto:${selectedApplicant.contactEmail}`">{{ selectedApplicant.contactEmail }}</a>
              </div>
              <div class="text-body-2 mb-1 px-1">
                📞 {{ selectedApplicant.phone }}
              </div>
              <div class="text-body-2 mb-1 px-1">
                📎
                <a :href="selectedApplicant.resume" target="_blank" rel="noopener" class="text-primary">
                  {{ t('applicant.resume') }}
                </a>
              </div>
              <div class="text-caption mt-1 px-1">
                🕒 {{ $dayjs(selectedApplicant.createdAt).format('YYYY-MM-DD HH:mm') }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="showApplicantDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>

    <v-alert v-if="!loading && jobs.length === 0" type="info" color="primary" class="mt-10 mx-6">
      {{ t('job.empty') }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">

import LoaderRequest from "~/components/App/Loader/Job/LoaderRequest.vue";

definePageMeta({
  title: 'Applications',
  icon: 'mdi-animation',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
})
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import { useRouter } from 'vue-router'
import Skills from "~/components/Job/Details/Skills.vue";
import Header from "~/components/Job/Details/Header.vue";

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const jobs = ref([])
const showApplications = ref<Record<string, boolean>>({})
const loading = ref(true)
const error = ref(false)
const { $dayjs } = useNuxtApp()

const loadingAccept = ref(false)
const loadingProgress = ref(false)
const loadingDeclined = ref(false)


const toggleApplications = (jobId: string) => {
  showApplications.value[jobId] = !showApplications.value[jobId]
}

const fetchApplications = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/job/application/applications')
    if (fetchError.value) throw new Error()
    jobs.value = data.value.data || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const selectedApplicant = ref(null)
const showApplicantDialog = ref(false)

const updateStatus = async (status: 'progress' | 'accept' | 'declined', id: string) => {
  if (status === 'progress') {
    loadingProgress.value = true
  } else if (status === 'accept') {
    loadingAccept.value = true
  } else if (status === 'declined') {
    loadingDeclined.value = true
  }
  try {
    await useFetch(`/api/job/application/status/${status}/${id}`, { method: 'POST' })
    Notify.success(`Status updated to ${status}`)
  } catch (e) {
    Notify.error('Failed to update status')
  }
  finally {
    if (status === 'progress') {
      loadingProgress.value = false
    } else if (status === 'accept') {
      loadingAccept.value = false
    } else if (status === 'declined') {
      loadingDeclined.value = false
    }
    await fetchApplications()
  }
}

watch(!jobs.value, () => {
  fetchApplications()
}, { immediate: true })
onMounted(async () => {
  await fetchApplications()
})
</script>
