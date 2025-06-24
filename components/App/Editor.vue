<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const props = defineProps<{
  modelValue: string
  apiKey?: string
  init?: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
}>()

const content = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
    emit('input', value)
  }
})

const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches
</script>

<template>
  <Editor
    v-model="content"
    :api-key="apiKey || ''"
    :init="{
      height: 300,
      menubar: 'file edit view insert format tools table help',
      branding: false,
      statusbar: false,
      toolbar_mode: 'sliding',
      popup_parent: '.v-overlay-container', // 🔥 attach popups to dialog overlay
      plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
      toolbar:
        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | forecolor backcolor | removeformat | code fullscreen',
      fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
      skin: 'material-classic',
      content_css: '/assets/styles/index.css',
      content_style: `
        html, body {
          background-color: transparent !important;
          color: inherit;
          font-family: Helvetica, Arial, sans-serif;
          font-size: 16px;
          padding: 10px;
          margin: 0;
        }
         .tox {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }

          .tox .tox-edit-area__iframe {
            background-color: transparent !important;
            border: none;
            width: 100%;
            height: 100%;
          }
        p { margin: 0; }
      `,
      ...props.init
    }"
  />
</template>


<style scoped>
.editor-container {
  position: relative;
  z-index: 10000;
}

/* 🧼 Style transparent pour TinyMCE container */
.tox {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* ✅ Important pour que les tooltips/menus apparaissent bien */
.tox-tinymce-aux {
  z-index: 99999 !important;
}

/* Empêche le v-dialog de couper les menus */
.v-dialog__content {
  overflow: visible !important;
}
.tox .tox-edit-area__iframe {
  border: 0;
  box-sizing: border-box;
  flex: 1;
  height: 100%;
  position: absolute;
  width: 100%;
}
</style>
