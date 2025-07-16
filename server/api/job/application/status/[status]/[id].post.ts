import {defineEventHandler, getQuery} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const id = event.context.params?.id
  const status = event.context.params?.status
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiJobBase}/api/v1/applications/${status}/${id}`

  return await requestWithRetry('post', apiUrl, token, {})
})
