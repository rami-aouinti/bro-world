import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const followedId = event.context.params?.id
  const axiosAuth = await useAuthenticatedAxios()
  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  await axiosAuth.delete(
    `https://bro-world.org/api/v1/unfollow/` + followedId,
    { }
  )

  return { success: true }
})
