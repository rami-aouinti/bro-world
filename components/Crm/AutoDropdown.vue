<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search...',
  },
  optionAttribute: {
    type: String,
    default: 'name',
  },
  idAttribute: {
    type: String,
    default: 'id',
  },
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const selected = ref(props.modelValue)

watch(selected, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <v-select
    v-model="selected"
    :items="options"
    :loading="loading"
    :label="placeholder"
    :item-title="optionAttribute"
    :item-value="idAttribute"
    variant="outlined"
    density="comfortable"
    hide-details
  />
</template>
