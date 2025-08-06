import { defineEventHandler, createError } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }
  const config = useRuntimeConfig()
  const url = `${config.public.apiBlogBase}/public/post/${slug}`

  return await requestWithRetry('get', url)
})
