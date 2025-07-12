import {defineEventHandler} from 'h3'
import {getEcommerceUserToken} from '~/server/utils/getEcommerceUserToken'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getEcommerceUserToken(event)
  const url = 'https://ecommerce.bro-world.org/api/v2/admin/payments'
  return await requestWithRetry('get', url, token, null, false, true)
})
