import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await axios.post(
    'https://bro-world.org/api/v1/auth/login',
    {
      username: body.username,
      password: body.password,
    },
  )

  const user = response.data.profile
  const token = response.data.token

  await setUserSession(event, { user })
  user.token = token
  return user
})
