<script setup lang="ts">
import { mergeProps } from 'vue'
const { loggedIn} = useUserSession()
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
      <v-tooltip location="bottom">
        <template #activator="{ props: tooltip }">
          <v-btn icon v-bind="mergeProps(menu, tooltip)" class="ml-1">
            <v-icon v-if="loggedIn" icon="mdi-bell" size="30" />
          </v-btn>
        </template>
        <span>Notification</span>
      </v-tooltip>
    </template>
    <v-list class="pa-3">
      <v-list-item
        v-for="(item, i) in dropdown"
        :key="i"
        class="pa-4 list-item-hover-active d-flex align-items-center py-1 my-1 border-radius-md"
      >
        <v-row class="d-flex align-center">
          <v-col cols="2">
            <v-icon class="material-icons-round text-body" size="20">{{
                item.icon
              }}</v-icon>
          </v-col>
          <v-col cols="10">
            <h6 class="text-sm font-weight-normal ms-2 text-typo">
              {{ item.title }}
            </h6>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
