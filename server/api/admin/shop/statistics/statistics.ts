import {defineEventHandler} from 'h3'
import {getEcommerceUserToken} from '~/server/utils/getEcommerceUserToken'
import {requestWithRetry} from '~/server/utils/requestWithRetry'

export default defineEventHandler(async (event) => {
  const token = await getEcommerceUserToken(event)
  const baseUrl = 'https://ecommerce.bro-world.org/api/v2/admin/statistics'

  const channelCode = 'FASHION_WEB'
  const year = new Date().getFullYear()

  const interval = 'month'

  const startDate = `${year}-01-01T00:00:00`
  const endDate = `${year}-12-31T23:59:59`

  const url = `${baseUrl}?channelCode=${encodeURIComponent(channelCode)}&startDate=${encodeURIComponent(startDate)}&interval=${interval}&endDate=${encodeURIComponent(endDate)}`
  return await requestWithRetry('get', url, token, null, false, true)
})
