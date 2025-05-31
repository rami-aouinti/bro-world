import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await axios.post(
    'https://bro-world.org/api/v1/auth/get_token',
    {
      username: body.username,
      password: body.password,
    },
  )

  axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token

  const userResponse = await axios.get(
    'https://bro-world.org/api/v1/profile',
  )

  const user = userResponse.data

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.username,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      roles: user.roles
    }
  })
  user.token = response.data.token
  return user
})
