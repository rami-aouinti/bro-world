<script setup lang="ts">
import ProductCarousel from "~/components/Ecommerce/home/ProductCarousel.vue";
import CookieConsent from "~/components/Ecommerce/layout/CookieConsent.vue";

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
