import { defineEventHandler, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username

  if (!username) {
    throw createError({ statusCode: 400, message: 'Missing username' })
  }

  const token = await getUserToken(event)
  const url = `https://bro-world.org/api/v1/profile/${username}`

  return await requestWithRetry('get', url, token)
})
