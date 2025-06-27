<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import BaseDialog from '~/components/BaseDialog.vue'

const props = defineProps<{
  label: string
  items: any[]
  urlCreate: string
  urlEdit: string
  urlDelete: string
  headers: { key: string; title: string; [key: string]: any }[]
  loading: boolean
  searchable?: boolean
  list?: boolean
  search?: string
}>()

const emit = defineEmits(['refresh'])

const dialog = ref(false)
const dialogMode = ref<'create' | 'edit' | 'view' | 'delete'>('create')
const selectedItem = ref<any>(null)
const formFields = ref<Record<string, any>>({})
const safeToggleHeaders = ref<any>(null)
const url = ref('')
// ✅ Headers sécurisés (exclut les entrées nulles ou sans clé)
const safeHeaders = computed(() => props.headers.filter(h => h && h.key && h.key !== 'actions' && h.list === true))

// Préparer les champs dynamiques selon selectedItem
function prepareFormFields() {
  formFields.value = {}
  for (const header of safeHeaders.value) {
    const key = header.key
    const value = selectedItem.value?.[key]
    formFields.value[key] = typeof value === 'boolean' ? !!value : value ?? ''
  }
}

function prepareFormEditFields() {
  formFields.value = {}
  for (const header of props.headers) {
    const key = header.key
    const value = selectedItem.value?.[key]
    formFields.value[key] = typeof value === 'boolean' ? !!value : value ?? ''
  }
}

function handleCreate() {
  url.value = props.urlCreate
  safeToggleHeaders.value = props.headers.filter(h => h && h.key && h.key !== 'actions' && h.create === true)
  selectedItem.value = {}
  dialogMode.value = 'create'
  prepareFormFields()
  dialog.value = true
}
function handleEdit(item: any) {
  url.value = props.urlEdit + '/' + item.id
  safeToggleHeaders.value =  props.headers.filter(h => h && h.key && h.key !== 'actions' && h.edit === true)
  selectedItem.value = { ...item }
  dialogMode.value = 'edit'
  prepareFormEditFields()
  dialog.value = true
}
function handleView(item: any) {
  safeToggleHeaders.value =  props.headers.filter(h => h && h.key && h.key !== 'actions' && h.show === true)
  selectedItem.value = { ...item }
  dialogMode.value = 'view'
  prepareFormFields()
  dialog.value = true
}
function handleDelete(item: any) {
  url.value = props.urlDelete + '/' + item.id
  dialogMode.value = 'delete'
  dialog.value = true
}
</script>

<template>
  <v-skeleton-loader v-if="loading" type="table" class="mx-4 my-6" />

  <v-card v-else rounded="xl" class="py-4" variant="text" elevation="10">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6 px-4">{{ label }}</span>
      <v-btn
        color="primary"
        variant="text"
        icon="mdi-plus"
        v-tooltip="{ text: 'Create' }"
        @click="handleCreate"
      />
    </v-card-title>

    <v-card-text>
      <v-data-table
        class="bg-transparent custom-table"
        :headers="safeHeaders"
        :items="props.items"
        :search="props.search"
        item-value="id"
        density="comfortable"
      >
        <template #item="{ item }">
          <tr>
            <td v-for="(header, index) in safeHeaders" :key="header.key || index">
                <template v-if="typeof item[header.key] === 'boolean'">
                  <v-checkbox :model-value="item[header.key]" color="primary" />
                </template>
                <template v-else>
                  {{ item[header.key] }}
                </template>
            </td>

            <td class="text-end">
              <v-btn
                color="primary"
                variant="text"
                icon="mdi-eye"
                v-tooltip="{ text: 'View' }"
                @click="handleView(item)"
              />
              <v-btn
                color="warning"
                variant="text"
                icon="mdi-pencil"
                v-tooltip="{ text: 'Edit' }"
                @click="handleEdit(item)"
              />
              <v-btn
                color="error"
                variant="text"
                icon="mdi-delete"
                v-tooltip="{ text: 'Delete' }"
                @click="handleDelete(item)"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <!-- Dialogue dynamique -->
  <BaseDialog
    v-model="dialog"
    :title="dialogMode === 'create' ? 'Create' : dialogMode === 'edit' ? 'Edit' : 'Details'"
    :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialog = false) }]"
    :saveButton="dialogMode !== 'view' ? [{ text: 'Save', color: 'primary', action: url }] : []"
    :forms="formFields"
    @success="() => emit('refresh')"
    @error="() => emit('refresh')"
  >
    <v-card rounded="xl">
      <v-card-text>
        <v-row v-if="dialogMode != 'delete'">
          <v-col
            cols="6"
            v-for="(header, index) in safeToggleHeaders"
            :key="header.key || index"
          >
            <v-text-field
              v-if="header.type !== 'boolean'"
              v-model="formFields[header.key]"
              :label="header.title"
              :disabled="dialogMode === 'view'"
              variant="outlined"
              density="comfortable"
              :color="typeof formFields[header.key] === 'boolean' ? 'primary' : undefined"
            />
            <v-checkbox
              v-else
              v-model="formFields[header.key]"
              :label="header.title"
              :disabled="dialogMode === 'view'"
              variant="outlined"
              density="comfortable"
              :color="typeof formFields[header.key] === 'boolean' ? 'primary' : undefined"
            />
          </v-col>
        </v-row>
        <h3 v-else>
          Are you sure you want to delete this {{ props.label }}?
        </h3>
      </v-card-text>
    </v-card>
  </BaseDialog>
</template>
<style scoped>
::v-deep(.v-data-table thead tr th) {
  background-color: transparent !important;
}
</style>

