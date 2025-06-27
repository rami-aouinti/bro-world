<script setup lang="ts">
import type { DataTableHeaders } from '~/plugins/vuetify'
import { onMounted } from 'vue'
import { useUserGroupStore } from '~/stores/admin/user/userGroupStore'
import ReusableDataTable from "~/components/Admin/ReusableDataTable.vue";

definePageMeta({
  icon: 'mdi-view-list',
  title: 'Groups',
  requiresAdmin: true,
  drawerIndex: 2,
})
const loading = ref(true)
const search = ref('')
const userGroupStore = useUserGroupStore()
const groups = computed(() => userGroupStore.groups)
onMounted(async () => {
  loading.value = true
  await userGroupStore.fetchUserGroups()
  loading.value = false
})

const headers: DataTableHeaders = [
  { title: 'ID', key: 'id' , list: false, show: true ,create: false, edit: true },
  { title: 'Name', key: 'name' , list: true, show: true ,create: true, edit: true},
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]

async function handleEdit() {
  loading.value = true
  await userGroupStore.fetchUserGroups()
  loading.value = false
}
async function handleCreate() {
  loading.value = true
  await userGroupStore.fetchUserGroups()
  loading.value = false
}
async function handleDelete() {
  loading.value = true
  await userGroupStore.fetchUserGroups()
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
      label="Groups"
      :headers="headers"
      :items="groups || []"
      :loading="loading"
      :search="search"
      @edit="handleEdit"
      @create="handleCreate"
      @delete="handleDelete"
    />
  </v-container>
</template>
