<script setup lang="ts">
import { onMounted } from 'vue'
import { useApiKeyStore } from '~/stores/admin/user/apiKeyStore'
import ReusableDataTable from "~/components/Admin/ReusableDataTable.vue";
import type {DataTableHeaders} from "~/plugins/vuetify";

definePageMeta({
  icon: 'mdi-view-list',
  title: 'Api Keys',
  requiresAdmin: true,
  drawerIndex: 4,
})
const loading = ref(true)
const search = ref('')
const apiKeyStore = useApiKeyStore()
const apiKeys = computed(() => apiKeyStore.apiKeys)
onMounted(async () => {
  loading.value = true
  await apiKeyStore.fetchApiKeys()
  loading.value = false
})

const headers: DataTableHeaders = [
  { title: 'ID', key: 'id', list: false, show: true ,create: false, edit: true  },
  { title: 'Description', key: 'description', list: true, show: true ,create: true, edit: true },
  { title: 'Token', key: 'token' , list: true, show: true ,create: true, edit: true},
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' }
]

async function handleEdit() {
  loading.value = true
  await apiKeyStore.fetchApiKeys()
  loading.value = false
}
async function handleCreate() {
  loading.value = true
  await apiKeyStore.fetchApiKeys()
  loading.value = false
}
async function handleDelete() {
  loading.value = true
  await apiKeyStore.fetchApiKeys()
  loading.value = false
}
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
      label="Api Keys"
      :headers="headers"
      :items="apiKeys || []"
      :loading="loading"
      :search="search"
      @edit="handleEdit"
      @create="handleCreate"
      @delete="handleDelete"
    />
  </v-container>
</template>
