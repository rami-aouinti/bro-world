<template>
  <section ref="templateSection" class="scroll-mt-14">
    <div class="flex justify-center text-center gap-3 mb-5">
      <v-avatar
        v-for="(pic, i) in picsRef"
        :key="i"
        :src="pic.src"
        :alt="pic.answer"
        role="button"
        tabindex="0"
        aria-label="Open story"
        style="cursor: pointer"
        size="58"
        class="border border-primary mx-2 py-1"
        @click="currentIndex = (quizz.timer && !end) ? currentIndex : i"
      >
        <img
          :alt="`question-${pic.answer}`"
          :src="getImgClass(pic)"
          width="50"
          height="50"
        />
      </v-avatar>
    </div>

    <div class="max-w-2xl w-full mx-auto px-4 space-y-6">
      <!-- Barre de progression -->
      <v-transition-scale v-if="quizz.timer" group>
        <div class="flex justify-center mb-4">
          <v-progress-linear
            v-if="!alreadyAnswered(currentPic)"
            :model-value="currentIndex"
            :size="32"
            :width="3"
            indeterminate
            color="primary"
          />
        </div>
      </v-transition-scale>

      <div class="bg-slate-800/40 p-4 rounded-lg text-center" :class="quizz.small ? 'h-[42vh]' : 'h-[62vh]'">
        <cite
          class="block text-md mb-2 truncate transition-opacity duration-300"
          :class="{ 'opacity-0': quizz.hideTitle }"
        >
          {{ currentPic.name }}
        </cite>

        <NuxtImg
          :src="currentPic.src"
          width="400"
          height="200"
          class="rounded mx-auto object-contain w-full"
          :class="quizz.small ? 'h-[33vh]' : 'h-[53vh]'"
          :alt="currentPic.name"
        />
      </div>

      <!-- Choix de réponses -->
      <div class="flex flex-wrap justify-around text-center gap-3 mt-2">
        <v-btn
          v-for="(pic, i) in getChoices()"
          :key="i"
          @click="handleChoice(pic.answer)"
          :disabled="alreadyAnswered(currentPic)"
          class="basis-[48%] transition-all border-2 border-transparent mx-4"
          :class="{
          '!border-teal-200 !bg-teal-600': alreadyAnswered(currentPic) && currentPic.answer === pic.answer,
          '!bg-red-500': !currentPic.found && selectedAnswer === pic.answer,
          'bg-primary': !alreadyAnswered(currentPic),
          '!cursor-default': alreadyAnswered(currentPic)
        }"
        >
          {{ pic.answer }}
        </v-btn>
      </div>

      <div v-if="end" class="text-center mt-10">
        <v-icon name="trophy" class="text-7xl text-teal-700 mb-4" />

        <div class="text-lg mb-4 flex justify-center items-center gap-4">
          End ...
          <v-btn v-if="replay !== 'no-replay'" :disabled="replay" variant="soft" @click="replay = true">
            {{ replay ? 'Loading...' : 'Replay' }}
          </v-btn>
          <NuxtLink to="/" class="text-teal-700 underline">Undo</NuxtLink>
        </div>

        <div class="mb-6">
          Score : {{ picsRef.filter(pic => pic.found).length }} / {{ picsRef.length }}
          <v-progress-circular
            :model-value="picsRef.filter(pic => pic.found).length"
            :max="picsRef.length"
            size="40"
            width="5"
            class="mt-2 mx-auto animate-pulse"
            color="teal"
          />
        </div>

        <!-- Liens Wikipédia -->
        <div class="bg-white/5 p-4 rounded-lg max-w-full text-left">
          <div class="text-xl mb-4">Liens Wikipédia</div>
          <ul class="space-y-2">
            <li
              v-for="(pic, i) in picsRef"
              :key="i"
              class="flex items-center gap-3 text-sm rounded-md p-2 odd:bg-gray-700/10 hover:bg-slate-400/10 transition"
            >
              <span class="basis-40 truncate">{{ pic.answer }}</span>
              <v-avatar :src="pic.src" :alt="pic.answer" size="sm" />
              <a
                :href="pic.article ?? pic.src.split('?width')[0]"
                target="_blank"
                class="text-primary underline truncate w-full"
              >
                {{ pic.name ?? pic.answer }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const currentIndex = ref(0)
const currentPic = computed(() => picsRef.value[currentIndex.value])
const imgContainer = ref(null)
const templateSection = ref(null)
const wikiLinks = ref(null)
const { isSwiping, direction } = useSwipe(imgContainer, {
  onSwipeEnd: () => {
    if (direction.value === 'left' && currentIndex.value < picsRef.value.length - 1) currentIndex.value++
    if (direction.value === 'right' && currentIndex.value > 0) currentIndex.value--
  }
})

const props = defineProps({
  quizz: Object,
  pics: Array,
  nbChoices: { type: Number, default: 4 }
})

const getChoices = () => {
  const pic = currentPic.value
  if (pic.choices) return pic.choices
  const choices = [pic]
  while (choices.length < props.nbChoices) {
    const randomPic = picsRef.value[Math.floor(Math.random() * picsRef.value.length)]
    if (!choices.includes(randomPic)) choices.push(randomPic)
  }
  pic.choices = choices.sort(() => Math.random() - 0.5)
  return pic.choices
}

const getImgClass = (pic) => {
  const baseClass = 'border-4 border-solid hover:scale-125 transition-all cursor-pointer'
  if (!alreadyAnswered(pic)) return baseClass
  const foundClass = pic.found ? 'border-teal-700' : 'border-red-500'
  return [baseClass, foundClass].join(' ')
}

const getPics = () => props.pics.map(pic => ({ ...pic, found: undefined }))
const picsRef = ref(getPics())
const alreadyAnswered = pic => pic.found !== undefined
const end = computed(() => picsRef.value.every(pic => alreadyAnswered(pic)))
const showAnswerTime = 800
const selectedAnswer = ref('')

const handleChoice = async answer => {
  selectedAnswer.value = answer
  currentPic.value.found = answer === currentPic.value.answer
  await new Promise(resolve => setTimeout(resolve, showAnswerTime))
  selectedAnswer.value = ''
  if (currentIndex.value !== picsRef.value.length - 1) currentIndex.value++
}

watchEffect(() => {
  if (end.value) setTimeout(() => wikiLinks.value.scrollIntoView({ behavior: 'smooth' }), 1000)
})

const replay = inject('replay', 'no-replay')
watch(() => props.pics, () => {
  picsRef.value = getPics()
  currentIndex.value = 0
  setTimeout(() => window.scrollTo({ top: 30, behavior: 'smooth' }), 500)
})
</script>

<style>
@keyframes appear {
  from { opacity: 0; scale: .8 }
  to { opacity: 1; scale: 1 }
}

.my-animate-children-appear > * {
  animation: appear linear both;
  animation-timeline: view();
  animation-range: entry 25% cover 50%;
}

@media (prefers-reduced-motion) {
  .my-animate-children-appear > * { animation: none; }
}
</style>
