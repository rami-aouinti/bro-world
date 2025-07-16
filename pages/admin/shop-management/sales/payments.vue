<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'
import {usePaymentStore} from "~/stores/admin/shop/sales/payments/paymentStore";

definePageMeta({
  icon: 'mdi-account',
  title: 'Payments',
  requiresAdmin: true,
  drawerIndex: 0,
})

const loading = ref(true)
const search = ref('')
const payments = ref<any[]>([])

// On va chercher le nom en anglais via la clé imbriquée
const headers: DataTableHeaders = [
  { title: 'Amount', key: 'amount', type: 'number', list: true, show: true, create: false, edit: false },
  { title: 'State', key: 'state', type: 'chip', color: 'info', list: true, show: true, create: false, edit: false },
  { title: 'Date', key: 'createdAt', type: 'date', list: true, show: true, create: false, edit: false },
  { title: '', key: 'actions', list: false, show: false, create: false, edit: false, sortable: false, align: 'end' }
]

const paymentStore = usePaymentStore()
async function loadPayments() {
  try {
    const data = await paymentStore.fetchPayments()
    if (data) {
      payments.value = data
      loading.value = false
    }
  } catch (e) {
    console.error('Erreur lors de la récupération des utilisateurs :', e)
  }
}
watch(loading, async () => {
  await loadPayments()
}, { immediate: true })
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadPayments()
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
      label="Payments"
      :headers="headers"
      urlCreate="/api/admin/product/create"
      urlEdit="/api/admin/product/edit"
      urlDelete="/api/admin/product/delete"
      :items="payments || []"
      :create="false"
      :loading="loading"
      :search="search"
      @refresh="loadPayments"
    />
  </v-container>
</template>

