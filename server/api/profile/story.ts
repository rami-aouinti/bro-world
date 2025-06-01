import { defineEventHandler, createError } from 'h3'
import formidable from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import { useAuthenticatedAxios } from '~/composables/useAuthenticatedFetch'

export default defineEventHandler(async (event) => {
  const axiosAuth = await useAuthenticatedAxios()
  const form = formidable({ multiples: false })

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })

  const file = Array.isArray(files.file) ? files.file[0] : files.file

  if (!file) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }


  const formData = new FormData()
  formData.append('file', fs.createReadStream(file.filepath), file.originalFilename)

  try {
    const response = await axiosAuth.post('https://bro-world.org/api/v1/story', formData)

    return response.data

  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axiosAuth.post('https://bro-world.org/api/v1/story', formData)
        return retryResponse.data
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Failed to load user after retry',
        })
      }
    }
  }
})
