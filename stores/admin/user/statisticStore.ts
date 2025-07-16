// stores/statisticStore.ts
import {defineStore} from 'pinia'
import {useCachedFetch} from '~/composables/useCachedFetch'

export const useStatisticStore = defineStore('statisticStore', () => {
  const stats = ref<{
    statistics: any
    usersCount: number
    userGroupsCount: number
    apiKeysCount: number
  }>({
    statistics: null,
    usersCount: 0,
    userGroupsCount: 0,
    apiKeysCount: 0,
  })

  const loading = ref(false)

  const fetchStatistics = async () => {
    loading.value = true
    const cacheKey = 'admin:user:statistics:all'

    try {
      stats.value = await useCachedFetch(
        cacheKey,
        async () => {
          const [
            statisticsRes,
            usersCountRes,
            userGroupsCountRes,
            apiKeysCountRes
          ] = [
            await useUserApi('/api/v1/statistics', {
              key: 'statistics',
              immediate: true
            }),
            await useUserApi('/api/v1/user/count', {
              key: 'usersCount',
              immediate: true
            }),
            await useUserApi('/api/v1/user_group/count', {
              key: 'userGroupsCount',
              immediate: true
            }),
            await useUserApi('/api/v1/api_key/count', {
              key: 'apiKeysCount',
              immediate: true
            }),
          ]

          return {
            statistics: statisticsRes?.value,
            usersCount: usersCountRes?.value,
            userGroupsCount: userGroupsCountRes?.value,
            apiKeysCount: apiKeysCountRes?.value,
          }
        },
        31536000 // 1 an
      )
      return await stats

    } catch (e) {
      console.error('❌ Erreur de chargement des statistiques utilisateur:', e)
    } finally {
      loading.value = false
    }

    return stats.value
  }

  return {
    stats,
    loading,
    fetchStatistics,
  }
})
