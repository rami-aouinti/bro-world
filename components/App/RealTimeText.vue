<template>
  <div class="text-body-1 font-mono pa-2">
    {{ displayedText }}<span v-if="showCursor" class="blinking-cursor">|</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue'

const props = defineProps({
  text: String
})
const displayedText = ref("")
const showCursor = ref(true)

let index = 0
let interval = null
let cursorInterval = null

onMounted(() => {
  // Animation du texte
  interval = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index]
      index++
    } else {
      clearInterval(interval)
    }
  }, 50)

  // Animation du curseur
  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  clearInterval(cursorInterval)
})
</script>

<style scoped>
.blinking-cursor {
  animation: blink 1s step-start infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
