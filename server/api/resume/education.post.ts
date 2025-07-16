import { defineEventHandler, createError } from 'h3'
import formidable from 'formidable'
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

  formData.append('school', String(fields.school ?? ''))
  formData.append('gradeLevel', String(fields.gradeLevel ?? ''))
  formData.append('name', String(fields.name ?? ''))
  formData.append('description', String(fields.description ?? ''))
  formData.append('startDate', String(fields.startDate ?? ''))
  formData.append('endDate', String(fields.endDate ?? ''))

  const config = useRuntimeConfig()
  const apiUrl = `${config.public.apiJobBase}/api/v1/resume/education`

  return await requestWithRetry('post', apiUrl, token, formData, true)
})
