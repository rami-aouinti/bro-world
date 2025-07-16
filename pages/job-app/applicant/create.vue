<template>
  <v-card class="mb-4 pa-3"
          rounded="xl"
          variant="text">
    <v-card-text>
      <v-row class="align-center mb-4">
        <v-col cols="5">
              <v-btn color="primary" variant="outlined" block @click="toggleUploadApplicant">
                Upload Resume
              </v-btn>
            </v-col>
        <v-col cols="2" class="text-center">
              <div class="text-subtitle-1 font-weight-medium">OR</div>
            </v-col>
        <v-col cols="5">
              <v-btn color="primary" variant="outlined" block @click="toggleCreateApplicant">
                {{ t('applicant.create') }}
              </v-btn>
            </v-col>
      </v-row>
      <CreateResume v-if="showCreateApplicant" @applicant-created="onApplicantCreated" />
      <UploadResume v-if="showUploadApplicant" @applicant-uploaded="onApplicantUploaded" />
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CreateResume from "~/components/Job/Applicant/CreateResume.vue";
import UploadResume from "~/components/Job/Applicant/UploadResume.vue";

import { useRouter } from 'vue-router'
const router = useRouter()
const { t } = useI18n()

const showCreateApplicant = ref(false)

const toggleCreateApplicant = () => {
  showCreateApplicant.value = !showCreateApplicant.value
  showUploadApplicant.value = false
}

const showUploadApplicant = ref(false)
const toggleUploadApplicant = () => {
  showCreateApplicant.value = false
  showUploadApplicant.value = !showUploadApplicant.value
}

const onApplicantCreated = () => {
  Notify.success('Applicant created successfully')
  router.push('/job-app/applicants')
}

const onApplicantUploaded= () => {
  Notify.success('Applicant uploaded successfully')
  router.push('/job-app/applicants')
}
</script>
