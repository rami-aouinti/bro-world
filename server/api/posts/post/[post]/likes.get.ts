import { defineEventHandler, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)

  const post = event.context.params?.post

  if (!post) {
    throw createError({ statusCode: 400, message: 'Missing post' })
  }

  const config = useRuntimeConfig()
  const url = `${config.public.apiBlogBase}/private/post/${post}/likes`
  return await requestWithRetry('get', url, token)
})
