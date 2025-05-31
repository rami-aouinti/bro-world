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

  const method = event.node.req.method

  if (method === 'GET') {
    const response = await axios.get(
      'https://bro-world.org/api/v1/stories',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
