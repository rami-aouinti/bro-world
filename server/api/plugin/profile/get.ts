import {defineEventHandler} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiBase}/api/v1/profile/plugins`

  return await requestWithRetry('get', apiUrl, token)
})
