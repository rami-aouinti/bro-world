<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
      </teleport>
    </client-only>
  <div class="thankyou-container">
    <h1 :class="isDark ? 'text-white' : 'text-default'">Thank you!</h1>
    <p :class="isDark ? 'text-white' : 'text-default'">You have successfully placed an order.</p>
    <v-btn variant="outlined" color="primary" to="/ecommerce/orderDetails">View order</v-btn>
  </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const canTeleport = ref(false)
function viewOrder() {
  alert('Redirecting to order details (or history)…')
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
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
</script>

<style scoped>
.thankyou-container {
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
  font-family: sans-serif;
}
h1 {
  font-size: 36px;
  margin-bottom: 12px;
}
p {
  font-size: 16px;
  color: #555;
  margin-bottom: 24px;
}
.btn-primary {
  background: #1abc9c;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
