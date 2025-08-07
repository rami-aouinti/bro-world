import {defineStore} from 'pinia'
import {useCachedFetch} from "~/composables/useCachedFetch";
import { deleteCachedKey } from '~/composables/useCachedFetch'

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
        return await useCachedFetch(`giUbFlBbPL:public_post_${slug}`, async () => {
          return await $fetch(`/api/posts/post/${slug}`)
        }, 300)
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async fetchReact(id): Promise<any[]> {
      try {
        return await useCachedFetch(`giUbFlBbPL:private_post_${id}_reacts`, async () => {
          return await $fetch(`/api/posts/post/${id}/likes`)
        }, 300)
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async fetchPublicReact(id): Promise<any[]> {
      try {
        return await useCachedFetch(`giUbFlBbPL:public_post_${id}_reacts`, async () => {
          return await $fetch(`/api/posts/post/${id}/public_likes`)
        }, 300)
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async fetchComments(id): Promise<any[]> {
      try {
        return await useCachedFetch(`giUbFlBbPL:public_post_${id}_comments`, async () => {
          return await $fetch(`/api/posts/post/${id}/comments`)
        }, 300)
      } catch (e) {
        console.error('Failed to fetch posts', e)
        return []
      }
    },

    async invalidateReactCache(id: string | number) {
      await deleteCachedKey(`giUbFlBbPL:public_post_${id}_reacts`)
      await deleteCachedKey(`giUbFlBbPL:private_post_${id}_reacts`)
    },

    async fetchPosts(page = 1, limit = 10, userId?): Promise<any[]> {
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })

        let response: any

        if (userId) {
          response = await useCachedFetch(
            `giUbFlBbPL:posts_page_${page}_limit_${limit}_user_${userId}`,
            async () => await $fetch(`/api/posts?${query.toString()}`),
            300
          )
        } else {
          response = await useCachedFetch(
            `giUbFlBbPL:posts_page_${page}_limit_${limit}`,
            async () => await $fetch(`/api/posts/public?${query.toString()}`),
            300
          )
        }

        if (response?.data && Array.isArray(response.data)) {
          this.total = response.count ?? 0
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
