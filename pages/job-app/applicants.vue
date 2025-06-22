<template>
  <v-container>
    <v-row class="align-center justify-space-between mb-2">
      <v-col cols="12" sm="12" class="text-sm-end text-start">
        <v-btn color="primary" :to="localePath('/job-app/applicant/create')" prepend-icon="mdi-plus">
          {{ t('applicant.create') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mt-10 mx-6">
      {{ t('applicant.error') }}
    </v-alert>

    <v-row v-if="loading">
      <LoaderApplicants></LoaderApplicants>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="applicant in applicants"
        :key="applicant.id"
        cols="12"
        md="6"
        lg="6"
      >
        <v-card rounded="xl" class="pa-2 mx-3" variant="text">
          <v-row no-gutters>
            <v-col cols="3" class="d-flex justify-center">
              <v-avatar size="48">
                <v-img
                  :src="applicant.user?.profile?.photo || '/default-avatar.png'"
                  alt="Avatar"
                />
              </v-avatar>
            </v-col>

            <v-col cols="9">
              <div class="text-h6 font-weight-bold px-1">
                {{ applicant.firstName }} {{ applicant.lastName }}
              </div>
              <div class="text-body-2 mb-1 px-1">
                📧 <a :href="`mailto:${applicant.contactEmail}`">{{ applicant.contactEmail }}</a>
              </div>
              <div class="text-body-2 mb-1 px-1">
                📞 {{ applicant.phone }}
              </div>
              <div class="text-body-2 mb-1 px-1">
                📎
                <a :href="applicant.resume" target="_blank" rel="noopener" class="text-primary">
                  {{ t('applicant.resume') }}
                </a>
              </div>
              <div class="text-caption mt-1 px-1">
                🕒 {{ $dayjs(applicant.createdAt).format('YYYY-MM-DD HH:mm') }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="!loading && applicants.length === 0" type="info" color="primary" class="mt-10 mx-6">
      {{ t('applicant.empty') }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import LoaderApplicants from "~/components/App/Loader/Job/LoaderApplicants.vue";

definePageMeta({
  title: 'Applicants',
  icon: 'mdi-animation',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
})

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'

const { $dayjs } = useNuxtApp()

const { t } = useI18n()
const localePath = useLocalePath()

const applicants = ref([])
const loading = ref(true)
const error = ref(false)

const fetchApplicants = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/job/application/applicants')
    if (fetchError.value) throw new Error()
    applicants.value = data.value || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}


watch(!applicants.value, () => {
  fetchApplicants()
}, { immediate: true })



onMounted(async () => {
  await fetchApplicants()
})
</script>
