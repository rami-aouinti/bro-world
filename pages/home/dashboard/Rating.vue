<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loading">
      <v-skeleton-loader
        type="list-item-two-line"
        class="mx-3 mb-4 rounded-xl"
        v-for="i in 5"
        :key="'rate' + i"
      />
    </template>

    <v-card v-else rounded="xl" class="mx-3" variant="text">
      <v-card-title class="d-flex justify-center mt-auto text-h5">
        <span class="text-h6">{{ t('dashboard.rating.title') }}</span>
      </v-card-title>

      <v-divider />

      <div class="d-flex align-center flex-column my-auto">
        <div class="text-h2 mt-5">
          {{ averageRating }}
          <span class="text-h6 ml-n3">/5</span>
        </div>

        <v-rating
          :model-value="averageRating"
          color="primary"
          half-increments
          readonly
        />
        <div class="px-3">
          {{ totalReviews }} {{ t('dashboard.rating.count') }}
        </div>
      </div>

      <v-list
        bg-color="transparent"
        class="d-flex flex-column-reverse"
        density="compact"
      >
        <v-list-item v-for="i in 5" :key="i">
          <v-progress-linear
            :model-value="totalReviews > 0 ? (distribution[`${i - 1}-${i}`] / totalReviews) * 100 : 0"
            class="mx-n5"
            color="primary"
            height="20"
            rounded
          />
          <template #prepend>
            <span>{{ i }}</span>
            <v-icon class="mx-3" icon="mdi-star" />
          </template>
          <template #append>
            <div class="rating-values">
              <span class="d-flex justify-end">{{ distribution[`${i - 1}-${i}`] }}</span>
            </div>
          </template>
        </v-list-item>
      </v-list>

      <v-divider class="my-4" />

      <div v-if="loggedIn" class="d-flex align-center justify-center ga-3 mb-4">
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
          {{ t('dashboard.rating.submit') }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
const readyRating = ref(true)
const isSubmitting = ref(false)

const fetchStats = async () => {
  const { data, error } = await useFetch('/api/review/get/')
  if (error.value) {
    readyRating.value = false
    console.error('Failed to load reviews:', error.value)
    return
  }

  if (data.value) {
    readyRating.value = false
    averageRating.value = data.value.average_rating ?? 0
    totalReviews.value = data.value.total_reviews ?? 0
    distribution.value = data.value.distribution ?? distribution.value
  }

  loading.value = false
}

const submitRating = async () => {
  if (newRating.value > 0) {
    isSubmitting.value = true

    await $fetch('/api/review/post/', {
      method: 'POST',
      body: { rating: newRating.value },
    })

    newRating.value = 0
    await fetchStats()

    isSubmitting.value = false
  }
}
watch(readyRating, () => {
  fetchStats()
}, { immediate: true })

onMounted(fetchStats)
</script>
