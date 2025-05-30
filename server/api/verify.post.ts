import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response = await axios.post(
    'https://bro-world.org/api/v1/auth/verification_email',
    {
      token: body.token,
    },
  )

  return response.data
})
