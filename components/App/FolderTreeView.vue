<template>
  <v-treeview
    bg-color="transparent"
    v-model:open="open"
    v-model:active="active"
    v-model:selected="selected"
    :items="props.items"
    :search="props.search"
    :custom-filter="filterSearch"
    color="primary"
    activatable
    item-title="name"
    item-value="id"
    transition
    return-object
    @drop="handleDrop"
    multiple
    draggable
    expand-icon="mdi-plus"
    collapse-icon="mdi-minus"
  >
    <template #label="{ item }">
      <div class="draggable-label">
        {{ item.name }}
      </div>
    </template>
    <template #prepend="{ item }">
      <FileIcon
        :type="item.type ?? 'file'"
        :isPrivate="item.isPrivate ?? false"
        :isFavorite="item.isFavorite ?? false"
        :extension="item.extension ?? ''"
        :isOpen="item.isOpen ?? false"
        @click="handleFileClick(item)"
      />
    </template>

    <template #append="{ item }">
      <v-icon size="18" @click="openDialog('create', item)" color="primary">mdi-plus</v-icon>
      <v-icon size="18" @click="openDialog('upload', item)" color="success">mdi-upload</v-icon>
      <v-icon size="18" @click="openDialog('update', item)" color="warning">mdi-pencil</v-icon>
      <v-icon v-if="item.isFile" size="18" @click="openDialog('deleteFile', item)" color="error">mdi-delete</v-icon>
      <v-icon v-else size="18" @click="openDialog('delete', item)" color="error">mdi-delete</v-icon>
    </template>
  </v-treeview>

  <!-- Modale de création de dossier -->
  <BaseDialog
    v-if="currentItem"
    v-model="dialogCreateFolder"
    title="New Folder"
    color="primary"
    :closeButton="[{ text: 'Cancel', color: 'grey', action: closeAllDialogs }]"
    :saveButton="[{ text: 'Save', color: 'primary', action: `/api/media/folder/${currentItem.id}/add` }]"
    :forms="formPayload"
    :files="[]"
    @success="onSuccess('create')"
    @error="Notify.error('Error creating folder')"
  >
    <v-card rounded="xl">
      <v-card-text>
        <v-text-field
          v-model="name"
          label="New Folder"
          variant="outlined"
          rounded
          required
        />
      </v-card-text>
    </v-card>
  </BaseDialog>

  <!-- Modale de mise à jour -->
  <CrudDialog
    v-if="currentItem"
    v-model="dialogUpdateFolder"
    title="Update Folder Name"
    color="primary"
    :closeButton="[{ text: 'Cancel', color: 'grey', action: closeAllDialogs }]"
    :saveButton="[{ text: 'Save', color: 'primary', action: `/api/media/folder/${currentItem.id}/folder` }]"
    :files="[]"
    method="PUT"
    :forms="formPayload"
    @success="onSuccess('update')"
    @error="Notify.error('Error updating folder')"
  >
    <v-card rounded="xl">
      <v-card-text>
        <v-text-field
          v-model="name"
          label="Update Folder Name"
          variant="outlined"
          rounded
          required
        />
      </v-card-text>
    </v-card>
  </CrudDialog>

  <!-- Modale de suppression -->
  <DeleteDialog
    v-if="currentItem"
    v-model="dialogDeleteFolder"
    :deleteUrl="`/api/media/folder/${currentItem.id}`"
    @deleted="onSuccess('delete')"
  />

  <!-- Modale de suppression -->
  <DeleteDialog
    v-if="currentItem"
    v-model="dialogDeleteFile"
    :deleteUrl="`/api/media/media/${currentItem.id}`"
    @deleted="onSuccess('delete')"
  />

  <!-- Modale d’upload -->
  <UploadDialog
    v-if="currentItem"
    v-model="dialogUploadFile"
    title="Upload File"
    color="primary"
    :closeButton="[{ text: 'Cancel', color: 'grey', action: closeAllDialogs }]"
    :saveButton="[{ text: 'Save', color: 'primary', action: `/api/media/folder/${currentItem.id}/media` }]"
    :forms="formPayload"
    :files="files"
    @success="onSuccess('upload')"
    @error="Notify.error('Error uploading file')"
  >
    <v-card rounded="xl">
      <v-card-text>
        <v-file-upload
          icon="mdi-upload"
          v-model="files"
          :title="$t('post.files')"
          multiple
          density="compact"
          variant="compact"
          show-size
          clearable
        />
      </v-card-text>
    </v-card>
  </UploadDialog>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, defineEmits, watch } from 'vue'
import FileIcon from '~/components/App/FileIcon.vue'
import UploadDialog from '~/components/UploadDialog.vue'
import BaseDialog from '~/components/BaseDialog.vue'
import DeleteDialog from '~/components/DeleteDialog.vue'
import CrudDialog from '~/components/CrudDialog.vue'

const emit = defineEmits(['create', 'upload', 'update',  'delete', 'filter'])
const props = defineProps({
  items: { type: Array, default: () => [] },
  search: { type: String, default: '' }
})

const open = ref<string[]>([])
const active = ref<string[]>([])
const selected = ref<string[]>([])
const caseSensitive = shallowRef(false)
const name = ref('')
const files = ref<File[]>([])
const currentItem = ref<any | null>(null)

const dialogCreateFolder = ref(false)
const dialogUpdateFolder = ref(false)
const dialogUploadFile = ref(false)
const dialogDeleteFolder = ref(false)
const dialogDeleteFile = ref(false)

const formPayload = computed(() => {
  const payload: Record<string, any> = {}
  if (name.value.trim()) payload.name = name.value.trim()
  return payload
})

function filterSearch(value: string, search: string) {
  return caseSensitive.value
    ? value.includes(search)
    : value.toLowerCase().includes(search.toLowerCase())
}

function openDialog(type: 'create' | 'update' | 'upload' | 'delete' | 'deleteFile', item: any) {
  currentItem.value = item
  if (type === 'update') {
    name.value = item.name
    dialogUpdateFolder.value = true
  } else if (type === 'create') {
    name.value = ''
    dialogCreateFolder.value = true
  } else if (type === 'upload') {
    files.value = []
    dialogUploadFile.value = true
  } else if (type === 'delete') {
    dialogDeleteFolder.value = true
  }
  else if (type === 'deleteFile') {
    dialogDeleteFile.value = true
  }
}

function closeAllDialogs() {
  dialogCreateFolder.value = false
  dialogUpdateFolder.value = false
  dialogUploadFile.value = false
  dialogDeleteFolder.value = false
  currentItem.value = null
  name.value = ''
  files.value = []
}

function onSuccess(type: 'create' | 'update' | 'upload' | 'delete') {
  closeAllDialogs()
  emit(type)
}

function handleFileClick(item: any) {
  if (item.type === 'folder') {
    item.isOpen = !item.isOpen

    console.log(open)
    console.log(open.value.indexOf(item.id))
    const index = open.value.indexOf(item.id)
  console.log(index)
  }
}
function handleDrop({ dragged, dropped }) {
  console.log('Dragged:', dragged)
  console.log('Dropped on:', dropped)

  // Ajoute dragged dans dropped.children
  dropped.children = dropped.children || []
  dropped.children.push(dragged)

  // Optionnel : enlever dragged de son ancien parent
  removeItem(props.items.value, dragged.id)
}

function removeItem(nodes, id) {
  for (const node of nodes) {
    if (node.children) {
      const index = node.children.findIndex(child => child.id === id)
      if (index > -1) {
        node.children.splice(index, 1)
        return true
      }
      removeItem(node.children, id)
    }
  }
}

watch(() => props.search, (val) => emit('filter', val))
</script>

<style scoped>
.v-icon {
  margin-inline-end: 2px;
  cursor: pointer;
}
</style>
