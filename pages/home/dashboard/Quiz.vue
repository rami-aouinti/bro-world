<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingQuiz">
      <v-skeleton-loader
        type="list-item-avatar-three-line"
        class="mx-3 mb-4 rounded-xl"
      />
    </template>

    <v-card
      v-else
      class="mx-3 my-4"
      rounded="xl"
      variant="text"
      elevation="10"
    >
      <v-card-title class="text-h6 font-weight-bold text-center">
        🏆 {{ t('dashboard.quiz.title') }}
        <NuxtLink
          to="/game"
          class="text-primary text-decoration-none font-weight-bold ml-1"
        >
          {{ t('dashboard.quiz.link') }}
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
              <span class="text-h6">
                {{ trophies[index] || '🏅' }}
              </span>
            </v-avatar>
          </template>

          <template #default>
            <div class="d-flex align-center w-100">
              <span class="font-weight-medium">{{ user.name }}</span>
              <span class="text-body-2 font-weight-bold ms-auto">
                {{ user.points }} pts
              </span>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const topUsers = ref<{ name: string; points: number }[]>([])
const trophies = ['🥇', '🥈', '🥉']
const loadingQuiz = ref(true)

const fetchQuiz = async () => {
  try {
    // API call simulation or real fetch
    topUsers.value = [
      { name: 'Alice', points: 1200 },
      { name: 'Bob', points: 980 },
      { name: 'Charlie', points: 870 }
    ]
  } catch (error) {
    console.error('Failed to fetch quiz rankings:', error)
  } finally {
    loadingQuiz.value = false
  }
}

onMounted(async () => {
  await fetchQuiz()
})
</script>
