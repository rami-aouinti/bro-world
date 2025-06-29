import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as any[],
    page: 1,
    limit: 10,
    total: 0,
    loaded: false,
  }),

  actions: {
    setPosts(payload: {
      data: any[],
      page: number,
      limit: number,
      count: number
    }) {
      this.posts = payload.data
      this.page = payload.page
      this.limit = payload.limit
      this.total = payload.count
      this.loaded = true
    },

    appendPost(post: any) {
      this.posts = [post.data, ...this.posts];
    },

    appendPosts(posts: any[]) {
      this.posts = [...this.posts, ...posts]
    },

    clearPosts() {
      this.posts = []
      this.loaded = false
    },

    async fetchPosts(page = 1, limit = 10): Promise<any[]> {
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })

        const { data, error } = await useFetch(`/api/posts?${query.toString()}`)

        if (error.value) throw error.value

        if (data.value && Array.isArray(data.value.data)) {
          // mettre à jour uniquement les métadonnées
          this.total = data.value.count
          this.page = page
          this.limit = limit

          return data.value.data
        }

        return []
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    }
  },
})
