<!-- components/common/SectionSpacer.vue -->
<script setup lang="ts">
const props = defineProps<{ mm?: number }>()
</script>

<template>
  <div :style="{ height: (props.mm ?? 8) + 'mm' }" />
</template>
