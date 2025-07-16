<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingNews">
      <v-skeleton-loader
        type="list-item-two-line"
        class="mx-3 mb-4 rounded-xl"
        v-for="i in 3"
        :key="i"
      />
    </template>

    <v-card
      v-else
      rounded="xl"
      class="bg-gradient-primary shadow-primary mx-3 mt-4 mb-4"
      variant="text"
      elevation="10"
      aria-labelledby="news-title"
    >
      <div class="bg-gradient-primary shadow-primary px-4 py-2">
        <v-toolbar
          color="transparent"
        >
          <v-app-bar-nav-icon color="primary">🌐</v-app-bar-nav-icon>
          <v-toolbar-title :class="isDark ? 'text-white' : 'text-default'"
                           style="text-shadow: 1px 1px 2px rgb(var(--v-theme-primary));">
            {{ t('dashboard.news.title') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-divider />

        <v-card-text>
          <v-list class="bg-transparent" role="list">
            <v-list-item
              v-for="(item, index) in news"
              :key="index"
              class="px-0 py-1"
              aria-label="News item"
              role="listitem"
            >
              <template v-if="isRtl" #append>
                <v-icon color="primary" class="ms-1">mdi-newspaper-variant-outline</v-icon>
              </template>
              <template v-else #prepend>
                <v-icon color="primary" class="mr-1">mdi-newspaper-variant-outline</v-icon>
              </template>

              <template #default>
                <span :class="isDark ? 'text-white' : 'text-default'">{{ item }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGroq } from '~/composables/useGroq'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const news = ref<string[]>([])
const loadingNews = ref(true)
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
onMounted(async () => {
  try {
    const { askGroq } = useGroq()
    const message = t('dashboard.groq.news')

    const raw = await askGroq(message)

    news.value = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.toLowerCase().includes('news headlines') &&
          !line.toLowerCase().startsWith('here are')
      )
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error)
    news.value = []
  } finally {
    loadingNews.value = false
  }
})
</script>
