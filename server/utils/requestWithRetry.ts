import axios from 'axios'
import { createError } from 'h3'

export async function requestWithRetry(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  token?: string,
  data: any = null,
  isMultipart: boolean = false
) {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (isMultipart) headers['Content-Type'] = 'multipart/form-data'

  try {
    const response = await axios({ method, url, headers, data })
    return response.data
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        const retryResponse = await axios({ method, url, headers, data })
        return retryResponse.data
      } catch (retryErr: any) {
        throw createError({
          statusCode: retryErr.response?.status || 500,
          message: retryErr.response?.data?.message || 'Retry failed',
        })
      }
    }

    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Request failed',
    })
  }
}
