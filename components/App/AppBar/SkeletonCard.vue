<script setup lang="ts">
const props = defineProps({
  height: {
    type: [String, Number],
    default: 140,
  },
  class: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <v-skeleton-loader
    type="card"
    :height="props.height"
    :class="`rounded-xl mx-3 mb-3 ${props.class}`"
  />
</template>
