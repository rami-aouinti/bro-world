<script setup lang="ts">
import { mergeProps } from 'vue'

const lastMessages = [
  {
    avatar: '/img/bruce-mars.jpg',
    message: 'Check new messages',
    time: '13 minutes ago',
  },
  {
    avatar: '/img/bruce-mars.jpg',
    message: 'Manage podcast session',
    time: '1 day ago',
  },
  {
    avatar: '/img/bruce-mars.jpg',
    message: 'Payment successfully completed',
    time: '2 days ago',
  },
]
</script>

<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn
        icon
        title="Messenger"
        aria-label="Messenger"
        v-bind="mergeProps(menu)"
        class="ml-1"
      >
        <v-icon icon="mdi-message" size="30" />
      </v-btn>
    </template>

    <v-list class="pa-3">
      <v-list-item
        v-for="(item, i) in lastMessages"
        :key="i"
        class="pa-3 list-item-hover-active d-flex align-start border-radius-md"
      >
        <v-avatar size="36" class="me-3">
          <NuxtImg
            width="36" height="36" :src="item.avatar" :alt="`Avatar ${i}`" cover />
        </v-avatar>

        <div>
          <h6 class="text-sm font-weight-normal text-typo mb-1">
            {{ item.message }}
          </h6>
          <p class="text-xs text-secondary d-flex align-center">
            <v-icon size="14" class="me-1">mdi-clock</v-icon>
            {{ item.time }}
          </p>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
