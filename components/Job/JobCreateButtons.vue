<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'create-job'): void
  (e: 'create-applicant'): void
}>()

const { t } = useI18n()
</script>

<template>
  <v-row class="mb-4" justify="center">
    <v-col cols="12" md="12" class="text-center">
      <v-btn
        prepend-icon="mdi-plus"
        color="primary"
        variant="outlined"
        rounded
        block
        @click="emit('create-job')"
      >
        {{ t('job.create') }}
      </v-btn>
    </v-col>
  </v-row>
</template>
