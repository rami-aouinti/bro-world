<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGroq } from '~/composables/useGroq'

const { loggedIn } = useUserSession()
const { askGroq } = useGroq()

const showCard = ref(false)
const loading = ref(true)
const weatherInfo = ref('')
const city = ref('')
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const averageRating = ref(0)
const totalReviews = ref(0)
const distribution = ref({
  '0-1': 0,
  '1-2': 0,
  '2-3': 0,
  '3-4': 0,
  '4-5': 0
})

const newRating = ref(0)
const isSubmitting = ref(false)

const topUsers = ref([
  { name: 'Alice', points: 1200 },
  { name: 'Bob', points: 980 },
  { name: 'Charlie', points: 870 }
])
const trophies = ['🥇', '🥈', '🥉']

const fetchStats = async () => {
  const { data, error } = await useFetch('/api/review/get/')
  if (error.value) {
    console.error('Erreur fetch stats:', error.value)
    return
  }

  const result = data.value
  if (result) {
    averageRating.value = result.average_rating ?? 0
    totalReviews.value = result.total_reviews ?? 0
    distribution.value = result.distribution ?? distribution.value
  }
}

const submitRating = async () => {
  if (newRating.value > 0) {
    isSubmitting.value = true
    await useFetch('/api/review/post/', {
      method: 'POST',
      body: { rating: newRating.value }
    })
    newRating.value = 0
    await fetchStats()
    isSubmitting.value = false
  }
}

const getWeatherFromGroq = async (latitude: number, longitude: number) => {
  try {
    const messagePlace = `Based on these coordinates: latitude ${latitude}, longitude ${longitude}, return only the name of the nearest city or place. Just one word or name, no sentence.`
    const messageWeather = `Based on these coordinates: latitude ${latitude}, longitude ${longitude}, return only the current temperature (e.g., "7°C"). Do not write a sentence or explanation, just one value.`

    const placeRaw = await askGroq(messagePlace)
    const weatherRaw = await askGroq(messageWeather)

    const place = placeRaw?.trim().split('\n')[0] ?? 'Unknown location'
    const temperatureMatch = weatherRaw?.match(/-?\d+(\.\d+)?\s*°[CF]/i)
    const temperature = temperatureMatch ? temperatureMatch[0] : 'N/A'

    city.value = place
    weatherInfo.value = temperature
    showCard.value = true
  } catch (e) {
    console.error('Groq error:', e)
    showCard.value = false
  }
}

const news = ref<string[]>([])
const loadingNews = ref(true)

const fetchNewsFromGroq = async () => {
  try {
    const message = `List 5 key global news headlines today. Just output a plain list, one per line. No introduction or extra text. No markdown or asterisks. No numbers.`
    const response = await askGroq(message)

    if (response) {
      const lines = response
        .split('\n')
        .map(line => line.trim())
        .filter(line =>
          line.length > 0 &&
          !line.toLowerCase().includes('news headlines') &&
          !line.toLowerCase().startsWith('here are')
        )

      news.value = lines
    }
  } catch (e) {
    console.error('Groq News error:', e)
    news.value = ['Failed to load the latest news.']
  } finally {
    loadingNews.value = false
  }
}


onMounted(async () => {
  const tasks: Promise<any>[] = []
  await delay(10)
  if (loggedIn.value) {
    tasks.push(fetchStats())
  }
  tasks.push(fetchNewsFromGroq())

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        tasks.push(getWeatherFromGroq(coords.latitude, coords.longitude))
        Promise.all(tasks).finally(() => (loading.value = false))
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        Promise.all(tasks).finally(() => (loading.value = false))
      }
    )
  } else {
    await Promise.all(tasks)
    loading.value = false
  }
})
</script>

<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    color="primary"
    class="my-8 d-flex mx-auto"
  />
  <v-card v-else-if="showCard" rounded="xl" class="mx-3 mb-4" variant="text">
    <div class="px-4 py-4">
      <v-row>
        <v-col cols="8" class="my-auto">
          <p class="text-sm mb-0 font-weight-bold opacity-7">
            Weather today
          </p>
          <h5 class="text-h5 font-weight-bolder mb-0">
            {{ city }} {{ weatherInfo }}
          </h5>
        </v-col>
        <v-col cols="4" class="text-end">
          <v-img src="/img/small-logos/icon-sun-cloud.png" class="w-50 ms-auto" />
          <h5 class="mb-0 text-h5 text-end me-1">Cloudy</h5>
        </v-col>
      </v-row>
    </div>
  </v-card>
  <v-card
    v-if="!loadingNews"
    rounded="xl"
    class="mx-3 mt-4 mb-4"
    variant="text"
  >
    <v-card-title class="text-h6 font-weight-bold text-center">
      🌐 News
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-list class="bg-transparent">
        <v-list-item
          v-for="(item, i) in news"
          :key="i"
          class="px-0 py-1"
        >
          <template #prepend>
            <v-icon color="primary" class="mr-2">mdi-newspaper-variant-outline</v-icon>
          </template>
          <template #default>
            <span class="text-body-2">{{ item }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
  <v-card class="mx-3 my-4" rounded="xl" variant="text">
    <v-card-title class="text-h6 font-weight-bold text-center">
      🏆 Top 3 Members in
      <NuxtLink to="/game" class="text-primary text-decoration-none font-weight-bold ml-1">
        Quiz
      </NuxtLink>
    </v-card-title>
    <v-divider />

    <v-list class="bg-transparent">
      <v-list-item
        v-for="(user, index) in topUsers"
        :key="user.name"
        variant="text"
        class="px-2"
      >
        <template #prepend>
          <v-avatar size="36">
            <span class="text-h6">{{ trophies[index] }}</span>
          </v-avatar>
        </template>

        <template #default>
          <div class="d-flex align-center w-100">
            <span class="font-weight-medium">{{ user.name }}</span>
            <span class="text-body-2 font-weight-bold ms-auto">{{ user.points }} pts</span>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  <v-card v-if="!loading && loggedIn" rounded="xl" class="mx-3" variant="text">
    <v-card-title class="d-flex justify-center mt-auto text-h5">
      <span class="text-h6">Rating overview</span>
    </v-card-title>
    <v-divider />
    <div class="d-flex align-center flex-column my-auto">
      <div class="text-h2 mt-5">
        {{ averageRating }}
        <span class="text-h6 ml-n3">/5</span>
      </div>

      <v-rating :model-value="averageRating" color="primary" half-increments readonly />
      <div class="px-3">{{ totalReviews }} ratings</div>
    </div>

    <v-list bg-color="transparent" class="d-flex flex-column-reverse" density="compact">
      <v-list-item v-for="i in 5" :key="i">
        <v-progress-linear
          :model-value="totalReviews > 0 ? (distribution[`${i - 1}-${i}`] / totalReviews) * 100 : 0"
          class="mx-n5"
          color="primary"
          height="20"
          rounded
        />
        <template v-slot:prepend>
          <span>{{ i }}</span>
          <v-icon class="mx-3" icon="mdi-star" />
        </template>
        <template v-slot:append>
          <div class="rating-values">
            <span class="d-flex justify-end"> {{ distribution[`${i - 1}-${i}`] }} </span>
          </div>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-4" />

    <div class="d-flex align-center justify-center ga-3 mb-4">
      <v-rating
        v-model="newRating"
        half-increments
        color="secondary"
        hover
      />
      <v-btn
        color="primary"
        variant="text"
        :loading="isSubmitting"
        :disabled="newRating === 0"
        @click="submitRating"
      >
        Submit
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
.min-h-section {
  min-height: 280px;
}
</style>
