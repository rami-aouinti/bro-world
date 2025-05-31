import { defineEventHandler, createError } from 'h3'
import formidable from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import { requireUserSessionSafe } from '~/utils/requireUserSessionSafe'

export default defineEventHandler(async (event) => {
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

  const session = await requireUserSessionSafe(event)
  const token = session?.user?.token

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const formData = new FormData()
  formData.append('file', fs.createReadStream(file.filepath), file.originalFilename)

  try {
    const response = await axios.post('https://bro-world.org/api/v1/story', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    })

    return response.data

  } catch (error) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Erreur lors de l\'envoi de la story',
    })
  }
})
