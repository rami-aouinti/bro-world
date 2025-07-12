import {defineStore} from 'pinia'
import {useCachedFetch} from "~/composables/useCachedFetch";

export const useConfigurationStore = defineStore('configurations', {
  state: () => ({
    configurations: [] as any[],
    loaded: false,
  }),

  actions: {
    setConfiguration(payload: {
      configurations: any[]
    }) {
      this.configurations = payload.configurations
      this.loaded = true
    },
    async fetchConfigurations(): Promise<any[]> {
      try {
        return await useCachedFetch(`pFenRpPsbw:system_configurations`, async () => {
          return await $fetch(`/api/admin/configuration/configurations`)
        }, 31536000)
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    }
  },
})
