<!-- ✅ COMPOSANT PRINCIPAL DE LA PAGE PRODUIT -->
<!-- Fichier : pages/shopping/product/[handle].vue -->

<script setup lang="ts">
import ImageGallery from "~/components/Ecommerce/product/ImageGallery.vue";
import InfoDetails from "~/components/Ecommerce/product/InfoDetails.vue";
import TileCard from "~/components/Ecommerce/product/TileCard.vue";

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const handle = route.params.handle

if (!handle || typeof handle !== 'string') {
  throw createError({ statusCode: 404, statusMessage: 'Missing Product Handle' })
}

const { data } = await useAsyncData('product', () => GqlGetProduct({
  handle,
  variants: 10,
}))

const product = computed(() => data?.value?.product)

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product Not Found' })
}

const galleryImages = computed(() => product.value?.images.edges.map(edge => edge.node.url) || [])
const productId = product.value?.id

const { data: recommended } = await useAsyncData('recommended', () => GqlGetProductRecommendations({
  productId,
  variants: 1,
}), { lazy: true })

useSeoMeta({
  title: product.value?.seo.title || product.value?.title,
  description: product.value?.seo.description || product.value?.description,
  ogTitle: product.value?.seo.title || product.value?.title,
  ogDescription: product.value?.seo.description || product.value?.description,
  ogImage: product.value?.featuredImage?.url || `${config.public.siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="product-container">

    <div class="product-content">
      <ImageGallery :images="galleryImages" :product-title="product?.title" />
      <InfoDetails v-if="product" :product="product" />
    </div>

    <NuxtLazyHydrate when-visible>
      <section v-if="recommended?.productRecommendations?.length" class="related-products">
        <h2 class="related-title">Related Products</h2>
        <div class="related-scroll">
          <TileCard v-for="recommendedProduct in recommended?.productRecommendations" :key="recommendedProduct.id" :product="recommendedProduct" />
        </div>
      </section>
    </NuxtLazyHydrate>
  </div>
</template>

<style scoped>
.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.back-button {
  text-align: left;
  margin: 40px 0 20px;
}

.product-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

@media (min-width: 768px) {
  .product-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.related-products {
  margin: 80px auto 40px;
  text-align: left;
}

.related-title {
  font-size: 24px;
  margin-bottom: 32px;
}

.related-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.related-scroll::-webkit-scrollbar {
  display: none;
}
</style>
