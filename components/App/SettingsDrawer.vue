<script setup>
import {  defineEmits, defineProps } from 'vue'
import OrderSummary from "~/components/Ecommerce/cart/OrderSummary.vue";

const emit = defineEmits(['toggleSettingsDrawer'])

const props = defineProps({
  showSettingsDrawer: Boolean,
})
</script>

<template>
  <div class="fixed-plugin" :class="{ show: showSettingsDrawer }">
    <v-card class="card-shadow border-radius-xl pa-2">
      <div class="d-flex justify-space-between align-center">
        <v-row>
          <v-col cols="10">
            <div>
              <h5 class="text-h5 font-weight-bold">BroWorld Setting</h5>
              <p class="text-body-2">See our dashboard options.</p>
            </div>
          </v-col>
          <v-col cols="2" class="text-end">
            <v-btn
              variant="text"
              icon
              @click="emit('toggleSettingsDrawer', false)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-divider class="my-1" />
      <OrderSummary></OrderSummary>
    </v-card>
  </div>
</template>
