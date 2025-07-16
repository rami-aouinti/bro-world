import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import {requestWithRetry} from "~/server/utils/requestWithRetry";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const token = await getUserToken(event)

  const config = useRuntimeConfig()
  const url = `${config.public.apiBlogBase}/v1/platform/comment/${id}/like`
  return await requestWithRetry('post', url, token, {})
})
