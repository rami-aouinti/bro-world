<!-- ✅ COMPONENT: Cart Panel (Cart.vue) -->
<script lang="ts" setup>
import LineItem from "~/components/Ecommerce/cart/LineItem.vue";
import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart";

const {
  getPriceWithCurrency,
  cart,
  loading,
  updateItemQuantity,
  removeFromCart,
  redirectToCheckout,
} = useShopifyCart();

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
        <p class="empty-text">No items in cart</p>
      </div>

      <div v-if="cart?.lines?.edges?.length" class="cart-summary">
        <div class="summary-row">
          <div class="summary-labels">
            <p>Subtotal</p>
            <p>Sales Tax</p>
            <p>Shipping</p>
          </div>
          <div class="summary-values">
            <p>{{ getPriceWithCurrency(costs?.subtotalAmount) }}</p>
            <p>{{ getPriceWithCurrency(costs?.totalTaxAmount) }}</p>
            <p class="text-sm">Calculated at checkout</p>
          </div>
        </div>
        <div class="summary-total">
          <p>Total</p>
          <p>{{ getPriceWithCurrency(costs?.totalAmount) }}</p>
        </div>
        <v-btn
          class="checkout-btn"
          :disabled="loading"
          size="xl"
          @click="redirectToCheckout"
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
  height: 100%;
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
  overflow: hidden;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 4px;
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
