import axios from 'axios'

async function waitForSession(event, maxWait = 3000, interval = 100) {
  const start = Date.now()
  let session = await requireUserSession(event)

  while ((!session || !session.user?.token) && (Date.now() - start < maxWait)) {
    await new Promise(resolve => setTimeout(resolve, interval))
    session = await requireUserSession(event)
  }

  return session
}

export default defineEventHandler(async (event) => {
  const session = await waitForSession(event)

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
