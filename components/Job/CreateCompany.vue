<template>
  <div class="mb-3">
    <v-form @submit.prevent="submitCompany">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="company.name" :label="t('company.name')" required />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="company.siteUrl" :label="t('company.siteUrl')" type="url" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea density="compact" rounded="xl" v-model="company.description" :label="t('company.description')" required auto-grow outlined />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="company.location" :label="t('company.location')" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field density="compact" rounded="xl" v-model="company.contactEmail" :label="t('company.contactEmail')" type="email" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-file-upload clearable
                         density="compact"
                         title="Upload Logo"
                         variant="compact" v-model="company.logo" outlined accept="image/*" show-size />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn type="submit" color="secondary" block class="mt-2">{{ t('company.create') }}</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['company-created'])
const { t } = useI18n()
const panel = ref([0])

const company = ref({
  name: '',
  description: '',
  logo: null,
  siteUrl: '',
  location: '',
  contactEmail: ''
})

const submitCompany = async () => {
  const formData = new FormData()
  formData.append('name', company.value.name)
  formData.append('description', company.value.description)
  formData.append('location', company.value.location)
  formData.append('contactEmail', company.value.contactEmail)
  formData.append('siteUrl', company.value.siteUrl)
  if (company.value.logo) formData.append('file', company.value.logo)

  await useFetch('/api/job/company', { method: 'POST', body: formData })
  emit('company-created')
}
</script>
