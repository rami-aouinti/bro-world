<template>
  <component
    :is="Comp"
    v-model="localValue"
    :ui="ui"
    :accent="accent"
    :variant="variant"
    :maxLevel="maxLevel"
    :sizePx="sizePx"
    :editable="editable"
    :draggable="draggable"
  />
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import LanguagesStars from './LanguagesStars.vue'
import LanguagesBars from './LanguagesBars.vue'
import LanguagesDots from './LanguagesDots.vue'

defineOptions({ inheritAttrs: false })

type Lang = { id:string; name:string; level:0|1|2|3|4|5; note?:string }

const props = withDefaults(defineProps<{
  modelValue: Lang[]
  ui: any
  variant?: 'stars'|'bars'|'dots'
  accent?: string
  maxLevel?: number
  sizePx?: number
  editable?: boolean
  draggable?: boolean
}>(), {
  variant: 'stars',
  maxLevel: 5,
  sizePx: 18,
  editable: true,
  draggable: true,
})

const emit = defineEmits<{ (e:'update:modelValue', v: Lang[]): void }>()
const Comp = computed(() => ({
  stars: LanguagesStars,
  bars:  LanguagesBars,
  dots:  LanguagesDots
}[props.variant] ?? LanguagesStars))

const localValue = computed<Lang[]>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>
