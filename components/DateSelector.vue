<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  label?: string
  modelValue?: string | null
}>()

const emit = defineEmits(['update:modelValue'])

const menu = ref(false)
const date = ref(props.modelValue ?? '')

watch(date, val => emit('update:modelValue', val))
watch(() => props.modelValue, val => {
  if (val !== date.value) date.value = val
})

const formatted = computed(() =>
  date.value ? new Date(date.value).toLocaleDateString('fr-FR') : ''
)

const min = '1900-01-01' // si nécessaire
const locale = 'en-US' // ou 'fr-FR', selon vos besoins
</script>

<template>
  <v-dialog v-model="menu" width="300">
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        :label="label"
        class="flex-grow-1 py-3"
        density="compact"
        rounded="xl"
        :value="formatted"
      />
    </template>

    <v-date-picker
      v-model="date"
      :min="min"
      :locale="locale"
      @update:model-value="menu = false"
    />
  </v-dialog>
</template>
