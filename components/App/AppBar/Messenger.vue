<script setup lang="ts">
import { mergeProps } from 'vue'
const lastMessages = [
  {
    avatar: '@/assets/img/bruce-mars.jpg',
    message: 'Check new messages',
    time: '13 minutes ago',
  },
  {
    avatar: '@/assets/img/bruce-mars.jpg',
    message: 'Manage podcast session',
    time: '1 day',
  },
  {
    avatar: '@/assets/img/bruce-mars.jpg',
    message: 'Payment successfully completed',
    time: '2 days',
  },
]
</script>
<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn icon v-bind="mergeProps(menu)" class="ml-1">
        <v-icon icon="mdi-message" size="30" />
      </v-btn>
    </template>
    <v-list class="pa-3">
      <v-list-item
        v-for="(item, i) in lastMessages"
        :key="i"
        class="pa-4 list-item-hover-active d-flex py-1 my-1 border-radius-md"
      >
        <v-row>
          <v-col cols="1">
            <v-avatar size="28" class="rounded-circle">
              <v-img :alt="`${item.avatar} avatar`" :src="item.avatar" />
            </v-avatar>
          </v-col>
          <v-col cols="auto">
            <h6 class="text-sm font-weight-normal ms-2 text-typo">
              {{ item.message }}
            </h6>
            <p class="text-xs text-secondary mb-0">
              <v-icon size="12" class="text-secondary">mdi-clock me-1</v-icon>
              {{ item.time }}
            </p>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
