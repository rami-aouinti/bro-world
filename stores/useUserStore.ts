import {defineStore} from 'pinia'
import {deleteCachedKey, useCachedFetch} from "~/composables/useCachedFetch";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: [] as any[],
    loaded: false,
  }),

  actions: {
    setUser(payload: {
      user: any[]
    }) {
      this.user = payload.user
      this.loaded = true
    },

    async invalidateProfileCache(userId): Promise<any[]>  {
      await deleteCachedKey(`pFenRpPsbw:user_profile_${userId}`)
      return this.fetchProfile(userId)
    },

    async fetchFriends(id): Promise<any[]> {
      try {
        return await useCachedFetch(`pFenRpPsbw:user_friends_${id}`, async () => {
          return await $fetch(`/api/profile/friends`)
        }, 300)

      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async fetchProfile(id): Promise<any[]> {
      try {
        return await useCachedFetch(`pFenRpPsbw:user_profile_${id}`, async () => {
          return await $fetch(`/api/profile/${id}`)
        }, 300)

      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    }
  },
})
