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
  },
})
