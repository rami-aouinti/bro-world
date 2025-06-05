import { defineEventHandler, readBody } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.token) {
    throw new Error('Missing token in request body')
  }

  const url = 'https://bro-world.org/api/v1/auth/verification_email'

  return await requestWithRetry('post', url, undefined, { token: body.token })
})
