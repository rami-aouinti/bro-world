<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <v-text-field
          v-model="search"
          density="compact"
          outlined
          rounded="xl"
          class="px-4 mb-2"
          dense
          clear-icon="mdi-close-circle-outline"
          clearable
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          hide-details
          single-line
        />
        <TaxonTree :search="search" :items="treeItems" @edit="handleEdit" @update:items="onUpdate" />

      </teleport>
    </client-only>

    <div :dir="isRtl ? 'rtl' : 'ltr'">
      <v-card
        rounded="xl"
        class="bg-gradient-primary shadow-primary mx-3 d-flex flex-column"
        variant="text"
        elevation="10"
        style="height: calc(100vh - 122px); overflow-y: auto;"
      >
        <v-card-title class="d-flex justify-end gap-2 my-2">
          <v-btn @click="dialogCreateFolder = true" color="primary" prepend-icon="mdi-plus">
            New Folder
          </v-btn>
          <v-btn class="mx-2" @click="dialogUploadFile = true" color="primary" prepend-icon="mdi-upload">
            Upload File
          </v-btn>
        </v-card-title>

        <v-card-text class="flex-grow-1 overflow-y-auto">
          <!-- Breadcrumb -->
          <v-breadcrumbs class="px-4 mb-2 py-2">
            <v-breadcrumbs-item
              :disabled="breadcrumb.length === 0"
              @click="goToBreadcrumb(-1)"
              class="font-weight-bold breadcrumb-clickable"
            >
              🏠 Root
            </v-breadcrumbs-item>
            <span class="mx-2 text-medium-emphasis">/</span>
            <!-- Boucle sur les éléments du fil -->
            <v-breadcrumbs-item
              v-for="(item, index) in breadcrumb"
              :key="item.id"
              :disabled="index === breadcrumb.length - 1"
              @click="goToBreadcrumb(index)"
              :class="{ 'breadcrumb-clickable': index !== breadcrumb.length - 1 }"
            >
              {{ item.name }} /
            </v-breadcrumbs-item>
          </v-breadcrumbs>


          <v-row class="d-flex text-center mb-2 py-2">
            <v-col
              v-for="item in displayedItems"
              :key="item.id"
              cols="12" sm="6" md="3"
            >
              <v-icon
                draggable="true"
                @dragstart="onDragStart(item)"
                @dragend="onDragEnd"
                @click="item.isFile ? previewOrDownload(item) : openFolder(item)"
                size="72"
                class="me-4"
                :color="item.isFile ? 'primary' : 'orange'"
              >
                {{ item.isFile ? 'mdi-file' : 'mdi-folder' }}
              </v-icon>
              <div v-if="!item.editing" @click="startEditing(item)" class="text-truncate me-4 cursor-pointer">
                {{ item.name }}
              </div>

              <!-- Zone édition -->
              <v-text-field
                v-else
                v-model="item.name"
                density="compact"
                variant="text"
                autofocus
                hide-details
                @blur="stopEditing(item)"
                @keyup.enter="stopEditing(item)"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            v-if="draggedItem"
            class="hover-card ma-4"
            color="red"
            @drop.prevent="onDrop"
            @dragover.prevent
          >
            <v-icon size="36">mdi-trash-can</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Dialogs -->
      <BaseDialog
        v-model="dialogCreateFolder"
        title="New Folder"
        color="primary"
        :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialogCreateFolder.value = false) }]"
        :saveButton="[{ text: 'Save', color: 'primary', action: '/api/media/folder/folder' }]"
        :files="[]"
        :forms="formPayload"
        @success="loadFolders"
        @error="Notify.error('Error creating folder')"
      >
        <v-card rounded="xl">
          <v-card-text>
            <v-text-field
              v-model="postContent"
              label="New Folder"
              variant="outlined"
              required
            />
          </v-card-text>
        </v-card>
      </BaseDialog>

      <UploadDialog
        v-model="dialogUploadFile"
        title="Upload Files"
        color="primary"
        :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialogUploadFile.value = false) }]"
        :saveButton="[{ text: 'Save', color: 'primary', action: `/api/media/folder/${currentFolder?.id ?? user?.id}/media` }]"
        :forms="formPayload"
        :files="files"
        @success="loadFolders"
        @error="Notify.error('Error uploading file')"
      >
        <v-card rounded="xl">
          <v-card-text>
            <v-file-upload
              icon="mdi-upload"
              v-model="files"
              multiple
              density="compact"
              variant="compact"
              show-size
              clearable
            />
          </v-card-text>
        </v-card>
      </UploadDialog>
    </div>
    <v-dialog
      v-model="previewDialog"
      max-width="500"
      persistent
      scrollable
    >
      <v-card rounded="xl">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">{{ previewItem?.name }}</span>
          <v-btn variant="text" icon @click="previewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="d-flex justify-center align-center pa-4">
          <div v-if="previewItem">
            <img
              v-if="['png','jpg','jpeg','webp','gif'].includes(previewItem.extension?.toLowerCase())"
              :src="`${previewItem?.path}`"
              alt="Preview"
              class="rounded-xl cursor-pointer"
              @click="showFullscreenImage"
              style="max-width: 100%; border-radius: 12px;"
            />
            <iframe
              v-else-if="previewItem.extension?.toLowerCase() === 'pdf'"
              :src="`${previewItem?.path}`"
              width="100%"
              height="600"
              style="border: none; border-radius: 12px;"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="fullscreenImageDialog"
      fullscreen
      transition="dialog-top-transition"
      persistent
    >
      <v-card class="pa-0" flat>
        <v-toolbar dense flat>
          <v-spacer />
          <v-btn icon @click="fullscreenImageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-img
          :src="previewItem?.path"
          class="fullscreen-image"
          cover
        />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, shallowRef, nextTick } from 'vue'

import UploadDialog from "~/components/UploadDialog.vue";
import BaseDialog from "~/components/BaseDialog.vue";
import FolderTreeView from "~/components/App/FolderTreeView.vue";
import TaxonTree from "~/components/TaxonTree.vue";
const canTeleport = ref(false)
const dialogCreateFolder = ref(false)
const dialogUploadFile = ref(false)
const currentFolder = ref<FolderTreeNode | null>(null)
const breadcrumb = ref<FolderTreeNode[]>([])
const search = shallowRef(null)
const treeItems = ref<FolderTreeNode[]>([])
const files = ref<File[]>([])
const postContent = ref('')
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const previewDialog = ref(false)
const previewItem = ref<FolderTreeNode | null>(null)
const fullscreenImageDialog = ref(false)
const draggedItem = ref<FolderTreeNode | null>(null)

function onDragStart(item: FolderTreeNode) {
  draggedItem.value = item
}
function onDragEnd() {
  draggedItem.value = null
}
function onDrop() {
  if (draggedItem.value) {
    deleteItemOb(draggedItem.value)
    draggedItem.value = null
  }
}
function handleEdit(taxon: any) {
  console.log('Edit taxon:', taxon)
}

function onMove(e: any) {
  return true
}
function onUpdate() {
}

function showFullscreenImage() {
  fullscreenImageDialog.value = true
}
const displayedItems = computed(() => {
  return currentFolder.value?.children ?? treeItems.value
})

function openFolder(folder: FolderTreeNode) {
  if (folder.isFile) return
  breadcrumb.value.push(folder)
  currentFolder.value = folder
}

function goToBreadcrumb(index: number) {
  if (index === -1) {
    breadcrumb.value = []
    currentFolder.value = null // retour à la racine
  } else {
    breadcrumb.value = breadcrumb.value.slice(0, index + 1)
    currentFolder.value = breadcrumb.value[index]
  }
}


function formatSize(size: number): string {
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}


function previewOrDownload(item: FolderTreeNode) {
  if (!item.isFile) return

  const ext = item.extension?.toLowerCase()
  const previewable = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif']

  if (previewable.includes(ext)) {
    previewItem.value = item
    previewDialog.value = true
  } else {
    // sinon, télécharge directement
    window.open(`${item.path}`, '_blank')
  }
}

async function loadFolders() {
  try {
    const data = await $fetch('/api/media/folders')
    if (data) {
      treeItems.value = transformData(data[0].children)
      breadcrumb.value = []
      currentFolder.value = null
    }
  } catch (error) {
    Notify.error('Error')
    console.error(error)
  }
}

function transformData(data: any[]): FolderTreeNode[] {
  return data.map(folder => ({
    id: folder.id,
    name: folder.name,
    type: folder.type ?? 'folder',
    isFile: false,
    isOpen: false,
    isPrivate: folder.isPrivate ?? false,
    isFavorite: folder.isFavorite ?? false,
    extension: '',
    children: [
      ...(folder.children ? transformData(folder.children) : []),
      ...(folder.media || []).map((file: FileItem) => ({
        id: file.id,
        path: file.path,
        name: `${file.fileName} (${file.metaData.type} – ${formatSize(file?.fileSize)})`,
        searchableText: `${file.fileName} ${file.metaData.type} ${file.fileName.split('.').pop()}`.toLowerCase(),
        type: file.metaData.type ?? 'file',
        isFile: true,
        isOpen: false,
        isPrivate: file.private ?? false,
        isFavorite: file.favorite ?? false,
        extension: file.fileName.split('.').pop() ?? ''
      }))
    ]
  }))
}

const formPayload = computed(() => {
  const payload: Record<string, any> = {}
  if (postContent.value.trim()) {
    payload.name = postContent.value.trim()
  }
  return payload
})

const { t, locale } = useI18n()
const router = useRouter()
const { user, loggedIn } = useUserSession()

onMounted(async () => {
  if (!loggedIn) return
  await loadFolders()
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})

interface FolderTreeNode {
  id: string
  name: string
  type: string
  path?: string
  extension?: string
  isFile?: boolean
  isPrivate?: boolean
  isFavorite?: boolean
  editing?: boolean
  private?: boolean
  favorite?: boolean
  isOpen?: boolean
  children?: FolderTreeNode[]
}

interface FileItem {
  id: string
  fileName?: string
  fileSize?: number
  type?: string
  path?: string
  metaData?: any
  extension?: string
  isFile?: boolean
  isPrivate?: boolean
  private?: boolean
  favorite?: boolean
  isFavorite?: boolean
  isOpen?: boolean
}

async function createFolder() {
  await loadFolders()
}

async function renameItem() {
  await loadFolders()
}

async function deleteItem() {
  await loadFolders()
}

function startEditing(item: FolderTreeNode) {
  item.editing = true
}

function stopEditing(item: FolderTreeNode) {
  item.editing = false
  update(item)
}

function update(item: FolderTreeNode) {
  const formData = new FormData()
  formData.append('name', item.name)
  $fetch(`/api/media/folder/${item.id}/folder`, {
    method: 'PUT',
    body: formData
  }).then(() => {
    Notify.success('Name updated')
    loadFolders()
  }).catch(() => Notify.error('Update failed'))
}
function deleteItemOb(item: FolderTreeNode) {
  if (item.isFile) {
    $fetch(`/api/media/media/${item.id}`, { method: 'DELETE' })
      .then(async () => {
        Notify.success('Item deleted')
        await loadFolders()
      })
      .catch(() => Notify.error('Failed to delete'))
  }
  else {
    $fetch(`/api/media/folder/${item.id}`, { method: 'DELETE' })
      .then(async () => {
        Notify.success('Item deleted')
        await loadFolders()
      })
      .catch(() => Notify.error('Failed to delete'))
  }

}
async function addFile() {
  await loadFolders()
}
</script>

<style scoped>
.breadcrumb-clickable {
  cursor: pointer;
  text-decoration: none !important;
  color: inherit;
  font-weight: 500;
}
.fullscreen-image {
  height: calc(100vh - 96px); /* Retire la hauteur de la toolbar */
}
.breadcrumb-clickable:hover {
  color: var(--v-primary-base);
  text-decoration: underline;
}

.hover-card {
  transition: transform 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}
.cursor-pointer {
  cursor: pointer;
}
</style>
