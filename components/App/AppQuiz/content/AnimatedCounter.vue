<template>
  <div class="px-4 py-8 flex items-center justify-center flex-col">
    <span
      ref="target"
      class="flex tabular-nums text-slate-900 dark:text-white text-5xl font-extrabold mb-2"
      :style="{ '--num': animatedNumber }"
      :counter-set="`num ${Math.floor(animatedNumber)}`"
    >
      <span class="sr-only">{{ targetNumber }}</span>
      <span class="before:content-[counter(num)]">+</span>
    </span>

    <v-btn color="white" @click="startCounter" class="mt-4" size="xs">
      Start Counter
    </v-btn>

    <p class="text-xs mt-2 text-gray-500 text-center max-w-xs">
      or start the counter when this component is in the viewport
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watchOnce } from 'vue'
import { useElementVisibility } from '@vueuse/core'

const props = defineProps({
  targetNumber: {
    type: Number,
    required: true,
    default: 1234,
  },
})

const target = ref<HTMLElement | null>(null)
const targetIsVisible = useElementVisibility(target)
const animatedNumber = ref(0)

const startCounter = () => {
  const duration = 1000
  const start = performance.now()

  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    animatedNumber.value = props.targetNumber * progress
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

watchOnce(targetIsVisible, () => {
  startCounter()
})
</script>

<style scoped>
@property --num {
  syntax: "<integer>";
  initial-value: 0;
  inherits: false;
}

.before\:content-\[counter\(num\)\]::before {
  content: counter(num);
}
</style>
