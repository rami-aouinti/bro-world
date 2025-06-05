import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import FormData from 'form-data'
import { getUserToken } from '~/server/utils/getUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: "No form data received" })
  }

  const axiosFormData = new FormData()
  for (const { name, data, filename, type } of formData) {
    axiosFormData.append(name, data)
  }

  const token = await getUserToken(event)
  const url = 'https://bro-world.org/api/v1/profile/update'

  const user = await requestWithRetry('post', url, token, axiosFormData, true)

  // Mettre à jour la session locale
  await setUserSession(event, {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      enabled: user.enabled,
      profile: user?.profile,
      roles: user.roles,
    },
  })

  return user
})
