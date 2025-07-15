import {defineEventHandler, readBody} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = await getUserToken(event)
  const { userId, score, questions } = body

  if (!userId || typeof score !== 'number' || !Array.isArray(questions)) {
    return {
      statusCode: 400,
      statusMessage: 'Missing or invalid payload'
    }
  }

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiGameBase}/api/platform/quiz/submit-score`

  return await requestWithRetry('post', apiUrl, token, {
    userId,
    score,
    questions,
  })
})
