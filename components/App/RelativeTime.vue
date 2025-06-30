<template>
  <p class="text-xs text-secondary d-flex align-center">
  <v-icon size="14" class="me-1">mdi-clock</v-icon>
  {{ relativeDate }}
  </p>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const props = defineProps({
  date: {
    type: [String, Date],
    required: true
  }
})

const relativeDate = computed(() => dayjs(props.date).fromNow())
</script>
