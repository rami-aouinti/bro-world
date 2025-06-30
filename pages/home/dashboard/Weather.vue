<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="showCard">
      <v-skeleton-loader
        type="card"
        class="mx-3 mb-4 rounded-xl"
        height="120"
      />
    </template>
    <v-card v-else rounded="xl" class="mx-3 mb-4" variant="text" elevation="10">
      <div class="px-4 py-4">
        <v-row>
          <v-col cols="8" class="my-auto">
            <p class="text-sm mb-0 font-weight-bold opacity-7">
              {{ t('dashboard.weather.title') }}
            </p>
            <h6 class="text-h6 font-weight-bolder mb-0">
              {{ city }} {{ weatherInfo }}°C
            </h6>
          </v-col>
          <v-col cols="4" class="text-end">
            <v-img
              alt="weather image"
              src="/img/small-logos/icon-sun-cloud.png"
              class="w-50 ms-auto"
            />
            <h6 class="mb-0 text-h6 text-end me-1">
              {{ t('dashboard.weather.condition') }}
            </h6>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroq } from '~/composables/useGroq'
import { useCachedFetch } from '~/composables/useCachedFetch'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const { loggedIn } = useUserSession()
const runtimeConfig = useRuntimeConfig()
const { askGroq } = useGroq()

const showCard = ref(true)
const weatherInfo = ref('')
const city = ref('')

const getWeather = async (place: string) => {
  const result = await useCachedFetch('my-weather', async () => {
    const data = await $fetch('https://api.weatherapi.com/v1/current.json', {
      query: {
        key: runtimeConfig.public.weatherKey,
        q: place,
      },
    })
    return toRaw(data)
  }, 600)

  weatherInfo.value = result?.current?.temp_c ?? ''
  city.value = result?.location?.name ?? ''
}

const getWeatherFromGroq = async (latitude: number, longitude: number) => {
  try {
    const messagePlace = t('dashboard.groq.place', {
      lat: latitude,
      lng: longitude,
    })

    const placeRaw = await askGroq(messagePlace)
    const place = placeRaw?.trim().split('\n')[0] ?? 'Unknown location'

    await getWeather(place)
  } catch (e) {
    console.error('Groq error:', e)
  } finally {
    showCard.value = false
  }
}

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        getWeatherFromGroq(coords.latitude, coords.longitude)
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        showCard.value = false
      }
    )
  } else {
    showCard.value = false
  }
})
</script>
