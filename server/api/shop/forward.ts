// server/api/admin/shop/forward.ts
import { defineEventHandler, getQuery, readBody } from 'h3'
import { getEcommerceUserToken } from '~/server/utils/getEcommerceUserToken'
import { requestWithRetry } from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getEcommerceUserToken(event)
  const query = getQuery(event)
  const method = (query.method || 'GET').toString().toUpperCase()
  const endpoint = query.endpoint?.toString()

  if (!endpoint) {
    throw createError({ statusCode: 400, statusMessage: 'Missing endpoint param' })
  }

  const body = ['POST', 'PUT', 'PATCH'].includes(method) ? await readBody(event) : null
  const url = `https://ecommerce.bro-world.org${endpoint}`

  return await requestWithRetry(method, url, token, body, false, true)
})
