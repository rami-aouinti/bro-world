import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as any[],
    loaded: false,
  }),
  actions: {
    setPosts(newPosts: any[]) {
      this.posts = newPosts
      this.loaded = true
    },
    clearPosts() {
      this.posts = []
      this.loaded = false
    },
    async fetchPosts() {
      try {
        const { data, error } = await useFetch('/api/posts')
        if (data.value && Array.isArray(data.value)) {
          this.setPosts(data.value)
        }
      } catch (e) {
        console.error('Failed to fetch posts', e)
      }
    },
  },
})
