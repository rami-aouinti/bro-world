import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username

  if (!username) {
    throw createError({ statusCode: 400, message: 'Missing username' })
  }

  const axiosAuth = await useAuthenticatedAxios()

  try {
    const response = await axiosAuth.get(`https://bro-world.org/api/v1/profile/${username}`)

    return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axiosAuth.get(`https://bro-world.org/api/v1/profile/${username}`)
        return retryResponse.data
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load profile after retry',
        })
      }
    }
  }
})
