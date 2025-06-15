import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const url = 'https://job.bro-world.org/api/v1/job'

  return await requestWithRetry('get', url, token)
})
