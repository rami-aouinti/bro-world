<script setup lang="ts">
import ProductCarousel from "~/components/Ecommerce/home/ProductCarousel.vue";
import CookieConsent from "~/components/Ecommerce/layout/CookieConsent.vue";
import {nextTick, onMounted, ref, watch, computed} from 'vue'
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
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
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
    setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
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
        <v-list class="bg-transparent custom-list" elevation="0" lines="one" nav>
          <div v-motion-fade>
            <v-list-group
              v-for="taxon in taxons"
              :key="taxon.id"
              v-model="expanded[taxon.id]"
            >
              <template #activator="{ props }">
                <v-list-item class="custom-item pa-3" color="primary" v-bind="props">
                  <v-list-item-title class="text-subtitle-2 text-uppercase font-weight-bold mx-3" :class="isDark ? 'text-white' : 'text-default'">
                    {{ taxon.name }}
                  </v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="child in taxon.children"
                :key="child"
                :title="extractNameFromSlug(child)"
                prepend-icon="mdi-subdirectory-arrow-right"
              />
            </v-list-group>
          </div>
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
<style scoped>
.custom-list {
  background-color: transparent;
}

.custom-item {
  transition: all 0.2s ease;
  border-radius: 12px;
  padding-left: 12px;
  margin-bottom: 4px;
}

.custom-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transform: translateX(2px);
  box-shadow: 0 3px 9px rgb(var(--v-theme-primary));
}

.router-link-exact-active {
  background-color: #e3f2fd;
  font-weight: 700;
}
</style>
