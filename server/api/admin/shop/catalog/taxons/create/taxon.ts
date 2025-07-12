import { defineEventHandler, readMultipartFormData, readBody, createError } from 'h3'
import { requestWithRetry } from '~/server/utils/requestWithRetry'
import {getEcommerceUserToken} from "~/server/utils/getEcommerceUserToken";

export default defineEventHandler(async (event) => {
  const token = await getEcommerceUserToken(event)
  const body = await readBody(event)

  const apiUrl = `https://ecommerce.bro-world.org/api/v2/admin/taxons`

  return await requestWithRetry('post', apiUrl, token, body, false, true)
})
