// stores/userStore.ts
import {defineStore} from 'pinia'

interface ApiKey {
  id: string
}

interface ApiKeyState {
  apiKeys: ApiKey[]
  loading: boolean
}

export const useApiKeyStore = defineStore('apiKey', {
  state: (): ApiKeyState => ({
    apiKeys: [],
    loading: false,
  }),

  actions: {
    async fetchApiKeys() {
      try {
        this.loading = true
        this.apiKeys = await $fetch('/api/admin/user/apiKeys')
      } catch (error) {
        console.error('Error fetching apiKeys:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
