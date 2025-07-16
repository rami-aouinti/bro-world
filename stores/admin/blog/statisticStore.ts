// stores/statisticStore.ts
import {defineStore} from 'pinia'
import {useCachedFetch} from '~/composables/useCachedFetch'

export const useStatisticBlogStore = defineStore('statisticStore', () => {
  const stats = ref<any>({
    statistics: null,
    blogsCount: 0,
    postsCount: 0,
    likesCount: 0,
  })
  const loading = ref(false)

  const fetchStatistics = async () => {
    loading.value = true
    const cacheKey = 'admin:blog:statistics:all'

    try {
      // Assignation après mise en cache (évite les refs dans le cache)
      stats.value = await useCachedFetch(
        cacheKey,
        async () => {
          const [
            statisticsRes,
            blogsCountRes,
            postsCountRes,
            likesCountRes
          ] = [
            await useBlogApi('/api/v1/statistics', {
              key: 'statistics',
              immediate: true
            }),
            await useBlogApi('/api/v1/blog/count', {
              key: 'blogsCount',
              immediate: true
            }),
            await useBlogApi('/api/v1/post/count', {
              key: 'postsCount',
              immediate: true
            }),
            await useBlogApi('/api/v1/like/count', {
              key: 'likesCount',
              immediate: true
            }),
          ]

          return {
            statistics: statisticsRes?.statistics?.value,
            blogsCount: blogsCountRes?.blogsCount?.value,
            postsCount: postsCountRes?.postsCount?.value,
            likesCount: likesCountRes?.likesCount?.value,
          }
        },
        31536000 // 1 an en secondes
      )
      return await stats

    } catch (e) {
      console.error('❌ Erreur de chargement des statistiques:', e)
    } finally {
      loading.value = false
    }

    return stats.value
  }

  return {
    stats,
    loading,
    fetchStatistics
  }
})
