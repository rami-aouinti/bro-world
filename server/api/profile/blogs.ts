import { defineEventHandler, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const url = 'https://blog.bro-world.org/v1/profile/blog'

  return await requestWithRetry('get', url, token)
})
