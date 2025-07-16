<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import JobDetails from "~/components/Job/JobDetails.vue";
const { t } = useI18n()
const route = useRoute()
const jobId = route.params.id
const router = useRouter()
const { data: job } = await useFetch(`/api/job/jobs/${jobId}`)

</script>

<template>
  <v-container>
    <JobDetails :job="job"/>
  </v-container>
</template>
