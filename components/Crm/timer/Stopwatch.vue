<script lang="ts" setup>
const isRunning = ref(false)
const startTime = ref(0)
const elapsedTime = ref(0)
let timerInterval = null

const emit = defineEmits(['logged'])

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(elapsedTime.value / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const milliseconds = elapsedTime.value % 1000

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
})

const startStop = () => {
  if (isRunning.value) {
    clearInterval(timerInterval)
    emit('logged', elapsedTime.value)
  } else {
    startTime.value = Date.now() - elapsedTime.value
    timerInterval = setInterval(updateTimer, 10)
  }
  isRunning.value = !isRunning.value
}

const updateTimer = () => {
  elapsedTime.value = Date.now() - startTime.value
}

const reset = () => {
  if (isRunning.value) {
    clearInterval(timerInterval)
    isRunning.value = false
  }
  elapsedTime.value = 0
}
</script>

<template>
  <v-card class="">
    <template #header>
      <div class="flex flex-row items-center justify-center">
        <v-icon name="i-heroicons-clock" class="mr-2" />
        <h2 class="text-center">Stopwatch</h2>
      </div>
    </template>
    <div class="flex flex-col h-full space-y-4 mt-5 text-center">
      <div class="text-4xl font-mono mb-4">{{ formattedTime }}</div>
      <div class="flex flex-row justify-center space-x-2">
        <v-btn :color="isRunning ? 'red' : 'green'" @click="startStop" class="text-lg">
          {{ isRunning ? 'Stop' : 'Start' }}
        </v-btn>
        <v-btn color="gray" @click="reset" class="text-lg"> Reset </v-btn>
      </div>
    </div>
  </v-card>
</template>
