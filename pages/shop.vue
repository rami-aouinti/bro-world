<script setup lang="ts">
import ProductCarousel from "~/components/Ecommerce/home/ProductCarousel.vue";
import CookieConsent from "~/components/Ecommerce/layout/CookieConsent.vue";
import { ref, watch, onMounted, nextTick } from 'vue'
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
watch(loading, async () => {
  await loadProducts()
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  try {
    await loadProducts()
    await nextTick()
  } catch (e) {
  }
})
</script>
<template>
  <v-container
    fluid
  >
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
