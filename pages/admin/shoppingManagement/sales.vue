<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'

definePageMeta({
  icon: 'mdi-products',
  title: 'Sales',
  requiresAdmin: true,
  drawerIndex: 2,
})

const loading = ref(true)
const search = ref('')
const products = ref<any[]>([])

// On va chercher le nom en anglais via la clé imbriquée
const headers: DataTableHeaders = [
  { title: 'ID', key: '@id', type: 'text', list: false, show: true, create: false, edit: false },
  { title: 'Image', key: 'images.0.path', type: 'image', list: true, show: true, create: false, edit: false },
  { title: 'Name (EN)', key: 'translations.en_US.name', type: 'text', list: true, show: true, create: false, edit: false },
  { title: 'Enabled', key: 'enabled', type: 'boolean', list: true, show: true ,create: true, edit: true },
  { title: 'Rating', key: 'averageRating', type: 'rating', list: true, show: true, create: false, edit: false },
  { title: '', key: 'actions', list: false, show: false, create: false, edit: false, sortable: false, align: 'end' },
]

const loadProducts = async () => {
  loading.value = true
  try {
    const raw = await $fetch('/api/admin/shop/products/products', { responseType: 'text' })
    const fixedRaw = raw.trim().match(/^\{.*\}/s)?.[0]
    if (!fixedRaw) throw new Error('Invalid JSON format')
    const data = JSON.parse(fixedRaw)
    products.value = data['hydra:member']
  } catch (e) {
    console.error('❌ Erreur de chargement des produits:', e)
  } finally {
    loading.value = false
  }
}
watch(loading, async () => {
  await loadProducts()
}, { immediate: true })
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadProducts()
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
      label="Products"
      :headers="headers"
      urlCreate="/api/admin/product/create"
      urlEdit="/api/admin/product/edit"
      urlDelete="/api/admin/product/delete"
      :items="products || []"
      :loading="loading"
      :search="search"
      @refresh="loadProducts"
    />
  </v-container>
</template>

