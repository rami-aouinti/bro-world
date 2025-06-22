import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/ar'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import 'dayjs/locale/de'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('dayjs', dayjs)
})
