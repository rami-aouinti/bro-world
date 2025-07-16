// server/api/messenger/messages/[id]/status.patch.ts
import { defineEventHandler, readBody } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const id = event.context.params?.id
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}/api/v1/messenger/messages/${id}/status`

  return await requestWithRetry('patch', url, token, body, false)
})
