import { defineEventHandler } from 'h3'
import axios from "axios";

export default defineEventHandler(async (event) => {
  let session = await requireUserSession(event)
  let token = session.user.token
  let retries = 10

  while ((!token || token.trim() === '') && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    session = await requireUserSession(event)
    token = session.user.token
    retries--
  }

  if (!token) {
    throw createError({ statusCode: 400, message: 'Missing token after retry' })
  }

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const method = event.node.req.method

  if (method === 'GET') {
    try {
    const response = await axios.get('https://bro-world.org/api/v1/stories', {headers})

    return response.data} catch (err: any) {
      if (err.response?.status === 401) {
        try {
          const retryResponse = await axios.get('https://bro-world.org/api/v1/stories', {headers})
          return retryResponse.data
        } catch (retryErr: any) {
          throw createError({
            statusCode: retryErr.response?.status || 500,
            message: retryErr.response?.data?.message || 'Failed to load user after retry',
          })
        }
      }
    }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
