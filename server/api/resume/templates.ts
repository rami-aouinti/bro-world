import {defineEventHandler} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiJobBase}/platform/resume/templates`

  return await requestWithRetry('get', apiUrl)
})
