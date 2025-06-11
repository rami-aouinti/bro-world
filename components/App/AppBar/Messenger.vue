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
    message: 'Payment successfull..',
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
        class="opacity-80 ml-0"
      >
        <v-badge
          v-if="lastMessages.length > 0"
          color="primary"
          :content="lastMessages.length"
        >
          <template #default>
            <v-icon>mdi-message</v-icon>
          </template>
        </v-badge>

        <v-icon v-else>mdi-message</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-2">
      <v-list-item
        v-for="(item, i) in lastMessages"
        :key="i"
        class="pa-3 list-item-hover-active d-flex align-center border-radius-md"
      >
          <v-row align="center" class="pa-0 ma-0">
            <!-- Avatar -->
            <v-col cols="auto">
              <v-avatar size="36" class="me-1">
                <NuxtImg
                  width="24"
                  height="24"
                  :src="item.avatar"
                  :alt="`Avatar ${i}`"
                  cover
                />
              </v-avatar>
            </v-col>
            <v-col cols="auto">
              <div>
                <h6 class="text-sm font-weight-normal text-typo mb-1">
                  {{ item.message }}
                </h6>
                <p class="text-xs text-secondary d-flex align-center">
                  <v-icon size="14" class="me-1">mdi-clock</v-icon>
                  {{ item.time }}
                </p>
              </div>
            </v-col>
          </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
