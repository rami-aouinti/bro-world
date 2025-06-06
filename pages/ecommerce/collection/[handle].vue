<!-- ✅ COMPOSANT PRINCIPAL DE LA PAGE COLLECTION -->
<!-- Fichier : pages/shopping/collection/[handle].vue -->

<script setup lang="ts">
import HeaderSection from "~/components/Ecommerce/shared/HeaderSection.vue";
import CategorySelector from "~/components/Ecommerce/collection/CategorySelector.vue";
import SortSelector from "~/components/Ecommerce/collection/SortSelector.vue";
import TileCard from "~/components/Ecommerce/product/TileCard.vue";
import type { ShopifyCollectionSortKey } from "~/modules/shopify/types";

const route = useRoute()
const handle = route.params.handle

if (!handle || typeof handle !== 'string') {
  throw createError({ statusCode: 404, statusMessage: 'Missing Collection Handle' })
}

const { data: collectionData } = await useAsyncData('collection-data', () => GqlGetCollection({
  handle,
  items: 12,
  variants: 1,
}))

const collection = computed(() => collectionData?.value?.collection)

if (!collection.value) {
  throw createError({ statusCode: 404, statusMessage: 'Collection Not Found' })
}

const collectionProducts = computed(() => collection.value?.products.edges)

const { data: collectionsData } = await useAsyncData('collections-data', () => GqlGetCollections({ first: 20 }))

watch(
  () => route.query.sortKey,
  async (newVal) => {
    if (!handle) return
    collectionData.value = await GqlGetCollection({
      handle,
      items: 12,
      variants: 1,
      sortKey: newVal as ShopifyCollectionSortKey,
    })
  },
)

useSeoMeta({
  title: collection.value?.seo.title || collection.value?.title,
  description: collection.value?.seo.description || collection.value?.description || 'Search through collection of products',
  ogTitle: collection.value?.seo.title || collection.value?.title,
  ogDescription: collection.value?.seo.description || collection.value?.description || 'Search through collection of products',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="collection-container">
    <HeaderSection
      :title="collection?.title"
      description="Search through collection of products"
    />

    <div class="collection-main">
      <aside class="collection-sidebar">
        <CategorySelector :collections="collectionsData?.collections" />
      </aside>

      <section class="collection-products">
        <div class="collection-toolbar">
          <h2 class="collection-count">
            All products ({{ collectionProducts?.length }})
          </h2>
          <SortSelector :disabled="!collectionProducts?.length" />
        </div>

        <NuxtLazyHydrate when-visible>
          <div v-if="collectionProducts?.length" class="product-grid">
            <TileCard
              v-for="{ node }, index in collectionProducts"
              :key="node.id"
              :product="node"
              :lazy="index !== 0"
            />
          </div>

          <div v-else class="no-products">
            <p class="text-white">No products found in this collection.</p>
          </div>
        </NuxtLazyHydrate>
      </section>
    </div>
  </div>
</template>

<style scoped>
.collection-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.collection-main {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 40px;
}

@media (min-width: 1024px) {
  .collection-main {
    flex-direction: row;
  }
}

.collection-sidebar {
  width: 100%;
  max-width: 360px;
  flex-shrink: 0;
}

.collection-products {
  flex-grow: 1;
  width: 100%;
}

.collection-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.collection-count {
  color: white;
  font-size: 1.125rem;
  font-weight: 500;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

@media (min-width: 1024px) {
  .product-grid {
    justify-content: flex-start;
  }
}

.no-products {
  margin-top: 60px;
}
</style>
