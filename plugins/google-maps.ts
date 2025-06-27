import { defineNuxtPlugin } from '#app'
import { Loader } from '@googlemaps/js-api-loader'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) return // Ne rien faire côté serveur

  const config = useRuntimeConfig()

  const loader = new Loader({
    apiKey: config.public.googleMapsApiKey,
    version: 'weekly',
    libraries: ['places']
  })

  const google = await loader.load() // Charge Google Maps sans `window`

  return {
    provide: {
      googleMaps: google.maps // Injecte `google.maps` sans `window`
    }
  }
})
