<template>
  <div class="mb-3">
    <v-form @submit.prevent="submitApplicant">
      <v-stepper v-model="step" elevation="0">
        <v-stepper-header>
          <v-stepper-item :value="1" />
          <v-stepper-item :value="2" />
          <v-stepper-item :value="3" />
          <v-stepper-item :value="4" />
          <v-stepper-item :value="5" />
          <v-stepper-item :value="6" />
          <v-stepper-item :value="7" />
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item :value="1">
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
              <v-col cols="12">
                <v-textarea density="compact" rounded="xl" v-model="applicant.description" :label="t('applicant.description')" required auto-grow outlined />
              </v-col>
            </v-row>
            <v-row class="d-flex align-center text-center mt-4 mb-2 mx-2">
              <v-btn color="primary" @click="nextStep" class="mt-4">{{ t('buttons.continue') }}</v-btn>
            </v-row>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <v-row class="py-2">
              <v-col cols="12">
                <div
                  v-for="(education, index) in educations"
                  :key="index"
                  class="d-flex align-center gap-4 mb-3"
                >
                  <v-row>
                    <v-col cols="11">
                      <v-card class="pa-4 mb-4" rounded="xl" variant="text">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="education.school"
                              label="Institution"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="education.startDate" label="Start" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="education.gradeLevel"
                              label="Degree"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="education.endDate" label="End" />
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="education.name"
                              label="Title"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="education.description"
                              label="Description"
                              required
                              auto-grow
                              outlined
                              rounded="xl"
                              class="text-align-auto mb-1"
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="1">
                      <v-btn variant="text" icon @click="educations.splice(index, 1)">
                        <v-icon color="primary">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12">
                <div
                  v-for="(education, index) in applicant.educations"
                  :key="index"
                  class="d-flex align-center gap-4 mb-3"
                >
                  <v-row>
                    <v-col cols="11">
                      <v-card class="pa-4 mb-4" rounded="xl" variant="text">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="education.school"
                              label="Institution"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="education.startDate" label="Start" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="education.gradeLevel"
                              label="Degree"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="education.endDate" label="End" />
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="education.name"
                              label="Title"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                           </v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="education.description"
                              label="Description"
                              required
                              auto-grow
                              outlined
                              rounded="xl"
                              class="text-align-auto mb-1"
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="1">
                      <v-btn variant="text" icon @click="applicant.educations.splice(index, 1)">
                        <v-icon color="primary">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="addEducation"
                >
                  Add Education
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
              <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
              <v-btn color="primary" @click="nextStep">{{ t('buttons.continue') }}</v-btn>
            </v-row>
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <v-row class="py-2">
              <v-col cols="12">
                <div
                  v-for="(experience, index) in applicant.experiences"
                  :key="index"
                  class="d-flex align-center gap-4 mb-3"
                >
                  <v-row>
                    <v-col cols="11">
                      <v-card class="pa-4 mb-4" rounded="xl" variant="text">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="experience.title"
                              label="Title"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="experience.startDate" label="Start" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="experience.company"
                              label="Company"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="experience.endDate" label="End" />
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="experience.description"
                              label="Description"
                              required
                              auto-grow
                              outlined
                              rounded="xl"
                              class="text-align-auto mb-1"
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="1">
                      <v-btn variant="text" icon @click="applicant.experiences.splice(index, 1)">
                        <v-icon color="primary">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="addExperience"
                >
                  Add Experience
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
              <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
              <v-btn color="primary" @click="nextStep">{{ t('buttons.continue') }}</v-btn>
            </v-row>
          </v-stepper-window-item>
          <v-stepper-window-item :value="4">
            <v-row class="py-2">
              <v-col cols="12">
                <div
                  v-for="(experience, index) in applicant.experiences"
                  :key="index"
                  class="d-flex align-center gap-4 mb-3"
                >
                  <v-row>
                    <v-col cols="11">
                      <v-card class="pa-4 mb-4" rounded="xl" variant="text">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="experience.title"
                              label="Title"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="experience.startDate" label="Start" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="experience.company"
                              label="Company"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="experience.endDate" label="End" />
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="experience.description"
                              label="Description"
                              required
                              auto-grow
                              outlined
                              rounded="xl"
                              class="text-align-auto mb-1"
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="1">
                      <v-btn variant="text" icon @click="applicant.experiences.splice(index, 1)">
                        <v-icon color="primary">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="addSkill"
                >
                  Add Skill
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
                <div
                  v-for="(experience, index) in applicant.experiences"
                  :key="index"
                  class="d-flex align-center gap-4 mb-3"
                >
                  <v-row>
                    <v-col cols="11">
                      <v-card class="pa-4 mb-4" rounded="xl" variant="text">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="experience.title"
                              label="Title"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="experience.startDate" label="Start" />
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="experience.company"
                              label="Company"
                              hide-details
                              class="flex-grow-1"
                              density="compact"
                              rounded="xl"
                            />
                            <DateSelector v-model="experience.endDate" label="End" />
                          </v-col>
                          <v-col cols="12">
                            <v-textarea
                              v-model="experience.description"
                              label="Description"
                              required
                              auto-grow
                              outlined
                              rounded="xl"
                              class="text-align-auto mb-1"
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="1">
                      <v-btn variant="text" icon @click="applicant.experiences.splice(index, 1)">
                        <v-icon color="primary">mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="addProject"
                >
                  Add Project
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
              <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
              <v-btn color="primary" @click="nextStep">{{ t('buttons.continue') }}</v-btn>
            </v-row>
          </v-stepper-window-item>
          <v-stepper-window-item :value="6">
            <v-row class="py-2">
              <v-col cols="12">
                <div
                  v-for="(lang, index) in applicant.languages"
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
                      <v-btn variant="text" icon @click="applicant.languages.splice(index, 1)">
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
          <v-stepper-window-item :value="7">
            <v-row class="py-2">
              <v-col cols="12">
                <div
                  v-for="(lang, index) in applicant.languages"
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
                      <v-btn variant="text" icon @click="applicant.languages.splice(index, 1)">
                        <v-icon color="primary">mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="addHobby"
                >
                  Add Hobby
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-space-between mt-4 mb-2 mx-2">
              <v-btn variant="text" @click="prevStep">{{ t('buttons.back') }}</v-btn>
              <v-btn color="primary" @click="submitApplicant">{{ t('applicant.submit') }}</v-btn>
            </v-row>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DateSelector from "~/components/DateSelector.vue";

const emit = defineEmits(['applicant-created'])
const props = defineProps<{
  selectedJobId: string | null
}>()
const { t } = useI18n()
const step = ref(1)
const applicant = ref({
  firstName: '',
  lastName: '',
  contactEmail: '',
  phone: '',
  description: '',
  languages: [],
  educations: [],
  references: [],
  skills: [],
  experiences: [],
  projects: [],
  others: [],
  resume: null

})

const nextStep = async () => {
  step.value++
  if (step.value === 3) {
    for (const education of applicant.value.educations) {
      const formData = new FormData()
      formData.append('school', education.school)
      formData.append('gradeLevel', education.gradeLevel)
      formData.append('name', education.name)
      formData.append('description', education.description)
      formData.append('startDate', education.startDate)
      formData.append('endDate', education.endDate)

      const { error } = await useFetch('/api/resume/education', {
        method: 'POST',
        body: formData,
      })

      if (error.value) {
        console.error('Error submitting education:', error.value)
      }
    }
    applicant.value.educations = []
  }
  if (step.value === 4) {
    const formData = new FormData()
    await useFetch('/api/resume/experience', {method: 'POST', body: formData})
    applicant.value.experiences = []
  }
  if (step.value === 5) {
    const formData = new FormData()
    await useFetch('/api/resume/skills', {method: 'POST', body: formData})
    applicant.value.skills = []
  }
  if (step.value === 6) {
    const formData = new FormData()
    await useFetch('/api/resume/projects', {method: 'POST', body: formData})
    applicant.value.projects = []
  }
  if (step.value === 7) {
    const formData = new FormData()
    await useFetch('/api/resume/languages', {method: 'POST', body: formData})
    applicant.value.languages = []
  }
}
const prevStep = () => step.value--

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

const addLanguage = () => {
  applicant.value.languages.push({ name: '', level: '' })
}
const addEducation = () => {
  applicant.value.educations.push({ school: '', gradeLevel: '', name: '', description: '', startDate: '', endDate: '' })
}

const addExperience = () => {
  applicant.value.experiences.push({ title: '', company: '', description: '', startDate: '', endDate: '' })
}

const addReference = () => {
  applicant.value.references.push({ title: '', company: '', description: '', startDate: '', endDate: '' })
}

const addSkill = () => {
  applicant.value.skills.push({ title: '', company: '', description: '', startDate: '', endDate: '' })
}

const addProject = () => {
  applicant.value.projects.push({ title: '', company: '', description: '', startDate: '', endDate: '' })
}

const addHobby = () => {
  applicant.value.others.push({ title: '', company: '', description: '', startDate: '', endDate: '' })
}


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

  await useFetch(`/api/job/application/${props.selectedJobId}/${data.value.id}`, {
    method: 'POST'
  })
  emit('applicant-uploaded')
}

const educations = ref<any[]>([])
const experiences = ref<any[]>([])
const skills = ref<any[]>([])
const languages = ref<any[]>([])
const hobbies = ref<any[]>([])
const projects = ref<any[]>([])

const fetchResume = async () => {
  const { data } = await useFetch('/api/resume/profile')
  if (data.value) {
    educations.value = data.value.educations ?? []
    experiences.value = data.value.experiences ?? []
    skills.value = data.value.skills ?? []
    languages.value = data.value.languages ?? []
    hobbies.value = data.value.hobbies ?? []
  }
}

watch(!educations.value, () => {
  fetchResume()
}, { immediate: true })

onMounted(fetchResume)

</script>
