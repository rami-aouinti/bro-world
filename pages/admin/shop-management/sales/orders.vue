<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'
import {useOrderStore} from "~/stores/admin/shop/sales/orders/orderStore.ts";

definePageMeta({
  icon: 'mdi-account',
  title: 'Orders',
  requiresAdmin: true,
  drawerIndex: 0,
})

const loading = ref(true)
const search = ref('')
const orders = ref<any[]>([])

const headers: DataTableHeaders = [
  { title: 'Number', key: 'number', type: 'text', list: true, show: true, create: false, edit: false },
  { title: 'Checkout State', key: 'checkoutState', type: 'chip', color: 'info', list: true, show: true, create: false, edit: false },
  { title: 'Payment State', key: 'paymentState', type: 'chip', color: 'info', list: true, show: true, create: false, edit: false },
  { title: 'Shipping State', key: 'shippingState', type: 'chip', color: 'success', list: true, show: true, create: false, edit: false },
  { title: 'Notes', key: 'notes', type: 'text', list: false, show: true, create: false, edit: true },
  { title: 'Total', key: 'total', type: 'number', list: true, show: true, create: false, edit: false },
  { title: 'Items Total', key: 'itemsTotal', type: 'number', list: false, show: true, create: false, edit: false },
  { title: 'Tax Total', key: 'taxTotal', type: 'number', list: false, show: true, create: false, edit: false },
  { title: 'Shipping Total', key: 'shippingTotal', type: 'number', list: false, show: true, create: false, edit: false },
  { title: 'Currency', key: 'currencyCode', type: 'text', list: true, show: true, create: false, edit: false },
  { title: 'State', key: 'state', type: 'chip', color: 'primary', list: true, show: true, create: false, edit: false },
  { title: 'Date', key: 'checkoutCompletedAt', type: 'date', list: true, show: true, create: false, edit: false },
  { title: '', key: 'actions', list: false, show: false, create: false, edit: false, sortable: false, align: 'end' }
]
const orderStore = useOrderStore()
async function loadOrders() {
  try {
    const data = await orderStore.fetchOrders()
    if (data) {
      orders.value = data
      loading.value = false
    }
  } catch (e) {
    console.error('Erreur lors de la récupération des utilisateurs :', e)
  }
}
watch(loading, async () => {
  await loadOrders()
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadOrders()
  await nextTick()
})
</script>
<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-bar">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          class="mr-2"
          rounded="xl"
          flat
          variant="solo"
          style="width: 250px"
        />
      </teleport>
    </client-only>

    <ReusableDataTable
      label="Orders"
      :headers="headers"
      urlCreate="/api/admin/product/create"
      urlEdit="/api/admin/product/edit"
      urlDelete="/api/admin/product/delete"
      :items="orders || []"
      :loading="loading"
      :create="false"
      :search="search"
      @refresh="loadOrders"
    />
  </v-container>
</template>

