<script setup lang="ts">

import BaseDataTable from "~/components/Admin/BaseDataTable.vue";

definePageMeta({
  title: 'Auth',
  middleware: 'auth',
})

const headers: (
  | { title: string; key: string }
  | {
  sortable: boolean
  title: string
  key: string
}
  )[] = [
  { title: 'Name', key: 'username' },
  { title: 'Firstname', key: 'firstName' },
  { title: 'Lastname', key: 'lastName' },
  { title: 'Email', key: 'email' },
  { title: 'Language', key: 'language' },
]


const { loggedIn } = useUserSession()
watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <BaseDataTable label="List of Users" api-path="/api/admin/user/users" :headers="headers"/>
      </v-col>
    </v-row>
  </v-container>
</template>
