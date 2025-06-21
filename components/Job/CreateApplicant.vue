<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="900px">
    <v-card>
      <v-card-title>{{ t('applicant.create') }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitApplicant">
          <v-row class="align-center mb-4">
            <v-col cols="4">
              <v-select
                v-model="form.applicantId"
                :items="applicants"
                :item-title="getFileName"
                item-value="id"
                label="Applicant"
                density="compact"
                rounded="xl"
                style="margin-top: 17px"
              />
            </v-col>
            <v-col cols="1" class="text-center">
              <div class="text-subtitle-1 font-weight-medium">OR</div>
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" variant="outlined" block @click="toggleUploadApplicant">
                Upload Resume
              </v-btn>
            </v-col>
            <v-col cols="1" class="text-center">
              <div class="text-subtitle-1 font-weight-medium">OR</div>
            </v-col>
            <v-col cols="3">
              <v-btn color="primary" variant="outlined" block @click="toggleCreateApplicant">
                {{ t('applicant.create') }}
              </v-btn>
            </v-col>
          </v-row>
          <CreateResume :selectedJobId="props.selectedJobId" v-if="showCreateApplicant" @applicant-created="onApplicantCreated" />
          <UploadResume :selectedJobId="props.selectedJobId" v-if="showUploadApplicant" @applicant-uploaded="onApplicantUploaded" />
        </v-form>
      </v-card-text>
      <v-card-actions v-if="!showCreateApplicant && !showUploadApplicant">
        <v-btn text @click="emit('update:modelValue', false)">{{ t('buttons.cancel') }}</v-btn>
        <v-btn color="primary" @click="submitApplicant">{{ t('applicant.submit') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CreateCompany from "~/components/Job/CreateCompany.vue";
import CreateResume from "~/components/Job/CreateResume.vue";
import UploadResume from "~/components/Job/UploadResume.vue";

const props = defineProps<{
  modelValue: boolean
  selectedJobId: string | null
}>()

const emit = defineEmits(['update:modelValue', 'applicant-created'])
const getFileName = (applicant: any) => {
  return applicant.resume
    ? applicant.resume.split('/').pop()
    : `${applicant.name ?? 'Unknown'} (no resume)`
}
const { t } = useI18n()

const form = ref({
  applicantId: '',
  name: '',
  contactEmail: '',
  jobPreferences: ''
})

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



const applicants = ref<any[]>([])
const fetchApplicants = async () => {
  const { data } = await useFetch('/api/job/applicants')
  if (data.value) applicants.value = data.value
}
const onApplicantCreated = () => {
  fetchApplicants()
  showCreateApplicant.value = false
  emit('applicant-created')
  emit('update:modelValue', false)
}

const onApplicantUploaded= () => {
  fetchApplicants()
  showUploadApplicant.value = false
  emit('applicant-created')
  emit('update:modelValue', false)
}



watch(!applicants.value, () => {
  fetchApplicants()
}, { immediate: true })

onMounted(fetchApplicants)

const submitApplicant = async () => {
  const { data } = await useFetch('/api/job/applicant', {
    method: 'POST',
    body: form.value
  })
  if (!data.value?.id) return

  await useFetch(`/api/job/application/${props.selectedJobId}/${data.value.id}`, {
    method: 'POST'
  })

  emit('applicant-created')
  emit('update:modelValue', false)
}
</script>
