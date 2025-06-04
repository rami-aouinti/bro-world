<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch } from '#app'

const props = defineProps<{
  headers: {
    key: string
    title: string
    checkbox?: boolean
  }[]
  label: string
  apiPath: string
}>()

const search = ref('')
const { data: items, pending, error, refresh } = useFetch(() => props.apiPath, {
  credentials: 'include',
})

const handleDelete = async (id: string | number) => {
  await useFetch(`${props.apiPath}/${id}`, { method: 'DELETE' })
  refresh()
}

const handleShow = async (id: string | number) => {
  const res = await useFetch(`${props.apiPath}/${id}`)
  console.log('Show:', res)
}

const handleEdit = async (id: string | number) => {
  const res = await useFetch(`${props.apiPath}/${id}`)
  console.log('Edit:', res)
}
const headersWithActions = computed(() => [
  ...props.headers,
  { title: '', key: 'actions', sortable: false },
])
</script>

<template>
  <div
    v-if="pending"
    class="d-flex justify-center align-center"
    style="height: 25vh"
  >
    <v-progress-circular
      :size="120"
      :width="10"
      color="primary"
      indeterminate
    />
  </div>
  <v-card v-else variant="text">
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
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">{{ label }}</span>
    </v-card-title>

    <v-data-table :headers="headersWithActions" :items="items || []" :search="search">
      <template v-slot:item="{ item }">
        <tr>
          <td
            v-for="header in props.headers"
            :key="header.key"
          >
            <!-- checkbox -->
            <v-checkbox
              v-if="header.checkbox"
              :model-value="item[header.key]"
              readonly
              hide-details
              density="compact"
            />
            <!-- chips -->
            <div v-else-if="Array.isArray(item[header.key])">
              <v-chip
                v-for="(chip, i) in item[header.key]"
                :key="i"
                class="ma-1"
                size="small"
                label
              >
                {{ chip }}
              </v-chip>
            </div>
            <!-- default -->
            <span v-else>{{ item[header.key] }}</span>
          </td>

          <!-- actions -->
          <td class="text-center">
            <v-btn icon="mdi-eye" variant="text" color="primary" @click="handleShow(item.id)" />
            <v-btn icon="mdi-pencil" variant="text" color="warning" @click="handleEdit(item.id)" />
            <v-btn icon="mdi-delete" variant="text" color="error" @click="handleDelete(item.id)" />
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-alert v-if="error" type="error" class="ma-4">
      An error occurred while loading users.
    </v-alert>
  </v-card>
</template>
