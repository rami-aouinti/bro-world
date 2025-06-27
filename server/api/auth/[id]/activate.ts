import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import {requestWithRetry} from "~/server/utils/requestWithRetry";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const token = await getUserToken(event)
  const url = `https://bro-world.org/api/v1/profile/${id}/activate`
  return await requestWithRetry('get', url, token)
})
