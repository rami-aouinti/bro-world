<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="showCard">
      <v-skeleton-loader type="card" class="mx-3 mb-4 rounded-xl" height="120" />
    </template>
    <v-card v-else rounded="xl" class="mx-3 mb-4" variant="text" elevation="10">
      <div class="px-4 py-4">
        <v-row>
          <v-col cols="8" class="my-auto">
            <p class="text-sm mb-0 font-weight-bold opacity-7">
              {{ t('dashboard.weather.title') }}
            </p>
            <h6 class="text-h6 font-weight-bolder mb-0">
              {{ city }} {{ weatherInfo }}
            </h6>
          </v-col>
          <v-col cols="4" class="text-end">
            <v-img src="/img/small-logos/icon-sun-cloud.png" class="w-50 ms-auto" />
            <h6 class="mb-0 text-h6 text-end me-1">{{ t('dashboard.weather.condition') }}</h6>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGroq } from '~/composables/useGroq'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const { loggedIn } = useUserSession()
const { askGroq } = useGroq()
const showCard = ref(true)
const weatherInfo = ref('')
const city = ref('')
const tasks: Promise<any>[] = []


const getWeatherFromGroq = async (latitude: number, longitude: number) => {
  try {
    const messagePlace = t('dashboard.groq.place', {
      lat: latitude,
      lng: longitude
    })
    const messageWeather = t('dashboard.groq.weather', {
      lat: latitude,
      lng: longitude
    })

    const placeRaw = await askGroq(messagePlace)
    const weatherRaw = await askGroq(messageWeather)

    const place = placeRaw?.trim().split('\n')[0] ?? 'Unknown location'
    const temperatureMatch = weatherRaw?.match(/-?\d+(\.\d+)?\s*\u00b0[CF]/i)
    const temperature = temperatureMatch ? temperatureMatch[0] : 'N/A'

    city.value = place
    weatherInfo.value = temperature
    showCard.value = true
  } catch (e) {
    console.error('Groq error:', e)
    showCard.value = false
  }
}
onMounted(async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        tasks.push(getWeatherFromGroq(coords.latitude, coords.longitude))
        Promise.all(tasks).finally(() => (showCard.value = false))
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        Promise.all(tasks).finally(() => (showCard.value = false))
      }
    )
  } else {
    await Promise.all(tasks)
    showCard.value = false
  }
})
</script>
