import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const axiosAuth = await useAuthenticatedAxios()
  const followedId = event.context.params?.id

  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  const response = await axiosAuth.get(`https://bro-world.org/api/v1/follow/status/` + followedId)

  return response.data
})
