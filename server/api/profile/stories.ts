import { defineEventHandler } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const axiosAuth = await useAuthenticatedAxios()

  const method = event.node.req.method

  if (method === 'GET') {
    const response = await axiosAuth.get('https://bro-world.org/api/v1/stories')

    return response.data
  }

  throw createError({ statusCode: 405, message: 'Method Not Allowed' })
})
