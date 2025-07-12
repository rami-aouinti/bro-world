// stores/orderStore.ts
import {defineStore} from 'pinia'
import type {Blog} from '~/types/blog/blog'
import {useCachedFetch} from '~/composables/useCachedFetch'

export const useBlogStore = defineStore('blogStore', () => {
  const blogs = ref<Blog[]>([])
  const loading = ref(false)

  const fetchBlogs = async () => {
    loading.value = true
    const cacheKey = 'admin:blog:blogs:all'
    try {
      return await useCachedFetch<{ 'blog': Blog[] }>(
        cacheKey,
        async () => {

          const {data} = await useBlogApi<{ 'blog': Blog[] }>(
            '/api/v1/blog',
            {key: 'blog', immediate: true}
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

    return blogs.value
  }

  return {
    blogs,
    loading,
    fetchBlogs
  }
})
