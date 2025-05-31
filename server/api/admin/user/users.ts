import { defineEventHandler } from 'h3'
import axios from 'axios'
import { requireUserSessionSafe } from '~/utils/requireUserSessionSafe'

export default defineEventHandler(async (event) => {
  const session = await requireUserSessionSafe(event)

  if (!session || !session.user || !session.user.token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Missing or invalid session/token',
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
