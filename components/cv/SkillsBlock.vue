<!-- components/cv/SkillsBlock.vue -->
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
import { computed, defineOptions } from 'vue'
import SkillsChips from './SkillsChips.vue'
import SkillsStacked from './SkillsStacked.vue'

defineOptions({ inheritAttrs: false })

type SkillGroup = { id:string; label:string; items:string[] }

const props = withDefaults(defineProps<{
  modelValue: SkillGroup[]
  variant?: 'skill-1' | 'skill-2'
  ui: any
  accent?: string
  chipVariant?: 'text'|'elevated'|'outlined'|'flat'|'tonal'|'plain'
  chipColor?: string
  chipDensity?: 'comfortable'|'compact'|'default'
}>(), {
  variant: 'skill-1',
  chipVariant: 'text',
  chipDensity: 'compact'
})

const emit = defineEmits<{ (e:'update:modelValue', v: SkillGroup[]): void }>()
const Comp = computed(() => props.variant === 'skill-2' ? SkillsStacked : SkillsChips)

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const chipVariant  = computed(() => props.chipVariant)
const chipColor    = computed(() => props.chipColor ?? props.accent)
const chipDensity  = computed(() => props.chipDensity)
</script>
