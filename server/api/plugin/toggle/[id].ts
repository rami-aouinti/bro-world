import { defineEventHandler, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }

  const token = await getUserToken(event)
  const url = `https://bro-world.org/api/v1/profile/plugin/${id}/toggle`

  return await requestWithRetry('post', url, token, {})
})
