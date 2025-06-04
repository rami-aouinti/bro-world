import { defineEventHandler, createError } from 'h3'
import axios from "axios";

export default defineEventHandler(async (event) => {

  const followedId = event.context.params?.id

  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
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
  const response = await axios.get(`https://bro-world.org/api/v1/follow/status/` + followedId, {headers})

  return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axios.get(`https://bro-world.org/api/v1/follow/status/` + followedId, {headers})
        return retryResponse.data
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load user after retry',
        })
      }
    }
  }
})
