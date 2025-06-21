<template>
  <slot />
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
});
</script>
