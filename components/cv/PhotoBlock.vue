<template>
  <div class="photo-block" @mouseenter="hover=true" @mouseleave="hover=false">
    <!-- Image / placeholder -->
    <div class="frame" :class="{ placeholder: !src }">
      <img v-if="src" :src="src" alt="photo" />
      <div v-else class="ph">📷</div>
    </div>

    <!-- Hover overlay controls -->
    <transition name="fade">
      <div v-if="hover" class="overlay">
        <!-- Delete whole section -->
        <v-btn icon="mdi-delete" variant="text" size="small" class="btn tl" color="error"
               @click.stop="$emit('delete-section')" />

        <!-- Upload -->
        <v-btn icon="mdi-upload" variant="text" size="small" class="btn tr"
               @click.stop="triggerFile" />

        <!-- Remove current photo -->
        <v-btn v-if="src" icon="mdi-close" variant="text" size="small" class="btn br" color="warning"
               @click.stop="emit('update:src','')" />
      </div>
    </transition>

    <!-- Hidden file input -->
    <input ref="fileEl" type="file" accept="image/*" class="hidden" @change="onFile" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ src?: string }>()
const emit = defineEmits<{
  (e: 'update:src', value: string): void
  (e: 'delete-section'): void
}>()

const hover = ref(false)
const fileEl = ref<HTMLInputElement | null>(null)

function triggerFile(){ fileEl.value?.click() }

function onFile(e: Event){
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if(!file) return
  const reader = new FileReader()
  reader.onload = () => {
    emit('update:src', String(reader.result || ''))
    // reset pour ré-upload du même fichier
    input.value = ''
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.photo-block{ position:relative; width:48mm; height:64mm; }
.frame{ width:100%; height:100%;
  display:flex; align-items:center; justify-content:center; overflow:hidden; background:#fafafa; }
.frame img{ width:100%; height:100%; object-fit:cover; }
.ph{ font-size:28px; opacity:.5; }
.overlay{ position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.08));
  border-radius:6px; }
.btn{ position:absolute; }
.tl{ top:6px; left:6px; }
.tr{ top:6px; right:6px; }
.br{ bottom:6px; right:6px; }
.fade-enter-active,.fade-leave-active{ transition:opacity .15s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
.hidden{ display:none; }
.placeholder{ border-style:dashed; }
</style>
