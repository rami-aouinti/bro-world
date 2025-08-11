<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <div class="my-2">
            <strong :class="isDark ? 'text-white' : 'text-default'">Currency </strong>USD
          </div>
          <div class="my-2">
            <strong :class="isDark ? 'text-white' : 'text-default'">Locale </strong>English (United States)
          </div>
          <div class="my-2">
            <strong :class="isDark ? 'text-white' : 'text-default'">Payments</strong>
            <hr />
            <v-row>
              <v-col cols="6">
                <div>Cash on delivery</div>
              </v-col>
              <v-col cols="6">
                <div style="text-align: right; font-weight: bold;">$65.62</div>
              </v-col>
            </v-row>
          </div>
          <div class="my-2">
            <strong :class="isDark ? 'text-white' : 'text-default'">Shipments</strong>
            <hr />
            <div>FedEx</div>
          </div>
        </div>
      </teleport>
    </client-only>
    <h2 :class="isDark ? 'text-white' : 'text-default'">Summary of your order</h2>
    <v-row>
      <v-col cols="12" md="6">
        <div>
          <strong :class="isDark ? 'text-white' : 'text-default'">Billing address</strong>
          <hr />
          <address>
            asd asdada<br />
            köln<br />
            köln, 50859<br />
            GERMANY
          </address>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div>
          <strong :class="isDark ? 'text-white' : 'text-default'">Shipping address</strong>
          <hr />
          <address>
            asd asdada<br />
            köln<br />
            köln, 50859<br />
            GERMANY
          </address>
        </div>
      </v-col>
      <v-col cols="12">
        <table class="order-table">
          <thead>
          <tr>
            <th>Item</th>
            <th>Unit price</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="product-cell">
              <img src="https://via.placeholder.com/80x80.png?text=Product" />
              <div>
                <strong>Starlight Echo T-Shirt</strong><br />
                <small>Starlight_Echo_T_Shirt-variant-0</small><br />
                <small>T-shirt size: S</small>
              </div>
            </td>
            <td>$61.89</td>
            <td>1</td>
            <td>$61.89</td>
          </tr>
          </tbody>
        </table>
      </v-col>
      <v-col cols="12" md="6">
        <strong :class="isDark ? 'text-white' : 'text-default'">Order Summary</strong>
        <hr />
        <div><span>Items total:</span><span>$61.89</span></div>
        <div><span>Taxes total:</span><span>$0.00</span></div>
        <div><span>Discount:</span><span>$0.00</span></div>
        <div><span>Shipping total:</span><span>$3.73</span></div>
        <hr />
        <div class="total"><strong>Total:</strong><strong>$65.62</strong></div>
      </v-col>
      <v-col cols="12" md="6">
        <strong :class="isDark ? 'text-white' : 'text-default'">Extra notes</strong>
        <hr />
        <div>
          <v-textarea rows="3" placeholder="Leave a message..."></v-textarea>
        </div>
      </v-col>
    </v-row>
    <!-- Place order -->
    <div class="actions">
      <v-btn variant="outlined" color="primary" to="/ecommerce/thankYou">Place order</v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const canTeleport = ref(false)
function placeOrder() {
  alert('Order placed successfully 🎉')
}
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
</script>

<style scoped>
.checkout-complete {
  max-width: 960px;
  margin: auto;
  padding: 40px;
  font-family: sans-serif;
}
h2 {
  font-size: 24px;
  margin-bottom: 24px;
}
.meta {
  display: flex;
  justify-content: flex-start;
  gap: 40px;
  margin-bottom: 24px;
}
.meta div {
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
  width: 220px;
}
.addresses {
  display: flex;
  gap: 40px;
  margin-bottom: 24px;
}
.addresses > div {
  flex: 1;
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
}
.payment-shipping {
  display: flex;
  gap: 40px;
  margin-bottom: 32px;
}
.payment-shipping > div {
  flex: 1;
  background: #f7f7f7;
  padding: 12px;
  border-radius: 6px;
}
hr {
  border: none;
  border-top: 1px dashed #ccc;
  margin: 8px 0;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
.order-table th {
  text-align: left;
  border-bottom: 1px solid #ccc;
  padding: 8px;
}
.order-table td {
  padding: 12px 8px;
  vertical-align: top;
}
.product-cell {
  display: flex;
  gap: 12px;
}
.product-cell img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}
.totals {
  max-width: 400px;
  margin-left: auto;
  font-size: 14px;
}
.totals div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.totals .total {
  font-size: 18px;
  font-weight: bold;
  margin-top: 12px;
}
.notes {
  margin-top: 24px;
}
.notes label {
  display: block;
  margin-bottom: 6px;
}
.notes textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.actions {
  text-align: center;
  margin-top: 14px;
}
.btn-primary {
  border: none;
  padding: 10px 20px;
  font-size: 15px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
