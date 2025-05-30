<template>
  <small class="d-block text-muted">{{ relativeDate }}</small>
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
