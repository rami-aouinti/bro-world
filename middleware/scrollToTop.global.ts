export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // Exécute après un tick pour laisser Nuxt changer la page
    nextTick(() => {
      window.scrollTo({ top: 0, behavior: 'auto' }) // ou 'smooth'
    })
  }
})
