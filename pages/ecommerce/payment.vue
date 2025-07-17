<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
const canTeleport = ref(false)
const selectedMethod = ref('cash')
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
  alert(`Payment method selected: ${selectedMethod.value}`)
}
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
</script>
<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <h3 class="my-3" :class="isDark ? 'text-white' : 'text-default'">Summary</h3>
          <div class="item">
            <span :class="isDark ? 'text-white' : 'text-default'">Starlight Echo T-Shirt</span>
            <span class="text-end" :class="isDark ? 'text-white' : 'text-default'">$61.89</span>
          </div>
          <hr />
          <div class="line"><span :class="isDark ? 'text-white' : 'text-default'">Items total:</span><span class="text-end">$61.89</span></div>
          <div class="line"><span :class="isDark ? 'text-white' : 'text-default'">Discount:</span><span class="text-end">$0.00</span></div>
          <div class="line"><span :class="isDark ? 'text-white' : 'text-default'">Estimated shipping cost:</span><span class="text-end">$3.73</span></div>
          <div class="line"><span :class="isDark ? 'text-white' : 'text-default'">Taxes total:</span><span class="text-end">$0.00</span></div>
          <hr />
          <div class="total my-3">
            <strong :class="isDark ? 'text-white' : 'text-default'">Order total:</strong>
            <strong class="text-end" :class="isDark ? 'text-white' : 'text-default'">$65.62</strong>
          </div>
        </div>
      </teleport>
    </client-only>
    <h2 :class="isDark ? 'text-white' : 'text-default'">Payment #1</h2>

    <div
      class="payment-option"
      :class="{ selected: selectedMethod === 'cash' }"
      @click="selectedMethod = 'cash'"
    >
      <div class="radio-circle" :class="{ active: selectedMethod === 'cash' }"></div>
      <div>
        <strong>Cash on delivery</strong>
        <p>Sed ea placeat magnam dignissimos a.</p>
      </div>
    </div>

    <div
      class="payment-option"
      :class="{ selected: selectedMethod === 'bank' }"
      @click="selectedMethod = 'bank'"
    >
      <div class="radio-circle" :class="{ active: selectedMethod === 'bank' }"></div>
      <div>
        <strong>Bank transfer</strong>
        <p>Enim voluptate delectus consequatur est.</p>
      </div>
    </div>

    <div class="payment-actions">
      <v-btn variant="outlined" color="secondary" to="/ecommerce/shipping">← Change shipping method</v-btn>
      <v-btn variant="outlined" color="primary" to="/ecommerce/complete">Complete →</v-btn>
    </div>
  </v-container>
</template>



<style scoped>
.checkout-container {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  gap: 40px;
  font-family: sans-serif;
}

.payment-left {
  flex: 2;
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
}

.payment-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8f8f8;
  margin-bottom: 16px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.payment-option.selected {
  border-color: rgb(var(--v-theme-primary));
}

.payment-option strong {
  display: block;
  margin-bottom: 4px;
}
.payment-option p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-top: 4px;
  border: 2px solid #ccc;
  background: #fff;
}
.radio-circle.active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
}

.payment-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
.btn-outline {
  background: #fff;
  border: 1px solid #ccc;
  padding: 8px 16px;
  cursor: pointer;
}
.btn-primary {
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
