import axios from 'axios'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {

    try {
    const response = await axios.get(
      'https://blog.bro-world.org/public/post',
    )

    return response.data} catch (err: any) {
      if (err.response?.status === 401) {
        try {
          const retryResponse = await axios.get(
            'https://blog.bro-world.org/public/post',
          )
          return retryResponse.data
        } catch (retryErr: any) {
          throw createError({
            statusCode: retryErr.response?.status || 500,
            message: retryErr.response?.data?.message || 'Failed to load user after retry',
          })
        }
      }
    }
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
