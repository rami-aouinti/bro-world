import {defineEventHandler} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBase}/api/plugins/${key}`

  return await requestWithRetry('get', apiUrl)
})
