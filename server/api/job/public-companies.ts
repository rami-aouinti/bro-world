import { defineEventHandler } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = `${config.public.apiJobBase}/platform/company`

  return await requestWithRetry('get', url)
})
