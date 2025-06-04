import { defineEventHandler, createError } from 'h3'
import axios from "axios";
import FormData from 'form-data'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
   if (!formData || formData.length === 0) {
    throw new Error("No form data received");
  }

  const axiosFormData = new FormData();


  formData.forEach(({ name, data, filename, type }) => {
    axiosFormData.append(name, data);
  });

  let session = await requireUserSession(event)
  let token = session.user.token
  let retries = 10

  while ((!token || token.trim() === '') && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100))
    session = await requireUserSession(event)
    token = session.user.token
    retries--
  }

  if (!token) {
    throw createError({ statusCode: 400, message: 'Missing token after retry' })
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  try {
    const response = await axios.post('https://bro-world.org/api/v1/profile/update', axiosFormData, {headers})

    const user = response.data

    await setUserSession(event, {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        enabled: user.enabled,
        profile: user?.profile,
        roles: user.roles,
      }
    })
    return response.data



  } catch (error) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to update',
    })
  }
})
