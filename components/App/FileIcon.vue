<template>
  <v-tooltip :text="tooltip">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        variant="text"
        :color="icon.color"
        @click="emit('click')"
      >
        <v-icon size="32">{{ icon.name }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: { type: String, default: 'file' },        // 'file' ou 'folder'
  extension: { type: String, default: '' },
  isOpen: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const fileIcons = {
  html: { name: 'mdi-language-html5', color: '#36a211', label: 'PDF' },
  json: { name: 'mdi-code-json', color: '#332f2f', label: 'PDF' },
  md: { name: 'mdi-language-markdown', color: '#ce2626', label: 'PDF' },
  pdf: { name: 'mdi-file-pdf-box', color: '#e53935', label: 'PDF' },
  docx: { name: 'mdi-file-word-box', color: '#1e88e5', label: 'Word' },
  xlsx: { name: 'mdi-file-excel-box', color: '#43a047', label: 'Excel' },
  pptx: { name: 'mdi-file-powerpoint-box', color: '#e64a19', label: 'PowerPoint' },
  txt: { name: 'mdi-file-document-outline', color: '#546e7a', label: 'Texte' },
  jpg: { name: 'mdi-file-image', color: '#2680da', label: 'Image JPG' },
  jpeg: { name: 'mdi-file-image', color: '#26c6da', label: 'Image JPG' },
  png: { name: 'mdi-file-image', color: '#1f8c9a', label: 'Image PNG' },
  mp4: { name: 'mdi-file-video', color: '#ab47bc', label: 'Vidéo MP4' },
  mp3: { name: 'mdi-file-music', color: '#5c6bc0', label: 'Audio MP3' },
  zip: { name: 'mdi-zip-box', color: '#ff8f00', label: 'Archive ZIP' },
  js: { name: 'mdi-nodejs', color: '#8d6e63', label: 'Code JS' },
  php: { name: 'mdi-file-code-outline', color: '#8d6e63', label: 'Code PHP' },
  default: { name: 'mdi-file-outline', color: '#9e9e9e', label: 'Fichier inconnu' }
}

const folderIcon = computed(() => {
  if (props.isPrivate) return { name: 'mdi-folder-lock', color: '#e53935', label: 'Dossier privé' }
  if (props.isFavorite) return { name: 'mdi-folder-star', color: '#ffb300', label: 'Favori' }
  if (props.isShared) return { name: 'mdi-folder-account', color: '#42a5f5', label: 'Partagé' }
  return props.isOpen
    ? { name: 'mdi-folder-open', color: '#fdd835', label: 'Dossier ouvert' }
    : { name: 'mdi-folder', color: '#fbc02d', label: 'Dossier' }
})

const icon = computed(() => {
  if (props.type === 'folder') return folderIcon.value
  const ext = props.extension.toLowerCase()
  return fileIcons[ext] ?? fileIcons.default
})

const tooltip = computed(() => icon.value.label)
</script>
