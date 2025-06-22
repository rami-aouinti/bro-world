<script setup lang="ts">
import Skills from "~/components/Job/Details/Skills.vue";

definePageMeta({
  title: 'Requests',
  icon: 'mdi-animation',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
})
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import Header from "~/components/Job/Details/Header.vue";
import LoaderRequest from "~/components/App/Loader/Job/LoaderRequest.vue";

const { t } = useI18n()
const localePath = useLocalePath()

const jobs = ref([])
const loading = ref(true)
const error = ref(false)

const fetchRequests = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/job/application/requests')
    if (fetchError.value) throw new Error()
    jobs.value = data.value.data || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}


watch(!jobs.value, () => {
  fetchRequests()
}, { immediate: true })

onMounted(async () => {
  await fetchRequests()
})
</script>
<template>
  <v-container>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="!loading && jobs.length === 0" type="info" color="primary" class="mt-10 mx-6">
      {{ t('job.empty') }}
    </v-alert>
  </v-container>
</template>
