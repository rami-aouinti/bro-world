<script setup lang="ts">
import { computed } from 'vue'
import QuantitySelector from "~/components/Ecommerce/product/QuantitySelector.vue";
import type { ShopifyCartLineItem } from "~/modules/shopify/types";
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart";
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
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
            format="webp"
            :src="item.merchandise.product.featuredImage?.url"
            width="72"
            height="92"
            class="product-image"
          />
        </NuxtLink>
        <v-btn
          class="remove-btn"
          size="xs"
          variant="outline"
          icon="mdi-delete"
          color="primary"
          @click="emit('remove-item', item.id)"
        />
      </div>
      <div class="details-wrapper">
        <p class="product-title" :class="isDark ? 'text-white' : 'text-default'">{{ item.merchandise.product.title }}</p>
        <p class="product-price text-primary">
          {{ getPriceWithCurrency(item.merchandise.product.priceRange.minVariantPrice) }}
        </p>
        <p class="product-options" :class="isDark ? 'text-white' : 'text-secondary'">
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
  top: -3px;
  right: -6px;
}

.details-wrapper {
  flex-grow: 1;
  position: relative;
}

.product-title {
  font-size: 0.875rem;
  font-weight: 450;
}

.product-price {
  font-size: 1.075rem;
  font-weight: 600;
}

.product-options {
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.quantity-selector {
  right: 0;
  bottom: 0;
}
</style>
