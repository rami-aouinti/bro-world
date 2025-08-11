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
import InterestsChips from './InterestsChips.vue'      // variante "interests-1"
import InterestsStacked from './InterestsStacked.vue'  // variante "interests-2"

const props = defineProps<{
  modelValue: string[]
  variant?: 'interests-1' | 'interests-2'
  accent?: string
}>()

const emit = defineEmits<{ (e:'update:modelValue', v:string[]): void }>()
const attrs = useAttrs()

const Comp = computed(() =>
  props.variant === 'interests-2' ? InterestsStacked : InterestsChips
)

const localValue = computed({
  get: () => props.modelValue,
  set: (v: string[]) => emit('update:modelValue', v),
})

const forwardProps = computed(() => ({ accent: props.accent }))
const forwardListeners = computed(() => attrs)
</script>
