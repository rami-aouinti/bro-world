import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import {requestWithRetry} from "~/server/utils/requestWithRetry";

export default defineEventHandler(async (event) => {
  const code = event.context.params?.code
  const token = await getUserToken(event)
  const url = `https://bro-world.org/api/v1/profile/${code}/activate`
  return await requestWithRetry('get', url, token, {})
})
