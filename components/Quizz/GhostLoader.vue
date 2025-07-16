<template>
  <div
    class="animate-pulse flex justify-around relative max-h-44 overflow-hidden gap-7"
    :class="{ hidden: !ready }"
  >
    <div v-for="index in range" :key="index + 'i'">
      <div
        class="relative w-24 h-28 rounded flex justify-center items-center mb-10 bg-slate-400 border-slate-200 border-4"
      >
        <ClientOnly>
          <Vue3Lottie
            autoPlay
            animationLink="/quizz/joconde.json"
            class="opacity-50 w-20 h-20"
          />
        </ClientOnly>
      </div>
      <div
        class="h-4 w-24 rounded bg-teal-500 flex justify-center items-center mb-3"
      >
        <div class="w-12 h-1 bg-white/40" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'

const props = defineProps({
  nbItems: {
    type: Number,
    required: true,
  },
})

const ready = ref(false)
const range = computed(() => Array.from({ length: props.nbItems }, (_, i) => i))

onMounted(() => {
  setTimeout(() => {
    ready.value = true
  }, 100)
})
</script>
