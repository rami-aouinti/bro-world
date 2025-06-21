import {defineEventHandler, getQuery} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'
import {getUserToken} from "~/server/utils/getUserToken";

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const jobId = event.context.params?.job
  const applicantId = event.context.params?.applicant
  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiJobBase}/api/v1/application/${jobId}/${applicantId}`

  return await requestWithRetry('post', apiUrl, token, {})
})
