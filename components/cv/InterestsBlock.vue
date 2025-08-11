<template>
  <component
    :is="Comp"
    :ui="ui"
    v-model="localValue"
    :accent="accent"
    :chipVariant="chipVariant"
    :chipColor="chipColor"
    :chipDensity="chipDensity"
  />
</template>
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import InterestsChips from './InterestsChips.vue'      // variante "interests-1"
import InterestsStacked from './InterestsStacked.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue: any
  variant?: 'interest-1' | 'interest-2'
  ui: any
  accent?: string
  chipVariant?: 'text'|'elevated'|'outlined'|'flat'|'tonal'|'plain'
  chipColor?: string
  chipDensity?: 'comfortable'|'compact'|'default'
}>(), {
  variant: 'interest-1',
  chipVariant: 'text',
  chipDensity: 'compact'
})

const emit = defineEmits<{ (e:'update:modelValue', v: any): void }>()
const Comp = computed(() => props.variant === 'interest-2' ? InterestsStacked : InterestsChips)

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const chipVariant  = computed(() => props.chipVariant)
const chipColor    = computed(() => props.chipColor ?? props.accent)
const chipDensity  = computed(() => props.chipDensity)
</script>
