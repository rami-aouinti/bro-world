<script setup lang="ts">
const emit = defineEmits<{
  (e: 'toggleSettingsDrawer', value: boolean): void
}>()

const lastMessages = [
]
</script>
<template>
  <div class="d-none d-sm-flex align-center">
    <v-btn
      icon
      title="Shopping"
      aria-label="shopping"
      class="opacity-80 ml-0"
      @click="emit('toggleSettingsDrawer', true)"
    >
      <v-badge
        v-if="lastMessages.length > 0"
        color="primary"
        :content="lastMessages.length"
      >
        <template #default>
          <v-icon>mdi-shopping</v-icon>
        </template>
      </v-badge>

      <v-icon v-else>mdi-shopping</v-icon>
    </v-btn>
  </div>
</template>
