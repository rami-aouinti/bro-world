<template>
  <component
    :is="Comp"
    v-model="localValue"
    v-bind="forwardProps"
    v-on="forwardListeners"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import SkillsChips from './SkillsChips.vue'
import SkillsStacked from './SkillsStacked.vue'

type SkillGroup = { id:string; label:string; items:string[] }

const props = defineProps<{
  modelValue: SkillGroup[]
  variant?: 'skill-1' | 'skill-2'
  accent?: string
}>()
const emit = defineEmits<{ (e:'update:modelValue', v: SkillGroup[]): void }>()
const attrs = useAttrs()

const Comp = computed(() => props.variant === 'skill-2' ? SkillsStacked : SkillsChips)

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const forwardProps = computed(() => ({ accent: props.accent }))
const forwardListeners = computed(() => attrs)
</script>
