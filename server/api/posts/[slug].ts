import { defineEventHandler, createError } from 'h3'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing username' })
  }

  const axiosAuth = await useAuthenticatedAxios()

  try {
    const response = await axiosAuth.get(`https://blog.bro-world.org/public/post/${slug}`)

    return response.data
  } catch (err: any) {
    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Failed to load profile',
    })
  }
})
