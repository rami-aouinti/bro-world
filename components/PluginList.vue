<template>
  <transition name="fade-slide">
    <v-card
      @click="emit('open')"
      v-show="visible"
      class="plugin-card d-flex flex-column mx-3 my-2"
      elevation="10"
      rounded="xl"
      variant="text"
      hover
      max-width="360"
    >
      <v-card-title class="text-h6 text-default font-weight-bold">
        <v-icon class="mr-2" :icon="plugin.icon" />
        {{ plugin.name }}
      </v-card-title>

      <v-card-subtitle class="text-grey-darken-1 px-4">
        {{ plugin.subTitle }}
      </v-card-subtitle>

      <v-card-text class="text-body-2 px-6 py-2">
        {{ truncate(plugin.description, 30) }}
      </v-card-text>

      <v-divider class="mx-4" />

      <v-card-actions>
        <v-btn variant="tonal" color="primary">{{ plugin.pricing }}</v-btn>
        <v-spacer />
        <v-btn icon="mdi-heart-outline" variant="text" />
        <v-btn icon="mdi-share-variant" variant="text" />
      </v-card-actions>
    </v-card>
  </transition>

  <!-- Lightbox plein écran -->
  <v-dialog v-model="dialog" width="500" height="500" transition="dialog-bottom-transition">
    <v-card class="d-flex flex-column">
      <v-toolbar flat color="transparent">
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-img
        :src="plugin.logo"
        width="500" height="400"
        class="flex-grow-1"
        cover
        alt="Plugin preview"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

defineProps({
  plugin: Object
})
const emit = defineEmits<{
(e: 'open'): void
}>()
const visible = ref(false)
const dialog = ref(false)

onMounted(() => {
  setTimeout(() => {
    visible.value = true
  }, Math.random() * 400)
})
</script>

<style scoped>
.plugin-card {
  border-radius: 24px;
  overflow: hidden;
  padding-top: 0;
  background-color: var(--v-theme-surface);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(220, 9, 160, 0.1);
}
.plugin-card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgb(3, 32, 61);
}
.fade-slide-enter-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
