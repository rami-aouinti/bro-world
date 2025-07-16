<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update:search', 'update:location'])
const { t } = useI18n()

const search = ref('')
const selectedLocations = ref('')

watch(search, val => emit('update:search', val))
watch(selectedLocations, val => emit('update:location', val))
</script>
<template>
  <v-row>
    <v-col cols="6">
      <v-text-field v-model="search" :placeholder="t('job.search')" prepend-inner-icon="mdi-magnify" variant="outlined" class="mb-4" rounded="xl" density="compact" />
    </v-col>
    <v-col cols="6">
      <v-text-field v-model="selectedLocations" :label="t('job.location')" prepend-inner-icon="mdi-earth" variant="outlined" multiple chips clearable class="mb-2" rounded="xl" density="compact" />
    </v-col>
  </v-row>
</template>
