// server/api/posts.ts
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method !== 'GET') {
    throw createError({ statusCode: 405, message: 'Method Not Allowed' })
  }

  const query = getQuery(event)
  const page = parseInt(query.page as string || '1', 10)
  const limit = parseInt(query.limit as string || '10', 10)
  const offset = (page - 1) * limit

  try {
    const response = await axios.get(`https://blog.bro-world.org/public/post?page=${page}&limit=${limit}`)
    return response.data.slice(offset, offset + limit)
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axios.get(`https://blog.bro-world.org/public/post?page=${page}&limit=${limit}`)
        return retryResponse.data.slice(offset, offset + limit)
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load posts after retry',
        })
      }
    }

    // gestion des autres erreurs
    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Failed to fetch posts',
    })
  }
})
