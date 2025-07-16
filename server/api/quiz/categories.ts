import {defineEventHandler, getQuery} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiGameBase}/platform/categories`

  return await requestWithRetry('get', apiUrl)
})
