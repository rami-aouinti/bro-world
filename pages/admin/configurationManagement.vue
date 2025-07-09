<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'
definePageMeta({
  title: 'Configuration Management',
  requiresAdmin: true,
  icon: 'mdi-access-point-network',
  drawerIndex: 2,
})
const loading = ref(true)
const search = ref('')
const configurations = ref<any[]>([])
const headers: DataTableHeaders = [
  { title: 'ID', key: 'id', type: 'text', list: false, show: true ,create: false, edit: false },
  { title: 'Key', key: 'configurationKey', type: 'text', list: false, show: true ,create: true, edit: false },
  { title: 'Value', key: 'configurationValue', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: 'Context', key: 'contextKey', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]
async function fetchConfigurations() {
  try {
    const data = await $fetch('/api/admin/configuration/configurations')
    if (data) {
      configurations.value = data
    }
    loading.value = false
  } catch (e) {
    console.error('Failed to load configurations :', e)
  }
}
watch(loading, () => {
  fetchConfigurations()
}, { immediate: true })
onMounted(fetchConfigurations)
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
      label="Users"
      :headers="headers"
      urlCreate="/api/admin/configuration/create/configuration"
      urlEdit="/api/admin/configuration/edit/configuration"
      urlDelete="/api/admin/configuration/delete/configuration"
      :items="configurations || []"
      :loading="loading"
      :search="search"
      @refresh="fetcConfigurations"
    />
  </v-container>
</template>
