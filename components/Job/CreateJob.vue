<template>
  <v-dialog :model-value="modelValue" max-width="900px" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>{{ t('job.create') }}</v-card-title>
      <v-card-text>
        <v-stepper v-model="step" elevation="0">
          <v-stepper-header>
            <v-stepper-item :value="1" :title="t('company.title')" />
            <v-stepper-item :value="2" :title="t('job.details')" />
            <v-stepper-item :value="3" :title="t('job.requirements')" />
            <v-stepper-item :value="4" :title="t('job.additional')" />
            <v-stepper-item :value="5" :title="t('job.others')" />
          </v-stepper-header>

          <v-stepper-window>
            <!-- Step 1 - Company -->
            <v-stepper-window-item :value="1">
              <v-row class="align-center mb-4">
                <v-col cols="5">
                  <v-select
                    v-model="jobForm.companyId"
                    :items="companies"
                    item-title="name"
                    item-value="id"
                    :label="t('job.company')"
                    density="compact"
                    rounded="xl"
                    style="margin-top: 17px"
                  />
                </v-col>
                <v-col cols="2" class="text-center">
                  <div class="text-subtitle-1 font-weight-medium">OR</div>
                </v-col>
                <v-col cols="5">
                  <v-btn color="primary" variant="outlined" block @click="toggleCreateCompany">
                    {{ t('company.create') }}
                  </v-btn>
                </v-col>
              </v-row>
              <CreateCompany v-if="showCreateCompany" @company-created="onCompanyCreated" />
              <v-row class="d-flex align-center text-center mt-4 mb-2 mx-2">
                <v-btn color="primary" :disabled="!jobForm.companyId" @click="nextStep" class="mt-4">{{ t('buttons.continue') }}</v-btn>
              </v-row>
            </v-stepper-window-item>

            <!-- Step 2 - Job Info -->
            <v-stepper-window-item :value="2">
              <v-row class="py-2">
                <v-col cols="12">
                  <v-text-field v-model="jobForm.title" :label="t('job.title')" density="compact" rounded="xl" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-textarea v-model="jobForm.description" :label="t('job.description')" density="compact" rounded="xl" auto-grow class="mb-2" />

                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea v-model="jobForm.work" :label="t('job.work')" density="compact" rounded="xl" auto-grow class="mb-2" />

                </v-col>
              </v-row>
              <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
                  <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
                  <v-btn color="primary" :disabled="!jobForm.title" @click="nextStep">{{ t('buttons.continue') }}</v-btn>
              </v-row>
            </v-stepper-window-item>

            <!-- Step 3 - Details -->
            <v-stepper-window-item :value="3">
              <v-row class="py-2">
                <v-col cols="12" md="4">
                  <v-select v-model="jobForm.requiredSkills" :items="['Php','Symfony','Html','Css','Laravel']" :label="t('job.skills')" multiple chips density="compact" rounded="xl" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="jobForm.requirements" :items="['Symfony','Backend','Node']" :label="t('job.requirements')" multiple chips density="compact" rounded="xl" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="jobForm.experience"
                    :items="experienceOptions"
                    item-title="label"
                    item-value="value"
                    :label="t('job.experience')"
                    density="compact"
                    rounded="xl"
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="text-grey-darken-1">
                    {{ t('job.salaryRange') }}: {{ salaryRangeRange[0] }} € - {{ salaryRangeRange[1] }} €
                  </div>
                  <v-range-slider
                    v-model="salaryRangeRange"
                    :min="15000"
                    :max="150000"
                    step="5000"
                    thumb-label="always"
                    class="mt-6"
                  />
                </v-col>
              </v-row>
              <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
                <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
                <v-btn color="primary" @click="nextStep">{{ t('buttons.continue') }}</v-btn>
              </v-row>
            </v-stepper-window-item>

            <v-stepper-window-item :value="4">
              <v-row class="py-2">
                <v-col cols="12" md="4">
                  <v-select v-model="jobForm.workType" :items="['Remote','Onsite','Hybrid']" :label="t('job.workType')" chips density="compact" rounded="xl" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="jobForm.contractType" :items="['Fulltime','Parttime']" :label="t('job.contractType')" chips density="compact" rounded="xl" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="jobForm.workLocation" :label="t('job.location')" multiple chips clearable class="mb-2" rounded="xl" density="compact" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div
                    v-for="(lang, index) in jobForm.languages"
                    :key="index"
                    class="d-flex align-center gap-4 mb-3"
                  >
                    <v-row>
                      <v-col cols="12" md="5">
                        <v-select
                          v-model="lang.name"
                          :items="availableLanguages"
                          item-title="name"
                          item-value="name"
                          label="Language"
                          hide-details
                          class="flex-grow-1"
                          density="compact"
                          rounded="xl"
                        />
                      </v-col>
                      <v-col cols="12" md="5">
                        <v-select
                          v-model="lang.level"
                          :items="['basic', 'intermediate', 'fluent', 'native']"
                          label="Level"
                          hide-details
                          class="flex-grow-1"
                          density="compact"
                          rounded="xl"
                        />
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn variant="text" icon @click="jobForm.languages.splice(index, 1)">
                          <v-icon color="primary">mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>

                  <v-btn
                    variant="text"
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="addLanguage"
                  >
                    Add Language
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
                <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
                <v-btn color="primary" @click="nextStep">{{ t('buttons.continue') }}</v-btn>
              </v-row>
            </v-stepper-window-item>
            <v-stepper-window-item :value="5">
              <v-row class="py-2">
                <v-col cols="12">
                  <v-textarea v-model="jobForm.benefits" :label="t('job.benefits')" density="compact" rounded="xl" auto-grow class="mb-2" />
                </v-col>
              </v-row>
              <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
                <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
                <v-btn color="primary" @click="submitJob">{{ t('job.submit') }}</v-btn>
              </v-row>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import CreateCompany from './CreateCompany.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'job-created'])

const { t } = useI18n()
const step = ref(1)

const locationSearch = ref('')
const locationItems = ref<{ title: string; value: string }[]>([])
watch(locationSearch, async (val) => {
  if (!val || val.length < 2) return
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`
  const response = await fetch(url)
  const result = await response.json()
  locationItems.value = result.map((place: any) => ({ title: place.display_name, value: place.display_name }))
})


// Step navigation
const nextStep = () => step.value++
const prevStep = () => step.value--

// Formulaire & logiques
const showCreateCompany = ref(false)
const toggleCreateCompany = () => showCreateCompany.value = !showCreateCompany.value
const companies = ref<any[]>([])
const fetchCompanies = async () => {
  const { data } = await useFetch('/api/job/companies')
  if (data.value) companies.value = data.value
}
const onCompanyCreated = () => {
  fetchCompanies()
  showCreateCompany.value = false
}

watch(!companies.value, () => {
  fetchCompanies()
}, { immediate: true })

onMounted(fetchCompanies)

const availableLanguages = [
  { name: 'English' },
  { name: 'Français' },
  { name: 'Deutsch' },
  { name: 'العربية' },
  { name: 'Español' },
  { name: 'Português' },
  { name: 'Italiano' },
  { name: '中文' },
  { name: '日本語' },
  { name: 'Русский' },
]

const jobForm = ref({
  companyId: '',
  title: '',
  description: '',
  requiredSkills: [],
  workType: 'Remote',
  contractType: 'Fulltime',
  requirements: [],
  benefits: '',
  experience: '',
  salaryRange: '',
  work: '',
  workLocation: '',
  languages: []
})

// Experience
const experienceOptions = [
  { label: '6 months', value: '0.5' },
  { label: '1 year', value: '1' },
  { label: '2 years', value: '2' },
  { label: '3 years', value: '3' },
  { label: '5 years+', value: '5+' },
  { label: '10 years+', value: '10+' }
]

// Salary slider
const salaryRangeRange = ref<[number, number]>([30000, 90000])
watch(salaryRangeRange, (range) => {
  jobForm.value.salaryRange = `${range[0]} - ${range[1]}`
})

// Langue
const addLanguage = () => {
  jobForm.value.languages.push({ name: '', level: '' })
}

// Submit
const submitJob = async () => {
  await useFetch('/api/job/job', {
    method: 'POST',
    body: jobForm.value
  })
  emit('job-created')
  emit('update:modelValue', false)
}
</script>
