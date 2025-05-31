import { defineEventHandler } from 'h3'
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
