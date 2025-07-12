<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'

definePageMeta({
  icon: 'mdi-cart',
  title: 'Payment methods',
  requiresAdmin: true,
  drawerIndex: 1,
})

const loading = ref(true)
const search = ref('')
const languages = ref<any[]>([])

const headers: DataTableHeaders = [
  { title: 'ID', key: '@id', type: 'text', list: false, show: true, create: false, edit: false },
  { title: 'Name', key: 'name', type: 'text', list: true, show: true, create: false, edit: false },
  { title: 'Code', key: 'code', type: 'text', list: true, show: true, create: false, edit: false },
  { title: '', key: 'actions', list: false, show: false, create: false, edit: false, sortable: false, align: 'end' },
]

const loadLanguages = async () => {
  try {
    const raw = await $fetch('/api/admin/shop/configuration/language/languages', { responseType: 'text' })
    const fixedRaw = raw.trim().match(/^\{.*\}/s)?.[0]
    if (!fixedRaw) throw new Error('Invalid JSON format')
    const data = JSON.parse(fixedRaw)
    languages.value = data['hydra:member']
    loading.value = true
  } catch (e) {
    console.error('❌ Erreur de chargement des produits:', e)
  } finally {
    loading.value = false
  }
}
watch(loading, async () => {
  await loadLanguages()
}, { immediate: true })
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadLanguages()
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
      label="Languages"
      :headers="headers"
      urlCreate="/api/admin/product/create"
      urlEdit="/api/admin/product/edit"
      urlDelete="/api/admin/product/delete"
      :items="languages || []"
      :loading="loading"
      :search="search"
      @refresh="loadLanguages"
    />
  </v-container>
</template>

