export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.node.req.method

  if (method === 'POST') {
    return { message: `Post ${id} liked` }
  }

  if (method === 'DELETE') {
    return { message: `Post ${id} disliked` }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
