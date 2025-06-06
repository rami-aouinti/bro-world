<script setup lang="ts">
import {useShopifyCart} from "~/modules/shopify/composables/useShopifyCart";

const { getImagePath } = useShopifyCart()

defineProps<{ images: string[], productTitle?: string }>()
</script>

<template>
  <v-carousel
    class="rounded-lg max-w-[300px] max-h-[300px] md:min-w-[500px] md:max-w-[500px] md:max-h-[500px] text-center mx-auto md:text-left md:mx-0 md:ml-12 overflow-hidden md:overflow-visible"
    show-arrows="hover"
    dots
  >
    <v-carousel-item
      v-for="(item, index) in images"
      :key="index"
    >
      <NuxtImg
        :src="getImagePath(item)"
        :alt="`Image ${index + 1} of - ${productTitle}`"
        :preload="index === 0"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :fetch-priority="index === 0 ? 'high' : 'low'"
        draggable="false"
        class="max-w-[300px] max-h-[300px] md:min-w-[500px] md:max-w-[500px] md:max-h-[500px] object-contain text-center mx-auto"
        width="300px" height="500px"
        fit="contain"
      />
    </v-carousel-item>
  </v-carousel>
</template>
