<script setup lang="ts">
const props = defineProps({
  drawer: Object,
  loggedIn: Boolean,
})
const emit = defineEmits(['toggle'])
</script>

<template>
  <v-btn
    v-if="Object.values(props.drawer).some(Boolean)"
    icon="mdi-close"
    color="primary"
    class="fixed-plugin-button-news position-fixed my-1"
    @click="emit('toggle', 'visible')"
    aria-label="Close sidebar"
  />

  <v-btn
    v-if="loggedIn && props.drawer.visible"
    icon="mdi-world"
    color="primary"
    class="fixed-plugin-button-world position-fixed my-1"
    @click="emit('toggle', 'world')"
  />
  <v-btn
    v-if="loggedIn && props.drawer.visible"
    icon="mdi-folder-multiple"
    color="primary"
    class="fixed-plugin-button-media position-fixed my-1"
    @click="emit('toggle', 'media')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-newspaper"
    color="primary"
    class="fixed-plugin-button-news position-fixed my-1"
    @click="emit('toggle', 'news')"
  />
  <v-btn
    v-if="props.drawer.visible"
    icon="mdi-palette-outline"
    color="primary"
    class="fixed-plugin-button-theme position-fixed my-1"
    @click="emit('toggle', 'theme')"
  />
</template>
