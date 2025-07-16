<template>
  <div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <v-expand-transition>
      <GhostLoader
        v-if="!ready"
        :nbItems="quizz.nbPics"
        class="w-full max-w-3xl mx-auto my-8"
      />
    </v-expand-transition>

    <div v-if="pics.length">
      <Choice
        v-if="quizz.quizzTemplate === 'choice'"
        :pics="pics"
        :nbChoices="4"
        :class="{ 'opacity-0': !ready }"
        :quizz="quizz"
      />
      <Drag
        v-else
        :picsInit="pics"
        :class="{ 'opacity-0': !ready }"
        :swap="!quizz.no_swap"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, provide } from 'vue'
import GhostLoader from '~/components/Quizz/GhostLoader.vue'
import Choice from '~/components/Quizz/Choice.vue'
import Drag from '~/components/Quizz/Drag.vue'

const imgWidth = 300
const date = ref('')
const dateLine = computed(() => `# SPARQL query: ${date.value}`)

const defaultImageLabel = 'image'
const defaultAnswerLabel = 'answerLabel'

const props = defineProps<{
  quizz: {
    nbPics: number
    quizzTemplate: string
    no_swap?: boolean
    imageLabel?: string
    answerLabel?: string
  },
  sparqlQuery: string
}>()

const limit = `LIMIT ${props.quizz.nbPics + 8}`
const sparqlQuery = props.sparqlQuery + limit

const baseUrl = 'https://query.wikidata.org/sparql?query='
const fullUrl = computed(() =>
  baseUrl + encodeURIComponent(dateLine.value + sparqlQuery)
)

const headers = { Accept: 'application/json' }
const { data: items, error } = await useFetch(fullUrl, {
  headers,
  server: false
})

const pics = ref<any[]>([])

const cleanResults = (receivedPictures: any[]) =>
  receivedPictures
    .filter(p =>
      !p.answer.includes('http') &&
      !p.answer.includes('|') &&
      !p.src.includes('.tiff')
    )
    .filter((p, i, self) =>
      i === self.findIndex(t => t.answer === p.answer || t.src === p.src)
    )
    .map(p => ({
      ...p,
      src: p.src.replace('http://', 'https://')
    }))

watchEffect(() => {
  if (items.value) {
    const receivedPictures = items.value.results.bindings.map((item: any) => ({
      src: item[props.quizz.imageLabel ?? defaultImageLabel].value + `?width=${imgWidth}`,
      answer: item[props.quizz.answerLabel ?? defaultAnswerLabel].value,
      article: item.article?.value,
      name: item.itemLabel?.value ?? item.peintureLabel?.value
    }))
    const cleanPics = cleanResults(receivedPictures)
    pics.value = cleanPics.slice(0, props.quizz.nbPics)
  }
})

const replay = ref(false)
provide('replay', replay)

watchEffect(() => {
  if (replay.value) {
    date.value = new Date().toLocaleString()
  }
})

const ready = ref(false)
watchEffect(() => {
  if (pics.value.length) {
    setTimeout(() => {
      ready.value = true
      replay.value = false
    }, 700)
  }
})
</script>
