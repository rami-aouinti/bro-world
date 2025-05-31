import axios from 'axios'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
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
