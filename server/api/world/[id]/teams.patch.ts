import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const id = event.context.params?.id
  const body = await readBody(event)
  const teams = body.teams

  const config = useRuntimeConfig()
  const url = `${config.public.apiBlogBase}/v1/blog/${id}/teams`
  return await requestWithRetry('patch', url, token, {teams}, false)
})
