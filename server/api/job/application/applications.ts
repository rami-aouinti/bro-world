import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const params = new URLSearchParams(query as Record<string, string>)

  const apiUrl = `${config.public.apiJobBase}/api/v1/profile/job?${params.toString()}`
  return await requestWithRetry('get', apiUrl, token)
})
