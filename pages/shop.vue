<script setup lang="ts">
import ProductCarousel from "~/components/Ecommerce/home/ProductCarousel.vue";
import CookieConsent from "~/components/Ecommerce/layout/CookieConsent.vue";
import {nextTick, onMounted, ref, watch} from 'vue'
import {buildTaxonTree} from "~/composables/useTaxons";

definePageMeta({
  layout: 'default',
  description: 'Shopping page',
  breadcrumb: 'disabled',
  title: 'Shopping',
  meta: [
    { name: 'description', content: 'Explore our latest collections and casual things for everyday use.' },
    { name: 'keywords', content: 'shopping, ecommerce, collections, casual' },
  ],
  head: {
    title: 'Shopping',
    meta: [
      { name: 'description', content: 'Explore our latest collections and casual things for everyday use.' },
      { name: 'keywords', content: 'shopping, ecommerce, collections, casual' },
    ],
  },
  scrollToTop: true,
})
const { data: latestStuffCollection } = await useAsyncData('latest-stuff-collection', () => GqlGetCollection({
  handle: 'latest-stuff',
  items: 10,
  variants: 1,
}))

const { data: casualThingsCollection } = await useAsyncData('casual-things-collection', () => GqlGetCollection({
  handle: 'casual-things',
  items: 10,
  variants: 1,
}), { lazy: true })

const products = ref<any[]>([])
const loading = ref(true)
const canTeleport = ref(false)
const loadProducts = async () => {
  try {
    const raw = await $fetch('/api/shopping/products/products', {
      responseType: 'text'
    })
    const fixedRaw = raw.trim().match(/^\{.*}/s)?.[0]

    if (!fixedRaw) {
      throw new Error('❌ Impossible d’extraire un JSON valide.')
    }

    const data = JSON.parse(fixedRaw)
    products.value = data['hydra:member']
  } catch (e) {
    console.error('❌ Erreur de chargement des produits:', e)
  } finally {
    loading.value = false
  }
}
const headers = [
  { text: 'Nom', value: 'name' },
  { text: 'Prix', value: 'defaultVariant.price' }, // tu adapteras si besoin
  { text: 'Note', value: 'averageRating' },
]

const loadTaxons = async () => {
  try {
    const raw = await $fetch('/api/shop/taxons', { responseType: 'text' })
    const fixedRaw = raw.trim().match(/^\{.*\}/s)?.[0]
    if (!fixedRaw) throw new Error('Invalid JSON format')
    const data = JSON.parse(fixedRaw)
    taxons.value = buildTaxonTree(data['hydra:member'], 'en_US')
    loading.value = true
  } catch (e) {
    console.error('❌ Erreur de chargement des produits:', e)
  } finally {
    loading.value = false
  }
}

interface Taxon {
  id: number
  name: string
  description: string
  children: string[]
  ['@id']: string
}

const taxons = ref<Taxon[]>([]) // sera chargé par API ou props
const expanded = ref<Record<number, boolean>>({})

function extractNameFromSlug(url: string): string {
  console.log(url)
  const slug = url.split('/').pop() || ''
  return slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}


watch(loading, async () => {
  await loadProducts()
  await loadTaxons()
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    await loadTaxons()
    await loadProducts()
    await nextTick()
    canTeleport.value = !!document.getElementById('menu-bar-world')
  } catch (e) {
  }
})
</script>
<template>
  <v-container
    fluid
  >
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <v-list class="bg-transparent" elevation="0" lines="one" nav>
          <v-list-group
            v-for="taxon in taxons"
            :key="taxon.id"
            v-model="expanded[taxon.id]"
            :prepend-icon="'mdi-storefront'"
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ taxon.name }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="child in taxon.children"
              :key="child"
              :title="extractNameFromSlug(child)"
              prepend-icon="mdi-subdirectory-arrow-right"
            />
          </v-list-group>
        </v-list>
      </teleport>
    </client-only>

    <div class="max-w-7xl px-6 mx-auto text-center">
      <NuxtLazyHydrate when-visible>
        <section class="justify-center">
          <ProductCarousel
            title="New Collection"
            description="Newest collection products"
            link="/ecommerce/collection/latest-stuff"
            :products="latestStuffCollection?.collection?.products"
          />

          <ProductCarousel
            title="Casual Things"
            description="Casual things for everyday"
            link="/ecommerce/collection/casual-things"
            :products="casualThingsCollection?.collection?.products"
          />
        </section>
      </NuxtLazyHydrate>
    </div>
    <CookieConsent />
  </v-container>
</template>
