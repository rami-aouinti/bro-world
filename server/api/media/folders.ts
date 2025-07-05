import {defineEventHandler, getQuery} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = await getUserToken(event)
  const apiUrl = `${config.public.apiMediaBase}/v1/platform/mediaFolder`

  return await requestWithRetry('get', apiUrl, token)
})
