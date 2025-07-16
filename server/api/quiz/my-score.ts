// server/api/quiz/my-score.ts
import { defineEventHandler } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  if (!token) {
    return {
      statusCode: 401,
      statusMessage: 'Unauthorized'
    }
  }
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiGameBase}/api/platform/quiz/final-score`

  return await requestWithRetry('get', apiUrl, token)
})
