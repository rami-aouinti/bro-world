import { defineStore } from 'pinia'
import { useCachedFetch } from '~/composables/useCachedFetch'

export const useCommentStore = defineStore('comments', {
  state: () => ({
    comments: {} as Record<string, any[]>,   // { postId: [comments] }
    total: {} as Record<string, number>,     // { postId: totalCount }
    limit: 5,
  }),

  actions: {
    async fetchComments(postId: string, page = 1) {
      const query = new URLSearchParams({ page: page.toString(), limit: this.limit.toString() })
      const data = await useCachedFetch(`comments:${postId}:${page}`, async () => {
        return await $fetch(`/api/posts/${postId}/comments?${query}`)
      }, 300)

      if (data?.comments) {
        if (!this.comments[postId]) this.comments[postId] = []
        this.comments[postId] = page === 1 ? data.comments : [...this.comments[postId], ...data.comments]
        this.total[postId] = data.total
      }
      return this.comments[postId]
    },

    addComment(postId: string, comment: any) {
      if (!this.comments[postId]) this.comments[postId] = []
      this.comments[postId].unshift(comment) // insertion au début
    }
  }
})
