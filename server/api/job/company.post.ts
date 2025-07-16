import { defineEventHandler, createError } from 'h3'
import formidable from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getUserToken(event)
  const form = formidable({ multiples: false })

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })

  const formData = new FormData()

  // 🔐 Toujours forcer en string (évite les erreurs "Arrays not supported")
  formData.append('name', String(fields.name ?? ''))
  formData.append('description', String(fields.description ?? ''))
  formData.append('location', String(fields.location ?? ''))
  formData.append('contactEmail', String(fields.contactEmail ?? ''))
  formData.append('siteUrl', String(fields.siteUrl ?? ''))

  const file = Array.isArray(files.file) ? files.file[0] : files.file

  if (!file) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  formData.append('file', fs.createReadStream(file.filepath), file.originalFilename)

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiJobBase}/api/v1/company`

  return await requestWithRetry('post', apiUrl, token, formData, true)
})
