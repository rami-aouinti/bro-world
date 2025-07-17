<script lang="ts" setup>
import VariantOptions from "~/components/Ecommerce/product/VariantOptions.vue";
import QuantitySelector from "~/components/Ecommerce/product/QuantitySelector.vue";
import type { ShopifyProduct } from "~/modules/shopify/types";
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart";
import { computed } from 'vue'

const props = defineProps<{ product?: ShopifyProduct }>()
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const { addToCart, loading, getPriceWithCurrency } = useShopifyCart()
const route = useRoute()

const quantity = ref<number>(1)

const optionsInUrl = computed(() => Object.keys(route.query).length)

const areOptionsSelected = computed(
  () => optionsInUrl.value === props.product?.options.length
)

const computedVariant = computed(() => {
  const productVariants = props.product?.variants.nodes
  if (!productVariants || !optionsInUrl.value) return undefined

  return productVariants.find(variant =>
    variant.selectedOptions.every(
      option => option.value === route.query[option.name]
    )
  )
})
</script>

<template>
  <section class="product-info">
    <div class="product-header">
      <h3 class="product-title" :class="isDark ? 'text-white' : 'text-default'">
        {{ product?.title }}
      </h3>
      <span
        class="product-price"
        :class="isDark ? 'text-white' : 'text-default'"
        style="text-shadow: 1px 1px 2px rgb(var(--v-theme-primary));"
      >
        {{ getPriceWithCurrency(computedVariant?.price) || "" }}
      </span>
    </div>

    <p class="product-description">
      {{ product?.description }}
    </p>

    <VariantOptions :product="product"  />

    <div class="action-row">
      <div class="quantity-block">
        <p class="quantity-label font-weight-bold" :class="isDark ? 'text-white' : 'text-default'">Quantity</p>
        <QuantitySelector
          class="quantity-selector"
          @quantity-updated="(newVal: number) => (quantity = newVal)"
        />
      </div>

      <v-btn
        class="add-to-cart"
        color="primary"
        :disabled="loading || !areOptionsSelected"
        @click="addToCart(product, computedVariant?.id, quantity)"
      >
        Add to cart
      </v-btn>
    </div>
  </section>
</template>

<style scoped>
.product-info {
  padding: 1rem 0;
  text-align: left;
}

.product-header {
  margin-bottom: 1rem;
}

.product-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .product-title {
    font-size: 2rem;
  }
}

.product-price {
  font-size: 1.75rem;
  font-weight: 600;
}

.product-description {
  margin-top: 1.5rem;
  max-height: 7rem;
  overflow-y: auto;
}

.action-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1.5rem 0;
}

.quantity-block {
  flex-shrink: 0;
}

.quantity-label {
  margin-bottom: 0.5rem;
}

.quantity-selector {
  min-width: 100px;
}

.add-to-cart {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
