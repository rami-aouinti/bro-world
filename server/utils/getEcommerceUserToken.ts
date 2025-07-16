import { createError } from 'h3'

export async function getEcommerceUserToken(event: any): Promise<string> {
  let session = await requireUserSession(event)
  let token = session.user.tokenEcommerce
  let retries = 10

  while ((!token || token.trim() === '') && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    session = await requireUserSession(event)
    token = session.user.tokenEcommerce
    retries--
  }

  if (!token) {
    throw createError({ statusCode: 400, message: 'Missing token after retry' })
  }

  return token
}
