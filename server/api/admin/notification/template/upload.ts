import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const config = useRuntimeConfig()
  const url = `${config.public.apiNotificationBase}/api/upload-templates`

  return await requestWithRetry('post', url, token, {})
})
