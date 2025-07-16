import { defineEventHandler, createError } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }

  const url = `https://blog.bro-world.org/public/post/${slug}`

  return await requestWithRetry('get', url)
})
