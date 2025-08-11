<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="mb-30 mx-4 my-4">
          <h2 :class="isDark ? 'text-white' : 'text-default'">Summary</h2>
          <div class="summary-line text-secondary"><span>Items total:</span><span :class="isDark ? 'text-white' : 'text-default'">${{ itemsTotal.toFixed(2) }}</span></div>
          <div class="summary-line text-secondary"><span>Estimated shipping cost:</span><span :class="isDark ? 'text-white' : 'text-default'">${{ shipping.toFixed(2) }}</span></div>
          <div class="summary-line text-secondary"><span>Taxes total:</span><span :class="isDark ? 'text-white' : 'text-default'">$0.00</span></div>
          <hr />
          <div class="summary-total"><span>Order total:</span><span class="text-primary">${{ total.toFixed(2) }}</span></div>
          <v-btn to="/ecommerce/checkout" color="primary" class="checkout my-3">Checkout</v-btn>
        </div>
      </teleport>
    </client-only>
    <div class="cart-container">
      <div class="cart-left">
        <h1 :class="isDark ? 'text-white' : 'text-default'">Your shopping cart</h1>
        <p class="subtitle">Edit your items, apply coupon or proceed to the checkout</p>

        <table v-if="cart?.lines?.edges?.length" class="cart-table">
          <thead>
          <tr>
            <th>Item</th>
            <th>Unit price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="{ item } in cart?.lines.edges" :key="item?.id">
            <td class="product-info">
              <NuxtLink
                :to="`/product/${item?.merchandise.product.handle}`"
                @click="isCartOpen = false"
              >
                <NuxtImg
                  format="webp"
                  :src="item?.merchandise.product.featuredImage?.url"
                  width="72"
                  height="92"
                  class="product-image"
                />
              </NuxtLink>
              <div class="info">
                <strong>{{ item?.merchandise.product.title }}</strong>
                <div class="variant">{{ item?.merchandise.selectedOptions.map((option) => option.value).join(", ") }}</div>
                <div class="size">{{ item?.merchandise.selectedOptions.map((option) => option.value).join(", ") }}</div>
              </div>
              <v-btn icon="mdi-delete" color="danger" @click="removeFromCart"></v-btn>
            </td>
            <td>{{ getPriceWithCurrency(item?.merchandise.product.priceRange.minVariantPrice) }}</td>

            <td>{{ getPriceWithCurrency(costs?.totalTaxAmount) }}</td>
          </tr>
          </tbody>
        </table>

        <div class="coupon">
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field density="compact" rounded="xl" v-model="coupon" placeholder="Enter your code..." />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn color="secondary" @click="applyCoupon">Apply coupon</v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn to="/ecommerce/checkout" color="primary" class="checkout">Checkout</v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn color="danger" variant="outlined" class="clear" @click="clearCart">Clear cart</v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
const canTeleport = ref(false)
const items = ref([
  {
    name: 'Starlight Echo T-Shirt',
    variant: 'Starlight_Echo_T_Shirt-variant-0',
    size: 'S',
    price: 61.89,
    quantity: 1,
    image: 'https://via.placeholder.com/80x80.png?text=Product',
  },
])
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const coupon = ref('')
const shipping = ref(2.56)
const costs = computed(() => cart?.value?.cost);

import { useShopifyCart } from "~/modules/shopify/composables/useShopifyCart";
import LineItem from "~/components/Ecommerce/cart/LineItem.vue";
const {
  getPriceWithCurrency,
  cart,
  isCartOpen,
  loading,
  updateItemQuantity,
  removeFromCart,
  redirectToCheckout,
} = useShopifyCart();
const itemsTotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
const total = computed(() => itemsTotal.value + shipping.value)

const applyCoupon = () => {
  alert(`Coupon "${coupon.value}" applied (not really 😄)`)
}
const clearCart = () => {
  items.value = []
}
const removeItem = (index) => {
  items.value.splice(index, 1)
}
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
</script>

<style scoped>
.cart-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  font-family: sans-serif;
}
.cart-left {
  flex: 2;
}
.cart-right {
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 24px;
}
.subtitle {
  margin-bottom: 24px;
  color: #666;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
.cart-table th {
  text-align: left;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
.cart-table td {
  padding: 16px 8px;
  vertical-align: middle;
}
.product-info {
  display: flex;
  align-items: center;
  position: relative;
}
.product-info img {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  margin-right: 12px;
}
.product-info .remove {
  position: absolute;
  left: -20px;
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #000;
}
.info .variant,
.info .size {
  font-size: 12px;
  color: #777;
}
.clear {
  cursor: pointer;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 18px;
  margin-top: 16px;
}
.checkout {
  width: 100%;
  border: none;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
