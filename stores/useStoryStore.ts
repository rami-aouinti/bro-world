import {defineStore} from 'pinia'
import {useCachedFetch} from "~/composables/useCachedFetch";

export const useStoryStore = defineStore('story', {
  state: () => ({
    stories: [] as any[],
    loaded: false,
  }),

  actions: {
    appendStory(story: any) {
      this.stories = [story.data, ...this.stories];
    },
    setStory(payload: {
      stories: any[]
    }) {
      this.stories = payload.stories
      this.loaded = true
    },
    async createStory(id, formData): Promise<any[]> {
      try {
        const response = await $fetch('/api/profile/story', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        })
        if (response) {
          return response
        }
      }
      catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },
    async fetchStories(id): Promise<any[]> {
      try {
        return await useCachedFetch(`pFenRpPsbw:profile:stories_${id}`, async () => {
          return await $fetch('/api/profile/stories')
        }, 1000)

      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },
  },
})
