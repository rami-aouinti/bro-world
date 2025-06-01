import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing username' })
  }

  const axiosAuth = await useAuthenticatedAxios()

  try {
    const response = await axiosAuth.get(`https://blog.bro-world.org/public/post/${slug}`)

    return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axiosAuth.get(`https://blog.bro-world.org/public/post/${slug}`)
        return retryResponse.data
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load user after retry',
        })
      }
    }
  }
})
