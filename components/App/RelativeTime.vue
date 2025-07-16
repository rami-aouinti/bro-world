<template>
  <p class="text-xs text-medium-emphasis d-flex align-center">

  {{ relativeDate }}
    <v-icon size="14" class="mx-1">mdi-clock</v-icon>
  </p>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const props = defineProps({
  date: {
    type: [String, Date],
    required: true,
    default: () => new Date().toISOString(), // sécurité
  },
})

const relativeDate = computed(() => dayjs(props?.date)?.fromNow())
</script>
