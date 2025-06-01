import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const axiosAuth = await useAuthenticatedAxios()
  const followedId = event.context.params?.id

  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }
  try {
  const response = await axiosAuth.get(`https://bro-world.org/api/v1/follow/status/` + followedId)

  return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axiosAuth.get(`https://bro-world.org/api/v1/follow/status/` + followedId)
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
