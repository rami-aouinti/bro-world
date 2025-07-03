<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- Loader -->
    <template v-if="loading">
      <v-skeleton-loader
        v-for="i in 5"
        :key="'rate-skeleton-' + i"
        type="list-item-two-line"
        class="mx-3 mb-2 rounded-xl"
      />
    </template>

    <!-- Card -->
    <v-card v-else rounded="xl" class="mx-3" variant="text" elevation="10" aria-label="Rating">
      <v-card-title class="d-flex justify-center text-h5">
        <span class="text-h6">{{ t('dashboard.rating.title') }}</span>
      </v-card-title>

      <v-divider />

      <!-- Note globale -->
      <div class="d-flex flex-column align-center my-4">
        <div class="text-h2">
          {{ averageRating.toFixed(1) }}
          <span class="text-h6 ml-1">/5</span>
        </div>
        <v-rating
          :model-value="averageRating"
          color="primary"
          half-increments
          readonly
          size="large"
          aria-label="Average rating"
        />
        <div class="text-caption">
          {{ totalReviews }} {{ t('dashboard.rating.count') }}
        </div>
      </div>

      <!-- Détails distribution -->
      <v-list bg-color="transparent" density="compact">
        <v-list-item
          v-for="i in 5"
          :key="'dist-' + i"
          class="px-1"
          aria-label="Rating bar"
        >
          <template #prepend>
            <span>{{ i }}</span>
            <v-icon class="mx-2" icon="mdi-star" />
          </template>

          <v-progress-linear
            :model-value="getRatingPercent(i)"
            height="20"
            color="primary"
            rounded
            class="flex-grow-1"
          />

          <template #append>
            <span class="ml-2">{{ distribution[`${i - 1}-${i}`] ?? 0 }}</span>
          </template>
        </v-list-item>
      </v-list>

      <v-divider v-if="loggedIn" class="my-4" />

      <!-- Formulaire d’évaluation -->
      <div
        v-if="loggedIn"
        class="d-flex align-center justify-center gap-1 mb-2"
      >
        <v-rating
          v-model="newRating"
          half-increments
          color="secondary"
          hover
          aria-label="Submit your rating"
        />
        <v-btn
          color="primary"
          variant="text"
          :loading="isSubmitting"
          :disabled="newRating === 0"
          @click="submitRating"
        >
          {{ t('dashboard.rating.submit') }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const { loggedIn } = useUserSession()

const loading = ref(true)
const averageRating = ref(0)
const totalReviews = ref(0)
const distribution = ref<Record<string, number>>({
  '0-1': 0,
  '1-2': 0,
  '2-3': 0,
  '3-4': 0,
  '4-5': 0,
})

const newRating = ref(0)
const isSubmitting = ref(false)

const getRatingPercent = (i: number) => {
  const key = `${i - 1}-${i}`
  const value = distribution.value[key] ?? 0
  return totalReviews.value > 0 ? (value / totalReviews.value) * 100 : 0
}

const fetchStats = async () => {
  try {
    const response = await $fetch('/api/review/get/')
    averageRating.value = response?.average_rating ?? 0
    totalReviews.value = response?.total_reviews ?? 0
    distribution.value = response?.distribution ?? distribution.value
  } catch (error) {
    console.error('Erreur lors du chargement des stats :', error)
  } finally {
    loading.value = false
  }
}

const submitRating = async () => {
  if (!loggedIn || newRating.value === 0) return

  isSubmitting.value = true
  try {
    await $fetch('/api/review/post/', {
      method: 'POST',
      body: { rating: newRating.value },
    })
    newRating.value = 0
    await fetchStats()
  } catch (error) {
    console.error('Erreur lors de la soumission du rating :', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchStats)
</script>
