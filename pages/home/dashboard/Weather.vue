<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <v-skeleton-loader
      v-if="loading"
      type="card"
      class="mx-3 mb-4 rounded-xl"
      height="120"
    />

    <v-card
      v-else
      rounded="xl"
      class="bg-gradient-primary shadow-primary mx-3 mb-2"
      variant="text"
      elevation="10"
      :class="{ 'text-end': isRtl, 'text-start': !isRtl }"
    >
      <div class="bg-gradient-primary shadow-primary px-4 py-4">
        <v-row>
          <v-col cols="8" class="my-auto">
            <p class="text-sm mb-0 font-weight-bold opacity-7">
              {{ t('dashboard.weather.title') }}
            </p>
            <h6
              class="text-h6 font-weight-bolder mb-0"
              :class="isDark ? 'text-white' : 'text-default'"
            >
              {{ city }} {{ weatherInfo }}°C
            </h6>
          </v-col>
          <v-col cols="4" class="text-end">
            <NuxtImg
              alt="weather icon"
              src="/img/small-logos/icon-sun-cloud.png"
              class="w-50 ms-auto"
              width="48"
              height="48"
              :lazy-src="'https://placehold.net/7.png'"
              format="webp" loading="lazy" cover
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

const { user, loggedIn } = await useUserSession()
const runtimeConfig = useRuntimeConfig()
const { askGroq } = useGroq()
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const loading = ref(true)
const weatherInfo = ref('')
const city = ref('')
async function getWeather(place: string) {
  try {
    const result = await useCachedFetch('cache:my-weather-' + user?.value?.id, async () => {
      return await $fetch('https://api.weatherapi.com/v1/current.json', {
        query: {
          key: runtimeConfig.public.weatherKey,
          q: place,
        },
      })
    }, 600)

    weatherInfo.value = result?.current?.temp_c ?? 'N/A'
    city.value = result?.location?.name ?? 'Unknown'
  } catch (error) {
    console.error('Weather API error:', error)
    city.value = t('dashboard.weather.unavailable')
    weatherInfo.value = '--'
  } finally {
    loading.value = false
  }
}

async function resolveCityFromLocation(lat: number, lng: number) {
  try {
    const message = t('dashboard.groq.place', { lat, lng })
    const location = await askGroq(message)
    const place = location?.split('\n')[0]?.trim() || 'Berlin'
    await getWeather(place)
  } catch (error) {
    console.error('Geolocation/Groq error:', error)
    await getWeather('Berlin')
  }
}

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolveCityFromLocation(coords.latitude, coords.longitude),
      () => {
        console.warn('Geolocation permission denied')
        getWeather('Berlin')
      }
    )
  } else {
    getWeather('Berlin')
  }
})
</script>
