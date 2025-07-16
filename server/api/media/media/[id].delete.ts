import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const id = event.context.params?.id
  const config = useRuntimeConfig()
  const url = `${config.public.apiMediaBase}/v1/platform/media/${id}`
  return await requestWithRetry('delete', url, token)
})
