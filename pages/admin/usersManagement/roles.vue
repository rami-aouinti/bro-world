<script setup lang="ts">
import type { DataTableHeaders } from '~/plugins/vuetify'
import { onMounted } from 'vue'
import { useRoleStore } from '~/stores/admin/user/roleStore'
import ReusableDataTable from "~/components/Admin/ReusableDataTable.vue";

definePageMeta({
  icon: 'mdi-view-list',
  title: 'Role',
  requiresAdmin: true,
  drawerIndex: 3,
})
const loading = ref(true)
const search = ref('')
const roleStore = useRoleStore()
const roles = computed(() => roleStore.roles)
onMounted(async () => {
  loading.value = true
  await roleStore.fetchRoles()
  loading.value = false
})

const headers: DataTableHeaders = [
  { title: 'ID', key: 'id' , list: true, show: true ,create: false, edit: true },
  { title: 'Description', key: 'description' , list: true, show: true ,create: false, edit: true },
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]

async function handleEdit() {
  loading.value = true
  await roleStore.fetchRoles()
  loading.value = false
}
async function handleCreate() {
  loading.value = true
  await roleStore.fetchRoles()
  loading.value = false
}
async function handleDelete() {
  loading.value = true
  await roleStore.fetchRoles()
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
      label="Roles"
      :headers="headers"
      :items="roles || []"
      :loading="loading"
      :search="search"
      @edit="handleEdit"
      @create="handleCreate"
      @delete="handleDelete"
    />
  </v-container>
</template>
