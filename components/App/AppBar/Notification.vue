<script setup lang="ts">
import { mergeProps } from 'vue'

const dropdown = [
  {
    icon: 'mdi-email',
    title: 'Check new messages',
  },
  {
    icon: 'mdi-podcast',
    title: 'Manage podcast session',
  },
  {
    icon: 'mdi-shopping-cart',
    title: 'Payment successfully completed',
  },
]
</script>

<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn
        icon
        title="Notification"
        aria-label="notification"
        v-bind="mergeProps(menu)"
        class="ml-1"
      >
        <v-icon size="30">mdi-bell</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-2">
      <v-list-item
        v-for="(item, i) in dropdown"
        :key="i"
        class="py-2 px-3 d-flex align-center list-item-hover-active border-radius-md"
      >
        <v-icon size="20" class="me-3 text-body">{{ item.icon }}</v-icon>
        <span class="text-sm font-weight-normal text-typo">
          {{ item.title }}
        </span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
