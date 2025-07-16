<template>
  <div class="d-flex align-center">
    <v-icon class="text-white" size="20">mdi-heart</v-icon>
    <h6 class="text-h7 ms-2 text-body-1 font-weight-bold">Interests</h6>
  </div>
  <v-divider :thickness="5"></v-divider>
  <div class="px-0 py-2 text-sm">
    <v-list class="no-background px-0" :lines="false" density="compact">
      <v-list-item v-for="(item, i) in props.items" :key="i" :value="item" class="no-background text-sm text-white px-0">
        <div class="d-flex align-center">
          <v-icon class="text-white" size="12" icon="mdi-radiobox-blank" />
          <span class="ms-2">{{ item.text }}</span>
        </div>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  items: Array
});
</script>

<style scoped>
.no-background {
  background-color: transparent !important;
}
</style>
