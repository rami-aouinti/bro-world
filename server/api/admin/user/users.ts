import { defineEventHandler } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (!session?.user?.token) {
    throw createError({
      statusCode: 401,
      message: 'Session is missing token (expired or not yet initialized)',
    })
  }

  const token = session.user.token

  try {
    const response = await axios.get('https://bro-world.org/api/v1/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch users',
    })
  }
})
