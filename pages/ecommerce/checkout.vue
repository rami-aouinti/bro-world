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
          <v-btn to="/ecommerce/shipping" color="primary" class="checkout my-3">Shipping</v-btn>
        </div>
      </teleport>
    </client-only>
    <form class="checkout-form" @submit.prevent="submitForm">
      <h2 :class="isDark ? 'text-white' : 'text-default'">Address</h2>
      <p class="text-secondary">Billing address</p>

      <!-- Select from book -->
      <div class="form-group">
        <v-select label="Select address from my book" rounded="xl" density="compact">
          <option>Select address from my book</option>
        </v-select>
      </div>

      <!-- Name -->
      <div class="form-row">
        <div class="form-group" :class="{ error: errors.firstName }">
          <v-text-field label="First name" rounded="xl" density="compact" v-model="form.firstName" />
          <p v-if="errors.firstName">Please enter first name.</p>
        </div>
        <div class="form-group" :class="{ error: errors.lastName }">
          <v-text-field label="Last name" rounded="xl" density="compact" v-model="form.lastName" />
          <p v-if="errors.lastName">Please enter last name.</p>
        </div>
        <!-- Country -->
        <div class="form-group" :class="{ error: errors.country }">
          <v-select label="Country" rounded="xl" density="compact" v-model="form.country">
            <option value="">Select</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="US">USA</option>
          </v-select>
          <p v-if="errors.country">Please select country.</p>
        </div>
      </div>
      <div class="form-row">
        <!-- Address -->
        <div class="form-group" :class="{ error: errors.street }">
          <v-text-field label="Street" rounded="xl" density="compact" v-model="form.street" />
          <p v-if="errors.street">Please enter street.</p>
        </div>
        <div class="form-group" :class="{ error: errors.city }">
          <v-text-field label="City" rounded="xl" density="compact" v-model="form.city" />
          <p v-if="errors.city">Please enter city.</p>
        </div>
        <div class="form-group" :class="{ error: errors.postcode }">
          <v-text-field label="Post Code" rounded="xl" density="compact" v-model="form.postcode" />
          <p v-if="errors.postcode">Please enter postcode.</p>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <v-text-field label="Company" rounded="xl" density="compact" v-model="form.company" />
        </div>
        <div class="form-group">
          <v-text-field label="Phone" rounded="xl" density="compact" v-model="form.phone" />
        </div>
        <div class="form-group">
          <label>
            <v-checkbox label="Use different address for shipping?" rounded="xl" density="compact" v-model="form.differentShipping" />
          </label>
        </div>
      </div>


      <div class="form-actions">
        <v-btn to="/ecommerce/cart" variant="outlined" color="secondary">← Back to cart</v-btn>
        <v-btn to="/ecommerce/shipping" variant="outlined" color="primary">Shipping →</v-btn>
      </div>
    </form>
  </v-container>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
const canTeleport = ref(false)
const form = reactive({
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  country: '',
  city: '',
  postcode: '',
  phone: '',
  differentShipping: false,
})
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const errors = reactive({})

function submitForm() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.firstName) errors.firstName = true
  if (!form.lastName) errors.lastName = true
  if (!form.street) errors.street = true
  if (!form.country) errors.country = true
  if (!form.city) errors.city = true
  if (!form.postcode) errors.postcode = true

  if (Object.keys(errors).length === 0) {
    alert('Address submitted!')
  }
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
  padding: 40px;
  gap: 40px;
  font-family: sans-serif;
}
.checkout-form {
  flex: 2;
}
.checkout-form h2 {
  font-size: 24px;
  margin-bottom: 4px;
}
.checkout-form p {
  color: #666;
  margin-bottom: 24px;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
.form-group.error input,
.form-group.error select {
  border: 1px solid #e74c3c;
}
.form-group.error p {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}
.form-row {
  display: flex;
  gap: 16px;
}
.form-row .form-group {
  flex: 1;
}
input,
select {
  height: 36px;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
input[type="checkbox"] {
  height: auto;
  margin-right: 8px;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
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
  margin-top: 16px;
  font-weight: bold;
  font-size: 18px;
}
</style>
