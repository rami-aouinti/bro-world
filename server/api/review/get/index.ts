import {defineEventHandler} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {useCachedFetch} from "~/composables/useCachedFetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBase}/api/reviews/stats`
  const cached = await useCachedFetch(`reviews:stats`, async () => {
    return await requestWithRetry('get', apiUrl)
  }, 3600)
  if (cached) return cached
})
