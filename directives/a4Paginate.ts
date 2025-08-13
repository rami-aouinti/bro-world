// plugins/a4-paginate.ts
import { defineNuxtPlugin } from '#app'
import type { Directive } from 'vue'

type A4PaginateOpts = {
  /** Sélecteur des items à paginer (ex: '.cv-section') */
  itemSelector?: string
  /** Conteneur qui contient les items (ex: '.main') */
  areaSelector?: string
  /** Déplace le .footer de la 1re page vers la dernière (true par défaut) */
  moveFooterToLast?: boolean
  /** marge de tolérance (px) avant overflow */
  fudgePx?: number
  /** Nombre max de pages (0 = illimité) */
  maxPages?: number
}

function rafNext(cb: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(cb))
}

function createPageFrom(base: HTMLElement) {
  const page = document.createElement('div')
  page.className = base.className
  page.setAttribute('data-generated', '1')
  page.style.cssText = base.getAttribute('style') || ''

  const grid = document.createElement('div')
  grid.className = 'grid'

  const main = document.createElement('div')
  main.className = 'main'

  grid.appendChild(main)
  page.appendChild(grid)
  return { page, grid, main }
}

function getRectBottom(el: HTMLElement, root: HTMLElement) {
  const r1 = el.getBoundingClientRect()
  const r2 = root.getBoundingClientRect()
  return r1.bottom - r2.top
}

/**
 * Paginate .cv-section dans des .a4 successifs.
 * - Garde la 1re .a4 comme 1re page (avec identity/sidebar existants).
 * - Crée des .a4 supplémentaires ne contenant que .grid > .main (le fond sidebar marche quand même via CSS).
 * - Déplace le .footer de la 1re page vers la dernière si moveFooterToLast=true.
 */
function paginate(el: HTMLElement, opts: A4PaginateOpts = {}) {
  if (!process.client) return

  const itemSelector = opts.itemSelector || (opts as any).selector || '.cv-section'
  const areaSelector = opts.areaSelector || '.main'
  const fudge = opts.fudgePx ?? 2
  const maxPages = Math.max(0, opts.maxPages ?? 0)
  const moveFooterToLast = opts.moveFooterToLast !== false

  const base = el.querySelector(':scope > .a4') as HTMLElement || el.querySelector('.a4') as HTMLElement
  if (!base) return

  // 1) Nettoyer anciennes pages générées
  el.querySelectorAll('.a4[data-generated="1"]').forEach(n => n.remove())

  // 2) Conteneur des items (main) et liste d’items
  const baseMain = base.querySelector(areaSelector) as HTMLElement
  if (!baseMain) return
  const items = Array.from(baseMain.querySelectorAll(itemSelector)) as HTMLElement[]
  if (!items.length) return

  // 3) Calcul de la coupure sur la 1re page (on laisse header/sidebar/… tels quels)
  const pageHeight = base.clientHeight
  let cutIndex = items.length
  for (let i = 0; i < items.length; i++) {
    const bottom = getRectBottom(items[i], base)
    if (bottom > pageHeight - fudge) {
      cutIndex = i
      break
    }
  }

  // Rien à faire si tout tient
  if (cutIndex === items.length) {
    // Déplace éventuellement le footer vers la "dernière" → qui est la 1re dans ce cas
    if (moveFooterToLast) {
      const footer = base.querySelector('.footer')
      if (footer && footer.parentElement !== base.querySelector('.grid')) {
        // rien, le footer est déjà sur la seule page
      }
    }
    return
  }

  // 4) Détacher les items qui débordent (à partir de cutIndex)
  const overflowItems = items.slice(cutIndex)
  overflowItems.forEach(n => n.remove())

  // 5) Créer des pages suivantes et y déplacer les items un par un
  let idx = 0
  let pageCount = 1 // base = 1re page
  let lastPage: HTMLElement = base
  while (idx < overflowItems.length && (maxPages === 0 || pageCount < maxPages)) {
    const { page, main } = createPageFrom(base)
    el.appendChild(page)
    lastPage = page
    pageCount++

    while (idx < overflowItems.length) {
      const candidate = overflowItems[idx]
      main.appendChild(candidate)

      const over = page.scrollHeight > page.clientHeight + fudge
      if (over) {
        // retire le dernier et passe à la page suivante
        candidate.remove()
        break
      }
      idx++
    }
  }

  // Si des items restent (maxPages atteint), on les met quand même sur la dernière
  while (idx < overflowItems.length) {
    (lastPage.querySelector('.main') as HTMLElement).appendChild(overflowItems[idx++])
  }

  // 6) Déplacer le footer réel sur la dernière page si demandé
  if (moveFooterToLast && lastPage !== base) {
    const baseFooter = base.querySelector('.footer')
    if (baseFooter) {
      // le déplacer physiquement conserve la réactivité (pas un clone)
      (lastPage.querySelector('.grid') || lastPage).appendChild(baseFooter)
    }
  }

  // 7) Marqueur visuel (facultatif)
  el.setAttribute('data-a4-paginate-ready', '1')
}

export default defineNuxtPlugin((nuxtApp) => {
  const dir: Directive<HTMLElement, A4PaginateOpts> = {
    // ✅ évite l’erreur SSR
    getSSRProps() {
      return {}
    },
    mounted(el, binding) {
      rafNext(() => paginate(el, binding?.value))
      // re-layout si les polices chargent plus tard (hauteurs changent)
      window.addEventListener('load', () => paginate(el, binding?.value), { once: true })
    },
    updated(el, binding) {
      rafNext(() => paginate(el, binding?.value))
    },
  }
  nuxtApp.vueApp.directive('a4-paginate', dir)
})
