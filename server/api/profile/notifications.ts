import { defineEventHandler, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' })
  }

  const token = await getUserToken(event)
  const url = 'https://notification.bro-world.org/api/v1/profile/notifications'

  return await requestWithRetry('get', url, token)
})
