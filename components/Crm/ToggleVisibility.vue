<script lang="ts" setup>
const emit = defineEmits(['toggle-visibility'])
const isComponentVisible = ref(true)
const tooltipText = computed(() => (isComponentVisible.value ? 'Hide' : 'Show'))

const toggleComponentVisibility = () => {
  isComponentVisible.value = !isComponentVisible.value
  emit('toggle-visibility', isComponentVisible.value)
}
</script>

<template>
  <v-tooltip :text="tooltipText" class="ml-auto">
    <v-btn @click="toggleComponentVisibility" color="gray" variant="ghost">
      <v-icon :name="isComponentVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
    </v-btn>
  </v-tooltip>
</template>
