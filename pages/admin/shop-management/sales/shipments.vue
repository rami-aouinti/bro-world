<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'
import {useShipmentStore} from "~/stores/admin/shop/sales/shipments/shipmentStore";

definePageMeta({
  icon: 'mdi-account',
  title: 'Shipments',
  requiresAdmin: true,
  drawerIndex: 0,
})

const loading = ref(true)
const search = ref('')
const shipments = ref<any[]>([])

const headers: DataTableHeaders = [
  { title: 'ID', key: 'id', type: 'text', list: true, show: true, create: false, edit: false },
  { title: 'State', key: 'state', type: 'chip', color: 'info', list: true, show: true, create: false, edit: false },
  { title: 'Method', key: 'method', type: 'link', list: true, show: true, create: false, edit: false },
  {
    title: 'Tracking',
    key: 'tracking',
    type: 'text',
    list: true,
    show: true,
    create: true,
    edit: true
  },
  {
    title: 'Shipped At',
    key: 'shippedAt',
    type: 'date',
    list: true,
    show: true,
    create: false,
    edit: false
  },
  {
    title: 'Created At',
    key: 'createdAt',
    type: 'date',
    list: false,
    show: true,
    create: false,
    edit: false
  },
  {
    title: 'Updated At',
    key: 'updatedAt',
    type: 'date',
    list: false,
    show: true,
    create: false,
    edit: false
  },
  {
    title: '',
    key: 'actions',
    list: false,
    show: false,
    create: false,
    edit: false,
    sortable: false,
    align: 'end'
  }
]

const shipmentStore = useShipmentStore()
async function loadShipments() {
  try {
    const data = await shipmentStore.fetchShipments()
    if (data) {
      shipments.value = data
      loading.value = false
    }
  } catch (e) {
    console.error('Erreur lors de la récupération des utilisateurs :', e)
  }
}
watch(loading, async () => {
  await loadShipments()
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadShipments()
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
      label="Shipments"
      :headers="headers"
      urlCreate="/api/admin/product/create"
      urlEdit="/api/admin/product/edit"
      urlDelete="/api/admin/product/delete"
      :create="false"
      :items="shipments || []"
      :loading="loading"
      :search="search"
      @refresh="loadShipments"
    />
  </v-container>
</template>

