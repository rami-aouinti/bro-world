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
    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Failed to load profile',
    })
  }
})
