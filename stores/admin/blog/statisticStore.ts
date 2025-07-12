// stores/orderStore.ts
import {defineStore} from 'pinia'
import type {Statistics} from '~/types/blog/statistics'
import {useCachedFetch} from '~/composables/useCachedFetch'
import {useBlogApi} from "~/composables/useBlogApi";

export const useStatisticStore = defineStore('statisticStore', () => {
  const statistics = ref<Statistics[]>([])
  const loading = ref(false)

  const fetchStatistics = async () => {
    loading.value = true
    const cacheKey = 'admin:blog:statistics:all'
    try {
      return await useCachedFetch(
        cacheKey,
        async () => {

          const {data} = await useBlogApi(
            '/api/v1/statistics',
            {key: 'statistics', immediate: true}
          )
          if (data?.value) {
            return await data.value
          }
        },
        31536000
      )
    } catch (e) {
      console.error('❌ Erreur de chargement des commandes:', e)
    } finally {
      loading.value = false
    }

    return statistics.value
  }

  return {
    statistics,
    loading,
    fetchStatistics
  }
})
