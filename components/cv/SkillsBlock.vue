<template>
  <component
    :is="Comp"
    :ui="ui"
    v-model="localValue"
    :accent="accent"
    :chipVariant="chipVariant"
    :chipColor="chipColor"
    :chipDensity="chipDensity"
    :columns="columns"
    :groupLine="groupLine"
    :groupLineWidth="groupLineWidth"
    :groupLineStyle="groupLineStyle"
    :groupLineColor="groupLineColor"
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
  columns?: 1|2
  groupLine?: 'underline'|'none'
  groupLineWidth?: number
  groupLineStyle?: 'solid'|'dashed'|'dotted'
  groupLineColor?: string
}>(), {
  variant: 'skill-1',
  chipVariant: 'text',
  chipDensity: 'compact',
  columns: 2,
  groupLine: 'underline',
  groupLineWidth: 100,
  groupLineStyle: 'solid'
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

const columns          = computed(() => props.columns ?? 2)
const groupLine        = computed(() => props.groupLine ?? 'underline')
const groupLineWidth   = computed(() => props.groupLineWidth ?? 100)
const groupLineStyle   = computed(() => props.groupLineStyle ?? 'solid')
const groupLineColor   = computed(() => props.groupLineColor ?? (props.chipColor ?? props.accent))
</script>
