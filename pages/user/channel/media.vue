<template>
  <v-container fluid>
    <div :dir="isRtl ? 'rtl' : 'ltr'">
      <template v-if="showCard">
        <v-skeleton-loader
          type="card"
          class="mx-3 mb-4 rounded-xl"
          height="350"
        />
      </template>
      <div v-else>
        <v-card rounded="xl" class="bg-gradient-primary shadow-primary border-radius-lg mx-3" variant="text" elevation="10">
          <v-toolbar
            color="transparent"
          >
            <v-app-bar-nav-icon color="primary"></v-app-bar-nav-icon>
            <v-toolbar-title text="My files"></v-toolbar-title>
            <v-btn @click="dialogCreateFolder = true" color="primary" icon="mdi-plus"></v-btn>
            <v-btn @click="dialogUploadFile = true" color="primary" icon="mdi-upload"></v-btn>
            <template v-slot:extension>
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
              ></v-text-field>
            </template>
          </v-toolbar>
          <FolderTreeView
            :items="treeItems"
            :search="search"
            @update="renameItem"
            @delete="deleteItem"
            @upload="addFile"
            @create="createFolder"
          />
        </v-card>

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
                rounded
                outlined
                required
              />
            </v-card-text>
          </v-card>
        </BaseDialog>

        <UploadDialog
          v-model="dialogUploadFile"
          title="New Folder"
          color="primary"
          :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialogUploadFile.value = false) }]"
          :saveButton="[{ text: 'Save', color: 'primary', action: '/api/media/upload' }]"
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
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  description: 'Media page',
  breadcrumb: 'disabled',
  title: 'Media',
  meta: [
    { name: 'description', content: 'User profile page with personal information and settings.' },
    { name: 'keywords', content: 'profile, user, settings' },
  ],
  head: {
    title: 'Profile',
    meta: [
      { name: 'description', content: 'User profile page with personal information and settings.' },
      { name: 'keywords', content: 'profile, user, settings' },
    ],
  },
  middleware: 'auth',
  scrollToTop: true,
})
import { ref, onMounted, computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const search = shallowRef(null)
const dialogCreateFolder = ref(false)
const dialogUploadFile = ref(false)

function filter (value, search, item) {
  return value.toLowerCase().indexOf(search.toLowerCase())
}
import FolderTreeView from "~/components/App/FolderTreeView.vue";
import BaseDialog from "~/components/BaseDialog.vue";
import UploadDialog from "~/components/UploadDialog.vue";
const files = ref<File[]>([])
const { t, locale } = useI18n()
const router = useRouter()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const { loggedIn, user } = useUserSession()
const showCard = ref(true)
onMounted(async () => {
  showCard.value = false
  if (!loggedIn) {
    showCard.value = true
  } else {
    await loadFolders()
  }
})

const newFolderName = ref('')
const treeItems = ref<FolderTreeNode[]>([])

interface FolderTreeNode {
  id: string
  name: string
  type: string
  extension?: string
  isFile?: boolean
  isPrivate?: boolean
  isFavorite?: boolean
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
  metaData?: any
  extension?: string
  isFile?: boolean
  isPrivate?: boolean
  private?: boolean
  favorite?: boolean
  isFavorite?: boolean
  isOpen?: boolean
}

async function loadFolders() {
  try {
    const  data = await $fetch('/api/media/folders')
    if (data) {
      treeItems.value = transformData(data[0].children)
    }
  } catch (error) {
    Notify.error('Error')
    console.error(error)
  }
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

async function addFile() {
  await loadFolders()
}

function formatSize(size: number): string {
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
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

const postContent = ref('')

const formPayload = computed(() => {
  const payload: Record<string, any> = {}
  if (postContent.value.trim()) {
    payload.name = postContent.value.trim()
  }

  return payload
})

</script>
