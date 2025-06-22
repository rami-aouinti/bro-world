<template>
  <div class="mb-3">
    <v-form @submit.prevent="submitApplicant">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="applicant.firstName" :label="t('applicant.firstName')" required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="applicant.lastName" :label="t('applicant.lastName')" type="email" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="applicant.contactEmail" :label="t('applicant.contactEmail')" type="email" required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="applicant.phone" :label="t('applicant.phone')"  />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-textarea density="compact" rows="4" rounded="xl" v-model="applicant.description" :label="t('applicant.description')" required auto-grow outlined />
        </v-col>
        <v-col cols="12" md="6">
          <v-file-upload
            clearable
            density="compact"
            title="Upload CV"
            variant="compact"
            rounded="xl"
            v-model="applicant.resume"
            outlined
            accept=".pdf,.doc,.docx,image/*"
            show-size />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn type="submit" color="primary">{{ t('applicant.submit') }}</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['applicant-uploaded'])
const { t } = useI18n()

const applicant = ref({
  firstName: '',
  lastName: '',
  contactEmail: '',
  phone: '',
  description: '',
  resume: null
})

const submitApplicant = async () => {
  const formData = new FormData()
  formData.append('firstName', applicant.value.firstName)
  formData.append('lastName', applicant.value.lastName)
  formData.append('contactEmail', applicant.value.contactEmail)
  formData.append('phone', applicant.value.phone)
  formData.append('description', applicant.value.description)
  if (applicant.value.resume) formData.append('file', applicant.value.resume)

  const { data } = await useFetch('/api/job/applicant', { method: 'POST', body: formData })
  if (!data.value?.id) return

  emit('applicant-uploaded')
}
</script>
