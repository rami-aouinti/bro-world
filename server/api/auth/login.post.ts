import { defineEventHandler, readBody, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, message: 'Missing username or password' })
  }

  try {
    const response = await axios.post('https://bro-world.org/api/v1/auth/login', {
      username: body.username,
      password: body.password,
    })

    const user = response.data.profile
    user.token = response.data.token

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.username,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profile: user?.profile,
        enabled: user.enabled,
        avatar: user.avatar,
        token: user.token,
        roles: user.roles,
      },
    })

    return user

  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Login failed',
    })
  }
})
