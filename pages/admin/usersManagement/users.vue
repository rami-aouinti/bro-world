<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import { useUserStore } from '~/stores/admin/user/userStore'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'

// Méta-infos de la page
definePageMeta({
  icon: 'mdi-account-group',
  title: 'Users',
  requiresAdmin: true,
  drawerIndex: 2,
})

const userStore = useUserStore()
const loading = ref(true)
const search = ref('')

const headers: DataTableHeaders = [
  { title: 'ID', key: 'id', type: 'text', list: false, show: true ,create: false, edit: false },
  { title: 'Username', key: 'username', type: 'text', list: false, show: true ,create: true, edit: false },
  { title: 'Email', key: 'email', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: 'First Name', key: 'firstName', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: 'Last Name', key: 'lastName', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: 'Enabled', key: 'enabled', type: 'boolean', list: true, show: true ,create: true, edit: true },
  { title: 'Password', key: 'password', type: 'text', list: false, show: false ,create: true, edit: false },
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]

const users = computed(() => userStore.users)

async function fetchUsers() {
  loading.value = true
  await userStore.fetchUsers()
  loading.value = false
}

onMounted(await fetchUsers)
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
      urlCreate="/api/admin/user/create/user"
      urlEdit="/api/admin/user/edit/user"
      urlDelete="/api/admin/user/delete/user"
      :items="users || []"
      :loading="loading"
      :search="search"
      @refresh="fetchUsers"
    />
  </v-container>
</template>
