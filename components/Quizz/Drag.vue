<template>
  <v-container fluid class="transition-opacity duration-500" :class="{ 'opacity-0': !ready }">
    <v-alert
      v-if="orientationError"
      type="info"
      variant="outlined"
      border="start"
      class="text-center my-4 text-teal-600"
    >
      <v-icon start icon="mdi-screen-rotation" />
      {{ orientationError }}
    </v-alert>

    <div v-else class="h-80 max-w-full">
      <VueDraggableNext
        :list="pictures"
        @end="handleEnd"
        :move="handleMove"
        animation="500"
        tag="ul"
        class="flex flex-nowrap space-x-5 mb-4"
        :class="{ 'swap': swap }"
      >
        <TransitionGroup name="img-group">
          <li
            v-for="(picture, id) in pictures"
            :key="picture.src"
            class="relative cursor-move hover:opacity-90 transition-opacity"
            :style="basisStyle"
          >
            <v-scale-transition>
              <span
                v-show="picture.found"
                class="absolute w-full bg-teal-700/20 z-10 h-[calc(100%+110px)] grid place-content-center text-4xl border-b-2 border-yellow-300"
              ></span>
            </v-scale-transition>

            <v-chip
              :color="picture.found ? 'teal' : 'gray'"
              :size="picture.found ? '2xl' : 'md'"
              class="w-full bg-blue-400/20 rounded-xl"
            >
              <v-img v-bind="imgProperties(picture.src)" />
            </v-chip>
          </li>
        </TransitionGroup>
      </VueDraggableNext>

      <!-- answers -->
      <ul v-auto-animate class="flex flex-nowrap space-x-5">
        <li
          v-for="answer in answers"
          :key="answer"
          class="grid place-content-center rounded-xl h-20 border-2 border-teal-700 border-solid text-sm select-none group"
          :class="{ 'my-animation-shake': lastError.answer === answer }"
          :data-answer="answer"
          :style="basisStyle"
        >
          <v-icon icon="mdi-arrow-up" class="mx-auto mb-1">mdi-arrow-up</v-icon>
          {{ answer }}
        </li>
      </ul>
    </div>

    <!-- game won -->
    <div v-if="shuffled && youWin">
      <Fires class="opacity-80" />
      <v-dialog
        v-model="youWin"
        persistent
        :max-width="300"
        class="text-center"
      >
        <v-card>
          <v-card-text class="text-xl font-bold py-4">
            Good... défi réussi !
          </v-card-text>
          <v-card-actions class="justify-around">
            <v-btn v-if="replay !== 'no-replay'" :loading="replay === true" @click="replay = true">
              {{ replay === true ? 'Loading...' : 'Replay' }}
            </v-btn>
            <v-btn v-else @click="deepShuffle">Replay</v-btn>
            <NuxtLink to="/" class="text-teal-600 underline">Exit</NuxtLink>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect, inject } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import Fires from '~/components/App/AppQuiz/Fires.vue'
import { useScreenOrientation } from '@vueuse/core'

const props = defineProps<{
  picsInit: { src: string; answer: string }[]
  swap?: boolean
}>()

const getPics = () => props.picsInit.map(picture => ({ ...picture, found: false }))
const getAnswers = () => props.picsInit.map(picture => picture.answer)

const ready = ref(false)
const shuffled = ref(false)
const pictures = ref(getPics())
const answers = ref(getAnswers())
const youWin = computed(() => pictures.value.every(picture => picture.found))
const basisStyle = computed(() => ({ 'flex-basis': `${100 / answers.value.length}%` }))

const screenOrientation = useScreenOrientation()
const acceptedOrientation: OrientationType[] = ['landscape-primary', 'landscape-secondary']
const lastError = ref({ picture: '', answer: '' })

const movingIndex = ref(0)
const lastIndex = ref(0)
const moveTriggered = ref(false)

const handleMove = (e: any) => {
  if (!props.swap) return true
  const { index, futureIndex } = e.draggedContext
  movingIndex.value = index
  lastIndex.value = futureIndex
  moveTriggered.value = true
  return false
}

const handleEnd = (e: any) => {
  if (props.swap) return handleEndSwap(e)
  const chosenAnswer = answers.value[e.newIndex]
  const chosenPicture = pictures.value[e.newIndex]
  if (chosenAnswer !== chosenPicture.answer)
    lastError.value.answer = chosenAnswer
}

const handleEndSwap = (e: any) => {
  if (!moveTriggered.value) return
  const futureItem = pictures.value[lastIndex.value]
  const movingItem = pictures.value[movingIndex.value]
  const _items = [...pictures.value]
  _items[lastIndex.value] = movingItem
  _items[movingIndex.value] = futureItem
  pictures.value = _items

  const chosenAnswer = answers.value[lastIndex.value]
  if (chosenAnswer !== movingItem.answer)
    lastError.value.answer = chosenAnswer
  moveTriggered.value = false
}

const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5)
const deepShuffle = () => {
  let nbFound = 2
  while (nbFound > 1) {
    shuffle(answers.value)
    checkAnswer()
    nbFound = getNbFound()
  }
  shuffled.value = true
}
const getNbFound = () => pictures.value.filter(picture => picture.found).length
const imgProperties = (src: string) => ({
  src,
  alt: 'Unknown image ' + src,
  class: 'border-4 border-solid w-auto max-h-[40vh]'
})

const orientationError = computed(() => {
  if (!ready.value || !screenOrientation.isSupported.value || !screenOrientation.orientation.value)
    return ''
  if (!acceptedOrientation.includes(screenOrientation.orientation.value))
    return 'Please switch to landscape mode to start the game'
  return ''
})

onMounted(async () => {
  shuffle(pictures.value)
  ready.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  deepShuffle()
})

const checkAnswer = () => {
  for (let i = 0; i < pictures.value.length; i++) {
    const pic = pictures.value[i]
    pic.found = pic.answer === answers.value[i]
  }
}

const resetLastError = async () => {
  if (lastError.value.picture || lastError.value.answer) {
    await new Promise(resolve => setTimeout(resolve, 300))
    lastError.value = { picture: '', answer: '' }
  }
}

const replay = inject('replay', 'no-replay') as Ref<boolean> | 'no-replay'

watch(() => props.picsInit, () => {
  pictures.value = getPics()
  answers.value = getAnswers()
  deepShuffle()
})

watchEffect(() => checkAnswer())
watchEffect(() => resetLastError())
</script>

<style scoped>
.my-animation-shake {
  animation: shake 0.4s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
</style>
