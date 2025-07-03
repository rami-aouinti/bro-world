<script setup lang="ts">
import { defineEmits, defineProps, onMounted, onBeforeUnmount } from 'vue'
import OrderSummary from '~/components/Ecommerce/cart/OrderSummary.vue'

const emit = defineEmits(['toggleSettingsDrawer'])

const props = defineProps({
  showSettingsDrawer: Boolean
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('toggleSettingsDrawer', false)
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    class="fixed-plugin"
    :class="{ show: showSettingsDrawer }"
    role="complementary"
    aria-label="Settings drawer"
    tabindex="-1"
  >
    <v-card
      class="card-shadow border-radius-xl pa-2"
      max-width="360"
    >
      <v-row align="center" justify="space-between" class="mb-2">
        <v-col cols="10">
          <div>
            <h5 class="text-h5 font-weight-bold">Order Summary</h5>
            <p class="text-body-2">Review items in your cart</p>
          </div>
        </v-col>
        <v-col cols="2" class="text-end">
          <v-btn
            variant="text"
            icon
            aria-label="Close settings"
            @click="emit('toggleSettingsDrawer', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-1"/>

      <OrderSummary/>
    </v-card>
  </div>
</template>

<style scoped>
.fixed-plugin {
  position: fixed;
  top: 64px; /* below app-bar */
  right: -400px;
  height: calc(100vh - 64px);
  width: 360px;
  background-color: white;
  transition: right 0.3s ease;
  z-index: 2100;
  overflow-y: auto;
}

.fixed-plugin.show {
  right: 0;
}

@media (max-width: 768px) {
  .fixed-plugin {
    width: 100%;
    right: -100%;
  }

  .fixed-plugin.show {
    right: 0;
  }
}
</style>
