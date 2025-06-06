

<!-- ✅ COMPONENT: LineItem.vue -->
<script setup lang="ts">
import QuantitySelector from "~/components/Ecommerce/product/QuantitySelector.vue";
import type { ShopifyCartLineItem } from "~/modules/shopify/types";
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart";

const { getPriceWithCurrency, isCartOpen } = useShopifyCart();

const emit = defineEmits<{
  (e: 'remove-item', value: string): void
  (e: 'update-quantity', value: { item: ShopifyCartLineItem, quantity: number }): void
}>()

const props = defineProps<{ item: ShopifyCartLineItem, disabled: boolean }>()

function debouncedUpdateQuantity(newQuantity: number) {
  setTimeout(() => {
    emit('update-quantity', { item: props.item, quantity: newQuantity })
  }, 700)
}
</script>

<template>
  <li class="line-item">
    <div class="item-wrapper">
      <div class="image-wrapper">
        <NuxtLink
          :to="`/product/${item.merchandise.product.handle}`"
          @click="isCartOpen = false"
        >
          <NuxtImg
            :src="item.merchandise.product.featuredImage?.url"
            width="92"
            height="92"
            class="product-image"
          />
        </NuxtLink>
        <v-btn
          class="remove-btn"
          size="xs"
          color="neutral"
          variant="outline"
          icon="i-heroicons-x-mark-20-solid"
          @click="emit('remove-item', item.id)"
        />
      </div>
      <div class="details-wrapper">
        <p class="product-title">{{ item.merchandise.product.title }}</p>
        <p class="product-price">
          {{ getPriceWithCurrency(item.merchandise.product.priceRange.minVariantPrice) }}
        </p>
        <p class="product-options">
          {{ item.merchandise.selectedOptions.map((option) => option.value).join(", ") }}
        </p>
        <QuantitySelector
          class="quantity-selector"
          :quantity="item.quantity"
          :disabled="disabled"
          small
          @quantity-updated="debouncedUpdateQuantity"
        />
      </div>
    </div>
  </li>
</template>

<style scoped>
.line-item {
  margin-bottom: 1rem;
}

.item-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.image-wrapper {
  position: relative;
}

.product-image {
  border-radius: 0.5rem;
  object-fit: contain;
  max-width: 92px;
  max-height: 92px;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
}

.details-wrapper {
  flex-grow: 1;
  position: relative;
}

.product-title {
  font-size: 1rem;
  font-weight: 500;
}

.product-price {
  font-size: 0.875rem;
  font-weight: 600;
}

.product-options {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.quantity-selector {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
