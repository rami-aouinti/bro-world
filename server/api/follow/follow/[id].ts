import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'
import axios from "axios";

export default defineEventHandler(async (event) => {
  const followedId = event.context.params?.id
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
  if (!followedId) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }
  try {
  await axios.post(
    `https://bro-world.org/api/v1/follow/` + followedId,
    { }, { headers }
  )

  return { success: true }
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        await axios.post(
          `https://bro-world.org/api/v1/follow/` + followedId,
          { }, {headers}
        )
        return { success: true }
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load user after retry',
        })
      }
    }
  }
})
