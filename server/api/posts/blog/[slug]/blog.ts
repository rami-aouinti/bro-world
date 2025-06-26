import { defineEventHandler } from 'h3'
import { getUserToken } from '~/server/utils/getUserToken'
import {requestWithRetry} from "~/server/utils/requestWithRetry";

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  const token = await getUserToken(event)

  const config = useRuntimeConfig()
  const url = `${config.public.apiBlogBase}/v1/platform/blog/${slug}`
  return await requestWithRetry('get', url, token)
})
