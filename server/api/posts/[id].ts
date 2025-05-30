export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.node.req.method

  if (method === 'GET') {
    return { id, title: "Example Post", content: "This is a post", authorId: 1 }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    return { message: `Post ${id} updated`, data: body }
  }

  if (method === 'DELETE') {
    return { message: `Post ${id} deleted` }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
