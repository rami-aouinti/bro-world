<script lang="ts" setup>
import type { ShopifyProduct } from "~/modules/shopify/types";

const props = defineProps({
  product: {
    type: Object as PropType<ShopifyProduct>,
    default: () => ({}),
  },
  lazy: {
    type: Boolean,
    default: true,
  },
});

const { getPriceWithCurrency, getImagePath } = useShopifyCart();

const computedPrice = computed(() =>
  props.product?.priceRange?.minVariantPrice &&
  getPriceWithCurrency({
    amount: props.product.priceRange.minVariantPrice.amount,
    currencyCode: props.product.priceRange.minVariantPrice.currencyCode,
  })
);

const shouldDisplaySecondImage = ref(false);

function handleMouseOver(event: MouseEvent) {
  const isMobileClickEvent = !event.relatedTarget;

  if (
    isMobileClickEvent ||
    (props.product?.images?.edges && props.product.images.edges.length < 2)
  )
    return;

  shouldDisplaySecondImage.value = true;
}
</script>

<template>
  <div
    class="tile-card"
    @click="shouldDisplaySecondImage = false"
    @mouseover="handleMouseOver"
    @mouseleave="shouldDisplaySecondImage = false"
  >
    <NuxtLink :to="`/ecommerce/product/${product?.handle}`" class="tile-link">
      <div class="tile-image-wrapper">
        <NuxtImg
          v-show="!shouldDisplaySecondImage"
          :src="getImagePath(product?.featuredImage?.url)"
          :alt="`Image 1 of ${product?.title}`"
          class="tile-image"
          :loading="lazy ? 'lazy' : 'eager'"
          width="146"
          height="216"
          :placeholder="[50, 25, 75, 5]"
        />
        <NuxtImg
          v-show="shouldDisplaySecondImage"
          :src="getImagePath(product?.images?.edges?.[1]?.node?.url)"
          :alt="`Image 2 of ${product?.title}`"
          class="tile-image"
          loading="lazy"
          width="146"
          height="216"
        />
      </div>
      <div class="tile-info">
        <p class="tile-title">{{ product?.title }}</p>
        <span class="tile-price">{{ computedPrice }}</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.tile-card {
  flex-shrink: 0;
  width: 146px;
  border-radius: 8px;
  text-align: left;
  transition: box-shadow 0.3s;
}

.tile-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.tile-link {
  display: block;
  text-decoration: none;
}

.tile-image-wrapper {
  position: relative;
}

.tile-image {
  width: 100%;
  height: 188px;
  object-fit: cover;
  border-radius: 8px;
}

.tile-info {
  padding: 8px;
  color: white;
}

.tile-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #cbd5e1; /* slate-300 */
}

.tile-price {
  display: block;
  padding-top: 4px;
  font-size: 0.875rem;
  color: #94a3b8; /* slate-400 */
}
</style>
