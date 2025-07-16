import { defineEventHandler, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const followedId = event.context.params?.id

  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  const token = await getUserToken(event)
  const url = `https://bro-world.org/api/v1/follow/status/${followedId}`

  return await requestWithRetry('get', url, token)
})
