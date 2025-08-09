import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ friends: any[] }>(event)
  if (!body || !('friends' in body)) {
    throw createError({ statusCode: 400, message: 'Missing "friends" in body' })
  }

  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  // ⚠️ IMPORTANT: on réécrit TOUT l’objet user; ne perds pas de champs !
  await setUserSession(event, {
    user: {
      ...session.user,
      friends: body.friends,
    },
  })

  return { ok: true }
})
