import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: "No form data received" })
  }

  const axiosFormData = new FormData()
  for (const { name, data, filename, type } of formData) {
    if (filename) {
      axiosFormData.append(name, new Blob([data], { type }), filename)
    }
  }
  axiosFormData.append('mediaFolder', 'General')
  const config = useRuntimeConfig()
  const url = `${config.public.apiMediaBase}/v1/platform/media`
  return await requestWithRetry('post', url, token, axiosFormData, true)
})
