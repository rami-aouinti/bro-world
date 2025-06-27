import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const id = event.context.params?.id
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBase}/api/v1/user/${id}`

  return await requestWithRetry('delete', apiUrl, token, false)
})
