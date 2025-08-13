// plugins/a4-paginate.ts
import { defineNuxtPlugin } from '#app'
import type { Directive } from 'vue'

type A4PaginateOpts = {
  selector?: string
}

function runClientPagination(root: HTMLElement, opts: A4PaginateOpts) {
  if (!process.client) return
  // Mini no-op utile : on marque l’élément pour vérifier que le plugin tourne.
  root.setAttribute('data-a4-paginate-ready', '1')
  // Tu pourras mettre ici ta vraie logique de pagination plus tard.
  // console.log('[a4-paginate] mounted on', root, 'opts=', opts)
}

export default defineNuxtPlugin((nuxtApp) => {
  const dir: Directive<HTMLElement, A4PaginateOpts> = {
    // ✅ indispensable pour éviter l’erreur côté SSR
    getSSRProps() {
      return {}
    },
    mounted(el, binding) {
      runClientPagination(el, binding?.value || {})
    },
    updated(el, binding) {
      runClientPagination(el, binding?.value || {})
    },
  }

  nuxtApp.vueApp.directive('a4-paginate', dir)
})
