import {defineEventHandler, getQuery} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const jobId = event.context.params?.job
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiJobBase}/api/v1/job/${jobId}`
  return await requestWithRetry('get', apiUrl, token)
})
