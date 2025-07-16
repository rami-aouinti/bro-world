import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {

  const token = await getUserToken(event)
  const url = 'https://bro-world.org/api/v1/profile/delete'

  const user = await requestWithRetry('delete', url, token)

  await setUserSession(event, {
    user: {},
  })

  return user
})
