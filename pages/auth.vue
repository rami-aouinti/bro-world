<script setup lang="ts">
import type { DataTableHeader } from 'vuetify'

definePageMeta({
  title: 'Auth',
  middleware: 'auth',
})

const headers: DataTableHeader[] = [
  { title: 'Name', key: 'username' },
  { title: 'FirstName', key: 'firstName' },
  { title: 'LastName', key: 'lastName' },
  { title: 'Email', key: 'email' },
  { title: 'Language', key: 'language' },
  { title: 'Actions', key: 'actions' },
]

const { data: users } = await useFetch('/api/admin/user/users')

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
        <v-card>
          <v-data-table
            :items="users || undefined"
            :headers="headers"
            show-select
          >
            <template #item.actions>
              <v-defaults-provider
                :defaults="{
                  VBtn: {
                    size: 20,
                    rounded: 'lg',
                    variant: 'text',
                    class: 'ml-1',
                    color: '',
                  },
                  VIcon: {
                    size: 20,
                  },
                  VTooltip: {
                    location: 'top',
                  },
                }"
              >
                <v-btn v-tooltip="{ text: 'Edit' }" icon="mdi-pencil" />
                <v-btn v-tooltip="{ text: 'Copy' }" icon="mdi-content-copy" />
                <v-btn v-tooltip="{ text: 'Delete' }" icon="mdi-delete" />
              </v-defaults-provider>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
