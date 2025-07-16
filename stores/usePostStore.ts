import {defineStore} from 'pinia'
import {useCachedFetch} from "~/composables/useCachedFetch";

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

    async fetchPost(slug): Promise<any[]> {
      try {
        return await useCachedFetch(`pFenRpPsbw:public_post_${slug}`, async () => {
          return await $fetch(`/api/posts/post/${slug}`)
        }, 31536000)
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async fetchPosts(page = 1, limit = 10): Promise<any[]> {
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        const response = await useCachedFetch(`pFenRpPsbw:post_public_${page}_${limit}`, async () => {
          return await $fetch(`/api/posts?${query.toString()}`)
        }, 31536000)

        if (response && Array.isArray(response.data)) {
          // mise à jour des métadonnées
          this.total = response.count
          this.page = page
          this.limit = limit
          return response.data
        }

        return []
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    }
  },
})
