import {defineEventHandler, getQuery} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt((query.page as string) || '1', 10)
  const limit = parseInt((query.limit as string) || '20', 10)
  const offset = (page - 1) * limit

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBlogBase}/public/post?page=${page}&limit=${limit}`

  return await requestWithRetry('get', apiUrl)
})
