import { defineEventHandler, readBody } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const body = await readBody(event)
  const id = event.context.params?.id
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/messenger/conversations/${id}/messages`

  return await requestWithRetry('post', url, token, body, false)
})








