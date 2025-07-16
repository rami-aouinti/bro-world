import {defineEventHandler} from 'h3'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const url = 'https://ecommerce.bro-world.org/api/v2/shop/taxons'
  return await requestWithRetry('get', url)
})
