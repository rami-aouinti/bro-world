import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const followedId = event.context.params?.id
  const axiosAuth = await useAuthenticatedAxios()
  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }
  try {
  await axiosAuth.post(
    `https://bro-world.org/api/v1/follow/` + followedId,
    { }
  )

  return { success: true }
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        await axiosAuth.post(
          `https://bro-world.org/api/v1/follow/` + followedId,
          { }
        )
        return { success: true }
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load user after retry',
        })
      }
    }
  }
})
