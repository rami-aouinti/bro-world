import { createError } from 'h3'

async function waitForSession(event, maxWait = 3000, interval = 100) {
  const start = Date.now()
  let session = await requireUserSession(event)

  while ((!session || !session.user?.token) && (Date.now() - start < maxWait)) {
    await new Promise(resolve => setTimeout(resolve, interval))
    session = await requireUserSession(event)
  }

  return session
}

export async function requireUserSessionSafe(event) {
  const session = await waitForSession(event)

  if (!session || !session.user || !session.user.token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized (invalid session or missing token)',
    })
  }

  return session
}
