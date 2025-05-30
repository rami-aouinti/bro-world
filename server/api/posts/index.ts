import axios from 'axios'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const response = await axios.get(
      'https://blog.bro-world.org/public/post',
    )

    return response.data
  }

  if (method === 'POST') {
    const body = await readBody(event)
    return { message: "Post created", post: body }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
