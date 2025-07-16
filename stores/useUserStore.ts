import {defineStore} from 'pinia'
import {useCachedFetch} from "~/composables/useCachedFetch";

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
    async fetchProfile(id, username): Promise<any[]> {
      try {
        if (id) {
          return await useCachedFetch(`pFenRpPsbw:user_profile_${id}`, async () => {
            return await $fetch(`/api/profile/${username}`)
          }, 31536000)
        } else {
          return await useCachedFetch(`pFenRpPsbw:user_profile_${username}`, async () => {
            return await $fetch(`/api/profile/${username}`)
          }, 31536000)
        }

      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    }
  },
})
