import { defineEventHandler, readBody } from 'h3'
import axios from 'axios'

import https from 'https'
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  checkServerIdentity: () => null,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await axios.post(
    'https://bro-world-system.de/api/v1/auth/register',
    {
      email: body.email,
      password: body.password,
      repeatPassword: body.repeatPassword,
    },
    { httpsAgent },
  )

  return !!response.data
})
