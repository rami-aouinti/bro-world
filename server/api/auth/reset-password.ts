import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password, confirmPassword, token } = body || {}

  if (!email || !password || !confirmPassword) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  try {
    const response = await axios.post('https://bro-world.org/api/auth/reset-password', {
      email,
      token,
      password,
      confirmPassword,
    })

    return !!response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Registration failed',
    })
  }
})
