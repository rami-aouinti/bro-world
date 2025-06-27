import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const config = useRuntimeConfig()
  const url = `${config.public.apiNotificationBase}/api/v1/notifications`

  return await requestWithRetry('get', url, token)
})
