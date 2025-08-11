<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <h2 :class="isDark ? 'text-white' : 'text-default'">Summary</h2>
          <div class="summary-line text-secondary"><span>Items total:</span><span :class="isDark ? 'text-white' : 'text-default'">${{ shippingCost.toFixed(2) }}</span></div>
          <div class="summary-line text-secondary"><span>Estimated shipping cost:</span><span :class="isDark ? 'text-white' : 'text-default'">${{ shippingCost.toFixed(2) }}</span></div>
          <div class="summary-line text-secondary"><span>Taxes total:</span><span :class="isDark ? 'text-white' : 'text-default'">$0.00</span></div>
          <hr />
          <div class="summary-total"><span>Order total:</span><span class="text-primary">${{ (61.89 + shippingCost).toFixed(2) }}</span></div>
          <v-btn to="/ecommerce/payment" color="primary" class="checkout my-3">Payment</v-btn>
        </div>
      </teleport>
    </client-only>
    <div class="shipping-left">
      <h2 :class="isDark ? 'text-white' : 'text-default'">Shipment #1</h2>

      <v-card rounded="xl" class="bg-gradient-primary shadow-primary mb-3 my-2" variant="text" elevation="10">
       <v-row>
         <v-col cols="1">
           <v-checkbox class="mx-4 my-5" density="compact" selected></v-checkbox>
         </v-col>
         <v-col cols="9">
           <div class="px-3 my-3">
             <strong>FedEx</strong>
             <p>Quo consequatur et dolor repudiandae est.</p>
           </div>
         </v-col>
         <v-col cols="2">
           <div class="shipping-price my-5">
             ${{ shippingCost.toFixed(2) }}
           </div>
         </v-col>
       </v-row>


      </v-card>
      <div class="shipping-actions">
        <v-btn to="/ecommerce/checkout" variant="outlined" color="secondary">← Change address</v-btn>
        <v-btn to="/ecommerce/payment" variant="outlined" color="primary">Payment →</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
const canTeleport = ref(false)
const shippingCost = ref(3.73)
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
function goNext() {
  alert('Go to payment step!')
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
.checkout-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 40px;
  font-family: sans-serif;
}

.shipping-left {
  flex: 2;
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
}

.shipping-option {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shipping-option.selected {
  border: 2px solid #1abc9c;
}

.shipping-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.shipping-info strong {
  display: block;
  margin-bottom: 4px;
}

.shipping-info p {
  font-size: 13px;
  color: #666;
}

.shipping-price {
  font-weight: bold;
}

.shipping-actions {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
}

.btn-outline {
  background: #fff;
  border: 1px solid #ccc;
  padding: 8px 16px;
  cursor: pointer;
}

.btn-primary {
  background: #1abc9c;
  color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

.checkout-summary {
  flex: 1;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 24px;
}
.checkout-summary h3 {
  font-size: 20px;
  margin-bottom: 16px;
}
.checkout-summary .item,
.checkout-summary .line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.checkout-summary .total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 18px;
  margin-top: 16px;
}
</style>
