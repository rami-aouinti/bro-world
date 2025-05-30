export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    return [
      { id: "1", title: "Post 1", content: "Hello World!", authorId: 1 },
      { id: "2", title: "Post 2", content: "Nuxt 3 is awesome!", authorId: 2 }
    ]
  }

  if (method === 'POST') {
    const body = await readBody(event)
    return { message: "Post created", post: body }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
