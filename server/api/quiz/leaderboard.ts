// server/api/quiz/leaderboard.ts
import { defineEventHandler } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiGameBase}/platform/quiz/leaderboard`

  return await requestWithRetry('get', apiUrl)
})
