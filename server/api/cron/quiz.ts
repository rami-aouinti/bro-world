import {defineEventHandler} from 'h3'

import { requestWithRetry } from '~/server/utils/requestWithRetry'
import { getRedisClient } from '~/server/utils/redis'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const redis = await getRedisClient()

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiGameBase}/platform/quiz/leaderboard`

  try {
    const token = await getUserToken(event)
    const response = await requestWithRetry('get', apiUrl, token)

    if (!response) throw new Error('Empty quiz scores response')

    await redis.set('quiz:scores', JSON.stringify(response), 'EX', 3600) // 1h
    return { status: 'ok', cached: true }
  } catch (error: any) {
    console.error('Cron Quiz Error:', error)
    return { status: 'error', message: error.message }
  }
})
