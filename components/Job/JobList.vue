<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import InfiniteList from '~/components/Blog/InfiniteList.vue'
import JobDetails from "~/components/Job/JobDetails.vue";

const props = defineProps<{
  jobs: any[]
  filtered: boolean
}>()

const emit = defineEmits<{
  (e: 'apply', jobId: string): void
  (e: 'loaded', jobs: any[]): void
}>()

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <InfiniteList
    v-if="!filtered"
    fetch-url="/api/job/jobs"
    :limit="5"
    @loaded="emit('loaded', $event)"
  >
    <template #default="{ items }">
      <v-card
        v-for="job in items"
        :key="job.id"
        class="mb-4 pa-3"
        rounded="xl"
        variant="text"
      >
        <JobDetails :job="job"/>
      </v-card>
    </template>
  </InfiniteList>

  <div v-else-if="jobs.length">
    <v-card
      v-for="job in jobs"
      :key="job.id"
      class="mb-4 pa-3"
      rounded="xl"
      variant="text"
    >
      <JobDetails :job="job"/>
    </v-card>
  </div>

  <v-alert v-else border="start" type="info" color="primary" class="mt-10 mx-6">
    {{ t('job.noMatch') }}
  </v-alert>
</template>
