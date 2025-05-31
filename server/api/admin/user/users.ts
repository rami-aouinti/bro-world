import { defineEventHandler } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const axiosAuth = await useAuthenticatedAxios()
  try {
    const response = await axiosAuth.get('https://bro-world.org/api/v1/user')

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch users',
    })
  }
})
