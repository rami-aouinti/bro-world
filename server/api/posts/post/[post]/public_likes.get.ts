import { defineEventHandler, createError } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const post = event.context.params?.post

  if (!post) {
    throw createError({ statusCode: 400, message: 'Missing post' })
  }

  const config = useRuntimeConfig()
  const url = `${config.public.apiBlogBase}/public/post/${post}/likes`
  return await requestWithRetry('get', url)
})
