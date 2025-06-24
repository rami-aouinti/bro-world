<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="loadingNews">
      <v-skeleton-loader type="list-item-two-line" class="mx-3 mb-4 rounded-xl" v-for="i in 3" :key="i" />
    </template>
    <v-card v-else rounded="xl" class="mx-3 mt-4 mb-4" variant="text">
      <v-card-title class="text-h6 font-weight-bold text-center">
        🌐 {{ t('dashboard.news.title') }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-list class="bg-transparent">
          <v-list-item v-for="(item, i) in news" :key="i" class="px-0 py-1">
            <template v-if="isRtl" #append>
              <v-icon color="primary" class="ms-2">mdi-newspaper-variant-outline</v-icon>
            </template>
            <template v-else #prepend>
              <v-icon color="primary" class="mr-2">mdi-newspaper-variant-outline</v-icon>
            </template>
            <template #default>
              <span class="text-body-2">{{ item }}</span>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>


<script setup lang="ts">
import {computed, ref, onMounted} from 'vue'
import {useGroq} from '~/composables/useGroq'
import {useI18n} from 'vue-i18n'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const { loggedIn } = useUserSession()
const { askGroq } = useGroq()

const news = ref<string[]>([])
const loadingNews = ref(true)
const tasks: Promise<any>[] = []

const fetchNewsFromGroq = async () => {
  try {
    const message = t('dashboard.groq.news')
    const response = await askGroq(message)

    if (response) {
      news.value = response
        .split('\n')
        .map(line => line.trim())
        .filter(line =>
          line.length > 0 &&
          !line.toLowerCase().includes('news headlines') &&
          !line.toLowerCase().startsWith('here are')
        )
    }
  } catch (e) {
    console.error('Groq News error:', e)
    news.value = [t('dashboard.news.error')]
  } finally {
    loadingNews.value = false
  }
}

onMounted(async () => {
  tasks.push(fetchNewsFromGroq())
})
</script>
