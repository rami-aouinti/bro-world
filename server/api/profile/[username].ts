import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username

  if (!username) {
    throw createError({ statusCode: 400, message: 'Missing username' })
  }

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

  try {
    const response = await axios.get(`https://bro-world.org/api/v1/profile/${username}`, {
      headers
    })
    return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Retry once
      try {
        const retryResponse = await axios.get(`https://bro-world.org/api/v1/profile/${username}`, {
          headers
        })
        return retryResponse.data
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load profile after retry',
        })
      }
    }

    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Unknown error',
    })
  }
})
