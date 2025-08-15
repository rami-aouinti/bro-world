<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingQuiz">
      <v-skeleton-loader
        type="list-item-avatar-three-line"
        class="rounded-xl"
      />
    </template>

    <v-card
      v-else
      class="bg-gradient-primary shadow-primary my-4"
      rounded="xl"
      width="100%"
      variant="text"
      elevation="10"
    >
      <div class="bg-gradient-primary shadow-primary py-2">
        <v-toolbar
          color="transparent"
        >
          <v-toolbar-title class="d-flex align-center justify-center font-weight-bold" :class="isDark ? 'text-white' : 'text-default'" to="/quiz">
            {{ t('dashboard.quiz.title') }}
            <NuxtLink
              to="/game"
              class="text-default text-decoration-none font-weight-bold ml-1"
            >
              {{ t('dashboard.quiz.link') }}
            </NuxtLink>
          </v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <v-list class="bg-transparent" role="list">
          <v-list-item
            v-for="(topUser, index) in topUsers"
            :key="topUser.userId?.id ?? index"
            variant="text"
            class="px-4"
            role="listitem"
            aria-label="Quiz ranking item"
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
                <NuxtLink
                  :to="topUser.userId?.username === user?.username ? localePath('/profile') : localePath(`/user/${topUser.userId.username}`)"
                  class="font-weight-bolder text-decoration-none"
                  :class="isDark ? 'text-white' : 'text-default'"
                >
                  <span class="mx-2">
                  <UserAvatar :user="topUser.userId" size="26" color="primary" />
                </span>
                  <span :class="topUser.userId?.id === user?.id ? 'text-primary font-weight-bold' : 'text-default font-weight-medium'">
                  {{ topUser.userId?.firstName }} {{ topUser.userId?.lastName }}
                </span>
                </NuxtLink>

                <span class="text-body-2 ms-auto font-weight-bold" :class="topUser.userId?.id === user?.id ? 'text-primary' : ''">
                  {{ topUser.score }} pts
                </span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UserAvatar from "~/components/App/UserAvatar.vue";
import { useLocalePath } from '#i18n';
const { user } = await useUserSession()
const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const localePath = useLocalePath();
const topUsers = ref<{ name: string; points: number }[]>([])
const trophies = ['🥇', '🥈', '🥉']
const loadingQuiz = ref(true)
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const fetchScores = async () => {
  try {
    const data = await $fetch('/api/quiz/leaderboard')
    topUsers.value = data.leaderboard
    loadingQuiz.value = false
  } catch (error) {
    console.error('Failed to fetch quiz rankings:', error)
  }
}

onMounted(async () => {
  await fetchScores()
})
</script>
