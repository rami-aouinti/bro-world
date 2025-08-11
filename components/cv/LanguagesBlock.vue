<template>
  <component :is="comp" v-bind="passProps" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LanguagesStars from './LanguagesStars.vue'   // language-1

type Lang = { id:string; name:string; level:0|1|2|3|4|5; note?:string }

const props = defineProps<{
  modelValue: Lang[]
  variant?: 'language-1'
  [k: string]: any
}>()

const comp = computed(() => LanguagesStars)
const passProps = computed(() => props)
</script>
