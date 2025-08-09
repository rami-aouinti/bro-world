import { defineEventHandler } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const params = new URLSearchParams(query as Record<string, string>)

  const apiUrl = `${config.public.apiJobBase}/platform/job?${params.toString()}`
  return await requestWithRetry('get', apiUrl)
})
