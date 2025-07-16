// stores/orderStore.ts
import {defineStore} from 'pinia'
import type {Post} from '~/types/blog/post'
import {useCachedFetch} from '~/composables/useCachedFetch'
import {useBlogApi} from "~/composables/useBlogApi";

export const usePostStore = defineStore('postStore', () => {
  const posts = ref<Post[]>([])
  const loading = ref(false)

  const fetchPosts = async () => {
    loading.value = true
    const cacheKey = 'admin:blog:posts:all'
    try {
      return await useCachedFetch(
        cacheKey,
        async () => {

          const {data} = await useBlogApi(
            '/api/v1/post',
            {key: 'post', immediate: true}
          )
          if (data?.value) {
            return await data.value
          }
        },
        31536000
      )
    } catch (e) {
      console.error('❌ Erreur de chargement des commandes:', e)
    } finally {
      loading.value = false
    }

    return posts.value
  }

  return {
    posts,
    loading,
    fetchPosts
  }
})
