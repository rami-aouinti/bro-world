<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'
import { useJobStore } from '~/stores/useJobStore'
import { useCompanyStore } from '~/stores/useCompanyStore'
import InfiniteList from '~/components/Blog/InfiniteList.vue'

const jobStore = useJobStore()
const companyStore = useCompanyStore()

const company = ref({
  name: '',
  description: '',
  location: '',
  contactEmail: '',
})

const job = ref({
  title: '',
  description: '',
  requiredSkills: '',
  experience: '',
  companyId: '',
})

const companies = ref<any[]>([])

const fetchCompanies = async () => {
  const { data } = await useFetch('/api/job/companies')
  if (data.value) {
    companies.value = data.value
  }
}

const submitCompany = async () => {
  await useFetch('/api/job/company', {
    method: 'POST',
    body: company.value,
  }).then(() => {
    fetchCompanies()
    company.value = {
      name: '',
      description: '',
      location: '',
      contactEmail: '',
    }
  })
}

const submitJob = async () => {
  await useFetch('/api/job/job', {
    method: 'POST',
    body: job.value,
  }).then(() => {
    job.value = {
      title: '',
      description: '',
      requiredSkills: '',
      experience: '',
      companyId: '',
    }
  })
}

onMounted(() => {
  fetchCompanies()
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Créer une entreprise</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitCompany">
              <v-text-field v-model="company.name" label="Nom de l'entreprise" required />
              <v-text-field v-model="company.description" label="Description" />
              <v-text-field v-model="company.location" label="Localisation" />
              <v-text-field v-model="company.contactEmail" label="Email de contact" type="email" />
              <v-btn type="submit" color="primary">Créer</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <InfiniteList
          v-if="!companyStore.loaded"
          fetch-url="/api/job/companies"
          :limit="5"
          @loaded="companyStore.setCompanies"
        >
          <template #default="{ items }">
            <v-card
              v-for="company in items"
              :key="company.id"
              class="mb-4 pa-3"
            >
              <v-card-title>{{ company.name }}</v-card-title>
              <v-card-subtitle>{{ company.location }}</v-card-subtitle>
              <v-card-text>
                <p><strong>Description :</strong> {{ company.description }}</p>
                <p><strong>Email de contact :</strong> {{ company.contactEmail }}</p>
              </v-card-text>
            </v-card>
          </template>
        </InfiniteList>
        <div v-else-if="companyStore.companies.length">
          <div v-for="company in companyStore.companies" :key="company.id">
            <v-card
              class="mb-4 pa-3"
            >
              <v-card-title></v-card-title>
              <v-card-subtitle></v-card-subtitle>
              <v-card-text>
                <p><strong>Nom :</strong> {{ company.name }}</p>
                <p><strong>Description :</strong> {{ company.description }}</p>
                <p><strong>Localisation :</strong> {{ company.location }}</p>
                <p><strong>Email de contact :</strong> {{ company.contactEmail }}</p>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Créer une offre d'emploi</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitJob">
              <v-select
                v-model="job.companyId"
                :items="companies"
                item-title="name"
                item-value="id"
                label="Entreprise"
                required
              />
              <v-text-field v-model="job.title" label="Titre du poste" required />
              <v-textarea v-model="job.description" label="Description" />
              <v-textarea v-model="job.requiredSkills" label="Compétences requises" />
              <v-text-field v-model="job.experience" label="Années d'expérience" type="number" />
              <v-btn type="submit" color="primary">Publier</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <InfiniteList
          v-if="!jobStore.loaded"
          fetch-url="/api/job/jobs"
          :limit="5"
          @loaded="jobStore.setJobs"
        >
          <template #default="{ items }">
            <v-card
              v-for="job in items"
              :key="job.id"
              class="mb-4 pa-3"
            >
              <v-card-title>{{ job.title }}</v-card-title>
              <v-card-subtitle>{{ job.experience }} ans d'expérience</v-card-subtitle>
              <v-card-text>
                <p>{{ job.description }}</p>
                <p><strong>Compétences :</strong> {{ job.requiredSkills }}</p>
              </v-card-text>
            </v-card>
          </template>
        </InfiniteList>
        <div v-else-if="jobStore.jobs.length">
          <div v-for="job in jobStore.jobs" :key="job.id">
            <v-card
              class="mb-4 pa-3"
            >
              <v-card-title>{{ job.title }}</v-card-title>
              <v-card-subtitle>{{ job.experience }} ans d'expérience</v-card-subtitle>
              <v-card-text>
                <p>{{ job.description }}</p>
                <p><strong>Compétences :</strong> {{ job.requiredSkills }}</p>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
