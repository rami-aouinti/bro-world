import { defineEventHandler, getQuery } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string
  const level = query.level as string

  if (!category || !level) {
    throw createError({ statusCode: 400, statusMessage: 'Category and Level are required' })
  }

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiGameBase}/platform/quiz/generate?category=${category}&level=${level}`

  return await requestWithRetry('get', apiUrl)
})
