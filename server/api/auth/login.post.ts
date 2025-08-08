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
    if (user.username === 'john-root') {
      const responseEcommerce = await axios.post('https://ecommerce.bro-world.org/api/v2/admin/administrators/token', {
        email: user.email,
        password: body.password,
      })
      user.adminUser = responseEcommerce.data.adminUser
      user.tokenEcommerce = responseEcommerce.data.token
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.username,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        enabled: user?.enabled,
        photo: user?.photo,
        token: response.data.token,
        tokenEcommerce: user?.tokenEcommerce,
        customerEcommerce: user?.adminUser,
        roles: user.roles,
        friends: user.friends,
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
