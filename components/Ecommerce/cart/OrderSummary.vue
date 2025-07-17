<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import LineItem from "~/components/Ecommerce/cart/LineItem.vue";
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
const emit = defineEmits(['checkout'])
const {
  getPriceWithCurrency,
  cart,
  loading,
  updateItemQuantity,
  removeFromCart,
  redirectToCheckout,
} = useShopifyCart();
function redirect(url: string) {
  emit('checkout')
  router.push(url)
}
const costs = computed(() => cart?.value?.cost);
</script>

<template>
  <div class="cart-panel">
    <div v-if="cart?.lines?.edges?.length" class="cart-header">
      <p>{{ cart?.lines?.edges?.length }} item(s)</p>
    </div>

    <div class="cart-content">
      <ul v-if="cart?.lines?.edges?.length" class="cart-items">
        <LineItem
          v-for="{ node } in cart?.lines.edges"
          :key="node.id"
          :item="node"
          :disabled="loading"
          @remove-item="removeFromCart"
          @update-quantity="updateItemQuantity"
        />
      </ul>

      <div v-else class="cart-empty">
        <v-icon name="i-heroicons-shopping-bag-20-solid" class="icon-empty" />
        <p class="empty-text" :class="isDark ? 'text-white' : 'text-default'">No items in cart</p>
      </div>

      <div v-if="cart?.lines?.edges?.length" class="cart-summary">
        <div class="summary-row">
          <div class="summary-labels" :class="isDark ? 'text-white' : 'text-default'">
            <p>Subtotal</p>
            <p>Sales Tax</p>
            <p>Shipping</p>
          </div>
          <div class="summary-values" :class="isDark ? 'text-white' : 'text-default'">
            <p>{{ getPriceWithCurrency(costs?.subtotalAmount) }}</p>
            <p>{{ getPriceWithCurrency(costs?.totalTaxAmount) }}</p>
            <p class="text-sm">Calculated at checkout</p>
          </div>
        </div>
        <div class="summary-total">
          <p :class="isDark ? 'text-white' : 'text-default'">Total</p>
          <p class="text-primary">{{ getPriceWithCurrency(costs?.totalAmount) }}</p>
        </div>
        <v-btn
          class="checkout-btn"
          :disabled="loading"
          color="primary"
          variant="outlined"
          @click="redirect('/ecommerce/cart')"
        >
          Checkout
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-panel {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.cart-header {
  font-weight: 500;
  margin-bottom: 1rem;
}

.cart-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  overflow-y: auto;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
}

.cart-empty {
  text-align: center;
  margin-top: 4rem;
}

.icon-empty {
  width: 40px;
  height: 40px;
  margin: 0 auto;
}

.empty-text {
  margin-top: 1rem;
  font-size: 1.125rem;
}

.cart-summary {
  padding-top: 1rem;
  border-top: 1px solid #334155;
  margin-top: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-labels,
.summary-values {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-values {
  text-align: right;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 1rem;
}

.checkout-btn {
  width: 100%;
}
</style>
